import { Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ReferenceService } from '../../core/services/reference.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { CustomResponse } from '../../common/models/custom-response';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Pagination } from 'app/core/models/pagination';
import { UserService } from '../../core/services/user.service';
import { Tag } from '../../dashboard/models/tag'

declare var  $: any;

@Component({
  selector: 'app-add-tags-util',
  templateUrl: './add-tags-util.component.html',
  styleUrls: ['./add-tags-util.component.css'],
  providers: [HttpRequestLoader, Pagination]
})
export class AddTagsUtilComponent implements OnInit, OnDestroy {

  tag: Tag = new Tag();
  //isAddTag = false;
  addTagLoader: HttpRequestLoader = new HttpRequestLoader();
  tagResponse: CustomResponse = new CustomResponse();
  tagButtonSubmitText = "Save";
  tagModalTitle = "Enter Tag Details";
  tagErrorMessage = "";
  tagNames: string[] = [];
  loggedInUserId = 0;
  customResponse: CustomResponse = new CustomResponse();
  tags: Array<Tag> = new Array<Tag>();
  maxlengthError: boolean = false;
  maxlengthErrorMessage = "Please note: The maximum allowed length for the tag is 55 characters."
  tagSelected: boolean = false;
  tagFirstColumnEndIndex: number;
  tagsListFirstColumn: Tag[];
  tagsListSecondColumn: Tag[];
  tagsSelected: any[] = [];
  tagSearchKey: string = "";
  createdOrsearchedTags: Tag[] = [];
  isAddTagPopup: boolean;
  previousTags: Tag[] = [];
  selectedTagNames: any[];
  allTags = [];

  @Input() pagination: Pagination;
  @Input() isAddTag:boolean;
  @Input() selectedTag:any;
  @Output() notifyParent: EventEmitter<any>;
  @Input() selectedTags = [];
  @Input() isTagsTabActive =false;

  constructor(public referenceService: ReferenceService, public httpRequestLoader: HttpRequestLoader, public authenticationService: AuthenticationService,
     public userService: UserService) {
    this.loggedInUserId = this.authenticationService.getUserId();
    this.notifyParent = new EventEmitter<any>();
   }

  ngOnInit() {
    if(!this.isTagsTabActive){
      $('#addTagModal').modal('show');
      this.searchTags();
      if (Array.isArray(this.selectedTags)) {
        this.allTags.push(...this.selectedTags); 
      } else {
        console.error('selectedTags is not an array');
      }
      this.selectedTagNames = this.selectedTags.map(person => person.tagName)
    }
    else{
    if (this.isAddTag) {
      this.tag = new Tag();
      this.tagModalTitle = 'Enter Tag Details';
      this.tagButtonSubmitText = "Save";
      this.tagNames = [];
      this.tag.isValid = true;
    } else {
      this.tag = new Tag();
      this.tag.isValid = true;
      this.tag.isTagNameValid = true;
      this.tagButtonSubmitText = "Update";
      this.tagModalTitle = 'Edit Tag Details';
      if (this.selectedTag != undefined) {
        this.tag.id = this.selectedTag.id;
        this.tag.tagName = this.selectedTag.tagName;
      } else {
        this.closeTagModal();
      }
    }
    $('#addTagModalPopup').modal('show');
  }
  }

  ngOnDestroy() {
    $('#addTagModalPopup').modal('hide');
    $('#addTagModal').modal('hide');
    this.tagSelected = false;
    this.isAddTagPopup=false;
    this.isTagsTabActive = false;
  }

  closeTagModal() {
    $('#addTagModalPopup').modal('hide');
    this.referenceService.stopLoader(this.addTagLoader);
    this.tag = new Tag();
    this.removeTagErrorClass();
    this.tagResponse = new CustomResponse();
    this.isAddTag = false;
    this.tagNames = [];
    this.tag.isTagNameValid = false;
    this.maxlengthError = false;
    this.notifyParent.emit();
  }
  closeTagModal1() {
    $('#addTagModal').modal('hide');
    this.referenceService.stopLoader(this.addTagLoader);
    this.tag = new Tag();
    this.removeTagErrorClass();
    this.tagResponse = new CustomResponse();
    this.isAddTag = false;
    this.tagNames = [];
    this.tag.isTagNameValid = false;
    this.maxlengthError = false;
    this.isAddTagPopup = false;
    this.notifyParent.emit(this.allTags);
  }

