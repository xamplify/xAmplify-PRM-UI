import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
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

declare var $:any, swal: any;
@Component({
  selector: 'app-team-members-util',
  templateUrl: './team-members-util.component.html',
  styleUrls: ['./team-members-util.component.css'],
  providers: [Pagination, HttpRequestLoader, FileUtil, CallActionSwitch, Properties, RegularExpressions]
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
  loading: boolean;
  selectedId: number;
  deletePopupLoader: boolean;
  successMessage: string;
  customResponse: CustomResponse = new CustomResponse();
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
  csvErrors: any[];
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
  isModalPopupshow = false ;
  showModulesPopup: boolean;
  moveToTop: boolean;
  showPartnersPopup:boolean;
  selectedTeamMemberId:number;
  showSecondAdmin = true;
  analyticsCountDto:AnalyticsCountDto = new AnalyticsCountDto();
  showPrimaryAdminConfirmSweetAlert = false;
  selectedPrimaryAdminTeamMemberUserId = 0;
  primaryAdminSweetAlertParameterDto:SweetAlertParameterDto = new SweetAlertParameterDto();
  adminsLoader:HttpRequestLoader = new HttpRequestLoader();
  admins:Array<any> = new Array<any>();
  mergeTagForGuide:any;
  isSuperAdminAccessing = false;
  isNavigatedFromSuperAdminScreen = false;
  constructor(public logger: XtremandLogger, public referenceService: ReferenceService, private teamMemberService: TeamMemberService,
    public authenticationService: AuthenticationService, private pagerService: PagerService, public pagination: Pagination,
    private fileUtil: FileUtil, public callActionSwitch: CallActionSwitch, public userService: UserService, private router: Router,
    public utilService: UtilService, private vanityUrlService: VanityURLService, public properties: Properties, 
    public regularExpressions: RegularExpressions,public route:ActivatedRoute) {
    this.isLoggedInAsTeamMember = this.utilService.isLoggedAsTeamMember();
    this.isSuperAdminAccessing = this.authenticationService.isSuperAdmin();
    this.loggedInUserId = this.authenticationService.getUserId();
    this.isNavigatedFromSuperAdminScreen = this.referenceService.getCurrentRouteUrl().indexOf("superadmin-manage-team")>-1;
    if(this.isNavigatedFromSuperAdminScreen){
      this.loggedInUserId = this.route.snapshot.params['userId'];
      this.pagination.userListId = this.loggedInUserId;
    }
    this.isLoggedInThroughVanityUrl = this.vanityUrlService.isVanityURLEnabled();
    if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
      this.vanityLoginDto.vendorCompanyProfileName = this.authenticationService.companyProfileName;
      this.vanityLoginDto.userId = this.loggedInUserId;
      this.vanityLoginDto.vanityUrlFilter = true;
    }
   
  }

  ngOnInit() {
    this.primaryAdminSweetAlertParameterDto.confirmButtonText = "Yes, Change It";
    this.isTeamMemberModule = this.moduleName == 'teamMember';
    this.moveToTop = "/home/team/add-team" == this.referenceService.getCurrentRouteUrl();
    this.findAll(this.pagination);
    /** User Guide */
    this.getGuideUrlByMergeTag()
    /** User Guide */
  }
  /** User Guide **/
  getGuideUrlByMergeTag(){
    this.authenticationService.getRoleByUserId().subscribe(
      (data: any) => {
          const role = data.data;
          const roleName = role.role == 'Team Member'? role.superiorRole : role.role;
          if (roleName == 'Marketing' || roleName == 'Marketing & Partner') {
              this.mergeTagForGuide = 'adding_team_members_marketing';
          } else if(roleName == 'Partner'){
              this.mergeTagForGuide = 'adding_team_members_partner';
          } else {
              this.mergeTagForGuide = 'add_and_manage_team_members';
          }
      });
  }
  /** User Guide **/
  findMaximumAdminsLimitDetails(){
    this.teamMemberService.findMaximumAdminsLimitDetails().subscribe(
      response=>{
        this.analyticsCountDto = response.data;
        this.referenceService.loading(this.httpRequestLoader, false);
      },error=>{
        this.analyticsCountDto = new AnalyticsCountDto();
        this.referenceService.loading(this.httpRequestLoader, false);
      }
    );
  }

  ngOnDestroy(): void {
    $('#delete-team-member-popup').modal('hide');
    $('#preview-team-member-popup').modal('hide');
    swal.close();
  }

  findAll(pagination: Pagination) {
    if (this.moveToTop) {
      this.referenceService.scrollSmoothToTop();
    }
    this.referenceService.loading(this.httpRequestLoader, true);
    this.httpRequestLoader.isHorizontalCss = true;
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
    let isDefaultOption = this.showAddTeamMemberDiv || this.showUploadedTeamMembers || (this.team.teamMemberGroupId==0 && this.editTeamMember);
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




  goToCampaignAnalytics(teamMember: any) {
    if (teamMember.status != "UNAPPROVED") {
      this.loading = true;
      let teamMemberId = teamMember.teamMemberUserId;
      this.router.navigate(['/home/campaigns/manage/tm/' + teamMemberId]);
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
      this.referenceService.goToTop();
      this.teamMemberService.updateTeamMemberXNFR2(this.team)
        .subscribe(
          data => {
            this.referenceService.loading(this.addTeamMemberLoader, false);
            this.referenceService.goToTop();
            this.loading = false;
            if (data.statusCode == 200) {
              this.editTeamMember = false;
              this.customResponse = new CustomResponse('SUCCESS', data.message, true);
              this.pagination = new Pagination();
              this.findAll(this.pagination);
            }else if(data.statusCode==3008){
              this.customResponse = new CustomResponse('ERROR', data.message, true);
            }else if (data.statusCode == 403) {
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
          this.referenceService.goToTop();
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
    this.loginAsTeamMember(teamMember.emailId, false);

  }

  loginAsTeamMember(emailId: string, isLoggedInAsAdmin: boolean) {
    if (this.isLoggedInThroughVanityUrl) {
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
      self.router.navigate(['home/dashboard/'])
        .then(() => {
          window.location.reload();
        })
    }, 500);

  }

  logoutAsTeamMember() {
    this.utilService.addLoginAsLoader();
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
    this.referenceService.hideDiv('csv-error-div');
    this.team = new TeamMember();
    this.customResponse = new CustomResponse();
    this.teamMemberUi = new TeamMemberUi();
    this.showAddTeamMemberDiv = true;
    this.findAllTeamMemberGroupIdsAndNames();
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
        },()=>{
          this.getPartnersCount(teamMemberGroupId,undefined);
        }
      );
    }else{
      this.loading = true;
     this.getPartnersCount(teamMemberGroupId,undefined);
    }
  }

  getPartnersCount(teamMemberGroupId:number,team:any){
    this.teamMemberService.getPartnersCount(teamMemberGroupId).subscribe(
      response=>{
        this.loading = false;
        let count = response.data;
        if(team!=undefined){
          team.teamMemberGroupPartnersCount = count;
        }else{
          this.team.teamMemberGroupPartnersCount = count;
        }
      },error=>{
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
    this.team.validForm = this.team.validEmailId && this.team.validTeamMemberGroupId && this.team.validFirstName ;
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
  
  goToManageTeam(){
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
              this.team.validFirstName=false;
              this.team.lastNameErrorMessage=data.mesaage;
              
            this.emaillIdDivClass = this.errorClass;
            this.firstNameDivClass = this.errorClass;
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
    this.referenceService.goToTop();
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
    this.csvErrors = [];
    var files = event.srcElement.files;
    if (this.fileUtil.isCSVFile(files[0])) {
      $("#empty-roles-div").hide();
      $("#csv-error-div").hide();
      var input = event.target;
      var reader = new FileReader();
      reader.readAsText(input.files[0]);
      reader.onload = (data) => {
        this.isUploadCsv = true;
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
    if (this.csvErrors.length > 0) {
      $("#csv-error-div").show();
      this.fileReset();
      this.isUploadCsv = false;
    } else {
      this.showUploadedTeamMembers = true;
      this.appendCsvDataToTable();
      this.fileReset();
    }
  }

  appendCsvDataToTable() {
    this.findAllTeamMemberGroupIdsAndNames();
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
        },()=>{
          this.getPartnersCount(teamMemberGroupId,team);
        }
      )
    }else{
     this.loading = true;
      this.getPartnersCount(teamMemberGroupId,team);
    }
  }

  validateCsvData() {
    let email = this.csvRecords.map(function (a) { return a[0].split(',')[0].toLowerCase() });
    let firstNames = this.csvRecords.map(function (a) { return a[0].split(',')[1].toLowerCase() });
    let duplicateEmailIds = this.referenceService.returnDuplicates(email);
    this.newlyAddedTeamMembers = [];
    if ((email.length > 0) && (firstNames.length > 0)) {
      for (let r = 1; r < email.length; r++) {
        let rows = this.csvRecords[r];
        let row = rows[0].split(',');
        let emailId = row[0];
        let firstName = row[1];
        let lastName = row[2];
        firstName = $.trim(firstName);
        if (firstName.length <= 0 && emailId.length > 0 && emailId !== '') {
          this.csvErrors.push('First Name is not available for : "' + emailId + '"');
        }
        if (emailId !== undefined && emailId !== '' && $.trim(emailId.length > 0)) {
          if (duplicateEmailIds.length == 0) {
            if (!this.referenceService.validateEmailId(emailId)) {
              this.csvErrors.push(emailId + " is invalid email address.");
            }
          }
          else {
            for (let d = 0; d < duplicateEmailIds.length; d++) {
              let duplicateEmailId = duplicateEmailIds[d];
              if (duplicateEmailId != undefined && $.trim(duplicateEmailId).length > 0) {
                this.csvErrors.push(duplicateEmailId + " is duplicate email address.");
                this.isUploadCsv = false;
              }
            }
            duplicateEmailIds = [];
          }
        }
        else if (firstName.length > 0 && firstName !== '') {
          this.csvErrors.push('Email is not available for : " ' + firstName + ' "');
        }
        else if (lastName.length > 0 && lastName !== '') {
          this.csvErrors.push('First Name & Email are mandatory for : " ' + lastName + ' "');
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
    this.referenceService.goToTop();
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
        if(this.team.teamMemberGroupId==null){
            this.team.teamMemberGroupId=0;
            this.team.validForm = false;
        }
        if(this.team.firstName.length===0){
          this.team.validForm = false;
        }
        else{
          this.team.validForm = true;
        }
      }, error => {
        this.referenceService.loading(this.httpRequestLoader, false);
        this.referenceService.showSweetAlertServerErrorMessage();
      },()=>{
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

  showPartners(teamMember:any){
    this.showPartnersPopup = true;
    this.selectedTeamMemberId = teamMember.teamMemberId;
  }

  hidePartnersPreviewPopup(refreshList:boolean){
    this.showPartnersPopup = false;
    this.selectedTeamMemberId = 0;
    if(refreshList){
      this.refreshList();
    }
  }
 /********XNFR-139*********/
  setPrimaryAdminOptions(teamMember:any){
    if(teamMember.status=='APPROVE' && !this.isLoggedInAsTeamMember && this.authenticationService.module.isAdmin){
      this.showPrimaryAdminConfirmSweetAlert = true;
      this.selectedPrimaryAdminTeamMemberUserId = teamMember.teamMemberUserId;
    }
  }

  /********XNFR-139*********/
  enableAsPrimaryAdmin(event:any){
    if (event) {
      this.loading = true;
      this.teamMemberService.updatePrimaryAdmin(this.selectedPrimaryAdminTeamMemberUserId).
      subscribe(
          response=>{
            this.loading = false;
            this.referenceService.showSweetAlertProceesor("Primary Admin Updated Successfully.");
            let self = this;
             setTimeout(function(){
                 self.authenticationService.logout();
             }, 3000);
          },error=>{
            this.logger.errorPage(error);
          }
      );
    }
    this.showPrimaryAdminConfirmSweetAlert = false;
  }

  findPrimaryAdminAndExtraAdmins(){
    this.admins = [];
    $('#adminsPreviewPopup').modal('show');
    this.isModalPopupshow = true;
    this.referenceService.scrollToModalBodyTopByClass();
    this.referenceService.startLoader(this.adminsLoader);
    this.teamMemberService.findPrimaryAdminAndExtraAdmins().subscribe(
      response=>{
        this.admins = response.data;
        this.referenceService.stopLoader(this.adminsLoader);
      },error=>{
        $('#adminsPreviewPopup').modal('hide');
        this.referenceService.showSweetAlertServerErrorMessage();
      }
    )
  }

}
