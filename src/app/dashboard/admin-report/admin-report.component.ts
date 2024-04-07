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
  constructor( public properties: Properties,public dashboardService: DashboardService, public pagination: Pagination , public pagerService: PagerService, public referenceService: ReferenceService,
    public authenticationService: AuthenticationService, public router:Router) {
  }
  
  eventHandler( keyCode: any ) { if ( keyCode === 13 ) { this.search(); } }
  
  search() {
      
      try {
              this.pagination.searchKey = this.searchKey;
              this.pagination.pageIndex = 1;
              this.getVendorsDetails();
      } catch ( error ) {
          console.error( error, "ManageContactsComponent", "sorting()" );
      }
  }
  
  
  sortByOption( event: any ) {
      try {
          this.sortOption = event;
          const sortedValue = this.sortOption.value;
          if ( sortedValue !== '' ) {
              const options: string[] = sortedValue.split( '-' );
              this.sortcolumn = options[0];
              this.sortingOrder = options[1];
          } else {
              this.sortcolumn = null;
              this.sortingOrder = null;
          }
              this.pagination.pageIndex = 1;
              this.pagination.sortcolumn = this.sortcolumn;
              this.pagination.sortingOrder = this.sortingOrder;
              this.getVendorsDetails();
      } catch ( error ) {
          console.error( error, "ManageContactsComponent", "sorting()" );
      }
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
              () => console.info( "vendors reports() finished" )
              )
      } catch ( error ) {
          console.error( error, "adminReportComponent", "loadingAllVendors()" );
      }
  

  }
  getVendorsDetails() {
      try {
          this.isListLoading = true;
          this.dashboardService.getVendorsList( this.pagination )
              .subscribe(
              ( data: any ) => {
                  console.log( data );
                  this.totalRecords = data.totalRecords;
                  this.vendorsDetails = data.data;
                  this.pagination.totalRecords = this.totalRecords;
                  this.pagination = this.pagerService.getPagedItems( this.pagination, this.vendorsDetails );
                  
                  if ( data.totalRecords === 0 ) {
                      this.customResponse = new CustomResponse( 'INFO', this.properties.NO_RESULTS_FOUND, true );
                  }
                  this.isListLoading = false;
              },
              error => console.error( error ),
              () => console.info( "vendors reports() finished" )
              )
      } catch ( error ) {
          console.error( error, "adminReportComponent", "loadingAllVendors()" );
      }
  }
  
  
  getVendorCompanyProfile(report:any) {
      try {
          this.authenticationService.selectedVendorId = report.id; 
          this.router.navigate(['/home/dashboard/edit-company-profile'])          
      } catch ( error ) {
          console.error( error, "adminReportComponent", "loadCompanyProfile()" );
      }
  }
  
  getVendorMyProfile(report:any) {
      try {
          this.dashboardService.getVendorsMyProfile( report.emailId )
              .subscribe(
              ( data: any ) => {
                  this.authenticationService.venorMyProfileReport = data;
                  this.router.navigate(['/home/dashboard/myprofile'])
              },
              error => console.error( error ),
              () => console.info( "vendors reports myProfile() finished" )
              )
      } catch ( error ) {
          console.error( error, "adminReportComponent", "loadMyProfile()" );
      }
  }
  
 
  
  setPage( event: any ) {
      this.pagination.pageIndex = event.page;
      this.getVendorsDetails();

  }
  
  onChangeAllContactUsers( event: Pagination ) {
      try {
          this.pagination = event;
          this.getVendorsDetails();
          
      } catch ( error ) {
          console.error( error, "adminreport", "getAdminList" );
      }
  }
  
  selectedVendorDetails(selectedVendor:any){
      try {
          this.loading = true;
          if(!selectedVendor.companyId){
              this.loading = false;
              swal("Vendor has signed up but not yet created company information.");
          }else{
    	  this.selectedVendorRow = selectedVendor;
          this.authenticationService.selectedVendorId = selectedVendor.id;
          this.dashboardService.loadDashboardReportsCount( selectedVendor.id )
              .subscribe(
              ( data: any ) => {
                  this.selectedVendorsDetails = data;
                 this.detailsTielsView = true;
                 this.loading = false;
              },
              error => {
                  this.loading = false;
                  this.referenceService.showSweetAlertServerErrorMessage();
              },
              () => {
                  this.loading = false;
                  console.info( "selectedVendors reports() finished" )
                  }
              )
          }
      } catch ( error ) {
          console.error( error, "adminReportComponent", "loadingSelectedVendorsDetails()" );
      }
  }
  

  ngOnInit() {
      this.listTop10RecentUsers();
  }
  
  
  activateOrDeactivate(report:any){
      let userStatus = report.userStatus;
      let text = "";
      let title = "";
      if(userStatus=="UNAPPROVED" || userStatus=="DECLINE" ){
          title = 'Are you sure to activate this account?';
          text  = "This account status is "+userStatus;
      }else if(userStatus=="APPROVED"){
          title = 'Are you sure to de-activate this account?';
          text  = "This account status is "+userStatus;
      }
      let self = this;
      swal( {
          title: title,
          text: text,
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#54a7e9',
          cancelButtonColor: '#999',
          confirmButtonText: 'Yes, Change it!',
          allowOutsideClick: false
      } ).then( function() {
          self.loading = true;
          self.activateOrDeactiveStatus(report);
      }, function( dismiss: any ) {
          console.log( 'you clicked on option' + dismiss );
      } );
      
  }
  
  activateOrDeactiveStatus(report:any){
      this.dashboardService.activateOrDeactiveStatus(report)
      .subscribe(
      ( data: any ) => {
          this.loading = false;
          this.search();
          swal("Status Changed Successfully", "", "success");
      },
      error => {this.loading = false;console.error( error )},
      () => {
         
          }
      )
  }
  
  changeStatus(report:any){
      try {
          console.log( report );
          let roleNames = report.roles.map( function( a ) { return a.roleName; } );
          const isOrgAdmin = roleNames.indexOf( this.roles.orgAdminRole ) > -1;
          let message = "";
          if(isOrgAdmin){
              message = "<b style='color:#5b9bd1'>Org Admin will be downgraded to Vendor</b>.";
          }else{
              message = "<b style='color:#5b9bd1'>Vendor will be upgraded to Org Admin</b>.";
          }
          let self = this;
          swal( {
              title: 'Are you sure to change the role?',
              text: message,
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#54a7e9',
              cancelButtonColor: '#999',
              confirmButtonText: 'Yes, Change it!',
              allowOutsideClick: false
          } ).then( function() {
              self.loading = true;
              self.changeRole(report);
          }, function( dismiss: any ) {
              console.log( 'you clicked on option' + dismiss );
          } );


      } catch ( error ) {
          console.error( error, "adminReportComponent", "changeStatus()" );
      }
  }
  
  changeRole(report:any){
      this.dashboardService.changeRole(report.id)
      .subscribe(
      ( data: any ) => {
          console.log( report );
          let message = report.emailId+" "+data;
          this.getVendorsDetails();
          this.customResponse = new CustomResponse('SUCCESS',message,true );
          this.loading = false;
      },
      error => {this.loading = false;console.error( error )},
      () => {
         
          }
      )
  }

  getAccess(report:any){
      try {
          this.loading = true;
          this.customResponse = new CustomResponse();
          this.updateFormCustomResponse  =new CustomResponse();
          this.dashboardService.getAccess(report.companyId)
              .subscribe(
              ( data: any ) => {
                  console.log(data);
                  this.isAccessView = true;
                  this.loading = false;
                  this.modulesAccess = data;
                  $('#access-template-div').modal('show');
              },
              error => {
                  console.error( error )
                  this.loading =false;
                  this.customResponse = new CustomResponse('ERROR','Something went wrong.',true );
              },
              () => console.info( "changeAccess() finished" )
              )
      } catch ( error ) {
          this.loading =false;
          console.error( error, "adminReportComponent", "changeAccess()" );
      }
  
  }
  
  updateAccess(){
      this.updateFormLoading = true;
      this.dashboardService.changeAccess(this.campaignAccess)
      .subscribe(
      ( data: any ) => {
          this.updateFormLoading=false;
          this.updateFormCustomResponse = new CustomResponse('SUCCESS',data.message,true );
      },
      error => {
          this.updateFormLoading=false;
          this.updateFormCustomResponse = new CustomResponse('ERROR','Something went wrong.',true );
      },
      () => console.info( "updateAccess() finished" )
      )
  }
  
  sendWelcomeEmail(response:any){
    if(response !== undefined){
        this.dynamicEmailContentComponent.openModal(response);
      //this.dynamicEmailContentComponent.openModal(response.alias,response.emailId);
    }      
  }
  
  openLinkInPopup(report:any){
      if(report !== undefined){
        this.copiedLinkCustomResponse = new CustomResponse();
        this.userAlias = report.alias;
        if(report.enableVanityURL){
            this.accessAccountVanityURL = window.location.protocol + "//" + report.companyProfileName +"." + window.location.hostname +"/axAa/"+report.alias ;
        }else{
            this.accessAccountVanityURL = this.authenticationService.APP_URL+"axAa/"+report.alias;
        }
        $('#user-alias-modal').modal('show');
      }      
  }
  
  /*********Copy The Link */
  copyAliasUrl(inputElement){
      this.copiedLinkCustomResponse = new CustomResponse();
      inputElement.select();
      document.execCommand('copy');
      inputElement.setSelectionRange(0, 0);
      this.copiedLinkCustomResponse = new CustomResponse('SUCCESS','Copied to clipboard successfully.',true );  

    }

    displayModuleAccess(report:any){
        if(report && report.companyId && report.companyProfileName){
            this.router.navigate(['/home/dashboard/module-access/' + report.companyId+"/"+report.alias+"/"+report.companyProfileName]);
        }        
    }  

  /**************Recent Login Users***************/

  editModuleNames(report:any){
    if(report && report.companyId && report.companyProfileName){
        this.router.navigate(['/home/dashboard/edit-module-names/' + report.companyId]);
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
}
