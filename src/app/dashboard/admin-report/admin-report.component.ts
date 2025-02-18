import { SUPER_ADMIN_MODULE_CONTSTANTS } from './../../constants/super-admin-modules.constants';
import { Component, OnInit,ViewChild } from '@angular/core';
import { DashboardReport } from '../../core/models/dashboard-report';
import { DashboardService } from '../dashboard.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { CustomResponse } from '../../common/models/custom-response';
import { Properties } from '../../common/models/properties';
import { Router } from '@angular/router';
import { Roles } from '../../core/models/roles';
import { CampaignAccess } from '../../campaigns/models/campaign-access';
import { DynamicEmailContentComponent } from '../dynamic-email-content/dynamic-email-content.component';
import { UpdatePasswordComponent } from './../super-admin/update-password/update-password.component';
import { UpdateEmailAddressComponent } from '../update-email-address/update-email-address.component';
import { IntegrationDetailsComponent } from '../integration-details/integration-details.component';
import { SuperAdminService } from '../super-admin.service';
import { AccountDetailsDto } from '../models/account-details-dto';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { UtilService } from 'app/core/services/util.service';
import { RouterUrlConstants } from 'app/constants/router-url.contstants';


declare var swal:any,$:any;

@Component({
  selector: 'app-admin-report',
  templateUrl: './admin-report.component.html',
  styleUrls: ['./admin-report.component.css'],
  providers: [Pagination, HttpRequestLoader, Properties,CampaignAccess]
})

export class AdminReportComponent implements OnInit {
    dashboardReport: DashboardReport = new DashboardReport();
    public httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
    modulesAccess:any;
    totalRecords: number;
    vendorsDetails: any;
    selectedVendorsDetails: any;
    detailsTielsView = false;
    isAccessView = false;
    selectedVendorRow: any;
    loading = false;
    isListLoading = false;
    public searchKey: string;
    customResponse: CustomResponse = new CustomResponse();
    copiedLinkCustomResponse:CustomResponse = new CustomResponse();
    roles: Roles = new Roles();
    sortcolumn: string = null;
    sortingOrder: string = null;
    sortOptions = [
                   { 'name': 'Sort by', 'value': '' },
                   { 'name': 'Company name (A-Z)', 'value': 'companyName-ASC' },
                   { 'name': 'Company name (Z-A)', 'value': 'companyName-DESC' },
                   { 'name': 'Last login (ASC)', 'value': 'dateLastLogin-ASC'},
                   { 'name': 'Last login (DESC)', 'value': 'dateLastLogin-DESC'},

               ];
    public sortOption: any = this.sortOptions[0];
    top10RecentUsers: any[];
    updateFormLoading = false;
    updateFormCustomResponse: CustomResponse = new CustomResponse();
    campaignAccess = new CampaignAccess();
    userAlias:string = "";
    @ViewChild('dynamicEmailContentComponent') dynamicEmailContentComponent: DynamicEmailContentComponent;
    accessAccountVanityURL:string;
    /***Upgrade Account */
    validEmailId = true;
    upgradeAccountLoader = false;
    emailId = "";
    upgradeAccountResponse:CustomResponse = new CustomResponse();
    companyInfo:any;
    upgradeAccountStatusCode = 0;
    adminsAndTeamMembers:Array<any>= new Array<any>();
    /***Upgrade Account */
    isVanityUrlEnabled = false;
    updatePasswordLoader = false;
    @ViewChild('updatePasswordComponent') updatePasswordComponent: UpdatePasswordComponent;
    @ViewChild('updateEmailAddressComponent') updateEmailAddressComponent: UpdateEmailAddressComponent;
    expandOrCollpaseAllText = "Collapse All";
    isLocalHost = true;
    @ViewChild('integrationDetailsComponent') integrationDetailsComponent:IntegrationDetailsComponent;
    readonly SUPER_ADMIN_MODULE_CONTSTANTS = SUPER_ADMIN_MODULE_CONTSTANTS;
    modules:Array<any> = new Array<any>();
    isPreviewRolesButtonClicked = false;
    teamMemberGroupId = 0;
    upgradeAccountOrFindUserOrCompanyDetailsHeader = "Upgrade Account";
    isUpgradeAccountOptionClicked = false;
    isFindUserOrCompanyDetailsOptionClicked: boolean;
    userOrCompanyOptions = [
        { 'name': 'User Id', 'value': 'userId' },
        { 'name': 'Company Id', 'value': 'companyId' },

    ];
    companyIdOrUserId = 0;
    validCompanyOrUserId = true;
    accountDetailsDto:AccountDetailsDto = new AccountDetailsDto();
    isValidAccountDetailsEntered = true;
  constructor( public properties: Properties,public dashboardService: DashboardService, public pagination: Pagination , 
    public pagerService: PagerService, public referenceService: ReferenceService,
    public authenticationService: AuthenticationService, public router:Router,public superAdminService:SuperAdminService,
    private logger:XtremandLogger,private utilService:UtilService) {
        this.isVanityUrlEnabled = this.authenticationService.vanityURLEnabled;
        this.isLocalHost = this.authenticationService.isLocalHost();
  }
  
