import { CustomAnimation } from './../../core/models/custom-animation';
import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CallActionSwitch } from '../../videos/models/call-action-switch';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { FileUtil } from '../../core/models/file-util';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { TeamMember } from 'app/team/models/team-member';
import { Status } from 'app/team/models/status.enum';
import { TeamMemberUi } from 'app/team/models/team-member-ui';
import { TeamMemberService } from 'app/team/services/team-member.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { CustomResponse } from '../../common/models/custom-response';
import { UserService } from "app/core/services/user.service";
import { UtilService } from '../../core/services/util.service';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
import { Properties } from '../../common/models/properties';
import { RegularExpressions } from '../../common/models/regular-expressions';
import { VanityLoginDto } from '../../util/models/vanity-login-dto';
import { AnalyticsCountDto } from 'app/core/models/analytics-count-dto';
import { SweetAlertParameterDto } from 'app/common/models/sweet-alert-parameter-dto';
import { ParterService } from 'app/partners/services/parter.service';
import { Roles } from 'app/core/models/roles';
import { XAMPLIFY_CONSTANTS } from 'app/constants/xamplify-default.constants';
import { VendorInvitation } from 'app/dashboard/models/vendor-invitation';
import { TagInputComponent as SourceTagInput } from 'ngx-chips';
import { FormControl } from '@angular/forms';
import { tap} from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { ActiveThreadsInfoComponent } from 'app/dashboard/active-threads-info/active-threads-info.component';

declare var $: any, swal: any;
@Component({
  selector: 'app-team-members-util',
  templateUrl: './team-members-util.component.html',
  styleUrls: ['./team-members-util.component.css'],
  providers: [Pagination, HttpRequestLoader, FileUtil, CallActionSwitch, Properties, RegularExpressions],
  animations:[CustomAnimation]
})
export class TeamMembersUtilComponent implements OnInit, OnDestroy {
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  addTeamMemberLoader: HttpRequestLoader = new HttpRequestLoader();
  teamMembers: Array<any> = new Array<any>();
  isLoggedInAsTeamMember = false;
  teamMemberGroups: Array<any> = new Array<any>();
  items2: any[] = [];
  emailIds: any[] = [];
  teamMemberIdToDelete: number = 0;
  selectedTeamMemberEmailId: string = "";
  public VendorInfoFilters: Array<any>;
  public selectedVendorCompanyIds = [];
  public selectedTeamMemberIds = [];
  public selectedVendorCompanies = [];
  public selectedTeamMembers = [];
  public vendorInfoFilterPlaceHolder: string = 'Select Vendors';
  public teamMemberInfoFilterPlaceHolder: string = 'Select Team Members';
  public vendorInfoFields: any;
  public teamMemberInfoFields: any;
  public TeamMemberInfoFilters: Array<any>;
  filterCategoryLoader = false;
  loading: boolean;
  selectedId: number;
  deletePopupLoader: boolean;
  successMessage: string;
  customResponse: CustomResponse = new CustomResponse();
  filterResponse: CustomResponse = new CustomResponse();
  selectedItem: any;
  inputChanged: any;
  isLoggedInThroughVanityUrl: boolean;
  loggedInUserId: number;
  showAddTeamMemberDiv = false;
  editTeamMember = false;
  teamMemberUi: TeamMemberUi = new TeamMemberUi();
  team: TeamMember = new TeamMember();
  saveOrUpdateButtonText = "Save";
  /*****Form Related**************/
  formGroupClass: string = "col-sm-8";
  emaillIdDivClass: string = this.formGroupClass;
  firstNameDivClass: string = this.formGroupClass;
  groupNameDivClass: string = this.formGroupClass;
  errorClass: string = "col-sm-8 has-error has-feedback";
  successClass: string = "col-sm-8 has-success has-feedback";
  defaultClass: string = this.formGroupClass;
  /************CSV Related************* */
  showUploadedTeamMembers = false;
  csvErrors: boolean = false;
  errorMessage: string;
  isUploadCsv: boolean;
  @ViewChild('fileImportInput')
  fileImportInput: any;
  csvRecords: any[];
  newlyAddedTeamMembers: any[];
  /******Preview Group Modules */

  vanityLoginDto: VanityLoginDto = new VanityLoginDto();
  @Input() moduleName: any;
  @Input() teamMemberGroupId: number;
  isTeamMemberModule = false;
  isModalPopupshow = false;
  showModulesPopup: boolean;
  moveToTop: boolean;
  showPartnersPopup: boolean;
  selectedTeamMemberId: number;
  showSecondAdmin = true;
  analyticsCountDto: AnalyticsCountDto = new AnalyticsCountDto();
  showPrimaryAdminConfirmSweetAlert = false;
  selectedPrimaryAdminTeamMemberUserId = 0;
  primaryAdminSweetAlertParameterDto: SweetAlertParameterDto = new SweetAlertParameterDto();
  adminsLoader: HttpRequestLoader = new HttpRequestLoader();
  admins: Array<any> = new Array<any>();
  mergeTagForGuide: any;
  selectedTrackType: any = "";
  selectedAssetType: any = "";
  selectedCampaignType: any = "";
  isCollapsed: boolean = false;
  filterApplied: boolean = false;
  showFilterOption: boolean = false;
  showFilterDropDown: boolean = false;
  isVendorVersion: boolean = false;
  isOnlyPartner: boolean;
  roleName: Roles = new Roles();
  isVendorRole: boolean;
  isOrgAdmin: boolean;
  isPrm: boolean;
  isMarketing: boolean;
  filterActiveBg: string;
  vanityUrlFilter: boolean = false;
  vendorCompanyProfileName: string;
  isSuperAdminAccessing = false;
  isNavigatedFromSuperAdminScreen = false;
  showAnalytics: boolean = false;
  teamInfo: any;
  csvPagination: any;
  logListName: string = "";
  downloadDataList = [];
  dateFilterText = "Select Date Filter";
  fromDateFilter: any = "";
  toDateFilter: any = "";
  fromDateFilterInString: string;
  toDateFilterInString: string;
  /***** XNFR-805 *****/
  vendorInvitation: VendorInvitation = new VendorInvitation();
  isEditorDisabled: boolean = true;
  @ViewChild('tagInput') tagInput: SourceTagInput;
  validators = [this.mustBeEmail.bind(this)];
  errorMessages = { 'must_be_email': 'Please be sure to use a valid email format' };
  onAddedFunc = this.beforeAdd.bind(this);
  isValidationMessage = false;
  addFirstAttemptFailed = false;
  inviteTeamMemberLoading = false;
  inviteTeamMemberHtmlBody: any;
  inviteTeamMemberResponse: CustomResponse = new CustomResponse();
  tableHeader: string = "";
  showTeamMemberName: any;
  /***** XNFR-805 *****/