  addTagErrorMessage(errorMessage: string) {
    this.tag.isValid = false;
    this.tagErrorMessage = errorMessage;
  }

  removeTagErrorClass() {
    this.tag.isValid = true;
    //this.tagResponse = new CustomResponse();
    this.tagErrorMessage = "";
    this.maxlengthError = false;
  }

  validateTagName(event: any) {
    this.removeTagErrorClass();
    let keyCode = event.keyCode;
    if (keyCode === 13) {
      if (this.isAddTag) {
        let lastEntry = this.tagNames[this.tagNames.length - 1]['value'];
        let name = "";
        name =  lastEntry.toLowerCase().substring(0,55);
        this.tagNames[this.tagNames.length - 1] = name;
        let index = this.tagNames.findIndex(item => name.toLowerCase() === item.toLowerCase());
          if(index > -1 && index != this.tagNames.length-1){
            this.tagNames.pop();
          }
        this.tag.isTagNameValid = true;
      } else {
        this.saveOrUpdateTag();
      }
    } else {
      if (this.isAddTag) {
        this.maxlengthError = (event.target.value != undefined && event.target.value.length > 55) ? true : false;
        if (this.tagNames == undefined || this.tagNames.length < 1) {
          this.tag.isTagNameValid = false;
        } else {
          this.tag.isTagNameValid = true;
        }
        if(event.target.value.length > 0) {
          let value = event.target.value;
          if(event.target.value.length > 55){
            value = event.target.value.substring(0,55);
          }
          event.target.value = value;
        }
      } else {
        this.maxlengthError = (this.tag.tagName != undefined && this.tag.tagName.length > 55) ? true : false;
        if (this.tag.tagName == undefined || this.tag.tagName.length < 1) {
          this.tag.isTagNameValid = false;
        } else {
          if(this.tag.tagName != undefined && this.tag.tagName .length > 55){
            this.tag.tagName = this.tag.tagName.substring(0,55);
          }
          this.tag.isTagNameValid = true;
        }
      }
    }
  }

  saveOrUpdateTag() {
    this.referenceService.startLoader(this.addTagLoader);
    if (this.tag.id > 0) {
      this.tag.updatedBy = this.loggedInUserId;
      if(this.tag.tagName != undefined && this.tag.tagName .length > 55){
        this.tag.tagName = this.tag.tagName.substring(0,55);
      }
    } else {
      this.tag.createdBy = this.loggedInUserId;
      this.tag.tagNames = this.tagNames;
    }
   
    this.userService.saveOrUpdateTag(this.tag)
      .subscribe(
        (result: any) => {
          if (result.access) {
            this.referenceService.stopLoader(this.addTagLoader);
            if(this.isTagsTabActive){
              this.closeTagModal();
            this.tagResponse = new CustomResponse('SUCCESS', result.message, true);
            this.notifyParent.emit(result.message);
            }else{
              this.isAddTagPopup=false;
              this.searchTags();
            }
          } else {
            this.authenticationService.forceToLogout();
          }

        },
        (error: string) => {
          this.referenceService.stopLoader(this.addTagLoader);
          let statusCode = JSON.parse(error['status']);
          if (statusCode == 409 || statusCode == 400) {
            this.addTagErrorMessage(JSON.parse(error['_body']).message);
          } else {
            this.referenceService.showSweetAlertErrorMessage(this.referenceService.serverErrorMessage);
          }
        });
  }

  public startsWithAt(control: FormControl) {
    try {
      let checkTag: string;
      if (control.value.charAt(0) === ' ' && checkTag.length === 0) {
        return { 'startsWithAt': true };
      }
      return null;
    } catch (error) { console.log('empty tag'); }
  }

