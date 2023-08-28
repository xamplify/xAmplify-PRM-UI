import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { CustomResponse } from '../../common/models/custom-response';
import { ReferenceService } from '../../core/services/reference.service';
import { Properties } from '../../common/models/properties';
import { SortOption } from '../../core/models/sort-option';
import { UtilService } from '../../../app/core/services/util.service';
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";
import { UserService } from "../../../app/core/services/user.service";
import { ParterService } from "../../../app/partners/services/parter.service";
import { ContactService } from '../../contacts/services/contact.service';
declare var $: any, swal: any;


@Component({
  selector: 'app-partner-company-modal-popup',
  templateUrl: './partner-company-modal-popup.component.html',
  styleUrls: ['./partner-company-modal-popup.component.css']
})
export class PartnerCompanyModalPopupComponent implements OnInit {
	
	ngxLoading = false;
    loggedInUserId: number = 0;
    pagination: Pagination = new Pagination();
    customResponse: CustomResponse = new CustomResponse();
	@Input() companyId: any;
    @Input() inputId: any;
    @Output() notifyOtherComponent = new EventEmitter();
    httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
    sendSuccess = false;
    responseMessage = "";
    responseImage = "";
    responseClass = "event-success";
    statusCode: number = 0;
    isEdit = false;
    /******Partner Companies Varaibles******/
    isHeaderCheckBoxChecked = false;
    selectedTeamMemberIds: any[] = [];
    sortOption: SortOption = new SortOption();
    adminsAndTeamMembersErrorMessage: CustomResponse = new CustomResponse();
    selectedPartnershipIds: any[] = [];
    teamMembersPagination: Pagination = new Pagination();
    teamMembersLoader: HttpRequestLoader = new HttpRequestLoader();
    selectedFilterIndex: number = 0;
    showFilter = true;
    isTableLoaded: boolean = true;
  constructor(public partnerService: ParterService,public xtremandLogger: XtremandLogger, private pagerService: PagerService, public authenticationService: AuthenticationService,
	        public referenceService: ReferenceService, public properties: Properties, public utilService: UtilService, public userService: UserService, public contactService: ContactService) { 
	  this.loggedInUserId = this.authenticationService.getUserId();
  }

  ngOnInit() {
      if (this.companyId != undefined && this.companyId > 0 && this.inputId != undefined && this.inputId > 0 ) {
              this.pagination.vendorCompanyId = this.companyId;
              this.pagination.partnerTeamMemberGroupFilter = true;
              this.openPopup();
          } else {
              this.referenceService.showSweetAlertErrorMessage("Invalid Request.Please try after sometime");
              this.closePopup();
          }
  }
  
  openPopup() {
      $('#partnerCompaniesPopup').modal('show');
      this.findPartnerCompanies(this.pagination);
  }
  
  findPartnerCompanies(pagination: Pagination) {
      this.referenceService.scrollToModalBodyTopByClass();
      this.referenceService.startLoader(this.httpRequestLoader);
      pagination.campaignId = this.inputId;
      pagination.userId = this.loggedInUserId;
      pagination.vendorCompanyId = this.companyId;
      this.partnerService.findPartnerCompanies(pagination).subscribe((result: any) => {
          let data = result.data;
          pagination.totalRecords = data.totalRecords;
          this.sortOption.totalRecords = data.totalRecords;
          $.each(data.list, function (_index: number, list: any) {
              list.displayTime = new Date(list.createdTimeInString);
          });
          pagination = this.pagerService.getPagedItems(pagination, data.list);
          this.referenceService.stopLoader(this.httpRequestLoader);
      }, _error => {
          this.customResponse = this.referenceService.showServerErrorResponse(this.httpRequestLoader);
      }, () => {

      });
  }
  
  closePopup() {
      this.notifyOtherComponent.emit();
      $('#partnerCompaniesPopup').modal('hide');
      this.sendSuccess = false;
      this.responseMessage = "";
      this.responseImage = "";
      this.responseClass = "";
      this.resetFields();
  }
  
  resetFields() {
      this.pagination = new Pagination();
      this.sortOption = new SortOption();
      this.isHeaderCheckBoxChecked = false;
      this.selectedTeamMemberIds = [];
      this.selectedPartnershipIds = [];
      this.ngxLoading = false;
  }
  clearAll(){
          this.selectedTeamMemberIds = [];
          this.selectedPartnershipIds = [];
          this.isHeaderCheckBoxChecked = false;
          this.disableOrEnablePartnerListsTab();
  }
  
  searchPartners() {
      this.getAllFilteredResults("partnerCompanies", this.pagination, this.sortOption);
  }
  