  constructor(public logger: XtremandLogger, public referenceService: ReferenceService, private teamMemberService: TeamMemberService,
    public authenticationService: AuthenticationService, private pagerService: PagerService, public pagination: Pagination,
    private fileUtil: FileUtil, public callActionSwitch: CallActionSwitch, public userService: UserService, private router: Router,
    public utilService: UtilService, private vanityUrlService: VanityURLService, public properties: Properties,
    public regularExpressions: RegularExpressions, public route: ActivatedRoute, public partnerService: ParterService, 
    private sanitizer: DomSanitizer) {

    this.isLoggedInAsTeamMember = this.utilService.isLoggedAsTeamMember();
    this.isSuperAdminAccessing = this.authenticationService.isSuperAdmin();
    this.loggedInUserId = this.authenticationService.getUserId();
    this.isNavigatedFromSuperAdminScreen = this.referenceService.getCurrentRouteUrl().indexOf("superadmin-manage-team") > -1;
    if (this.isNavigatedFromSuperAdminScreen) {
      this.loggedInUserId = this.route.snapshot.params['userId'];
      this.pagination.userListId = this.loggedInUserId;
    }
    this.isLoggedInThroughVanityUrl = this.vanityUrlService.isVanityURLEnabled();
    if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
      this.vanityLoginDto.vendorCompanyProfileName = this.authenticationService.companyProfileName;
      this.vanityLoginDto.userId = this.loggedInUserId;
      this.vanityLoginDto.vanityUrlFilter = true;
      this.vanityUrlFilter = this.vanityLoginDto.vanityUrlFilter;
      this.vendorCompanyProfileName = this.authenticationService.companyProfileName;
    }

