import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { ParterService } from '../services/parter.service';
import { UtilService } from 'app/core/services/util.service';
import { PagerService } from 'app/core/services/pager.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { SortOption } from 'app/core/models/sort-option';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { Pagination } from 'app/core/models/pagination';
import { TeamMemberService } from 'app/team/services/team-member.service';
import { CustomResponse } from 'app/common/models/custom-response';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
declare var $:any, swal: any;
@Component({
  selector: 'app-partner-journey-team-member-high-level-analytics-table',
  templateUrl: './partner-journey-team-member-high-level-analytics-table.component.html',
  providers: [TeamMemberService],
  styleUrls: ['./partner-journey-team-member-high-level-analytics-table.component.css']
})
export class PartnerJourneyTeamMemberHighLevelAnalyticsTableComponent implements OnInit {

  @Input() partnerCompanyId: any;
  @Input() teamMemberId: any;
  @Input() applyFilter: boolean;
  @Output() notifyShowDetailedAnalytics = new EventEmitter();
  @Input() isDetailedAnalytics: boolean;
  @Input() selectedPartnerCompanyIds: any = [];
  @Input() fromDateFilter: string = '';
  @Input() toDateFilter: string = '';
  @Input() fromActivePartnersDiv: boolean = false;
  @Input() fromDeactivatedPartnersDiv: boolean = false;
  @Input() fromAllPartnersDiv: boolean = false;

  
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  loggedInUserId: number = 0;
  searchKey: string = "";
  pagination: Pagination = new Pagination();
  customResponse: CustomResponse = new CustomResponse();
  isLoggedInAsTeamMember = false;
  loading: boolean;
  logger: any;
  showModulesPopup: boolean;
  teamMemberGroupId: any;
  scrollClass: string;
  isHeaderCheckBoxChecked: boolean = false;
  isSendReminderEnabled: boolean = false;
  partnershipStatus: any;
  selectedPartnerIds: number[] = [];
  allItems: any[] = []; 
  teamMemberPreview : boolean = false;
  selectedItemTeamMember : any;
  selectedEmailTemplateId: any;
  selectedEmailId: String;
  sendTestEmailIconClicked: boolean = false;
  constructor(public authenticationService: AuthenticationService,
    public referenseService: ReferenceService, private teamMemberService: TeamMemberService, public parterService: ParterService,
    public pagerService: PagerService, public utilService: UtilService,
    public xtremandLogger: XtremandLogger, public sortOption: SortOption,  private vanityURLService: VanityURLService) {
    this.loggedInUserId = this.authenticationService.getUserId();
    this.isLoggedInAsTeamMember = this.utilService.isLoggedAsTeamMember();
  }

  ngOnInit() {
  }
  

  ngOnChanges() {
    if(this.fromActivePartnersDiv){
      this.partnershipStatus = 'approved';
    } else if(this.fromDeactivatedPartnersDiv){
      this.partnershipStatus = 'deactivated';
    } else if(this.fromAllPartnersDiv){
      this.partnershipStatus = 'approved,deactivated';
    }
    this.pagination.pageIndex = 1;
    // if (this.partnerCompanyId != null && this.partnerCompanyId != undefined && this.partnerCompanyId > 0) {
    //   this.isDetailedAnalytics = true;
    // } else {
    //   this.isDetailedAnalytics = false;
    // }
    this.getPartnerJourneyTeamInfo(this.pagination);
  }

