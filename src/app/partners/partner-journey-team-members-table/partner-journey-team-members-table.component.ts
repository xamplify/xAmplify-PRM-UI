import { Component, OnInit, Input, Output, EventEmitter,OnDestroy } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PagerService } from 'app/core/services/pager.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { ParterService } from '../services/parter.service';
import { UtilService } from 'app/core/services/util.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { Pagination } from 'app/core/models/pagination';
import { SortOption } from 'app/core/models/sort-option';
import { PartnerJourneyRequest } from '../models/partner-journey-request';
import { SweetAlertParameterDto } from 'app/common/models/sweet-alert-parameter-dto';
import { Properties } from '../../common/models/properties';
import { CustomResponse } from '../../common/models/custom-response';
import { PartnerPrimaryAdminUpdateDto } from '../models/partner-primary-admin-update-dto';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
import { TeamMemberService } from 'app/team/services/team-member.service';

@Component({
  selector: 'app-partner-journey-team-members-table',
  templateUrl: './partner-journey-team-members-table.component.html',
  styleUrls: ['./partner-journey-team-members-table.component.css'],
  providers: [SortOption,Properties,TeamMemberService]
})
export class PartnerJourneyTeamMembersTableComponent implements OnInit,OnDestroy {
  @Input() partnerCompanyId: any;
  @Input() fromDateFilter: string = '';
  @Input() toDateFilter: string = '';
  @Input() partnerStatus: string = '';
  @Input() fromDeactivatedPartnersDiv: boolean = false;
  @Output() notifyTeamMemberSelection = new EventEmitter();

  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  loggedInUserId: number = 0;
  searchKey: string = "";
	pagination: Pagination = new Pagination();
  teamEmails: any = [];
  teamMemberId: any = 0;
  showModulesPopup: boolean;
  teamMemberGroupId: number;
  /***XNFR-878***/
  primaryAdminSweetAlertParameterDto: SweetAlertParameterDto = new SweetAlertParameterDto();
  isEnablePrimaryAdminOptionClicked = false;
  sucessOrFailureResponse : CustomResponse = new CustomResponse();
  partnerPrimaryAdminUpdateDto: PartnerPrimaryAdminUpdateDto = new PartnerPrimaryAdminUpdateDto();
  isLoading = false;
  isHeaderCheckBoxChecked: boolean = false;
  isSendReminderEnabled: boolean = false;
  selectedPartnerIds: number[] = [];
  allItems: any[] = []; 
  teamMemberPreview : boolean = false;
  selectedItemTeamMember : any;
  selectedEmailTemplateId: any;
  selectedEmailId: String;
  sendTestEmailIconClicked: boolean = false;
  logger: any;

   /***XNFR-878***/
  constructor(public authenticationService: AuthenticationService,
    public referenseService: ReferenceService, public parterService: ParterService,
    public pagerService: PagerService, public utilService: UtilService,
    public xtremandLogger: XtremandLogger, public sortOption: SortOption,
    public properties:Properties,  private vanityURLService: VanityURLService, private teamMemberService: TeamMemberService) {
      this.loggedInUserId = this.authenticationService.getUserId(); 
  }
  ngOnDestroy(): void {
    this.referenseService.closeSweetAlert();
  }

  ngOnInit() {   
    this.primaryAdminSweetAlertParameterDto.confirmButtonText = this.properties.proceed;
    this.primaryAdminSweetAlertParameterDto.text = this.properties.confirmPrimaryAdminText;
  } 

  ngOnChanges(){
    this.getTeamInfo(this.pagination);
    this.getTeamEmails();
  }