  listTop10RecentUsers(){
      try {
          this.isListLoading = true;
          this.dashboardService.listTop10RecentUsers()
              .subscribe(
              ( data: any ) => {
                  this.top10RecentUsers = data;
              },
              error => console.error( error ),
              () => {}
              )
      } catch ( error ) {
          console.error( error, "adminReportComponent", "loadingAllVendors()" );
      }
  }
  

  ngOnInit() {
    if(!this.isVanityUrlEnabled){
        this.listTop10RecentUsers();
    }
  }


  openUpgradeAccountModal(){
    this.upgradeAccountOrFindUserOrCompanyDetailsHeader = "Upgrade Account";
    this.isFindUserOrCompanyDetailsOptionClicked = false;
    this.isUpgradeAccountOptionClicked = true;
    this.resetEmailIdAndOtherUpgradeAccountValues();
    $('#upgrade-account-modal').modal('show');
  }

  openFindUserOrCompanyDetailsModalPopup(){
    this.upgradeAccountOrFindUserOrCompanyDetailsHeader = "Find Account Details";
    this.isUpgradeAccountOptionClicked = false;
    this.isFindUserOrCompanyDetailsOptionClicked = true;
    this.resetEmailIdAndOtherUpgradeAccountValues();
    $('#upgrade-account-modal').modal('show');
  }

  closeUpgradeAccountModal(){
    this.resetEmailIdAndOtherUpgradeAccountValues();
    this.isUpgradeAccountOptionClicked = false;
    this.isFindUserOrCompanyDetailsOptionClicked = false;
    this.accountDetailsDto = new AccountDetailsDto();
    $('#upgrade-account-modal').modal('hide');
  }

    private resetEmailIdAndOtherUpgradeAccountValues() {
        this.emailId = "";
        this.resetUpgradeAccountValues();
    }


    private resetUpgradeAccountValues() {
        this.validEmailId = true;
        this.upgradeAccountLoader = false;
        this.companyInfo = {};
        this.upgradeAccountResponse = new CustomResponse();
        this.upgradeAccountStatusCode = 0;
        this.adminsAndTeamMembers = [];
        this.validCompanyOrUserId = true;
        this.isValidAccountDetailsEntered = true;
       
    }

  upgradeAccountOnKeyPress(keyCode:any){
    if (keyCode === 13) { this.findCompanyInfo(); } 
  }

  findCompanyInfoOnKeyPress(keyCode:any){
    if (keyCode === 13) { this.findCompanyInfo(); } 
  }
  

  findCompanyInfo(){
      this.resetUpgradeAccountValues();
      this.findAccountDetailsOrUpgradeAccount();
     
  }

    private findAccountDetailsOrUpgradeAccount() {
        if (this.isUpgradeAccountOptionClicked) {
            let trimmedEmailId = $.trim(this.emailId);
            this.validEmailId = trimmedEmailId.length > 0;
            if (this.validEmailId) {
                this.emailId = this.emailId.toLowerCase();
                this.findCompanyInfoByEmailId(trimmedEmailId);
            }
        } else if (this.isFindUserOrCompanyDetailsOptionClicked) {
            this.isValidAccountDetailsEntered = false;
            if (this.accountDetailsDto.filterType == 'email') {
                let trimmedEmailId = $.trim(this.accountDetailsDto.emailId);
                this.validEmailId = trimmedEmailId.length > 0;
                this.isValidAccountDetailsEntered = this.validEmailId;
            } else  {
                this.validCompanyOrUserId = this.accountDetailsDto.companyIdOrUserId != undefined && this.accountDetailsDto.companyIdOrUserId > 0;
                this.isValidAccountDetailsEntered = this.validCompanyOrUserId;
            }
            if (this.isValidAccountDetailsEntered) {
                this.findAccountDetails();
            }
        }
    }

