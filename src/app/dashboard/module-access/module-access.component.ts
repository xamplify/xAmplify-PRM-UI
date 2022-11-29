import { Component, OnInit } from '@angular/core';
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


declare var $;
@Component({
  selector: 'app-module-access',
  templateUrl: './module-access.component.html',
  styleUrls: ['./module-access.component.css'],
  providers: [HttpRequestLoader,MdfService]
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
  scheduledCampaignsCount: number = 0;
  showOneClickLaunchErrorMessage: boolean;
  statusCode = 0;
  analyticsCountDto: AnalyticsCountDto = new AnalyticsCountDto();
  constructor(public authenticationService: AuthenticationService, private dashboardService: DashboardService, public route: ActivatedRoute, public referenceService: ReferenceService, private mdfService: MdfService) { }
  ngOnInit() {
    this.companyId = this.route.snapshot.params['alias'];
    this.userAlias = this.route.snapshot.params['userAlias'];
    this.companyProfilename = this.route.snapshot.params['companyProfileName'];
    this.getCompanyAndUserDetails();
    this.getModuleAccessByCompanyId();
    this.getDnsConfiguredDetails();
    this.findMaximumAdminsLimitDetails();
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

  startDnsLoader(){
    this.dnsLoader = true;
    this.dnsError = false;
    this.dnsErrorMessage = '';
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

  stopLoaderWithErrorMessage(message:string){
    this.dnsLoader = false;
    this.dnsError = true;
    this.dnsErrorMessage = message;
  }


  getCompanyAndUserDetails() {
    this.dashboardService.getCompanyDetailsAndUserId(this.companyId, this.userAlias).subscribe(result => {
      this.companyLoader = false;
      this.companyAndUserDetails = result;
      this.roleId = result.roleId;
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
    this.referenceService.goToTop();
    this.customResponse = new CustomResponse();
    this.ngxLoading = true;
    this.campaignAccess.companyId = this.companyId;
    this.campaignAccess.roleId = $('#roleId option:selected').val();
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
          this.addDefaultMdfForm();
        }else{
          this.showSuccessMessage();
          this.findMaximumAdminsLimitDetails();
        }
      }
    }
    );

  }

  showSuccessMessage(){
    this.customResponse = new CustomResponse('SUCCESS', "Modules updated successfully", true);
    this.getModuleAccessByCompanyId();
    this.getCompanyAndUserDetails();
    this.referenceService.goToTop();
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
    });
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
      this.campaignAccess.shareLeads = false;
      this.campaignAccess.allBoundSource = false;
      this.campaignAccess.campaignPartnerTemplateOpenedAnalytics = false;
      this.campaignAccess.salesEnablement = false;
      this.campaignAccess.dataShare = false;
    }else if(this.roleId==19){
      this.campaignAccess.shareLeads = false;
    }else{
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
}