  getAllFilteredResults(type: string, pagination: Pagination, sortOption: SortOption) {
      this.customResponse = new CustomResponse();
      pagination.pageIndex = 1;
      pagination.searchKey = sortOption.searchKey;
          pagination = this.utilService.sortOptionValues(sortOption.selectedDamPartnerDropDownOption, pagination);
          this.findPartnerCompanies(pagination);
 
  }
  
  viewTeamMembers(item: any) {
    /***XBI-1883**/
    let isPartnerCompanySelected = this.selectedPartnershipIds.length>0 && this.selectedPartnershipIds.indexOf(item.partnershipId)<=-1;
    if(!isPartnerCompanySelected){
        this.teamMembersPagination = new Pagination();
        this.isHeaderCheckBoxChecked = false;
        this.adminsAndTeamMembersErrorMessage = new CustomResponse();
        this.pagination.pagedItems.forEach((element) => {
            let partnerCompanyId = element.partnerCompanyId;
            let clickedCompanyId = item.partnerCompanyId;
            if (clickedCompanyId != partnerCompanyId) {
                element.expand = false;
            }
        });
        item.expand = !item.expand;
        if (item.expand) {
            this.referenceService.loading(this.teamMembersLoader, true);
            this.teamMembersPagination.companyId = item.partnerCompanyId;
            this.teamMembersPagination.partnershipId = item.partnershipId;
            this.getTeamMembersAndAdmins(this.teamMembersPagination);
  
        }
    }
  }
  
  getTeamMembersAndAdmins(teamMembersPagination: Pagination) {
      this.adminsAndTeamMembersErrorMessage = new CustomResponse();
      this.referenceService.loading(this.teamMembersLoader, true);
      this.userService.findAdminsAndTeamMembers(teamMembersPagination).subscribe(
          response => {
              let data = response.data;
              teamMembersPagination.totalRecords = data.totalRecords;
              teamMembersPagination.maxResults = teamMembersPagination.totalRecords;
              teamMembersPagination = this.pagerService.getPagedItems(teamMembersPagination, data.list);
              /*******Header checkbox will be chcked when navigating through page numbers*****/
              let teamMemberIds = teamMembersPagination.pagedItems.map(function (a) { return a.userId; });
              let items = $.grep(this.selectedTeamMemberIds, function (element: any) {
                  return $.inArray(element, teamMemberIds) !== -1;
              });
              if (items.length == teamMemberIds.length && teamMemberIds.length > 0) {
                  this.isHeaderCheckBoxChecked = true;
              } else {
                  this.isHeaderCheckBoxChecked = false;
              }
              this.referenceService.loading(this.teamMembersLoader, false);
          }, error => {
              this.xtremandLogger.error(error);
              this.referenceService.loading(this.teamMembersLoader, false);
              this.adminsAndTeamMembersErrorMessage = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
          }
      );
  }
  
  highlightSelectedAdminOrTeamMemberRowOnRowClick(teamMemberId: number, partnershipId: number, event: any){
	  
	  
  }
  
  highlightAdminOrTeamMemberRowOnCheckBoxClick(teamMemberId: number, partnershipId: number, event: any) {
      let isChecked = $('#' + teamMemberId).is(':checked');
      if (isChecked) {
          $('#publishToPartners' + teamMemberId).addClass('row-selected');
          this.selectedTeamMemberIds.push(teamMemberId);
      } else {
          $('#publishToPartners' + teamMemberId).removeClass('row-selected');
          this.selectedTeamMemberIds.splice($.inArray(teamMemberId, this.selectedTeamMemberIds), 1);
      }
      this.checkHeaderCheckBox(partnershipId);
      this.disableOrEnablePartnerListsTab();
      event.stopPropagation();
  }
  
  checkHeaderCheckBox(partnershipId: number) {
      let trLength = $('#admin-and-team-members-' + partnershipId + ' tbody tr').length;
      let selectedRowsLength = $('[name="adminOrTeamMemberCheckBox[]"]:checked').length;
      if (selectedRowsLength == 0) {
          this.selectedPartnershipIds.splice($.inArray(partnershipId, this.selectedPartnershipIds), 1);
      } else {
          this.selectedPartnershipIds.push(partnershipId);
      }
      this.selectedPartnershipIds = this.referenceService.removeDuplicates(this.selectedPartnershipIds);
      this.isHeaderCheckBoxChecked = (trLength == selectedRowsLength);
  }
  
  navigateToNextPage(event: any) {
      this.pagination.pageIndex = event.page;
      this.findPartnerCompanies(this.pagination);
  }
  