    this.init();
  }

  ngOnInit() {
    this.primaryAdminSweetAlertParameterDto.confirmButtonText = this.properties.proceed;
    this.primaryAdminSweetAlertParameterDto.text = this.properties.confirmPrimaryAdminText;
    this.isTeamMemberModule = this.moduleName == 'teamMember';
    this.moveToTop = "/home/team/add-team" == this.referenceService.getCurrentRouteUrl();
    this.findAll(this.pagination);
    /** User Guide */
    this.getGuideUrlByMergeTag()
    /** User Guide */
    this.getVendorInfoForFilter();
    this.getTeamMemberInfoForFilter();
    /** XNFR-914 ***/
    let isAnalytics = this.isVendorVersion ? false: true;
    if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '' && isAnalytics) {
      this.getModulesAccessGivenByVendorForPartners(); //XNFR-914
    } else {
      this.referenceService.assetAccessGivenByVendor = true;
      this.referenceService.trackAccessGivenByVendor = true;
      this.referenceService.playBookAccessGivenByVendor = true;
      this.referenceService.opportunitiesAccessGivenByVendor = true;
      this.referenceService.contactsAccessGivenByVendor = true;
      this.referenceService.campaignAccessGivenByVendor = true;
      this.referenceService.sharedLeadAccessGivenByVendor = true;
      this.referenceService.mdfAccessGivenByVendor = true;
      this.referenceService.showAnalytics = true;
    }
    /** XNFR-914 ***/
  }
  /** User Guide **/
  getGuideUrlByMergeTag() {
    this.authenticationService.getRoleByUserId().subscribe(
      (data: any) => {
        const role = data.data;
        const roleName = role.role == 'Team Member' ? role.superiorRole : role.role;
        if (roleName == 'Marketing' || roleName == 'Marketing & Partner') {
          this.mergeTagForGuide = 'adding_team_members_marketing';
        } else if (roleName == 'Partner') {
          this.mergeTagForGuide = 'adding_team_members_partner';
        } else {
          this.mergeTagForGuide = 'add_and_manage_team_members';
        }
      });
  }
  /** User Guide **/
  findMaximumAdminsLimitDetails() {
    this.teamMemberService.findMaximumAdminsLimitDetails().subscribe(
      response => {
        this.analyticsCountDto = response.data;
        this.referenceService.loading(this.httpRequestLoader, false);
      }, error => {
        this.analyticsCountDto = new AnalyticsCountDto();
        this.referenceService.loading(this.httpRequestLoader, false);
      }
    );
  }

  init() {
    const roles = this.authenticationService.getRoles();
    if (roles !== undefined) {
      if (this.authenticationService.loggedInUserRole != "Team Member") {
        this.isOnlyPartner = this.authenticationService.isOnlyPartner();
        if (roles.indexOf(this.roleName.orgAdminRole) > -1 ||
          roles.indexOf(this.roleName.vendorRole) > -1 ||
          roles.indexOf(this.roleName.vendorTierRole) > -1 ||
          roles.indexOf(this.roleName.marketingRole) > -1 ||
          roles.indexOf(this.roleName.prmRole) > -1) {
            this.isVendorVersion = true;
        }
        if (roles.indexOf(this.roleName.prmRole) > -1) {
          this.isPrm = true;
        }
        /** User Guide* */
        if (roles.indexOf(this.roleName.vendorRole) > -1) {
          this.isVendorRole = true;
        }
        /** User Guide */
        if (roles.indexOf(this.roleName.orgAdminRole) > -1) {
          this.isOrgAdmin = true;
        }

        if (roles.indexOf(this.roleName.marketingRole) > -1) {
          this.isMarketing = true;
        }
      }
    }
  }

  ngOnDestroy(): void {
    $('#delete-team-member-popup').modal('hide');
    $('#preview-team-member-popup').modal('hide');
    swal.close();
    this.isValidationMessage = false;
    this.inviteTeamMemberLoading = false;
    $('#invite_team_member_modal').modal('hide');
    this.csvErrors = false;
  }

  findAll(pagination: Pagination) {
    if (this.moveToTop) {
      this.referenceService.scrollSmoothToTop();
    }
    this.referenceService.loading(this.httpRequestLoader, true);
    this.httpRequestLoader.isHorizontalCss = true;
    this.pagination.selectedTeamMemberIds = this.selectedTeamMemberIds;
    if (!this.isTeamMemberModule) {
      pagination.filterKey = "teamMemberGroup";
      pagination.categoryId = this.teamMemberGroupId > 0 ? this.teamMemberGroupId : 0;
    }
    this.teamMemberService.findAll(pagination)
      .subscribe(
        response => {
          let data = response.data;
          this.teamMembers = data.list;
          pagination.totalRecords = data.totalRecords;
          pagination = this.pagerService.getPagedItems(pagination, this.teamMembers);
          this.referenceService.loading(this.httpRequestLoader, false);
        },
        error => {
          this.logger.errorPage(error);
        }, () => {
          this.referenceService.loading(this.httpRequestLoader, true);
          this.findMaximumAdminsLimitDetails();
        }
      );
  }

  refreshList() {
    this.pagination.pageIndex = 1;
    this.pagination.searchKey = "";
    this.findAll(this.pagination);
  }

  findAllTeamMemberGroupIdsAndNames() {
    this.referenceService.loading(this.addTeamMemberLoader, true);
    let isDefaultOption = this.showAddTeamMemberDiv || this.showUploadedTeamMembers || (this.team.teamMemberGroupId == 0 && this.editTeamMember);
    this.teamMemberService.findAllTeamMemberGroupIdsAndNames(isDefaultOption)
      .subscribe(
        response => {
          this.teamMemberGroups = response.data;
          this.referenceService.loading(this.httpRequestLoader, false);
          this.referenceService.loading(this.addTeamMemberLoader, false);
        },
        error => {
          this.logger.errorPage(error);
        });
  }


  changeOrgAdminStatus(team: any, event: any) {
    team.secondAdmin = event;
  }

  setDropDownData(data: any) {
    let self = this;
    self.items2 = [];
    $.each(data, function (index, value) {
      let emailId = data[index].emailId;
      let id = data[index].id;
      let obj = { 'id': id, 'emailId': emailId };
      self.items2.push(obj);
    });
  }




  goToAnalytics(teamMember: any) {
    if (teamMember.status != "UNAPPROVED") {
      let teamMemberId = teamMember.teamMemberUserId;
      this.teamInfo = teamMember;
      this.selectedTeamMembers.push(teamMemberId);
      this.selectedTeamMemberIds = this.selectedTeamMembers;
      this.clearFilterforDetailedView();
      this.showAnalytics = true;
    }

  }

  /**************Search TeamMembers***************/
  searchTeamMembers() {
    this.referenceService.setTeamMemberFilterForPagination(this.pagination, 0);
    this.findAll(this.pagination);
  }
  /**************Pagination TeamMembers***************/
  setPage(event: any) {
    this.pagination.pageIndex = event.page;
    this.findAll(this.pagination);
  }
  eventHandler(keyCode: any) { if (keyCode === 13) { this.searchTeamMembers(); } }

  changeTeamMemberStatus(teamMember: any, event: any) {
    if (event) {
      teamMember.status = Status.APPROVE;
      teamMember.enabled = event;
    } else {
      teamMember.status = Status.DECLINE;
      teamMember.enabled = event;
      teamMember.secondAdmin = false;
    }
  }

  /******************Update Team Member********************** */
  updateTeamMember() {
    if (!this.isLoggedInAsTeamMember) {
      this.loading = true;
      this.referenceService.loading(this.addTeamMemberLoader, true);
      this.customResponse = new CustomResponse();
      this.teamMemberService.updateTeamMemberXNFR2(this.team)
        .subscribe(
          data => {
            this.referenceService.loading(this.addTeamMemberLoader, false);
            this.loading = false;
            if (data.statusCode == 200) {
              this.editTeamMember = false;
              this.customResponse = new CustomResponse('SUCCESS', data.message, true);
              this.pagination = new Pagination();
              this.findAll(this.pagination);
            } else if (data.statusCode == 3008) {
              this.customResponse = new CustomResponse('ERROR', data.message, true);
            } else if (data.statusCode == 403) {
              this.editTeamMember = false;
              this.authenticationService.forceToLogout();
            }
          },
          error => {
            this.referenceService.loading(this.addTeamMemberLoader, false);
            this.loading = false;
            this.addServerError(error);
          }
        );
    }

  }



  /*************************Delete Team Member************** */
  showPopup(teamMember: any) {
    if (!this.isLoggedInAsTeamMember) {
      if (teamMember.status == "UNAPPROVED") {
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
          self.loading = true;
          self.selectedId = 0;
          self.teamMemberIdToDelete = teamMember.teamMemberUserId;
          self.selectedTeamMemberEmailId = teamMember.emailId;
          self.delete();
        }, function (dismiss: any) {

        });
      } else {
        this.selectedId = 0;
        this.deletePopupLoader = true;
        $('#delete-team-member-popup').modal('show');
        this.teamMemberService.findUsersToTransferData()
          .subscribe(
            data => {
              this.setDropDownData(data);
              this.emailIds = this.items2.filter((item) => item.id !== teamMember.teamMemberUserId);
              this.teamMemberIdToDelete = teamMember.teamMemberUserId;
              this.selectedTeamMemberEmailId = teamMember.emailId;
              this.deletePopupLoader = false;
            },
            _error => {
              $('#delete-team-member-popup').modal('hide');
              this.referenceService.showSweetAlertServerErrorMessage();
            });
      }
    }

  }



  delete() {
    this.deletePopupLoader = true;
    let teamMember = {};
    teamMember['id'] = this.teamMemberIdToDelete;
    teamMember['orgAdminId'] = this.selectedId;
    this.teamMemberService.delete(teamMember)
      .subscribe(
        data => {
          this.deletePopupLoader = false;
          this.loading = false;
          $('#delete-team-member-popup').modal('hide');
          this.successMessage = this.selectedTeamMemberEmailId + " deleted successfully.";
          this.customResponse = new CustomResponse('SUCCESS', this.successMessage, true);
          this.teamMemberIdToDelete = 0;
          this.selectedTeamMemberEmailId = "";
          this.pagination = new Pagination();
          this.findAll(this.pagination);
        },
        _error => {
          this.deletePopupLoader = false;
          this.loading = false;
          this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
        });
  }

  hidePopup() {
    this.selectedItem = "";
    this.inputChanged = "";
    $('input').val('');
    $('#delete-team-member-popup').modal('hide');
  }
  loginAs(teamMember: TeamMember) {
    this.utilService.addLoginAsLoader();
    this.utilService.reloadAppInAllTabs();
    this.loginAsTeamMember(teamMember.emailId, false);

  }

  loginAsTeamMember(emailId: string, isLoggedInAsAdmin: boolean) {
    if (this.isLoggedInThroughVanityUrl) {
      this.referenceService.isWelcomePageLoading = true;
      this.getVanityUrlRoles(emailId, isLoggedInAsAdmin);
    } else {
      this.getUserData(emailId, isLoggedInAsAdmin);
    }
  }

  getVanityUrlRoles(emailId: string, isLoggedInAsAdmin: boolean) {
    this.teamMemberService.getVanityUrlRoles(emailId)
      .subscribe(response => {
        this.setLoggedInTeamMemberData(isLoggedInAsAdmin, emailId, response.data);
      },
        (error: any) => {
          this.referenceService.showSweetAlertErrorMessage("Unable to Login as.Please try after sometime");
          this.loading = false;
        }
      );
  }

  getUserData(emailId: string, isLoggedInAsAdmin: boolean) {
    this.authenticationService.getUserByUserName(emailId)
      .subscribe(
        response => {
          this.setLoggedInTeamMemberData(isLoggedInAsAdmin, emailId, response);
        },
        (error: any) => {
          this.referenceService.showSweetAlertErrorMessage("Unable to Login as.Please try after sometime");
          this.loading = false;
        },
        () => this.logger.info('Finished getRolesByTeamMemberId()')
      );
  }

  setLoggedInTeamMemberData(isLoggedInAsAdmin: boolean, emailId: string, response: any) {
    if (isLoggedInAsAdmin) {
      localStorage.removeItem('adminId');
      localStorage.removeItem('adminEmailId');
      this.isLoggedInAsTeamMember = false;
    } else {
      let adminId = JSON.parse(localStorage.getItem('adminId'));
      if (adminId == null) {
        localStorage.adminId = JSON.stringify(this.loggedInUserId);
        localStorage.adminEmailId = JSON.stringify(this.authenticationService.user.emailId);
      }
    }
    this.utilService.setUserInfoIntoLocalStorage(emailId, response);
    let self = this;
    setTimeout(function () {
      
      const currentUser = localStorage.getItem( 'currentUser' );
      let isWelcomePageEnabled = JSON.parse( currentUser )[XAMPLIFY_CONSTANTS.welcomePageEnabledKey];
      let routingLink = isWelcomePageEnabled? 'welcome-page':'home/dashboard/';

      self.router.navigate([routingLink])
        .then(() => {
          window.location.reload();
        })
    }, 500);

  }

  logoutAsTeamMember() {
    this.utilService.addLoginAsLoader();
    this.utilService.reloadAppInAllTabs();
    let adminEmailId = JSON.parse(localStorage.getItem('adminEmailId'));
    this.loginAsTeamMember(adminEmailId, true);
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


  /***********Add Team Member(s) ********************/
  goToAddTeamMemberDiv() {
    this.team = new TeamMember();
    this.customResponse = new CustomResponse();
    this.teamMemberUi = new TeamMemberUi();
    this.showAddTeamMemberDiv = true;
    /***XNFR-883****/
    this.fetchTeamMemberGroupsByCondition();
  }
  /***XNFR-883****/
  private fetchTeamMemberGroupsByCondition() {
    if (this.authenticationService.module.loggedInThroughOwnVanityUrl && this.authenticationService.module.ssoEnabled) {
      this.findAllGroupIdsAndNamesWithDefaultSSOFirst();
    } else {
      this.findAllTeamMemberGroupIdsAndNames();
    }
  }

  findAllGroupIdsAndNamesWithDefaultSSOFirst() {
    this.referenceService.loading(this.addTeamMemberLoader, true);
    this.teamMemberService.findAllGroupIdsAndNamesWithDefaultSSOFirst()
      .subscribe(
        response => {
          this.teamMemberGroups = response.data;
          let teamMemberGroup = this.teamMemberGroups[0];
          let teamMemberGroupId = teamMemberGroup.id;
          this.team.teamMemberGroupId = teamMemberGroupId;
          $.each(this.newlyAddedTeamMembers,function(_index:number,teamMember:any){
            teamMember['teamMemberGroupId'] = teamMemberGroupId;
          });
          this.referenceService.loading(this.httpRequestLoader, false);
          this.referenceService.loading(this.addTeamMemberLoader, false);
        },
        error => {
          this.logger.errorPage(error);
        });
  }

  selectTeamMemberGroupId(teamMemberGroupId: any) {
    this.team.teamMemberGroupId = teamMemberGroupId;
    this.validateAddTeamMemberForm("teamMemberGroup");
    if (this.showSecondAdmin) {
      this.team.enableOption = false;
      this.team.secondAdmin = false;
      this.loading = true;
      this.teamMemberService.hasSuperVisorRole(teamMemberGroupId).subscribe(
        response => {
          this.team.enableOption = response.data;
        }, _error => {
          this.loading = false;
          this.referenceService.showSweetAlertServerErrorMessage();
        }, () => {
          this.getPartnersCount(teamMemberGroupId, undefined);
        }
      );
    } else {
      this.loading = true;
      this.getPartnersCount(teamMemberGroupId, undefined);
    }
  }

  getPartnersCount(teamMemberGroupId: number, team: any) {
    this.teamMemberService.getPartnersCount(teamMemberGroupId).subscribe(
      response => {
        this.loading = false;
        let count = response.data;
        if (team != undefined) {
          team.teamMemberGroupPartnersCount = count;
        } else {
          this.team.teamMemberGroupPartnersCount = count;
        }
      }, error => {
        this.loading = false;
        this.referenceService.showSweetAlertServerErrorMessage();
      }
    )
  }

  validateAddTeamMemberForm(fieldName: string) {
    if ("emailId" == fieldName) {
      this.team.validEmailId = this.referenceService.validateEmailId(this.team.emailId);
      this.team.emailIdErrorMessage = this.team.validEmailId ? '' : 'Please enter a valid email address';
      this.emaillIdDivClass = this.team.validEmailId ? this.successClass : this.errorClass;
    }

    if ("firstName" == fieldName) {
      this.team.validFirstName = $.trim(this.team.firstName) !== '' ? true : false;
      this.firstNameDivClass = this.team.validFirstName ? this.successClass : this.errorClass;
    }

    else if ("teamMemberGroup" == fieldName) {
      this.team.validTeamMemberGroupId = this.team.teamMemberGroupId != undefined && this.team.teamMemberGroupId > 0;
    }
    this.validateAllFields();
  }

  validateAllFields() {
    if (this.editTeamMember) {
      this.team.validEmailId = this.referenceService.validateEmailId(this.team.emailId);
      this.team.validTeamMemberGroupId = this.team.teamMemberGroupId != undefined && this.team.teamMemberGroupId > 0;
      this.team.validFirstName = this.referenceService.getTrimmedData(this.team.firstName);
    }
    this.team.validForm = this.team.validEmailId && this.team.validTeamMemberGroupId && this.team.validFirstName;
  }

  clearForm() {
    this.emaillIdDivClass = this.defaultClass;
    this.firstNameDivClass = this.defaultClass;
    this.team = new TeamMember();
    this.showAddTeamMemberDiv = false;
    this.showUploadedTeamMembers = false;
    this.editTeamMember = false;
    this.saveOrUpdateButtonText = "Save";
    this.refreshList();
  }

  goToManageTeam() {
    this.clearForm();
    this.customResponse = new CustomResponse();
  }


  addOrUpdateTeamMember() {
    this.customResponse = new CustomResponse();
    if (this.team.validForm) {
      this.referenceService.loading(this.addTeamMemberLoader, true);
      this.team.userId = this.loggedInUserId;
      if (this.editTeamMember) {
        this.updateTeamMember();
      } else {
        this.addTeamMember();
      }
    } else {
      this.referenceService.showSweetAlertErrorMessage("Invalid Email Id/Team Member Group.")
    }

  }

  addTeamMember() {
    this.loading = true;
    let teamMemberDtos = new Array<any>();
    let teamMemberDto = { 'emailId': this.team.emailId, 'firstName': this.team.firstName.trim(), 'lastName': this.team.lastName, 'teamMemberGroupId': this.team.teamMemberGroupId, 'secondAdmin': this.team.secondAdmin };
    teamMemberDtos.push(teamMemberDto);
    let teamInput = {};
    this.setTeamInputData(teamMemberDtos, teamInput);
    this.teamMemberService.saveTeamMembersXNFR2(teamInput).
      subscribe(
        data => {
          if (data.statusCode == 200) {
            this.customResponse = new CustomResponse('SUCCESS', data.message, true);
            this.clearForm();
          } else if (data.statusCode == 3008 || data.statusCode == 3010) {
            this.customResponse = new CustomResponse('ERROR', data.message, true);
          } else {
            this.team.validEmailId = false;
            this.team.emailIdErrorMessage = data.message;
            this.emaillIdDivClass = this.errorClass;
            this.team.validForm = false;
          }
          this.referenceService.loading(this.addTeamMemberLoader, false);
          this.loading = false;
        }, error => {
          this.addServerError(error);
        }
      );
  }



  addTeamMembers() {
    this.referenceService.loading(this.addTeamMemberLoader, true);
    this.customResponse = new CustomResponse();
    let teamInput = {};
    this.setTeamInputData(this.newlyAddedTeamMembers, teamInput);
    this.teamMemberService.saveTeamMembersXNFR2(teamInput).
      subscribe(
        data => {
          if (data.statusCode == 200) {
            this.customResponse = new CustomResponse('SUCCESS', data.message, true);
            this.clearForm();
          } else if (data.statusCode == 3008 || data.statusCode == 3010) {
            this.customResponse = new CustomResponse('ERROR', data.message, true);
          } else if (data.statusCode == 400 || data.statusCode == 401 || data.statusCode == 413) {
            let duplicateEmailIds = "";
            $.each(data.data, function (index: number, value: string) {
              duplicateEmailIds += (index + 1) + "." + value + "<br><br>";
            });
            let message = data.message + " <br><br>" + duplicateEmailIds;
            this.customResponse = new CustomResponse('ERROR', message, true);
          }
          this.referenceService.loading(this.addTeamMemberLoader, false);
        }, error => {
          this.addServerError(error);
        }
      );
  }

  setTeamInputData(teamMemberDtos: any, teamInput: any) {
    teamInput['userId'] = this.loggedInUserId;
    teamInput['teamMemberDTOs'] = teamMemberDtos;
    teamInput['vendorCompanyProfileName'] = this.vanityLoginDto.vendorCompanyProfileName;
    teamInput['vanityUrlFilter'] = this.vanityLoginDto.vanityUrlFilter;
  }

  /*************Upload CSV **************/
  downloadTeamMembersCsv() {
    window.location.href = this.authenticationService.REST_URL + "teamMember/downloadDefaultCsv/Add-Team-Members.csv?access_token=" + this.authenticationService.access_token;
  }

  readCsvFile(event: any) {
    this.customResponse = new CustomResponse();
    var files = event.srcElement.files;
    if (this.fileUtil.isCSVFile(files[0])) {
      $("#empty-roles-div").hide();
      var input = event.target;
      var reader = new FileReader();
      reader.readAsText(input.files[0]);
      reader.onload = (data) => {
        this.isUploadCsv = true;
        this.csvErrors = false;
        let csvData = reader.result;
        let csvRecordsArray = csvData['split'](/\r\n|\n/);
        let headersRow = this.fileUtil
          .getHeaderArray(csvRecordsArray);
        let headers = headersRow[0].split(',');
        if (this.validateHeaders(headers)) {
          this.csvRecords = this.fileUtil.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
          if (this.csvRecords.length > 1) {
            this.processCSVData();
          } else {
            this.showCsvFileError('You Cannot Upload Empty File');
          }
        } else {
          this.showCsvFileError('Invalid CSV');
        }
      }
      let self = this;
      reader.onerror = function () {
        self.showErrorMessageDiv('Unable to read the file');
        self.isUploadCsv = false;
      };
    } else {
      this.showErrorMessageDiv('Please Import csv file only');
      this.fileReset();
    }
  }

  processCSVData() {
    this.validateCsvData();
    if (this.csvErrors) {
      this.fileReset();
      this.isUploadCsv = false;
    } else {
      this.showUploadedTeamMembers = true;
      this.appendCsvDataToTable();
      this.fileReset();
    }
  }

  appendCsvDataToTable() {
    /***XNFR-883***/
    for (var i = 1; i < this.csvRecords.length; i++) {
      let rows = this.csvRecords[i];
      let row = rows[0].split(',');
      this.teamMemberUi.emptyTable = false;
      let team = {};
      let emailId = row[0].toLowerCase();
      if (emailId != undefined && $.trim(emailId).length > 0) {
        team['emailId'] = emailId;
        team['firstName'] = row[1];
        team['lastName'] = row[2];
        team['teamMemberGroupId'] = 0;
        team['secondAdmin'] = false;
        this.newlyAddedTeamMembers.push(team);
      }
    }
    this.fetchTeamMemberGroupsByCondition();
  }

  validateSecondAdminOptionForCsvUsers(teamMemberGroupId: number, team: any) {
    team.teamMemberGroupId = teamMemberGroupId;
    if (this.showSecondAdmin) {
      team.enableOption = false;
      team.secondAdmin = false;
      this.loading = true;
      this.teamMemberService.hasSuperVisorRole(teamMemberGroupId).subscribe(
        response => {
          team.enableOption = response.data;
        }, _error => {
          this.loading = false;
          this.referenceService.showSweetAlertServerErrorMessage();
        }, () => {
          this.getPartnersCount(teamMemberGroupId, team);
        }
      )
    } else {
      this.loading = true;
      this.getPartnersCount(teamMemberGroupId, team);
    }
  }

  validateCsvData() {
    let email = this.csvRecords.map(function (a) { return a[0].split(',')[0].toLowerCase() });
    let firstNames = this.csvRecords.map(function (a) { return a[0].split(',')[1].toLowerCase() });
    let duplicateEmailIds = this.referenceService.returnDuplicates(email);
    this.newlyAddedTeamMembers = [];
    if ((email.length > 0) && (firstNames.length > 0)) {
      let emailIds = [];
      for (let r = 1; r < email.length; r++) {
        let rows = this.csvRecords[r];
        let row = rows[0].split(',');
        let emailId = row[0];
        let firstName = row[1];
        let lastName = row[2];
        firstName = $.trim(firstName);
        if (firstName.length <= 0 && emailId.length > 0 && emailId !== '') {
          emailIds.push(emailId);
          this.customResponse = new CustomResponse('ERROR', 'First Name is not available for : ' + emailIds, true);
          this.csvErrors = true;
        }
        if (emailId !== undefined && emailId !== '' && $.trim(emailId.length > 0)) {
          if (duplicateEmailIds.length == 0) {
            if (!this.referenceService.validateEmailId($.trim(emailId))) {
              emailIds.push(emailId);
              this.customResponse = new CustomResponse('ERROR', emailIds + ' is invalid email address.', true);
              this.csvErrors = true;
            }
          } else {
            for (let d = 0; d < duplicateEmailIds.length; d++) {
              let duplicateEmailId = duplicateEmailIds[d];
              if (duplicateEmailId != undefined && $.trim(duplicateEmailId).length > 0) {
                emailIds.push(duplicateEmailId);
                this.customResponse = new CustomResponse('ERROR', emailIds + ' is duplicate email address.', true);
                this.csvErrors = true;
                this.isUploadCsv = false;
              }
            }
            duplicateEmailIds = [];
          }
        } else if (firstName.length > 0 && firstName !== '') {
          this.customResponse = new CustomResponse('ERROR', 'Email is not available for : ' + firstName, true);
          this.csvErrors = true;
        } else if (lastName.length > 0 && lastName !== '') {
          this.customResponse = new CustomResponse('ERROR', 'First Name & Email are mandatory for : ' + lastName, true);
          this.csvErrors = true;
        }
      }
    }
  }

  validateHeaders(headers: any) {
    return (headers[0] == "Email Id" && headers[1] == "First Name" && headers[2] == "Last Name");
  }

  showErrorMessageDiv(message: string) {
    this.errorMessage = message;
    this.customResponse = new CustomResponse('ERROR', this.errorMessage, true);
  }

  hideErrorMessageDiv() {
    this.errorMessage = "";
    this.customResponse = new CustomResponse('ERROR', this.errorMessage, false);
  }

  showCsvFileError(message: string) {
    this.showErrorMessageDiv(message);
    this.fileReset();
    this.isUploadCsv = false;
  }
  fileReset() {
    if (this.fileImportInput != undefined) {
      this.fileImportInput.nativeElement.value = "";
    }
    this.csvRecords = [];
  }

  deleteRow(index: number, teamMember: any) {
    let emailId = teamMember['emailId'];
    $('#team-member-' + index).remove();
    emailId = emailId.toLowerCase();
    this.newlyAddedTeamMembers = this.spliceArray(this.newlyAddedTeamMembers, emailId);
    let tableRows = $("#add-team-member-table > tbody > tr").length;
    if (tableRows == 0 || this.newlyAddedTeamMembers.length == 0) {
      this.clearUploadCsvDataAndGoBack();
    }
  }

  spliceArray(arr: any, emailId: string) {
    arr = $.grep(arr, function (data: any, _index: number) {
      return data.emailId != emailId
    });
    return arr;
  }

  clearUploadCsvDataAndGoBack() {
    this.customResponse = new CustomResponse();
    this.showUploadedTeamMembers = false;
    this.newlyAddedTeamMembers = [];
    this.fileReset();
  }

  addServerError(error: any) {
    this.referenceService.loading(this.addTeamMemberLoader, false);
    this.loading = false;
    let statusCode = JSON.parse(error['status']);
    let message = this.properties.serverErrorMessage;
    if (statusCode == 409 || statusCode == 400) {
      let errorResponse = JSON.parse(error['_body']);
      message = errorResponse['message'];
    }
    this.customResponse = new CustomResponse('ERROR', message, true);
  }

  /***********Preview Modules*********** */


  goToHome() {
    this.loading = true;
    this.referenceService.goToRouter(this.referenceService.homeRouter);
  }

  goToAdminReport(url: string) {
    this.loading = true;
    this.referenceService.goToRouter(url);
  }

  edit(id: number) {
    this.referenceService.scrollSmoothToTop();
    this.customResponse = new CustomResponse();
    this.referenceService.hideDiv('csv-error-div');
    this.referenceService.loading(this.httpRequestLoader, true);
    this.httpRequestLoader.isHorizontalCss = true;
    this.teamMemberService.findById(id).subscribe(
      response => {
        this.team = response.data;
        this.team.id = id;
        this.editTeamMember = true;
        this.saveOrUpdateButtonText = "Update";
        if (this.team.teamMemberGroupId == null) {
          this.team.teamMemberGroupId = 0;
          this.team.validForm = false;
        } else if (this.team.firstName.length === 0) {
          this.team.validForm = false;
        } else {
          this.team.validForm = true;
        }
      }, error => {
        this.referenceService.loading(this.httpRequestLoader, false);
        this.referenceService.showSweetAlertServerErrorMessage();
      }, () => {
        this.findAllTeamMemberGroupIdsAndNames();
      }
    );
  }


  getSelectedTeamMemberGroup(selectedTeamMemberGroupId: any) {
    this.team.teamMemberGroupId = selectedTeamMemberGroupId;
  }

  previewModules(teamMemberGroupId: number) {
    this.showModulesPopup = true;
    this.teamMemberGroupId = teamMemberGroupId;
  }

  hideModulesPreviewPopUp() {
    this.showModulesPopup = false;
  }

  showPartners(teamMember: any) {
    const fullName = ((teamMember.firstName || '') + ' ' + (teamMember.lastName || '')).trim();
    this.showTeamMemberName = fullName ? fullName : (teamMember.emailId || '');
    this.showPartnersPopup = true;
    this.selectedTeamMemberId = teamMember.teamMemberId;
  }

  hidePartnersPreviewPopup(refreshList: boolean) {
    this.showPartnersPopup = false;
    this.selectedTeamMemberId = 0;
    if (refreshList) {
      this.refreshList();
    }
  }
  /********XNFR-139*********/
  setPrimaryAdminOptions(teamMember: any) {
    if (teamMember.status == 'APPROVE' && !this.isLoggedInAsTeamMember && this.authenticationService.module.isAdmin) {
      this.showPrimaryAdminConfirmSweetAlert = true;
      this.selectedPrimaryAdminTeamMemberUserId = teamMember.teamMemberUserId;
    }
  }

  /********XNFR-139*********/
  enableAsPrimaryAdmin(event: any) {
    if (event) {
      this.loading = true;
      this.teamMemberService.updatePrimaryAdmin(this.selectedPrimaryAdminTeamMemberUserId).
        subscribe(
          response => {
            this.loading = false;
            this.referenceService.showSweetAlertProceesor("Primary Admin Updated Successfully.");
            let self = this;
            setTimeout(function () {
              self.authenticationService.logout();
            }, 3000);
          }, error => {
            this.logger.errorPage(error);
          }
        );
    }
    this.showPrimaryAdminConfirmSweetAlert = false;
  }

  findPrimaryAdminAndExtraAdmins() {
    this.admins = [];
    $('#adminsPreviewPopup').modal('show');
    this.isModalPopupshow = true;
    this.referenceService.scrollToModalBodyTopByClass();
    this.referenceService.startLoader(this.adminsLoader);
    this.teamMemberService.findPrimaryAdminAndExtraAdmins().subscribe(
      response => {
        this.admins = response.data;
        this.referenceService.stopLoader(this.adminsLoader);
      }, error => {
        $('#adminsPreviewPopup').modal('hide');
        this.referenceService.showSweetAlertServerErrorMessage();
      }
    )
  }

  interactionTracksDonutSliceSelected(type: any) {
    this.selectedTrackType = type;
    this.selectedAssetType = "";
  }

  interactionTracksDonutSliceUnSelected(type: any) {
    if (this.selectedTrackType == type) {
      this.selectedTrackType = "";
      this.selectedAssetType = "";
    }
  }

  typeWiseTrackAssetsDonutSliceSelected(type: any) {
    this.selectedAssetType = type;
  }
  typeWiseTrackAssetsDonutSliceUnSelected(type: any) {
    if (this.selectedAssetType == type) {
      this.selectedAssetType = "";
    }
  }

  redistributedCampaignDetailsPieChartSelected(type: any) {
    this.selectedCampaignType = type;
  }
  redistributedCampaignDetailsPieChartUnSelected(type: any) {
    if (this.selectedCampaignType == type) {
      this.selectedCampaignType = "";
    }
  }

  toggleCollapse(event: Event) {
    event.preventDefault();
    this.isCollapsed = !this.isCollapsed;
  }

  clickFilter() {
    if (!this.filterApplied) {
      this.showFilterOption = !this.showFilterOption;
    } else {
      if (this.showFilterOption) {
        this.showFilterOption = false;
      } else {
        this.showFilterDropDown = true;
      }
    }
    this.filterResponse.isVisible = false;
  }

  getVendorInfoForFilter() {
    this.filterCategoryLoader = true;
    this.vendorInfoFields = { text: 'companyName', value: 'companyId' };
    this.partnerService.getVendorInfoForFilter(this.pagination).
      subscribe(response => {
        this.VendorInfoFilters = response.data;
      }, error => {
        this.VendorInfoFilters = [];
        this.filterCategoryLoader = false;
      });
  }

  getTeamMemberInfoForFilter() {
    this.filterCategoryLoader = true;
    this.teamMemberInfoFields = { text: 'emailId', value: 'id' };
    this.partnerService.getTeamMemberInfoForFilter(this.pagination).
      subscribe(response => {
        this.TeamMemberInfoFilters = response.data;
      }, error => {
        this.TeamMemberInfoFilters = [];
        this.filterCategoryLoader = false;
      });
  }

  viewDropDownFilter() {
    this.showFilterOption = true;
    this.showFilterDropDown = false;
  }


  closeFilterOption() {
    this.showFilterOption = false;
  }

  clearFilter() {
    this.clearFilterdata();
    this.showFilterDropDown = false;
    this.filterActiveBg = 'defaultFilterACtiveBg';
    this.filterApplied = false;
    this.findAll(this.pagination);
  }

  applyFilters() {
    this.selectedTeamMemberIds = this.selectedTeamMembers;
    this.selectedVendorCompanyIds = this.selectedVendorCompanies;
    this.fromDateFilter = this.fromDateFilterInString;
    this.toDateFilter = this.toDateFilterInString;
    this.filterApplied = true;
    this.showFilterOption = false;
    this.filterActiveBg = 'filterActiveBg';
    this.showTeamMembersTable();
    this.findAll(this.pagination);
  }

  setFilterColor() {
    let isValidFromDateFilter = this.fromDateFilter != undefined && this.fromDateFilter.length > 0;
    let isValidToDateFilter = this.toDateFilter != undefined && this.toDateFilter.length > 0;
    if ((this.selectedVendorCompanyIds != null && this.selectedVendorCompanyIds.length > 0 && this.selectedVendorCompanyIds != undefined) ||
      (this.selectedTeamMemberIds != null && this.selectedTeamMemberIds.length > 0 && this.selectedTeamMemberIds != undefined)
      || isValidFromDateFilter || isValidToDateFilter) {
      this.filterActiveBg = 'filterActiveBg';
      this.filterApplied = true;
    }
  }

  showVendorView() {
    this.isVendorVersion = true;
    this.isCollapsed = true;
    this.clearFilter();
    this.showFilterOption = false;
  }

  showPartnerView() {
    this.isVendorVersion = false;
    this.isCollapsed = true;
    this.selectedCampaignType = "";
    this.clearFilter();
    this.showFilterOption = false;
  }

  clearAnalytics() {
    this.clearFilterdata();
    this.showFilterDropDown = false;
    this.filterActiveBg = 'defaultFilterACtiveBg';
    this.filterApplied = false;
    this.showAnalytics = false;
    this.isCollapsed = false;
    this.showFilterOption = false;
    this.refreshList();
  }

  downloadTeamMemberCsv() {
    this.httpRequestLoader.isHorizontalCss = true;
    this.csvPagination = { 
      ...this.pagination, 
      selectedTeamMemberIds: this.selectedTeamMemberIds,
      filterKey: this.isTeamMemberModule ? undefined : "teamMemberGroup",
      categoryId: this.teamMemberGroupId > 0 ? this.teamMemberGroupId : 0,
      pageIndex: 1,
      maxResults: this.pagination.totalRecords 
    };
    this.teamMemberService.findAll(this.csvPagination)
      .subscribe(
        response => {
          let data = response.data;
          this.csvPagination.csvPagedItems = data.list;
          this.downloadCsv();
          this.httpRequestLoader.isHorizontalCss = false;
        },
        error => {
          this.logger.errorPage(error);
          this.httpRequestLoader.isHorizontalCss = false;
        });
  }

  downloadCsv() {
    let csvName = "team_Members.csv";
    this.downloadDataList = this.csvPagination.csvPagedItems.map(item => {
      let row = {
        "FIRSTNAME": item.firstName,
        "LASTNAME": item.lastName,
        "EMAILID": item.emailId,
        "GROUP": item.primaryAdmin ? "N/A" : `"${item.teamMemberGroupName}"`,
        "ADMIN": (item.secondAdmin || item.primaryAdmin) ? "Yes" : "No",
        "STATUS": (item.status === "APPROVE") ? "Active" : "InActive"
      };
      if (this.isVendorRole || this.isOrgAdmin || this.isPrm) {
        row["TOTAL PARTNERS"] =
          (item.partnersCount === "" || item.partnersCount === null || item.partnersCount === undefined)
            ? "N/A"
            : item.partnersCount;
      }
      return row;
    });
    this.downloadCsvFile(this.downloadDataList, csvName);
  }

  downloadCsvFile(data: any[], filename: string) {
    const escapeCsvValue = (value: any) => {
      if (typeof value === 'string') {
        value.replace(/,/g, '');
      }
      return value;
    };
    const header = Object.keys(data[0]).map(escapeCsvValue).join(',') + '\n';
    const rows = data.map(row => Object.keys(row).map(key => escapeCsvValue(row[key])).join(',')).join('\n');
    const csvContent = header + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  validateDateFilter() {
    let isValidFromDateFilter = this.fromDateFilterInString != undefined && this.fromDateFilterInString != "";
    let isEmptyFromDateFilter = this.fromDateFilterInString == undefined || this.fromDateFilterInString == "";
    let isValidToDateFilter = this.toDateFilterInString != undefined && this.toDateFilterInString != "";
    let isEmptyToDateFilter = this.toDateFilterInString == undefined || this.toDateFilterInString == "";
    let isValidSelectedVendors = this.selectedVendorCompanies.length > 0;
    let isValidSelectedTeamMembers = this.selectedTeamMembers.length > 0;
    let checkIfToDateIsEmpty = isValidFromDateFilter && isEmptyToDateFilter;
    let checkIfFromDateIsEmpty = isValidToDateFilter && isEmptyFromDateFilter;
    let showToDateError = (isValidSelectedTeamMembers && checkIfToDateIsEmpty) || (!isValidSelectedTeamMembers && checkIfToDateIsEmpty)
      || (isValidSelectedVendors && checkIfToDateIsEmpty) || (!isValidSelectedVendors && checkIfToDateIsEmpty)
    let showFromDateError = (isValidSelectedTeamMembers && checkIfFromDateIsEmpty) || (!isValidSelectedTeamMembers && checkIfFromDateIsEmpty)
      || (isValidSelectedVendors && checkIfFromDateIsEmpty) || (!isValidSelectedVendors && checkIfFromDateIsEmpty)
    if (!(this.selectedVendorCompanies.length > 0) && !(this.selectedTeamMembers.length > 0) && (isEmptyFromDateFilter && isEmptyToDateFilter)) {
      this.filterResponse = new CustomResponse('ERROR', "Please provide valid input to filter", true);
    } else if (showToDateError) {
      this.filterResponse = new CustomResponse('ERROR', "Please pick To Date", true);
    } else if (showFromDateError) {
      this.filterResponse = new CustomResponse('ERROR', "Please pick From Date", true);
    } else if (isValidToDateFilter && isValidFromDateFilter) {
      var toDate = Date.parse(this.toDateFilterInString);
      var fromDate = Date.parse(this.fromDateFilterInString);
      if (fromDate <= toDate) {
        this.applyFilters();
      } else {
        this.filterResponse = new CustomResponse('ERROR', "From Date should be less than To Date", true);
      }
    } else {
      this.applyFilters();
    }
  }

  clearFilterdata() {
    this.selectedVendorCompanies = [];
    this.selectedTeamMembers = [];
    this.selectedTeamMemberIds = [];
    this.selectedVendorCompanyIds = [];
    this.fromDateFilter = "";
    this.toDateFilter = "";
    this.fromDateFilterInString = "";
    this.toDateFilterInString = "";
  }

  clearFilterforDetailedView() {
    this.showFilterOption = false;
    this.fromDateFilterInString = "";
    this.toDateFilterInString = "";
    this.fromDateFilter = "";
    this.toDateFilter = "";
    this.selectedVendorCompanies = [];
    this.selectedVendorCompanyIds = [];
    this.filterActiveBg = 'defaultFilterACtiveBg';
    this.filterApplied = false;
  }

  showTeamMembersTable() {
    if (this.selectedTeamMembers.length > 0 || this.selectedVendorCompanies.length > 0) {
      this.isCollapsed = false;
    } else {
      this.isCollapsed = true;
    }
  }

  /***** XNFR-805 *****/
  closeInviteTeamMemberModal() {
    $('#invite_team_member_modal').modal('hide');
    this.inviteTeamMemberResponse = new CustomResponse();
    if (this.isValidationMessage) {
      this.findAll(this.pagination);
    }
    this.emailIds = [];
    this.vendorInvitation.emailIds = [];
    this.inviteTeamMemberLoading = false;
    this.addFirstAttemptFailed = false;
    this.isValidationMessage = false;
  }

  /***** XNFR-805 *****/
  openInviteTeamMemberModal() {
    this.emailIds = [];
    this.vendorInvitation.emailIds = [];
    this.inviteTeamMemberLoading = true;
    $('#invite_team_member_modal').modal('show');
    this.tableHeader = this.properties.inviteATeamMemberToJoinxAmplify + (this.vendorCompanyProfileName ? this.vendorCompanyProfileName : 'xAmplify');
    let templateId = this.vendorCompanyProfileName === 'versa-networks' ? 28 : 1;
    this.teamMemberService.getHtmlBody(templateId).subscribe(
      response => {
        if (response.statusCode === 200) {
          let data = response.data;
          this.inviteTeamMemberHtmlBody = this.sanitizer.bypassSecurityTrustHtml(data.body);
          this.vendorInvitation.subject = data.subject;
          setTimeout(() => {
            const button = document.querySelector('div.button');
            if (button) {
              button.className = '';
            }
          });
        } else {
          this.inviteTeamMemberResponse = new CustomResponse('ERROR', 'Oops! something went wrong', true);
        }
        this.inviteTeamMemberLoading = false;
      },
      error => {
        this.logger.errorPage(error);
        this.inviteTeamMemberLoading = false;
        this.inviteTeamMemberResponse = new CustomResponse('ERROR', 'Oops! something went wrong', true);
      });
  }

  /***** XNFR-805 *****/
  extractStylesFromHtml(html: string): string {
    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    const matches = styleRegex.exec(html);
    return matches ? matches[1] : '';
  }

  /***** XNFR-805 *****/
  mustBeEmail(control: FormControl): { [key: string]: boolean } | null {
    if (this.addFirstAttemptFailed && !this.isValidEmail(control.value)) {
      return { "must_be_email": true };
    }
    return null;
  }

  /***** XNFR-805 *****/
  beforeAdd(tag: any): Observable<any> {
    const isPaste = !!tag['value'];
    const emailTag = isPaste ? tag.value : tag;
    if (!this.isValidEmail(emailTag)) {
      return this.handleInvalidEmail(emailTag, isPaste);
    }
    this.addFirstAttemptFailed = false;
    return Observable.of(emailTag);
  }

  /***** XNFR-805 *****/
  private handleInvalidEmail(tag: string, isPaste: boolean): Observable<any> {
    if (!this.addFirstAttemptFailed) {
      this.addFirstAttemptFailed = true;
      if (!isPaste) {
        this.tagInput.setInputValue(tag);
      }
    }
    return isPaste ? Observable.throw(this.errorMessages['must_be_email'])
      : Observable.of('').pipe(tap(() => setTimeout(() => this.tagInput.setInputValue(tag))));
  }

  /***** XNFR-805 *****/
  private isValidEmail(text: string): boolean {
    const EMAIL_REGEXP = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;
    return text ? EMAIL_REGEXP.test(text) : false;
  }

  /***** XNFR-805 *****/
  sendTeamMemberInviteEmail() {
    this.isValidationMessage = true;
    this.inviteTeamMemberLoading = true;
    this.inviteTeamMemberResponse = new CustomResponse();
    this.vendorInvitation.vanityURL = this.vendorCompanyProfileName;
    this.vendorInvitation.emailIds = this.emailIds.map(value => value.value);
    this.teamMemberService.sendTeamMemberInviteEmail(this.vendorInvitation)
      .subscribe(data => {
        if (data.statusCode == 200) {
          this.isValidationMessage = true;
          this.inviteTeamMemberResponse = new CustomResponse('SUCCESS', data.message, true);
        } else if (data.statusCode == 400 || data.statusCode == 401 || data.statusCode == 413) {
          this.isValidationMessage = false;
          this.vendorInvitation.emailIds = [];
          let duplicateEmailIds = data.data.map((value: string, index: number) => `${index + 1}. ${value}`).join(" ");
          let message = `${data.message} ${duplicateEmailIds}`;
          this.inviteTeamMemberResponse = new CustomResponse('ERROR', message, true);
        } else {
          this.isValidationMessage = false;
          this.vendorInvitation.emailIds = [];
          this.inviteTeamMemberResponse = new CustomResponse('ERROR', 'Oops! something went wrong', true);
        }
        this.inviteTeamMemberLoading = false;
      }, error => {
        this.logger.errorPage(error);
        this.isValidationMessage = false;
        this.vendorInvitation.emailIds = [];
        this.inviteTeamMemberLoading = false;
        this.inviteTeamMemberResponse = new CustomResponse('ERROR', 'Oops! something went wrong', true);
      });
  }

  /***** XNFR-805 *****/
  navigateToTeamMemberReports() {
    this.referenceService.goToRouter("/home/team/team-member-request");
  }
  /**** XNFR-914  ****/
    getModulesAccessGivenByVendorForPartners(){
      this.partnerService.getModulesAccessGivenByVendorForPartners(this.authenticationService.companyProfileName,undefined, this.loggedInUserId).subscribe(
        (response: any) => {
          if (response.statusCode == 200) {
             this.moduleAccessGivenByVendorForPartner(response.data);
          }
        },
        (_error: any) => {
          this.httpRequestLoader.isServerError = true;
          //this.xtremandLogger.error(_error);
        }
      );
    }
    moduleAccessGivenByVendorForPartner(partnerModules: any) {
      for (let module of partnerModules) {
        if (module.moduleId === 2) {
          this.referenceService.campaignAccessGivenByVendor = module.partnerAccessModule;
        } else if (module.moduleId === 3) {
          this.referenceService.contactsAccessGivenByVendor = module.partnerAccessModule;
        } else if (module.moduleId === 5) {
          this.referenceService.assetAccessGivenByVendor = module.partnerAccessModule;
        } else if (module.moduleId === 8) {
          this.referenceService.mdfAccessGivenByVendor = module.partnerAccessModule;
        } else if (module.moduleId === 9) {
          this.referenceService.opportunitiesAccessGivenByVendor = module.partnerAccessModule;
        } else if (module.moduleId === 12) {
          this.referenceService.playBookAccessGivenByVendor = module.partnerAccessModule;
        } else if (module.moduleId === 14) {
          this.referenceService.sharedLeadAccessGivenByVendor = module.partnerAccessModule;
        } else if (module.moduleId === 18) {
          this.referenceService.trackAccessGivenByVendor = module.partnerAccessModule;
        } 
      }
      if (!(this.referenceService.campaignAccessGivenByVendor || this.referenceService.contactsAccessGivenByVendor || this.referenceService.assetAccessGivenByVendor ||
        this.referenceService.mdfAccessGivenByVendor || this.referenceService.opportunitiesAccessGivenByVendor || this.referenceService.playBookAccessGivenByVendor ||
        this.referenceService.sharedLeadAccessGivenByVendor || this.referenceService.trackAccessGivenByVendor)) {
        this.referenceService.showAnalytics = false;
      }
    }
    /** XNFR-914 ***/
}