  private findAccountDetails() {
    this.upgradeAccountLoader = true;
    this.dashboardService.findAccountDetails(this.accountDetailsDto).subscribe(
        response => {
            this.handleUpgradeAccountResponse(response, "");
        }, error => {
            this.upgradeAccountLoader = false;
            this.upgradeAccountResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
        });
}

      
    private findCompanyInfoByEmailId(trimmedEmailId: any) {
        this.upgradeAccountLoader = true;
        this.dashboardService.findCompanyInfo(trimmedEmailId).subscribe(
            response => {
                this.handleUpgradeAccountResponse(response, trimmedEmailId);
            }, error => {
                this.upgradeAccountLoader = false;
                this.upgradeAccountResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
            });
    }

    private handleUpgradeAccountResponse(response: any, trimmedEmailId: any) {
        let statusCode = response.statusCode;
        this.companyInfo = {};
        this.adminsAndTeamMembers = [];
        this.upgradeAccountResponse = new CustomResponse();
        this.upgradeAccountStatusCode = statusCode;
        let statusCode200 = statusCode == 200;
        let statusCode400 = statusCode == 400;
        let statusCode404 = statusCode == 404;
        if (statusCode200 || statusCode400) {
            this.companyInfo = response.data.companyDetails;
            if (statusCode400) {
                let message = response.message;
                if(this.isUpgradeAccountOptionClicked){
                    let companyType = this.companyInfo.companyType;
                    if (companyType == "User") {
                        let upgradeLink = this.authenticationService.APP_URL + "/home/dashboard/admin-company-profile/" + trimmedEmailId;
                        message += " <a href=" + upgradeLink + ">Click Here</a> To Create Company Profille & Upgrade This " + companyType + " Account.";
                    } else if (companyType == "Partner") {
                        message += "Partner Should Complete Filling Company Details For Upgrading To Other Role.";
                    }
                }
                this.upgradeAccountResponse = new CustomResponse('ERROR', message, true);
            } else if (statusCode200) {
                this.adminsAndTeamMembers = response.data.adminsAndTeamMembers;
            }
        } else if (statusCode404) {
            this.upgradeAccountResponse = new CustomResponse('ERROR', response.message, true);
        }
        this.upgradeAccountLoader = false;
    }

  upgradeAccountType(){
      let upgradingAccountRoleId = $('#upgrade-account-type option:selected').val();
      let upgradingAccountRoleName = $('#upgrade-account-type option:selected').text();
      let self = this;
			swal({
				title: "Account Will Be Upgraded To "+upgradingAccountRoleName,
				type: 'success',
				showCancelButton: true,
				swalConfirmButtonColor: '#54a7e9',
				swalCancelButtonColor: '#999',
				confirmButtonText: "Yes, Please Upgrade.",
                allowOutsideClick: false,
                allowEscapeKey: false
			}).then(function () {
                self.upgradeAccount(upgradingAccountRoleId);
			}, function (_dismiss: any) {
                $('#upgrade-account-type').val(0);
			});
  }
    upgradeAccount(roleId:number) {
        this.referenceService.showSweetAlertProcessingLoader("Upgrading The Account.");
        this.dashboardService.upgradeAccount(this.companyInfo.companyId,roleId)
        .subscribe( 
            response=>{
                let statusCode = response.statusCode;
                let message = response.message;
                if(statusCode==200){
                    this.referenceService.showSweetAlertSuccessMessage(message);
                }else{
                    this.referenceService.showSweetAlertErrorMessage(message);
                }
                this.closeUpgradeAccountModal();
            },error=>{
                this.closeUpgradeAccountModal();
                this.referenceService.showSweetAlertServerErrorMessage();
        });
        
    }

    createNewAccount(){
        this.referenceService.goToRouter("home/dashboard/admin-company-profile");
    }

