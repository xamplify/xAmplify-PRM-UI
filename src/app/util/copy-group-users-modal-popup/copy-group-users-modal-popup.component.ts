import { Component, OnInit,Input,Output,EventEmitter,OnDestroy } from '@angular/core';
import { Properties } from 'app/common/models/properties';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { SortOption } from '../../core/models/sort-option';
import { UtilService } from 'app/core/services/util.service';
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { CustomResponse } from 'app/common/models/custom-response';
import { CopyGroupUsersDto } from 'app/common/models/copy-group-users-dto';

declare var $: any, swal: any;
@Component({
  selector: 'app-copy-group-users-modal-popup',
  templateUrl: './copy-group-users-modal-popup.component.html',
  styleUrls: ['./copy-group-users-modal-popup.component.css'],
  providers: [HttpRequestLoader, SortOption, Properties]
})
export class CopyGroupUsersModalPopupComponent implements OnInit {

  @Input() userListId = 0;
  @Input() selectedUserIds = [];
  @Input() moduleName = '';
  @Output() copyGroupUsersModalPopupEventEmitter = new EventEmitter();
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  customResponse: CustomResponse = new CustomResponse();
  pagination:Pagination = new Pagination();
  copySuccess = false;
  responseMessage = "";
  responseImage = "";
  responseClass = "event-success";
  statusCode = 0;
  sortOption: SortOption = new SortOption();
  isHeaderCheckBoxChecked: boolean;
  selectedPartnerGroupIds = [];
  copyGroupUsersDto:CopyGroupUsersDto = new CopyGroupUsersDto();
  showUsersPreview = false;
  selectedGroupName = "";
  selectedUserListId = 0;
  constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService,public properties:Properties,
    public utilService:UtilService,public logger:XtremandLogger,public pagerService:PagerService) { }
  

  ngOnInit() {
    this.addLoader();
    $('#copyGroupUsersModalPopup').modal('show');
    this.pagination.userListId = this.userListId;
    this.findGroupsForMerging(this.pagination);
  }
  private addLoader() {
    this.referenceService.startLoader(this.httpRequestLoader);
  }

  private removeLoader(){
    this.referenceService.stopLoader(this.httpRequestLoader);
  }

 

  findGroupsForMerging(pagination:Pagination){
    this.addLoader();
    this.authenticationService.findGroupsForMerging(pagination).subscribe(
      response=>{
        const data = response.data;
        pagination.totalRecords = data.totalRecords;
        this.sortOption.totalRecords = data.totalRecords;
        pagination = this.pagerService.getPagedItems(pagination, data.list);
        /*******Header checkbox will be chcked when navigating through page numbers*****/
				let partnerGroupIds = pagination.pagedItems.map(function (a) { return a.id; });
				let items = $.grep(this.selectedPartnerGroupIds, function (element: any) {
					return $.inArray(element, partnerGroupIds) !== -1;
				});
				this.isHeaderCheckBoxChecked = (items.length == partnerGroupIds.length && partnerGroupIds.length > 0);
        this.removeLoader();
      },error=>{
        this.referenceService.showSweetAlertServerErrorMessage();
        this.callEmitter();
      });
  }

  /*******Pagination/Search/Sort*****/
  navigateToNextPage(event: any) {
		this.pagination.pageIndex = event.page;
		this.findGroupsForMerging(this.pagination);
	}

  groupsSearchOnKeyEvent(keyCode: any) { if (keyCode === 13) { this.searchGroups(); } }

  /*************************Sort********************** */
	sortBy(text: any) {
		this.sortOption.selectedGroupsDropDownOption = text;
		this.getAllFilteredResults(this.pagination, this.sortOption);
	}
	/*************************Search********************** */
	searchGroups() {
		this.getAllFilteredResults(this.pagination, this.sortOption);
	}
	getAllFilteredResults(pagination: Pagination, sortOption: SortOption) {
		this.customResponse = new CustomResponse();
		pagination.pageIndex = 1;
		pagination.searchKey = sortOption.searchKey;
    pagination = this.utilService.sortOptionValues(sortOption.selectedGroupsDropDownOption, pagination);
    this.findGroupsForMerging(pagination);
	}
  /************Check Box related code starts here****************/
  highlightSelectedPartnerGroupOnRowClick(selectedPartnerGroupId: any, event: any) {
    this.referenceService.highlightRowOnRowCick('copy-group-users-tr', 'copy-group-users-list-table', 'copyGroupUsersCheckBoxName', this.selectedPartnerGroupIds, 'copy-group-users-header-checkbox-id', selectedPartnerGroupId, event);
  }

  highlightSelectedPartnerGroupOnCheckBoxClick(selectedPartnerGroupId: any, event: any) {
    this.referenceService.highlightRowByCheckBox('copy-group-users-tr', 'copy-group-users-list-table', 'copyGroupUsersCheckBoxName', this.selectedPartnerGroupIds, 'copy-group-users-header-checkbox-id', selectedPartnerGroupId, event);
  }

  selectOrUnselectAllRowsOfTheCurrentPage(event: any) {
    this.selectedPartnerGroupIds = this.referenceService.selectOrUnselectAllOfTheCurrentPage('copy-group-users-tr', 'copy-group-users-list-table', 'copyGroupUsersCheckBoxName', this.selectedPartnerGroupIds, this.pagination, event);
  }

  removeAllSelectedPartners() {
    this.selectedPartnerGroupIds = [];
    this.isHeaderCheckBoxChecked = false;
    $('#copy-group-users-header-checkbox-id').prop('checked',false);
  }



  copyToGroups(){
    if(this.selectedPartnerGroupIds.length>0){
      this.addLoader();
      this.copyGroupUsersDto = new CopyGroupUsersDto();
      this.copyGroupUsersDto.userIds = this.selectedUserIds;
      this.copyGroupUsersDto.userGroupIds = this.selectedPartnerGroupIds;
      this.copyGroupUsersDto.userGroupId = this.userListId;
      this.copyGroupUsersDto.moduleName = this.moduleName;
      this.authenticationService.copyUsersToUserGroups(this.copyGroupUsersDto).subscribe(
        response=>{
          this.copySuccess = true;
          this.statusCode = response.statusCode;
          if (this.statusCode == 200) {
            this.responseMessage = response.message;
          } else {
              this.responseMessage = response.message;
          }
          this.resetFields();
          this.removeLoader();
        },error=>{
          this.copySuccess = false;
          this.customResponse = this.referenceService.showServerErrorResponse(this.httpRequestLoader);
          this.removeLoader();
        });
    }else{
      this.referenceService.goToTop();
      this.customResponse = new CustomResponse('ERROR','Please select atleast one group',true);
    }
    
  }
  resetFields() {
    this.pagination = new Pagination();
    this.sortOption = new SortOption();
    this.isHeaderCheckBoxChecked = false;
    this.selectedPartnerGroupIds = [];
    this.selectedUserIds = [];
    this.userListId = 0;
  }

  callEmitter(){
    $('#copyGroupUsersModalPopup').modal('hide');
    this.copyGroupUsersModalPopupEventEmitter.emit();
  }
  

  closePopup(){
    this.callEmitter();
  }

  previewUserListUsers(partnerGroup: any) {
		this.showUsersPreview = true;
		this.selectedGroupName = partnerGroup.groupName;
		this.selectedUserListId = partnerGroup.id;
	}

  resetPreviewValues(){
    this.showUsersPreview = false;
    this.selectedGroupName = "";
    this.selectedUserListId = 0;
  }

}