  getTeamInfo(pagination : Pagination) {
    this.referenseService.loading(this.httpRequestLoader, true);
    this.pagination.userId = this.loggedInUserId;
    this.pagination.partnerCompanyId = this.partnerCompanyId;
    this.pagination.partnerJourneyFilter = true;
    this.pagination.fromDateFilterString = this.fromDateFilter;
    this.pagination.toDateFilterString = this.toDateFilter;
    this.pagination.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (this.teamMemberId !== undefined && this.teamMemberId != null && this.teamMemberId > 0) {
      this.pagination.teamMemberId = this.teamMemberId;
      this.pagination.filterKey = "teamMemberFilter";
    } else {
      this.pagination.filterKey = "";
      this.pagination.teamMemberId = undefined;
    }
    this.authenticationService.findAllTeamMembers(this.pagination).subscribe(
			(response: any) => {	
        if (response.statusCode == 200) {          
          this.sortOption.totalRecords = response.data.totalRecords;
				  this.pagination.totalRecords = response.data.totalRecords;
          response.data.list.forEach((partner: any) => {
            const existingIndex = this.allItems.findIndex(teamMember => teamMember.teamMemberId === partner.teamMemberId);
            if (existingIndex === -1) {
              this.allItems.push(partner);
            } else {
              this.allItems[existingIndex] = partner;
            }
            partner.isSelected = this.pagination.selectedPartnerIds.includes(partner.teamMemberId);
          });
          this.isHeaderCheckBoxChecked = response.data.list.every((partner: any) => partner.isSelected);      
				  this.pagination = this.pagerService.getPagedItems(this.pagination, response.data.list);
        }     
        this.referenseService.loading(this.httpRequestLoader, false);
			},
			(_error: any) => {
        this.httpRequestLoader.isServerError = true;
        this.xtremandLogger.error(_error);
			}
		);
  }

  search() {	
    this.sucessOrFailureResponse = new CustomResponse();	
    this.getAllFilteredResults(this.pagination);
	}

  searchKeyPress(keyCode: any) {
    if (keyCode === 13) { 
      this.search(); 
    } 
  } 

  getAllFilteredResults(pagination: Pagination) {
    pagination.pageIndex = 1;
    pagination.searchKey = this.sortOption.searchKey;
    pagination = this.utilService.sortOptionValues(this.sortOption.activepartnerJourney, pagination);
    this.getTeamInfo(this.pagination);
  }

  dropDownList(event) {
    this.pagination = event;
    this.getTeamInfo(this.pagination);
  }

  setPage(event:any) {
    this.goToDiv();
		this.pagination.pageIndex = event.page;
		this.getTeamInfo(this.pagination);
	}  

  navigateToDivAndGetAllTeamMembers(pagination:Pagination){
    this.goToDiv();
		this.getAllFilteredResults(pagination);
  }

  getSortedResults(text: any) {
    this.sortOption.selectedSortedOption = text;
    this.getAllFilteredResults(this.pagination);
  }  

  setSortColumns(pagination: Pagination, sortedValue: any) {
    if (sortedValue != "") {
        let options: string[] = sortedValue.split("-");
        pagination.sortcolumn = options[0];
        pagination.sortingOrder = options[1];
    }
  }

  onChangeTeamMember() {
    this.notifyTeamMemberSelection.emit(this.teamMemberId);
    this.getTeamInfo(this.pagination);
  }

  getTeamEmails() {
    this.referenseService.loading(this.httpRequestLoader, true);
    let partnerJourneyRequest = new PartnerJourneyRequest();
    partnerJourneyRequest.loggedInUserId = this.loggedInUserId;
    partnerJourneyRequest.partnerCompanyId = this.partnerCompanyId;
    partnerJourneyRequest.fromDateFilterInString = this.fromDateFilter
    partnerJourneyRequest.toDateFilterInString = this.toDateFilter;
    partnerJourneyRequest.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.parterService.getPartnerJourneyTeamEmails(partnerJourneyRequest).subscribe(
			(response: any) => {	
        this.referenseService.loading(this.httpRequestLoader, false);
        if (response.statusCode == 200) {
          this.teamEmails = response.data;	
        }        	
			},
			(_error: any) => {
        this.httpRequestLoader.isServerError = true;
        this.xtremandLogger.error(_error);
			}
		);
  }

  previewModules(teamMemberGroupId: number) {
    this.showModulesPopup = true;
    this.teamMemberGroupId = teamMemberGroupId;
  }

  hideModulesPreviewPopUp(){
    this.showModulesPopup = false;
  }

