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
                   { 'name': 'Conpany name (A-Z)', 'value': 'companyName-ASC' },
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
  constructor( public properties: Properties,public dashboardService: DashboardService, public pagination: Pagination , public pagerService: PagerService, public referenceService: ReferenceService,
    public authenticationService: AuthenticationService, public router:Router) {
        this.isVanityUrlEnabled = this.authenticationService.vanityURLEnabled;
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
    this.resetEmailIdAndOtherUpgradeAccountValues();
    $('#upgrade-account-modal').modal('show');
  }

  closeUpgradeAccountModal(){
    this.resetEmailIdAndOtherUpgradeAccountValues();
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
    }

  upgradeAccountOnKeyPress(keyCode:any){
    if (keyCode === 13) { this.findCompanyInfo(); } 
  }

  findCompanyInfo(){
      this.resetUpgradeAccountValues();
      let trimmedEmailId = $.trim(this.emailId);
      this.validEmailId = trimmedEmailId.length>0;
      if(this.validEmailId){
        this.upgradeAccountLoader = true;
        this.dashboardService.findCompanyInfo(trimmedEmailId).subscribe(
            response=>{
              let statusCode = response.statusCode;
              this.upgradeAccountStatusCode = statusCode;
              let statusCode200 = statusCode==200;
              let statusCode400 = statusCode==400;
              let statusCode404 = statusCode==404;
              if(statusCode200 || statusCode400){
                  this.companyInfo = response.data.companyDetails;
                  if(statusCode400){
                    let message = response.message;
                    let companyType = this.companyInfo.companyType;
                    if(companyType=="User"){
                        let upgradeLink = this.authenticationService.APP_URL+"/home/dashboard/admin-company-profile/"+trimmedEmailId;
                        message+= " <a href="+upgradeLink+">Click Here</a> To Create Company Profille & Upgrade This "+companyType+" Account.";
                     }else if(companyType=="Partner"){
                        message+="Partner Should Complete Filling Company Details For Upgrading To Other Role.";
                     }
                    this.upgradeAccountResponse = new CustomResponse('ERROR',message,true);
                  }else if(statusCode200){
                      this.adminsAndTeamMembers = response.data.adminsAndTeamMembers;
                  }
              }else if(statusCode404){
                  this.upgradeAccountResponse = new CustomResponse('ERROR',response.message,true);
              }
              this.upgradeAccountLoader = false;
            },error=>{
                this.upgradeAccountLoader = false;
                this.upgradeAccountResponse = new CustomResponse('ERROR',this.properties.serverErrorMessage,true);
            });
      }
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
    
}
