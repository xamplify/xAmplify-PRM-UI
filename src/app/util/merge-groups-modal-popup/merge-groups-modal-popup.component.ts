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

declare var $: any, swal: any;
@Component({
  selector: 'app-merge-groups-modal-popup',
  templateUrl: './merge-groups-modal-popup.component.html',
  styleUrls: ['./merge-groups-modal-popup.component.css'],
  providers: [HttpRequestLoader, SortOption, Properties]
})
export class MergeGroupsModalPopupComponent implements OnInit {

  @Input() userListId = 0;
  @Input() selectedUserIds = [];
  @Output() mergeGroupsModalPopupEventEmitter = new EventEmitter();
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  customResponse: CustomResponse = new CustomResponse();
  pagination:Pagination = new Pagination();
  selectedGroupIds = [];
  copySuccess = false;
  responseMessage = "";
  responseImage = "";
  responseClass = "event-success";
  statusCode = 0;
  sortOption: SortOption = new SortOption();
  isHeaderCheckBoxChecked: boolean;
  selectedPartnerGroupIds = [];

  constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService,public properties:Properties,
    public utilService:UtilService,public logger:XtremandLogger,public pagerService:PagerService) { }
  

  ngOnInit() {
    this.referenceService.startLoader(this.httpRequestLoader);
    $('#mergeGroupsModalPopup').modal('show');
    this.pagination.userListId = this.userListId;
    this.findGroupsForMerging(this.pagination);
  }

  findGroupsForMerging(pagination:Pagination){
    this.referenceService.startLoader(this.httpRequestLoader);
    this.authenticationService.findGroupsForMerging(pagination).subscribe(
      response=>{
        const data = response.data;
        pagination.totalRecords = data.totalRecords;
        this.sortOption.totalRecords = data.totalRecords;
        pagination = this.pagerService.getPagedItems(pagination, data.list);
        this.referenceService.stopLoader(this.httpRequestLoader);
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
    this.referenceService.highlightRowOnRowCick('merge-groups-tr', 'merge-groups-list-table', 'mergeGroupsCheckBoxName', this.selectedPartnerGroupIds, 'merge-groups-header-checkbox-id', selectedPartnerGroupId, event);
  }

  highlightSelectedPartnerGroupOnCheckBoxClick(selectedPartnerGroupId: any, event: any) {
    this.referenceService.highlightRowByCheckBox('merge-groups-tr', 'merge-groups-list-table', 'mergeGroupsCheckBoxName', this.selectedPartnerGroupIds, 'merge-groups-header-checkbox-id', selectedPartnerGroupId, event);
  }

  selectOrUnselectAllRowsOfTheCurrentPage(event: any) {
    this.selectedPartnerGroupIds = this.referenceService.selectOrUnselectAllOfTheCurrentPage('merge-groups-tr', 'merge-groups-list-table', 'mergeGroupsCheckBoxName', this.selectedPartnerGroupIds, this.pagination, event);
  }

  removeAllSelectedPartners() {
    this.selectedPartnerGroupIds = [];
    this.isHeaderCheckBoxChecked = false;
    $('#merge-groups-header-checkbox-id').prop('checked',false);
  }



  copyToGroups(){
    console.log(this.selectedPartnerGroupIds);
  }

  callEmitter(){
    $('#mergeGroupsModalPopup').modal('hide');
    this.mergeGroupsModalPopupEventEmitter.emit();
  }
  

  closePopup(){
    this.callEmitter();
  }

}
