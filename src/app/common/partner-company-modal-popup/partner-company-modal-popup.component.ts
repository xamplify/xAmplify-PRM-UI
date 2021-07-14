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
   // @Input() companyId: any;
    //@Output() notifyOtherComponent = new EventEmitter();
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
    showUsersPreview : boolean = false;

  constructor(public partnerService: ParterService,public xtremandLogger: XtremandLogger, private pagerService: PagerService, public authenticationService: AuthenticationService,
	        public referenceService: ReferenceService, public properties: Properties, public utilService: UtilService, public userService: UserService) { 
	  this.loggedInUserId = this.authenticationService.getUserId();
  }

  ngOnInit() {
	             this.openPopup();
	         
  }
  
  openPopup() {
      $('#partnerCompaniesPopup').modal('show');
      () => {
          this.findPartnerCompanies(this.pagination);
      }
  }
  
  findPartnerCompanies(pagination: Pagination) {
      this.referenceService.scrollToModalBodyTopByClass();
      this.referenceService.startLoader(this.httpRequestLoader);
      this.partnerService.loadPartnerCompanies(pagination, this.loggedInUserId).subscribe((result: any) => {
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
      //this.notifyOtherComponent.emit();
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
	  
	  
  }
  
  publish(){
	  
  }
  
  searchPartners(){
	  
  }
  
  viewTeamMembers(item: any){
	  
	  
  }
  
  searchAdminsAndTeamMembers(){
	  
  }
  highlightSelectedAdminOrTeamMemberRowOnRowClick(teamMemberId: number, partnershipId: number, event: any){
	  
	  
  }
  
  highlightAdminOrTeamMemberRowOnCheckBoxClick(teamMemberId: number, partnershipId: number, event: any) {
	  
  }
  
  navigateToNextPage(event: any) {
      this.pagination.pageIndex = event.page;
      this.findPartnerCompanies(this.pagination);
  }
  
  
  
  
  
  

}
