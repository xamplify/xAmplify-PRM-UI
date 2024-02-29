import { Component, OnInit } from '@angular/core';
import { ReferenceService } from '../../core/services/reference.service';
import { UserService } from '../../core/services/user.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { CustomResponse } from '../../common/models/custom-response';
import { UtilService } from 'app/core/services/util.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Pagination } from 'app/core/models/pagination';
import { SortOption } from '../../core/models/sort-option';
import { PagerService } from '../../core/services/pager.service';
import { Tag } from '../models/tag'

declare var swal, $: any;

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css'],
  providers: [HttpRequestLoader, SortOption, Pagination]
})
export class TagsComponent implements OnInit {

  tag: Tag = new Tag();
  isAddTag = false;
  addTagLoader: HttpRequestLoader = new HttpRequestLoader();
  tagPagination: Pagination = new Pagination();
  tagSortOption: SortOption = new SortOption();
  tagResponse: CustomResponse = new CustomResponse();
  tagButtonSubmitText = "Save";
  tagModalTitle = "Enter Tag Details";
  //tagErrorMessage = "";
  tagNames: string[] = [];
  loggedInUserId = 0;
  customResponse: CustomResponse = new CustomResponse();
  tags: Array<Tag> = new Array<Tag>();
  openAddTagPopup: boolean = false;
  selectedTag: Tag = new Tag();

  constructor(public referenceService: ReferenceService, public httpRequestLoader: HttpRequestLoader, public userService: UserService,
    public utilService: UtilService, public authenticationService: AuthenticationService, public logger: XtremandLogger,
    public pagerService: PagerService) {
    this.loggedInUserId = this.authenticationService.getUserId();
  }

  ngOnInit() {
    this.tagPagination = new Pagination();
    this.listTags(this.tagPagination);
  }

  /***************Tags*************** */
  listTags(pagination: Pagination) {
      pagination.userId = this.loggedInUserId;
      this.referenceService.startLoader(this.httpRequestLoader);
      this.userService.getTags(pagination)
        .subscribe(
          response => {
            const data = response.data;
            pagination.totalRecords = data.totalRecords;
            this.tagSortOption.totalRecords = data.totalRecords;
            $.each(data.tags, function (_index: number, tag: any) {
              tag.displayTime = new Date(tag.createdDateInUTCString);
            });
            pagination = this.pagerService.getPagedItems(pagination, data.tags);
            this.referenceService.stopLoader(this.httpRequestLoader);
          },
          (error: any) => {
            this.customResponse = this.referenceService.showServerErrorResponse(this.httpRequestLoader);
          },
          () => this.logger.info('Finished listTags()')
        );
  }

  /********************Pagaination&Search Code*****************/

  /*************************Sort********************** */
  tagSortBy(text: any) {
    this.tagSortOption.selectedTagDropDownOption = text;
    this.getAllTagsFilteredResults(this.tagPagination);
  }


  /*************************Search********************** */
  searchTags() {
    this.getAllTagsFilteredResults(this.tagPagination);
  }

  tagPaginationDropdown(items: any) {
    this.tagSortOption.itemsSize = items;
    this.getAllTagsFilteredResults(this.tagPagination);
  }

  /************Page************** */
  setTagPage(event: any) {
    this.tagResponse = new CustomResponse();
    this.customResponse = new CustomResponse();
    this.tagPagination.pageIndex = event.page;
    this.listTags(this.tagPagination);
  }

  getAllTagsFilteredResults(pagination: Pagination) {
    this.tagResponse = new CustomResponse();
    this.customResponse = new CustomResponse();
    this.tagPagination.pageIndex = 1;
    this.tagPagination.searchKey = this.tagSortOption.searchKey;
    this.tagPagination = this.utilService.sortOptionValues(this.tagSortOption.selectedTagDropDownOption, this.tagPagination);
    this.listTags(this.tagPagination);
  }
  tagEventHandler(keyCode: any) { if (keyCode === 13) { this.searchTags(); } }

  // public startsWithAt(control: FormControl) {
  //   try {
  //     let checkTag: string;
  //     if (control.value.charAt(0) === ' ' && checkTag.length === 0) {
  //       return { 'startsWithAt': true };
  //     }
  //     return null;
  //   } catch (error) { console.log('empty tag'); }
  // }

  // public validatorsTag = [this.startsWithAt];

  // validateTagName(keyCode: any) {
  //   this.removeTagErrorClass();
  //   if (keyCode === 13) {
  //     if (this.isAddTag) {
  //       let names = [];
  //       $.each(this.tagNames, function (index: number, tagName: any) {
  //         let name: string;
  //         name = tagName['value'].toLowerCase();
  //         names.push(name);
  //       });
  //       let lastEntry = names[names.length - 1];
  //       if (names.length > 1) {
  //         let index = names.indexOf(lastEntry);
  //         if(index != names.length-1){
  //           this.tagNames.pop();
  //         }
  //       }
  //       this.tag.isTagNameValid = true;
  //     } else {
  //       this.saveOrUpdateTag();
  //     }
  //   } else {
  //     if (this.isAddTag) {
  //       if (this.tagNames == undefined || this.tagNames.length < 1) {
  //         this.tag.isTagNameValid = false;
  //       } else {
  //         this.tag.isTagNameValid = true;
  //       }
  //     } else {
  //       if (this.tag.tagName == undefined || this.tag.tagName.length < 1) {
  //         this.tag.isTagNameValid = false;
  //       } else {
  //         this.tag.isTagNameValid = true;
  //       }
  //     }
  //   }
  // }