  selectAllTeamMembersOfTheCurrentPage(ev: any, partnershipId: number) {
      if (ev.target.checked) {
          $('[name="adminOrTeamMemberCheckBox[]"]').prop('checked', true);
          let self = this;
          $('[name="adminOrTeamMemberCheckBox[]"]:checked').each(function (_index: number) {
              var id = $(this).val();
              self.selectedTeamMemberIds.push(parseInt(id));
              $('#publishToPartners' + id).addClass('row-selected');
          });
          this.selectedTeamMemberIds = this.referenceService.removeDuplicates(this.selectedTeamMemberIds);
          this.selectedPartnershipIds.push(partnershipId);
      } else {
          $('[name="adminOrTeamMemberCheckBox[]"]').prop('checked', false);
          $('#parnter-companies tr').removeClass("row-selected");
          this.selectedTeamMemberIds = this.referenceService.removeDuplicates(this.selectedTeamMemberIds);
          let currentPageSelectedIds = this.teamMembersPagination.pagedItems.map(function (a) { return a.userId; });
          this.selectedTeamMemberIds = this.referenceService.removeDuplicatesFromTwoArrays(this.selectedTeamMemberIds, currentPageSelectedIds);
          this.selectedPartnershipIds = this.referenceService.removeDuplicates(this.selectedPartnershipIds);
          this.selectedPartnershipIds.splice($.inArray(partnershipId, this.selectedPartnershipIds), 1);
      }
      this.disableOrEnablePartnerListsTab();
      ev.stopPropagation();
  }
  
  disableOrEnablePartnerListsTab(){
      if(this.selectedTeamMemberIds.length>0){
          $('#partnerGroups-li').css({'cursor':'not-allowed'});
          $('.partnerGroupsC').css({'pointer-events':'none'});
          $('#partnerGroups-li').attr('title','You can choose either partners/partner lists');
      }else{
          $('#partnerGroups-li').css({'cursor':'auto'});
          $('.partnerGroupsC').css({'pointer-events':'auto'});
          $('#partnerGroups-li').attr('title','Click to see partner lists');
      }
  }
  
  publish() {
      this.customResponse = new CustomResponse();
      if (this.selectedTeamMemberIds.length > 0 || this.isEdit) {
          this.setValuesAndPublish();
      } else {
          this.referenceService.goToTop();
          this.customResponse = new CustomResponse('ERROR', 'Please select atleast one row', true);
      }
  }
  
  startLoaders() {
      this.ngxLoading = true;
      this.referenceService.startLoader(this.httpRequestLoader);
  }
  
  stopLoaders() {
      this.ngxLoading = false;
      this.referenceService.stopLoader(this.httpRequestLoader);
  }
  
  setValuesAndPublish(){
      this.startLoaders();
      let shareLeadsDTO = {
              "userId": this.loggedInUserId,
              "partnerIds": this.selectedTeamMemberIds,
              "userListId": this.inputId,
          }
      this.publishToPartners(shareLeadsDTO);
  }
  
  publishToPartners(shareLeadsDTO : any){
	  this.contactService.shareLeadsListToPartners(shareLeadsDTO).subscribe((data: any) => {
          this.referenceService.scrollToModalBodyTopByClass();
          this.stopLoaders();
          if (data.access) {
              this.sendSuccess = true;
              this.statusCode = data.statusCode;
              if (data.statusCode == 200) {
                  this.responseMessage = "Published Successfully";
              } else {
                  this.responseMessage = data.message;
              }
              this.resetFields();
          } else {
              this.ngxLoading = false;
              this.authenticationService.forceToLogout();
          }
      }, _error => {
          this.stopLoaders();
          this.sendSuccess = false;
          this.referenceService.goToTop();
          this.customResponse = this.referenceService.showServerErrorResponse(this.httpRequestLoader);
      });
  }
  
  partnersSearchOnKeyEvent(keyCode: any) { if (keyCode === 13) { this.searchPartners(); } }
  
  adminAndTeamMembersKeySearch(keyCode: any) { if (keyCode === 13) { this.searchAdminsAndTeamMembers(); } }
  
  searchAdminsAndTeamMembers() {
      this.teamMembersPagination.pageIndex = 1;
      this.getTeamMembersAndAdmins(this.teamMembersPagination);
  }
  
  getSelectedIndex(index:number){
      this.selectedFilterIndex = index;
      this.referenceService.setTeamMemberFilterForPagination(this.pagination,index);
      this.findPartnerCompanies(this.pagination);
    }
  
  
}
