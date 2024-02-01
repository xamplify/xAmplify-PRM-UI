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

  
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  loggedInUserId: number = 0;
  searchKey: string = "";
  pagination: Pagination = new Pagination();
  customResponse: any;
  isLoggedInAsTeamMember = false;
  loading: boolean;
  logger: any;
  showModulesPopup: boolean;
  teamMemberGroupId: any;
  
  constructor(public authenticationService: AuthenticationService,
    public referenseService: ReferenceService, private teamMemberService: TeamMemberService, public parterService: ParterService,
    public pagerService: PagerService, public utilService: UtilService,
    public xtremandLogger: XtremandLogger, public sortOption: SortOption) {
    this.loggedInUserId = this.authenticationService.getUserId();
    this.isLoggedInAsTeamMember = this.utilService.isLoggedAsTeamMember();
  }

  ngOnInit() {
  }
  

  ngOnChanges() {    
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
    this.pagination.maxResults = 6;
    this.pagination.detailedAnalytics = this.isDetailedAnalytics;
    this.pagination.partnerTeamMemberGroupFilter = this.applyFilter;
    this.pagination.teamMemberId = this.teamMemberId;
    this.parterService.getPartnerJourneyTeamInfo(this.pagination).subscribe(
      (response: any) => {
        this.referenseService.loading(this.httpRequestLoader, false);
        if (response.statusCode == 200) {
          this.sortOption.totalRecords = response.data.totalRecords;
          this.pagination.totalRecords = response.data.totalRecords;
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
    pagination.searchKey = this.sortOption.searchKey;
    pagination = this.utilService.sortOptionValues(this.sortOption.selectedSortedOption, pagination);
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
    if (!this.isLoggedInAsTeamMember) {
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

}