    openUpdatePasswordModal(){
        this.updatePasswordComponent.openModalPopup();
    }
    
    expandOrCollpase(){
		let isChecked =  $("input[name=collapsibleCheckBox]").is(":checked");
        $("input[name=collapsibleCheckBox]").prop('checked', !isChecked);
	}

    openUpdateEmailAddressModalPopup(){
        this.updateEmailAddressComponent.openModalPopup();
    }

    openIntegrationDetailsModalPopup(){
        this.integrationDetailsComponent.openModalPopup();
    }


    setFilterType(event:any){
        this.accountDetailsDto.companyIdOrUserId = 1;
        this.accountDetailsDto.emailId = "";
        if("userId"==event){
            this.accountDetailsDto.labelName = "User Id";
        }else if("companyId"==event){
            this.accountDetailsDto.labelName = "Company Id";
        }else if("email"==event){
            this.accountDetailsDto.labelName = "Email";
        }
        this.accountDetailsDto.filterType = event;
        this.upgradeAccountResponse = new CustomResponse();
        this.findAccountDetailsOrUpgradeAccount();
       
    }


    loginAs(result:any) {
		this.utilService.addLoginAsLoader();
		if(this.isVanityUrlEnabled){
			this.loginAsTeamMemberForVanityLogin(result.emailId,false,result.teamMemberUserId);
		}else{
			this.loginAsTeamMember(result.emailId, false, result.teamMemberUserId);
		}


	}

	loginAsTeamMemberForVanityLogin(emailId:any,isLoggedInAsAdmin:boolean,userId:number){
		let vanityUrlRoles:any;
			this.authenticationService.getVanityURLUserRolesForLoginAs(emailId,userId).
			subscribe(
				response=>{
					vanityUrlRoles = response.data;
				},error=>{
					this.referenceService.showSweetAlertErrorMessage("Unable to Login as.Please try after sometime");
					this.loading = false;
					this.referenceService.loaderFromAdmin = false;
					this.authenticationService.logout();
				},()=>{
					this.authenticationService.getUserByUserName(emailId)
					.subscribe(
						response => {
							response['roles'] = vanityUrlRoles;
							this.addOrRemoveLocalStorage(isLoggedInAsAdmin, userId, emailId, response);
						},
						(error: any) => {
							this.referenceService.showSweetAlertErrorMessage("Unable to Login as.Please try after sometime");
							this.loading = false;
							this.referenceService.loaderFromAdmin = false;
						},
						() => this.logger.info('Finished loginAsTeamMember()')
					);

				});
	}

	loginAsTeamMember(emailId: string, isLoggedInAsAdmin: boolean, userId: number) {
		this.loading = true;
		this.referenceService.loaderFromAdmin = true;
		this.authenticationService.getUserByUserName(emailId)
			.subscribe(
				response => {
					this.addOrRemoveLocalStorage(isLoggedInAsAdmin, userId, emailId, response);
				},
				(error: any) => {
					this.referenceService.showSweetAlertErrorMessage("Unable to Login as.Please try after sometime");
					this.loading = false;
					this.referenceService.loaderFromAdmin = false;
				},
				() => this.logger.info('Finished loginAsTeamMember()')
			);
	}

	private addOrRemoveLocalStorage(isLoggedInAsAdmin: boolean, userId: number, emailId: string, response: any) {
		if (isLoggedInAsAdmin) {
			localStorage.removeItem('loginAsUserId');
			localStorage.removeItem('loginAsUserEmailId');
		} else {
			let loginAsUserId = JSON.parse(localStorage.getItem('loginAsUserId'));
			if (loginAsUserId == null) {
				localStorage.loginAsUserId = JSON.stringify(userId);
				localStorage.loginAsUserEmailId = JSON.stringify(this.authenticationService.user.emailId);
			}
		}
		this.utilService.setUserInfoIntoLocalStorage(emailId, response);
		let self = this;
		setTimeout(function () {
			self.router.navigate(['home/dashboard/'])
				.then(() => {
					window.location.reload();
				});
		}, 500);
	}


    goToMergePartnerCompanies(){
        this.referenceService.goToRouter(RouterUrlConstants.home+RouterUrlConstants.dashboard+RouterUrlConstants.mergePartnerCompanies);
    }


}