  downloadTeamMembersReport() {
    let loggedInUserIdRequestParam = this.loggedInUserId != undefined && this.loggedInUserId > 0 ? this.loggedInUserId : 0;
    let searchKeyRequestParm = this.sortOption.searchKey != undefined ? this.sortOption.searchKey : "";
    let partnerTeamMemberGroupFilterRequestParm = true;
    let fromDateFilterRequestParam = this.fromDateFilter != undefined ? this.fromDateFilter : "";
    let toDateFilterRequestParam = this.toDateFilter != undefined ? this.toDateFilter : "";
    let partnerCompanyIdRequestParam = this.partnerCompanyId != undefined ? this.partnerCompanyId : 0;
    let teamMemberIdRequestParam = this.teamMemberId != undefined ? this.teamMemberId : 0;
    let timeZoneRequestParm = "&timeZone=" + Intl.DateTimeFormat().resolvedOptions().timeZone;
    let filterTypeRequestParam = this.teamMemberId != undefined && this.teamMemberId > 0 ? "&filterType=teamMemberFilter" : "";
    let url = this.authenticationService.REST_URL + "partner/journey/download/team-members-report?access_token=" + this.authenticationService.access_token
      + "&loggedInUserId=" + loggedInUserIdRequestParam + "&partnerCompanyId=" + partnerCompanyIdRequestParam + "&searchKey=" + searchKeyRequestParm
      + "&partnerTeamMemberGroupFilter=" + partnerTeamMemberGroupFilterRequestParm + "&teamMemberUserId=" + teamMemberIdRequestParam
      + "&fromDateFilterInString=" + fromDateFilterRequestParam + "&toDateFilterInString=" + toDateFilterRequestParam + timeZoneRequestParm + filterTypeRequestParam;
    this.referenseService.openWindowInNewTab(url);
  }

  sortActivePartnerJourney(text: any) {
    this.sortOption.activepartnerJourney = text;
    this.getAllFilteredResults(this.pagination);
  }

  /***XNFR-878*****/
  confirmPrimaryAdminChange(teamMember:any){
    this.partnerPrimaryAdminUpdateDto =  new PartnerPrimaryAdminUpdateDto();
    if (teamMember.status == 'APPROVE' && this.authenticationService.module.isAnyAdminOrSupervisor) {
      this.isEnablePrimaryAdminOptionClicked = true;
      this.partnerPrimaryAdminUpdateDto.partnerCompanyTeamMemberUserId = teamMember.teamMemberUserId;
    }
  }
  
  /********XNFR-878*********/
  enableAsPrimaryAdmin(event: any) {
    if (event) {
      this.isLoading = true;
      this.sucessOrFailureResponse = new CustomResponse();
      let statusCode = 0;
      this.authenticationService.updatePartnerCompanyPrimaryAdmin(this.partnerPrimaryAdminUpdateDto).
        subscribe(
          response => {
            statusCode = response.statusCode;
            let status = statusCode==200 ? 'SUCCESS':'ERROR';
            this.sucessOrFailureResponse = new CustomResponse(status,response.message,true);
            this.goToDiv();
            this.isEnablePrimaryAdminOptionClicked = false;
            this.isLoading = false;
          }, error => {
           this.referenseService.showSweetAlertServerErrorMessage();
           this.isEnablePrimaryAdminOptionClicked = false;
           this.isLoading = false;
          },()=>{
            if(statusCode==200){
              this.referenseService.loading(this.httpRequestLoader, true);
              this.pagination = new Pagination();
              this.pagination.userId = this.loggedInUserId;
              this.pagination.partnerCompanyId = this.partnerCompanyId;
              this.pagination.partnerJourneyFilter = true;
              this.pagination.fromDateFilterString = this.fromDateFilter;
              this.pagination.toDateFilterString = this.toDateFilter;
              this.pagination.searchKey = this.sortOption.searchKey;
              this.pagination.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
              this.getTeamInfo(this.pagination);
            }
          });
    }else{
      this.isEnablePrimaryAdminOptionClicked = false;
    }
   
  }


  private goToDiv() {
    this.referenseService.goToDiv("partner-team-members-list");
  }
  
  sendReminder(): void {
    const selectedTeamMembers = this.pagination.selectedPartnerIds
    .map(teamMemberId => this.allItems.find(item => item.teamMemberId === teamMemberId))
    .filter(teamMember => teamMember && teamMember.status !== 'UNAPPROVED' && teamMember.emailId);

  
    const emailIds = selectedTeamMembers.map(partner => partner.emailId);
    const emailIdsString = emailIds.join(', ');
  
    this.openSendTestEmailTeamMeberModalPopup(emailIdsString);
  
  }
  