  getPartnerJourneyTeamInfo(pagination: Pagination) {
    this.referenseService.loading(this.httpRequestLoader, true);
    this.pagination.userId = this.loggedInUserId;
    this.pagination.partnerCompanyId = this.partnerCompanyId;
    this.pagination.selectedPartnerCompanyIds = this.selectedPartnerCompanyIds;
    this.pagination.detailedAnalytics = this.isDetailedAnalytics;
    this.pagination.partnerTeamMemberGroupFilter = this.applyFilter;
    this.pagination.teamMemberId = this.teamMemberId;
    this.pagination.fromDateFilterString = this.fromDateFilter;
    this.pagination.toDateFilterString = this.toDateFilter;
    this.pagination.partnershipStatus = this.partnershipStatus;
    this.pagination.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    this.parterService.getPartnerJourneyTeamInfo(this.pagination).subscribe(
      (response: any) => {
        this.referenseService.loading(this.httpRequestLoader, false);
        if (response.statusCode == 200) {
          this.sortOption.totalRecords = response.data.totalRecords;
          this.pagination.totalRecords = response.data.totalRecords;
          if (pagination.totalRecords == 0) {
            this.scrollClass = 'noData'
          } else {
            this.scrollClass = 'tableHeightScroll'
          }
          response.data.list.forEach((partner: any) => {
            const existingIndex = this.allItems.findIndex(item => item.teamMemberId === partner.teamMemberId);
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

      },
      (_error: any) => {
        this.httpRequestLoader.isServerError = true;
        this.xtremandLogger.error(_error);
      }
    );
  }

  search() {
    this.getAllFilteredResults(this.pagination);
  }

  searchKeyPress(keyCode: any) {
    if (keyCode === 13) {
      this.search();
    }
  }

  getAllFilteredResults(pagination: Pagination) {
    pagination.pageIndex = 1;
    pagination.searchKey = this.searchKey;
    pagination = this.utilService.sortOptionValues(this.sortOption.teamMember, pagination);
    this.getPartnerJourneyTeamInfo(this.pagination);
  }

  dropDownList(event) {
    this.pagination = event;
    this.getPartnerJourneyTeamInfo(this.pagination);
  }

  setPage(event: any) {
    this.pagination.pageIndex = event.page;
    this.getPartnerJourneyTeamInfo(this.pagination);
  }

  getSortedResults(text: any) {
    this.sortOption.selectedSortedOption = text;
    this.getAllFilteredResults(this.pagination);
  }

  viewAnalytics(partnerCompanyId: any) {
    this.notifyShowDetailedAnalytics.emit(partnerCompanyId);
    this.referenseService.goToTop(); 
  }

  resendEmailInvitation(emailId: string) {
      let self = this;
      swal({
        title: 'Are you sure?',
        text: "An invitation email will be sent to team member",
        type: 'warning',
        showCancelButton: true,
        swalConfirmButtonColor: '#54a7e9',
        swalCancelButtonColor: '#999',
        confirmButtonText: 'Yes, send it!'

      }).then(function () {
        self.sendEmail(emailId);
      }, function (dismiss: any) {
        console.log('you clicked on option' + dismiss);
      });
  }

  sendEmail(emailId: string) {
    this.customResponse = new CustomResponse();
    try {
      this.loading = true;
      let input = {};
      input['userId'] = this.authenticationService.getUserId();
      input['emailId'] = emailId;
      this.teamMemberService.resendTeamMemberInvitation(input)
        .subscribe(
          data => {
            if (data.statusCode == 200) {
              this.customResponse = new CustomResponse('SUCCESS', "Invitation sent successfully.", true);
            } else {
              this.customResponse = new CustomResponse('ERROR', "Invitation cannot be sent as the account is already created for team member", true);
            }
            this.loading = false;
          },
          error => {
            this.loading = false;
            this.logger.errorPage(error);
          }
        );
    } catch (error) {
      this.loading = false;
    }
  }

  previewModules(teamMemberGroupId: number) {
    this.showModulesPopup = true;
    this.teamMemberGroupId = teamMemberGroupId;
  }

  hideModulesPreviewPopUp(){
    this.showModulesPopup = false;
  }

  /****** XNFR-147*****/

  downloadTeamMemberListCsv() {
    const url = `${this.authenticationService.REST_URL}partner/download`;
    const headers = {
      'Authorization': `Bearer ${this.authenticationService.access_token}`,
      'Content-Type': 'application/json'
    };

    fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(this.pagination)
    })
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'partner-team-member.csv';
        a.click();
      }, (_error: any) => {
        this.httpRequestLoader.isServerError = true;
        this.referenseService.loading(this.httpRequestLoader, false);
        this.xtremandLogger.error(_error);
        this.customResponse = new CustomResponse('ERROR', "Failed to Download", true);
      });

  }

  sortPartnerTeamMembers(text: any) {
    this.sortOption.teamMember = text;
    this.getAllFilteredResults(this.pagination);
  }

updateSelectionCheckBox(): void {
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

  this.updateSelectionCheckBox();
}

sendReminder(): void {
  const selectedTeamMembers = this.pagination.selectedPartnerIds
    .map(teamMemberId => this.allItems.find(item => item.teamMemberId === teamMemberId))
    .filter(teamMember => teamMember && teamMember.status !== 'UNAPPROVED' && teamMember.emailId);

  const emailIds = selectedTeamMembers.map(teamMember => teamMember.emailId);
  const emailIdsString = emailIds.join(', ');

  if (emailIdsString) {
    this.openSendTestEmailTeamMeberModalPopup(emailIdsString);
  } 
}


  sendTeamMemberEmail(item: any) {
    this.loading = true;
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
              this.updateSelectionCheckBox();
            }
            else {
              this.isSendReminderEnabled = false;
              this.isHeaderCheckBoxChecked = false;
            }

          } else {
            this.customResponse = new CustomResponse('ERROR', "Email cannot be sent", true);
          }
          this.loading = false;
        },
        error => {
          this.loading = false;
          this.logger.errorPage(error);
        }
      );
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


  emittedMethodTemMember(event: any) {
    if (Array.isArray(event)) {
      this.sendRemindersForAllSelectedPartners();
    }
    this.referenseService.showSweetAlertSuccessMessage('Email sent successfully.');
  }

  sendTestEmailModalPopupTeamMemberEventReceiver() {
    this.selectedEmailTemplateId = 0;
    this.sendTestEmailIconClicked = false;
    this.teamMemberPreview = false;
  }


}