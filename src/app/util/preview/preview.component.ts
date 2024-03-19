import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { Processor } from '../../core/models/processor';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css'],
  providers:[Processor,Properties]
})
export class PreviewComponent implements OnInit {
  id:number = 0;
  success = false;
  customResponse:CustomResponse = new CustomResponse();
  loggedInUserCompanyLogo="";
  isCampaignTemplatePreview = false;
  isSharedCampaignTemplatePreview = false;
  isVendorCompanyViewingWorkflowTemplate = false;
  isVendorCampaignAutoReplyEmailWorkflowId = false;
  vendorCampaignAutoReplyWebsiteLinkWorkflowId = false;
  campaignId = 0;
  constructor(public referenceService:ReferenceService,public authenticationService:AuthenticationService,public xtremandLogger:XtremandLogger,
    public route:ActivatedRoute,public processor:Processor,public properties:Properties) { }

  ngOnInit() {
    let currentRouterUrl = this.referenceService.getCurrentRouteUrl();
    this.isCampaignTemplatePreview = currentRouterUrl.indexOf("/pv/ct/")>-1;
    this.isSharedCampaignTemplatePreview = currentRouterUrl.indexOf("/pv/sct/")>-1;
    this.isVendorCompanyViewingWorkflowTemplate = currentRouterUrl.indexOf("/pv/wt/")>-1;
    this.isVendorCampaignAutoReplyEmailWorkflowId = currentRouterUrl.indexOf("/pv/scwaret")>-1;
    this.vendorCampaignAutoReplyWebsiteLinkWorkflowId = currentRouterUrl.indexOf("/pv/scwarwlt")>-1;
    this.referenceService.clearHeadScriptFiles();
    this.processor.set(this.processor);
    this.id = this.route.snapshot.params['id'];
    this.campaignId = this.route.snapshot.params['campaignId'];
    let isValidId = this.id!=undefined && this.id>0;
    let isValidCampaignId = this.campaignId!=undefined && this.campaignId>0;
    if(isValidId ||isValidCampaignId){
      this.getHtmlBody();
    }
  }

  getHtmlBody(){
    this.loggedInUserCompanyLogo = this.authenticationService.APP_URL+"/assets/images/company-profile-logo.png";
    let URL_SUFFIX = "";
    if(this.campaignId!=undefined){
      let vendorCampaignIdOrCampaignIdParameter = this.isSharedCampaignTemplatePreview ? "vendorCampaignId":"campaignId";
      URL_SUFFIX = vendorCampaignIdOrCampaignIdParameter+"/"+this.campaignId;
    }else{
      if(this.isVendorCampaignAutoReplyEmailWorkflowId){
        URL_SUFFIX = "vendorCampaignAutoReplyEmailWorkflowId/"+this.id;
      }else if(this.vendorCampaignAutoReplyWebsiteLinkWorkflowId){
        URL_SUFFIX = "vendorCampaignAutoReplyWebsiteLinkWorkflowId/"+this.id;
      }else{
        URL_SUFFIX = this.isVendorCompanyViewingWorkflowTemplate ? "workflowTemplateId/"+this.id:"id/"+this.id;
      }
    }
    this.authenticationService.getEmailTemplateHtmlBodyAndMergeTagsInfo(URL_SUFFIX).subscribe(
      response=>{
        let statusCode = response.statusCode;
        let data = response.data;
        if(statusCode==200){
          this.success = true;
          document.getElementById('html-preview').innerHTML = data.htmlBody;
          this.loggedInUserCompanyLogo = data.companyLogo;
        }else{
          if(statusCode==403){
            this.loggedInUserCompanyLogo = data.companyLogo;
          }
          this.customResponse = new CustomResponse('ERROR',this.properties.pageNotFound,true);
        }
        this.processor.remove(this.processor);
      },error=>{
        this.processor.remove(this.processor);
        this.customResponse = new CustomResponse('ERROR',this.properties.serverErrorMessage,true);
      });
  }

}