  addTag() {
    this.isAddTag = true;
    // this.tag = new Tag();
    // this.tagModalTitle = 'Enter Tag Details';
    // this.tagButtonSubmitText = "Save";
    // this.tagNames = [];
    // this.tag.isValid = true;
    this.openAddTagPopup = true;
    //$('#addTagModalPopup').modal('show');
  }

  // closeTagModal() {
  //   $('#addTagModalPopup').modal('hide');
  //   this.referenceService.stopLoader(this.addTagLoader);
  //   this.tag = new Tag();
  //   this.removeTagErrorClass();
  //   this.tagResponse = new CustomResponse();
  //   this.isAddTag = false;
  //   this.tagNames = [];
  //   this.tag.isTagNameValid = false;
  // }

  // addTagErrorMessage(errorMessage: string) {
  //   this.tag.isValid = false;
  //   //this.tagErrorMessage = errorMessage;
  // }

  // removeTagErrorClass() {
  //   this.tag.isValid = true;
  //   this.tagResponse = new CustomResponse();
  //   //this.tagErrorMessage = "";
  // }

  // saveOrUpdateTag() {
  //   this.referenceService.startLoader(this.addTagLoader);
  //   if (this.tag.id > 0) {
  //     this.tag.updatedBy = this.loggedInUserId;
  //   } else {
  //     this.tag.createdBy = this.loggedInUserId;
  //     var list = [];
  //     $.each(this.tagNames, function (index: number, val: any) {
  //       list.push(val['value']);
  //     });
  //     this.tag.tagNames = list;
  //   }
  //   this.userService.saveOrUpdateTag(this.tag)
  //     .subscribe(
  //       (result: any) => {
  //         //this.closeTagModal();
  //         this.openAddTagPopup = false;
  //         if (result.access) {
  //           this.referenceService.stopLoader(this.addTagLoader);
  //           this.tagResponse = new CustomResponse('SUCCESS', result.message, true);
  //           this.tagPagination = new Pagination();
  //           this.listTags(this.tagPagination);
  //         } else {
  //           this.authenticationService.forceToLogout();
  //         }

  //       },
  //       (error: string) => {
  //         this.referenceService.stopLoader(this.addTagLoader);
  //         let statusCode = JSON.parse(error['status']);
  //         if (statusCode == 409 || statusCode == 400) {
  //           this.addTagErrorMessage(JSON.parse(error['_body']).message);
  //         } else {
  //           this.referenceService.showSweetAlertErrorMessage(this.referenceService.serverErrorMessage);
  //         }
  //       });
  // }


  getTagById(tag: Tag) {
     this.selectedTag = new Tag();
    // this.tag.id = tag.id;
    // this.tag.tagName = tag.tagName;
    // this.tag.isValid = true;
    // this.tag.isTagNameValid = true;
    // this.tagButtonSubmitText = "Update";
    // this.tagModalTitle = 'Edit Tag Details';
    this.isAddTag = false;
    this.selectedTag = tag;
    this.openAddTagPopup = true;
    //$('#addTagModalPopup').modal('show');
  }


  /***********Delete**************/
  confirmDeleteTag(tag: Tag) {
    try {
      let self = this;
      swal({
        title: 'Are you sure?',
        text: "You won't be able to undo this action!",
        type: 'warning',
        showCancelButton: true,
        swalConfirmButtonColor: '#54a7e9',
        swalCancelButtonColor: '#999',
        confirmButtonText: 'Yes, delete it!'

      }).then(function () {
        self.deleteTagById(tag);
      }, function (dismiss: any) {
        console.log('you clicked on option' + dismiss);
      });
    } catch (error) {
      this.logger.error(this.referenceService.errorPrepender + " confirmDelete():" + error);
      this.referenceService.showServerError(this.httpRequestLoader);
    }

  }

  deleteTagById(tag: Tag) {
    this.tagResponse = new CustomResponse();
    tag.userId = this.loggedInUserId;
    tag.tagIds = [tag.id];
    this.referenceService.loading(this.httpRequestLoader, true);
    this.referenceService.goToTop();
    this.userService.deleteTag(tag)
      .subscribe(
        (response: any) => {
          if (response.access) {
            if (response.statusCode == 200) {
              this.tagResponse = new CustomResponse('SUCCESS', response.message, true);
              this.tagPagination.pageIndex = 1;
              this.listTags(this.tagPagination);
            }
          } else {
            this.authenticationService.forceToLogout();
          }
        },
        (error: string) => {
          this.referenceService.stopLoader(this.addTagLoader);
          let statusCode = JSON.parse(error['status']);
          if (statusCode == 400) {
            //this.addTagErrorMessage(JSON.parse(error['_body']).message);
            this.tagResponse = new CustomResponse('ERROR', JSON.parse(error['_body']).message, true);
          } else {
            this.referenceService.showServerErrorMessage(this.httpRequestLoader);
            this.tagResponse = new CustomResponse('ERROR', this.httpRequestLoader.message, true);
          }
        });
  }

  showSuccessMessage(message:any){
    if(message != undefined){
      this.tagResponse = new CustomResponse('SUCCESS',message, true);
    }else{
      this.tagResponse = new CustomResponse();
    }
  }

  resetTagValues(message: any){
    this.openAddTagPopup = false;
    this.isAddTag = false;
    this.showSuccessMessage(message);
    this.listTags(this.tagPagination);
  }

}