  openSendTestEmailTeamMeberModalPopup(emailIds: any) {
    this.selectedEmailId = emailIds;

    this.vanityURLService.getTemplateId(this.selectedEmailId, "teamMemberFilter").subscribe(
      response => {
        if (response.statusCode === 200) {
          this.selectedEmailTemplateId = response.data;
          this.sendTestEmailIconClicked = true;
          this.teamMemberPreview = true;
        } else if (response.statusCode === 400) {
          console.error("Error: Invalid email ID or other bad request.");
        } else {
          console.error("Unexpected status code:", response.statusCode);
        }
      },
      (error) => {
        console.error("Error fetching template ID:", error);
      }
    );
  }

updateSelectionState(): void {
  const currentPageItems = this.pagination.pagedItems;
  const selectableItems = currentPageItems.filter(item => item.status !== 'UNAPPROVED'); 

  selectableItems
    .filter(item => item.isSelected)
    .forEach(item => {
      if (!this.pagination.selectedPartnerIds.includes(item.teamMemberId)) {
        this.pagination.selectedPartnerIds.push(item.teamMemberId);
      }
    });

  selectableItems
    .filter(item => !item.isSelected)
    .forEach(item => {
      const index = this.pagination.selectedPartnerIds.indexOf(item.teamMemberId);
      if (index !== -1) {
        this.pagination.selectedPartnerIds.splice(index, 1);
      }
    });

  this.isSendReminderEnabled = this.pagination.selectedPartnerIds.some(teamMemberId => {
    const teamMember = this.allItems.find(item => item.teamMemberId === teamMemberId);
    return teamMember && teamMember.status !== 'UNAPPROVED';
  });

  this.isHeaderCheckBoxChecked = selectableItems.length > 0 && selectableItems.every(item => item.isSelected);
  this.selectedItemTeamMember = currentPageItems;
}
toggleSelectAll(event: Event): void {
  const checked = (event.target as HTMLInputElement).checked;
  const currentPageItems = this.pagination.pagedItems;

  currentPageItems.forEach(item => {
    if (item.status !== 'UNAPPROVED') { 
      item.isSelected = checked;

      if (checked) {
        if (!this.pagination.selectedPartnerIds.includes(item.teamMemberId)) {
          this.pagination.selectedPartnerIds.push(item.teamMemberId);
        }
      } else {
        const index = this.pagination.selectedPartnerIds.indexOf(item.teamMemberId);
        if (index !== -1) {
          this.pagination.selectedPartnerIds.splice(index, 1);
        }
      }
    }
  });

  this.updateSelectionState();
}

sendTestEmailModalPopupTeamMemberEventReceiver() {
  this.selectedEmailTemplateId = 0;
  this.sendTestEmailIconClicked = false;
  this.teamMemberPreview = false;
}



sendRemindersForAllSelectedPartners(): void {
    const selectedPartners = this.pagination.selectedPartnerIds
    .map(partnerId => this.allItems.find(item => item.teamMemberId === partnerId))
    .filter(partner => partner && partner.status !== 'UNAPPROVED' && partner.emailId);

      this.sendTeamMemberEmail(selectedPartners);
  

  selectedPartners.forEach(partner => {
    partner.isSelected = false;
  });
  this.pagination.selectedPartnerIds = [];
  this.isSendReminderEnabled = false;
  this.isHeaderCheckBoxChecked = false;
}

sendTeamMemberEmail(item: any) {
  this.isLoading = true;
  let user = new Pagination();
  for (const teamMember of item) {
    user.selectedPartnerIds.push(teamMember.teamMemberUserId);
  }
  user.userId = this.authenticationService.getUserId();
  user.vanityUrlFilter = this.authenticationService.vanityURLEnabled;
  user.vendorCompanyProfileName = this.authenticationService.companyProfileName;
  this.teamMemberService.resendTeamMemberEmail(user)
    .subscribe(
      data => {
        if (data.statusCode === 2017) {
          const partnerIndex = this.allItems.findIndex(p => p.teamMemberId === item.teamMemberId);
          if (partnerIndex !== -1) {
            this.allItems[partnerIndex].isSelected = false;
            this.pagination.selectedPartnerIds = this.pagination.selectedPartnerIds.filter(id => id !== item.teamMemberId);
          }

          if (this.pagination.selectedPartnerIds.length > 0) {
            this.isSendReminderEnabled = true;
            this.updateSelectionState();
          }
          else {
            this.isSendReminderEnabled = false;
            this.isHeaderCheckBoxChecked = false;
          }

        } else {
          this.sucessOrFailureResponse = new CustomResponse('ERROR', "Email cannot be sent", true);
        }
        this.isLoading = false;
      },
      error => {
        this.isLoading = false;
        this.logger.errorPage(error);
      }
    );
}


  emittedMethodTemMember(event: any) {
    if (Array.isArray(event)) {
      this.sendRemindersForAllSelectedPartners();
    }
    this.referenseService.showSweetAlertSuccessMessage('Email sent successfully.');
  }

}
