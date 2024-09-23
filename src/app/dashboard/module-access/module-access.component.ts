import { XtremandLogger } from './../../error-pages/xtremand-logger.service';
import { Component, Input, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { ActivatedRoute } from '@angular/router';
import { CustomResponse } from 'app/common/models/custom-response';
import { CampaignAccess } from 'app/campaigns/models/campaign-access';
import { ReferenceService } from 'app/core/services/reference.service';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { MdfService } from 'app/mdf/services/mdf.service';
import {DashboardType} from 'app/campaigns/models/dashboard-type.enum';
import { AnalyticsCountDto } from 'app/core/models/analytics-count-dto';
import { RegularExpressions } from 'app/common/models/regular-expressions';
import { Properties } from 'app/common/models/properties';


declare var $:any;
@Component({
  selector: 'app-module-access',
  templateUrl: './module-access.component.html',
  styleUrls: ['./module-access.component.css'],
  providers: [HttpRequestLoader,MdfService,RegularExpressions,Properties]
})
export class ModuleAccessComponent implements OnInit {

  companyId: any;
  userAlias: any;
  companyProfilename: any
  customResponse: CustomResponse = new CustomResponse();
  campaignAccess = new CampaignAccess();
  moduleAccessList: any = [];
  companyAndUserDetails: any;
  companyLoader = true;
  moduleLoader = true;
  ngxLoading = false;
  roleId:number = 0;
  dashboardTypeInString = "";
  dnsConfigured = false;
  dnsLoader = false;
  dnsError = false;
  dnsErrorMessage = "";
  spfConfigured = false;
  spfLoader = false;
  spfError = false;
  spfErrorMessage = "";
  scheduledCampaignsCount: number = 0;
  showOneClickLaunchErrorMessage: boolean;
  statusCode = 0;
  analyticsCountDto: AnalyticsCountDto = new AnalyticsCountDto();
  downloadLoader = false;
  headerName = "";
  isDashboardStats = false;
  companyProfileLoader = false;
  companyProfileNameError = false;
  companyProfileNameErrorMessage = "";
  companyProfileName = "";
  @Input() isNavigatedFromMyProfileSection = false;
  myProfileLoader = false;
  constructor(public authenticationService: AuthenticationService, private dashboardService: DashboardService, public route: ActivatedRoute, 
    public referenceService: ReferenceService, private mdfService: MdfService,public regularExpressions:RegularExpressions,
    public properties:Properties,public xtremandLogger:XtremandLogger) { }
  ngOnInit() {
    this.isDashboardStats = this.referenceService.getCurrentRouteUrl().indexOf("dashboard-stats")>-1;
    if(this.isDashboardStats){
      this.headerName = "Dashboard Stats";
      this.authenticationService.selectedVendorId = this.route.snapshot.params['userId'];
      this.companyId = this.route.snapshot.params['companyId'];
      this.userAlias = this.route.snapshot.params['userAlias'];
      if(this.userAlias!=undefined){
        this.getCompanyAndUserDetails();
      }else{
        this.companyLoader = false;
      }
    }else{
      if(this.isNavigatedFromMyProfileSection){
        this.getCompanyIdAndUserAliasAndCompanyProfileName();
      }else{
        this.companyId = this.route.snapshot.params['alias'];
        this.userAlias = this.route.snapshot.params['userAlias'];
        this.companyProfilename = this.route.snapshot.params['companyProfileName'];
        this.getAllData();
      }
        
    }
   
  }

  private getAllData() {
    this.getCompanyAndUserDetails();
    this.getModuleAccessByCompanyId();
    this.getDnsConfiguredDetails();
    this.getSpfConfiguredDetails();
    this.findMaximumAdminsLimitDetails();
    this.headerName = "Module Access";
  }

  getCompanyIdAndUserAliasAndCompanyProfileName() {
    this.myProfileLoader = true;
    this.dashboardService.getCompanyIdAndUserAliasAndCompanyProfileName().subscribe(result => {
      let data = result.data;
      this.companyId = data.companyId;
      this.userAlias = data.alias;
      this.companyProfilename = data.companyProfileName;
    }, error => {
      this.xtremandLogger.error(error);
    }, () => {
      this.myProfileLoader = false;
      this.getAllData();
    });
  }

  
  getDnsConfiguredDetails(){
    this.startDnsLoader();
    this.dashboardService.getDnsConfigurationDetails(this.companyId).subscribe(result => {
      this.dnsLoader = false;
      this.dnsError = false;
      this.dnsConfigured = result.data; 

    }, _error => {
      this.stopLoaderWithErrorMessage('DNS Configuration Details Not Found.');
    });
  }

  

  
  getSpfConfiguredDetails(){
    this.startSpfLoader();
    this.dashboardService.getSpfConfigurationDetails(this.companyId).subscribe(result => {
      this.spfLoader = false;
      this.spfError = false;
      this.spfConfigured = result.data; 

    }, _error => {
      this.stopLoaderWithErrorMessage('SPF Configuration Details Not Found.');
    });
  }

  startDnsLoader(){
    this.dnsLoader = true;
    this.dnsError = false;
    this.dnsErrorMessage = '';
  }



  startSpfLoader(){
    this.spfLoader = true;
    this.spfError = false;
    this.spfErrorMessage = '';
  }

  updateDnsConfiguration(){
    this.startDnsLoader();
    this.dashboardService.updateDnsConfigurationDetails(this.companyId,this.dnsConfigured).
    subscribe(result => {
      this.dnsLoader = false;
      if(result.statusCode==200){
        this.dnsError = false;
        this.referenceService.showSweetAlertSuccessMessage('DNS Configuration Updated Successfully');
      }else{
        this.stopLoaderWithErrorMessage('Unable to update DNS Configuartion.');
      }
      this.dnsError = false;
    }, _error => {
        this.stopLoaderWithErrorMessage('Unable to update DNS Configuartion.');
    });
  }

 

  updateSpf(){
    this.startSpfLoader();
    this.dashboardService.updateSpfConfigurationDetails(this.companyId,this.spfConfigured).
    subscribe(result => {
      this.spfLoader = false;
      if(result.statusCode==200){
        this.referenceService.showSweetAlertSuccessMessage('SPF Configuration Updated Successfully');
      }else{
        this.stopSpfLoaderWithErrorMessage('Unable to update SPF Configuartion.');
      }
      this.spfError = false;
    }, _error => {
        this.stopSpfLoaderWithErrorMessage('Unable to update SPF Configuartion.');
    });
  }

  stopLoaderWithErrorMessage(message:string){
    this.dnsLoader = false;
    this.dnsError = true;
    this.dnsErrorMessage = message;
  }

  stopSpfLoaderWithErrorMessage(message:string){
    this.spfLoader = false;
    this.spfError = true;
    this.spfErrorMessage = message;
  }


  getCompanyAndUserDetails() {
    this.dashboardService.getCompanyDetailsAndUserId(this.companyId, this.userAlias).subscribe(result => {
      this.companyAndUserDetails = result;
      this.companyProfileName = this.companyAndUserDetails.companyProfileName;
      this.roleId = result.roleId;
      this.companyLoader = false;
    }, error => {
      this.companyLoader = false;
      this.customResponse = new CustomResponse('ERROR', 'Something went wrong.', true);
    });

  }

  getModuleAccessByCompanyId() {
    if (this.companyId) {
      this.dashboardService.getAccess(this.companyId).subscribe(result => {
        this.campaignAccess = result;
        this.moduleLoader = false;
      }, _error => {
        this.moduleLoader = false;
        this.customResponse = new CustomResponse('ERROR', 'Something went wrong.', true);
      });
    }
  }

  

  updateModuleAccess(){
    this.customResponse = new CustomResponse();
    this.ngxLoading = true;
    this.campaignAccess.companyId = this.companyId;
    this.campaignAccess.userId = this.companyAndUserDetails.id;
    this.dashboardService.changeAccess(this.campaignAccess).subscribe(result => {
      this.statusCode = result.statusCode;
      this.customResponse = new CustomResponse('ERROR', result.message, true);
      this.ngxLoading = false;
    }, _error => {
      this.ngxLoading = false;
      this.customResponse = new CustomResponse('ERROR', "Something went wrong.", true);
    },
    ()=>{
      if(this.statusCode==200){
        if(this.campaignAccess.mdf && !this.companyAndUserDetails.defaultMdfFormAvaible){
          this.ngxLoading = true;
          this.addDefaultMdfForm();
        }else{
          this.showSuccessMessage();
          if(!this.isNavigatedFromMyProfileSection){
            this.findMaximumAdminsLimitDetails();
          }else{
            this.showMessageAndLogout();
          }
          
        }
      }
    }
    );

  }

  showSuccessMessage(){
    this.customResponse = new CustomResponse('SUCCESS', "Modules updated successfully", true);
    this.getModuleAccessByCompanyId();
    this.getCompanyAndUserDetails();
    this.referenceService.goToDiv('module-access-table');
    this.ngxLoading = false;
  }

  addDefaultMdfForm(){
    this.mdfService.saveMdfRequestForm(this.companyAndUserDetails.emailId, this.companyProfilename).subscribe((result: any) => {
      if (result.statusCode!=100) {
          this.referenceService.showSweetAlertSuccessMessage("Default Mdf Form Is Created");
        }
        this.showSuccessMessage();
    }, _error => {
      this.ngxLoading = false;
      this.customResponse = new CustomResponse('ERROR', "Something went wrong while adding default mdf form.", true);
    },()=>{
      this.showMessageAndLogout();
    });
  }

  private showMessageAndLogout() {
    this.referenceService.showSweetAlertProcessingLoader("Settings have been updated.");
    setTimeout(() => {
      this.authenticationService.logout();
      this.referenceService.closeSweetAlert();
    }, 3000);
  }

  setModulesByRole(){
    if(this.roleId==20){
      this.campaignAccess.emailCampaign = false;
      this.campaignAccess.videoCampaign = false;
      this.campaignAccess.videoCampaign = false;
      this.campaignAccess.socialCampaign = false;
      this.campaignAccess.eventCampaign = false;
      this.campaignAccess.survey = false;
      this.campaignAccess.formBuilder = true;
      this.campaignAccess.landingPage = false;
      this.campaignAccess.landingPageCampaign = false;
      this.campaignAccess.allBoundSource = false;
      this.campaignAccess.campaignPartnerTemplateOpenedAnalytics = false;
      this.campaignAccess.salesEnablement = false;
      this.campaignAccess.dataShare = false;
      this.campaignAccess.referVendor = false;
      this.campaignAccess.ssoEnabled = false;
    }else if(this.roleId==18){
      this.campaignAccess.loginAsPartner = false;
      this.campaignAccess.shareWhiteLabeledContent = false;
      this.campaignAccess.createWorkflow = false;
    }
    else{
     this.getModuleAccessByCompanyId();
    }
  }

  selectDashboardType(){
    let selectedDashboard = $('#dashboardType option:selected').val();
    if(selectedDashboard==DashboardType[DashboardType.DASHBOARD]){
      this.campaignAccess.dashboardType = DashboardType.DASHBOARD;
    }else if(selectedDashboard==DashboardType[DashboardType.ADVANCED_DASHBOARD]){
      this.campaignAccess.dashboardType = DashboardType.ADVANCED_DASHBOARD;
    }else if(selectedDashboard==DashboardType[DashboardType.DETAILED_DASHBOARD]){
      this.campaignAccess.dashboardType = DashboardType.DETAILED_DASHBOARD;
    }
  }

  updateLmsAndPlaybooks(){
    let isDamChecked = $('#damCheckBox').is(':checked');
    if(!isDamChecked){
      this.campaignAccess.lms = false;
      this.campaignAccess.playbooks = false;
    }
  }

  updateOneClickLaunchOption(){
    this.showOneClickLaunchErrorMessage = false;
    let shareLeadsChecked = $('#share-leads-e').is(':checked');
    if(!shareLeadsChecked){
      this.showOneClickLaunchErrorMessage = true;
      this.campaignAccess.oneClickLaunch = false;
      this.findScheduledCampaignsCount();
    }
  }

  /**********XNFR-125*************/
  findScheduledCampaignsCount(){
    let oneClickLaunchCheckBoxChecked = $('#one-click-launch-e').is(':checked');
    let shareLeadsChecked = $('#share-leads-e').is(':checked');
    if(!oneClickLaunchCheckBoxChecked || !shareLeadsChecked){
      this.ngxLoading = true;
      this.dashboardService.findOneClickLaunchScheduledCampaigns(this.companyId)
      .subscribe(
          response=>{
            this.ngxLoading = false;
            this.scheduledCampaignsCount = response.data;
          },error=>{
            this.ngxLoading = false;
          });
    }else{
      this.scheduledCampaignsCount = 0;
    }
  }
  /** XNFR-139 ***** */
  setMaxAdmins(){
    let maxAdmins =  $('#maxAdmins-Edit option:selected').val();
    this.campaignAccess.maxAdmins = maxAdmins;
  }

findMaximumAdminsLimitDetails(){
  this.ngxLoading = true;
  this.dashboardService.findMaximumAdminsLimitDetailsByCompanyId(this.companyId).subscribe(
    response=>{
      this.analyticsCountDto = response.data;
      this.ngxLoading = false;
    },error=>{
      this.analyticsCountDto = new AnalyticsCountDto();
      this.ngxLoading =false;
    }
  );
}

downloadContacts(){
  this.ngxLoading = true;
		let param: any = {
			'companyId': this.companyId,
		};
    let fileName = this.companyProfilename+"-contacts.csv";
		let completeUrl = this.authenticationService.REST_URL + "superadmin/downloadTotalContactsOfAllPartners/"+fileName+"?access_token=" + this.authenticationService.access_token;
		this.referenceService.post(param, completeUrl);
		this.ngxLoading = false;
}

downloadContactsCount(){
  this.ngxLoading = true;
  let param: any = {
    'companyId': this.companyId,
  };
  let fileName = this.companyProfilename+"-contacts-count.csv";
  let completeUrl = this.authenticationService.REST_URL + "superadmin/downloadTotalContactsCountOfAllPartners/"+fileName+"?access_token=" + this.authenticationService.access_token;
  this.referenceService.post(param, completeUrl);
  this.ngxLoading = false;
}

validateCompanyProfileName(){
  this.companyProfileNameError = false;
  this.companyProfileNameErrorMessage = "";
  let trimmedCompanyProfileName = this.referenceService.getTrimmedData(this.companyProfileName);
  let valueWithOutSpaces = $.trim(trimmedCompanyProfileName).toLowerCase().replace(/\s/g, '');
  if(trimmedCompanyProfileName.length>0){
    if (!this.regularExpressions.ALPHA_NUMERIC.test(trimmedCompanyProfileName)) {
      this.companyProfileNameError = true;
      this.companyProfileNameErrorMessage = "Please enter alpha numerics & lower case letters only";
    } else if (valueWithOutSpaces.length < 3) {
      this.companyProfileNameError = true;
      this.companyProfileNameErrorMessage = "Minimum 3 letters required";
    }
  }else{
    this.companyProfileNameError = true;
    this.companyProfileNameErrorMessage = "Please etner company profile name";
  }
  
}

updateCompanyProfileName(){
  this.startCompanyProfileLoader();
  let trimmedCompanyProfileName = this.referenceService.getTrimmedData(this.companyProfileName);
  let valueWithOutSpaces = $.trim(trimmedCompanyProfileName).toLowerCase().replace(/\s/g, '');
  this.dashboardService.updateCompanyProfileName(this.companyId,valueWithOutSpaces).
  subscribe(result => {
    this.companyProfileLoader = false;
    if(result.statusCode==200){
      this.companyProfileLoader = false;
      this.referenceService.showSweetAlertSuccessMessage(result.message);
    }else{
      this.companyProfileNameError = true;
      this.companyProfileNameErrorMessage = result.message;
    }
    this.companyProfileLoader = false;
  }, _error => {
      this.stopLoaderWithErrorMessage('Unable to update Company Profile.');
  });
}

startCompanyProfileLoader(){
  this.companyProfileLoader = true;
  this.companyProfileNameError = false;
  this.companyProfileNameErrorMessage = '';
}

 /***XNFR-595****/
 customUiSwitchEventReceiver(event:any){
  this.campaignAccess.paymentOverDue = event;
}

setSSOValue(event:boolean){
  this.campaignAccess.ssoEnabled = event;
}

setReferVendorValue(event:boolean){
  this.campaignAccess.referVendor = event;
}



}
