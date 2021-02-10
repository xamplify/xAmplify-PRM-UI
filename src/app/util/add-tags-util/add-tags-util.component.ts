import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ReferenceService } from '../../core/services/reference.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { CustomResponse } from '../../common/models/custom-response';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Pagination } from 'app/core/models/pagination';
import { UserService } from '../../core/services/user.service';
import { Tag } from '../../dashboard/models/tag'

declare var swal, $: any;

@Component({
  selector: 'app-add-tags-util',
  templateUrl: './add-tags-util.component.html',
  styleUrls: ['./add-tags-util.component.css'],
  providers: [HttpRequestLoader, Pagination]
})
export class AddTagsUtilComponent implements OnInit {

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

  @Input() pagination: Pagination;
  @Input() isAddTag:boolean;
  @Input() selectedTag:any;
  @Output() notifyParent: EventEmitter<any>;

  constructor(public referenceService: ReferenceService, public httpRequestLoader: HttpRequestLoader, public authenticationService: AuthenticationService,
     public userService: UserService) {
    this.loggedInUserId = this.authenticationService.getUserId();
    this.notifyParent = new EventEmitter<any>();
   }

  ngOnInit() {
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

  closeTagModal() {
    $('#addTagModalPopup').modal('hide');
    this.referenceService.stopLoader(this.addTagLoader);
    this.tag = new Tag();
    this.removeTagErrorClass();
    this.tagResponse = new CustomResponse();
    this.isAddTag = false;
    this.tagNames = [];
    this.tag.isTagNameValid = false;
  }

  addTagErrorMessage(errorMessage: string) {
    this.tag.isValid = false;
    this.tagErrorMessage = errorMessage;
  }

  removeTagErrorClass() {
    this.tag.isValid = true;
    //this.tagResponse = new CustomResponse();
    this.tagErrorMessage = "";
  }

  validateTagName(keyCode: any) {
    this.removeTagErrorClass();
    if (keyCode === 13) {
      if (this.isAddTag) {
        let names = [];
        $.each(this.tagNames, function (index: number, tagName: any) {
          let name: string;
          name = tagName['value'].toLowerCase();
          names.push(name);
        });
        let lastEntry = names[names.length - 1];
        if (names.length > 1) {
          let index = names.indexOf(lastEntry);
          if(index != names.length-1){
            this.tagNames.pop();
          }
        }
        this.tag.isTagNameValid = true;
      } else {
        this.saveOrUpdateTag();
      }
    } else {
      if (this.isAddTag) {
        if (this.tagNames == undefined || this.tagNames.length < 1) {
          this.tag.isTagNameValid = false;
        } else {
          this.tag.isTagNameValid = true;
        }
      } else {
        if (this.tag.tagName == undefined || this.tag.tagName.length < 1) {
          this.tag.isTagNameValid = false;
        } else {
          this.tag.isTagNameValid = true;
        }
      }
    }
  }

  saveOrUpdateTag() {
    this.referenceService.startLoader(this.addTagLoader);
    if (this.tag.id > 0) {
      this.tag.updatedBy = this.loggedInUserId;
    } else {
      this.tag.createdBy = this.loggedInUserId;
      var list = [];
      $.each(this.tagNames, function (index: number, val: any) {
        list.push(val['value']);
      });
      this.tag.tagNames = list;
    }
    this.userService.saveOrUpdateTag(this.tag)
      .subscribe(
        (result: any) => {
          this.closeTagModal();
          //this.openAddTagPopup = false;
          if (result.access) {
            this.referenceService.stopLoader(this.addTagLoader);
            this.tagResponse = new CustomResponse('SUCCESS', result.message, true);
            this.notifyParent.emit(this.pagination);
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

}