  public validatorsTag = [this.startsWithAt];

  addTagsCondition() {

    // this.selectedTags.forEach(tag => {
    //   if (!this.tagsSelected.includes(tag)) {
    //     this.tagsSelected.push(tag);
    //   } });
    
          let length = this.previousTags.length;
          this.isAddTagPopup = false;
          
          if ((length % 2) == 0) {
            this.tagFirstColumnEndIndex = length / 2;
            this.tagsListFirstColumn = this.previousTags.slice(0, this.tagFirstColumnEndIndex);
            this.tagsListSecondColumn = this.previousTags.slice(this.tagFirstColumnEndIndex);
          } else {
            this.tagFirstColumnEndIndex = (length - (length % 2)) / 2;
            this.tagsListFirstColumn = this.previousTags.slice(0, this.tagFirstColumnEndIndex + 1);
            this.tagsListSecondColumn = this.previousTags.slice(this.tagFirstColumnEndIndex + 1);
          }
        }

  updateSelectedTags(tag: Tag, checked: boolean) {
    this.tagSelected = false;
    this.tag.isTagNameValid = false;
    this.tag.isValid = false;

    if (checked) {
      this.tagSelected = true;
      // Add the tag if it’s not already in the selected tags
      if (!this.tagsSelected.some(existingTag => existingTag.tagName === tag.tagName)) {
        this.tagsSelected.push(tag);
      }

      if (this.selectedTags.length > 0) {
        this.selectedTags.forEach(selectedTag => {
          // Add selectedTag to tagsSelected if not already included
          if (!this.tagsSelected.some(existingTag => existingTag.tagName === selectedTag.tagName)) {
            this.tagsSelected.push(selectedTag);
          }
        });
        this.selectedTagNames = this.selectedTags.map(person => person.tagName);
      } else {
        this.selectedTagNames = this.tagsSelected.map(person => person.tagName);
      }
    } else {
      // Handle the removal case
      if (this.selectedTags.length > 0) {
        this.selectedTags.forEach(selectedTag => {
          if (!this.tagsSelected.some(existingTag => existingTag.tagName === selectedTag.tagName)) {
            this.tagsSelected.push(selectedTag);
          }
        });
      }

      const index = this.tagsSelected.findIndex(existingTag => existingTag.tagName === tag.tagName);
      if (index !== -1) {
        this.tagsSelected.splice(index, 1);
        this. selectedTags.splice(index, 1);// Remove the tag
        this.tagSelected = true;
      }
    }
  }
        
    saveSelectedTags() {
      this.notifyParent.emit(this.tagsSelected);
      $('#addTagModal').modal('hide');
      this.tag.isValid = false;
      this. tag.isTagNameValid = false;
       this. tagSelected = false;
    }
    openAddTagModal() {
      this.isAddTagPopup=true;
      this.tagSelected = false;
      // $('#addTagModal').modal('hide');
    }
    searchTags() {
      let pagination: Pagination = new Pagination();
      pagination.searchKey = this.tagSearchKey;
      pagination.userId = this.loggedInUserId;
      pagination.maxResults = 0;
      this.referenceService.startLoader(this.httpRequestLoader)
      this.userService.getTagsSearchTagName(pagination)
      .subscribe(
        response => {
          const data = response.data;
          this.previousTags = data.tags;
          this.addTagsCondition();
          this.referenceService.stopLoader(this.httpRequestLoader);
        },
        (error: any) => {
          this.referenceService.stopLoader(this.httpRequestLoader);
        },
      );
    }
    tagEventHandler(keyCode: any) { if (keyCode === 13) { this.searchTags(); } }

  cancel() {
    this.isAddTagPopup = false;
    this.tag.isValid = false
    this.tag.isTagNameValid = false;
    this.tag = new Tag();
    this.removeTagErrorClass();
    this.tagResponse = new CustomResponse();
    this.tagNames = [];
  }

}
