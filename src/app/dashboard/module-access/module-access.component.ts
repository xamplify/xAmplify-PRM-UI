import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { ActivatedRoute } from '@angular/router';
import { CustomResponse } from 'app/common/models/custom-response';
import { CampaignAccess } from 'app/campaigns/models/campaign-access';
import { ReferenceService } from 'app/core/services/reference.service';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { MdfService } from 'app/mdf/services/mdf.service';


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
  constructor(public authenticationService: AuthenticationService, private dashboardService: DashboardService, public route: ActivatedRoute, public referenceService: ReferenceService, private mdfService: MdfService) { }

  roleId:number = 0;
 

  ngOnInit() {
    this.companyId = this.route.snapshot.params['alias'];
    this.userAlias = this.route.snapshot.params['userAlias'];
    this.companyProfilename = this.route.snapshot.params['companyProfileName'];
    this.getCompanyAndUserDetails();
    this.getModuleAccessByCompanyId();
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
    this.ngxLoading = true;
    this.campaignAccess.companyId = this.companyId;
    this.campaignAccess.roleId = $('#roleId option:selected').val();
    this.campaignAccess.userId = this.companyAndUserDetails.id;
    this.dashboardService.changeAccess(this.campaignAccess).subscribe(result => {

    }, _error => {
      this.ngxLoading = false;
      this.customResponse = new CustomResponse('Error', "Something went wrong.", true);
    },
    ()=>{
        if(this.campaignAccess.mdf && !this.companyAndUserDetails.defaultMdfFormAvaible){
          this.addDefaultMdfForm();
        }else{
          this.showSuccessMessage();
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
      this.customResponse = new CustomResponse('Error', "Something went wrong while adding default mdf form.", true);
    });
  }

  setModulesByRole(){
    if(this.roleId==20){
      this.campaignAccess.emailCampaign = false;
      this.campaignAccess.videoCampaign = false;
      this.campaignAccess.videoCampaign = false;
      this.campaignAccess.socialCampaign = false;
      this.campaignAccess.eventCampaign = false;
      this.campaignAccess.formBuilder = false;
      this.campaignAccess.landingPage = false;
      this.campaignAccess.landingPageCampaign = false;
      this.campaignAccess.shareLeads = false;
      this.campaignAccess.allBoundSource = false;
      this.campaignAccess.campaignPartnerTemplateOpenedAnalytics = false;
      this.campaignAccess.salesEnablement = false;
    }else{
     this.getModuleAccessByCompanyId();
    }
  }
  
}
