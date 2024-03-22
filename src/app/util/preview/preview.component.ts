import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { Processor } from '../../core/models/processor';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { EventCampaign } from 'app/campaigns/models/event-campaign';
import { from } from 'rxjs/observable/from';
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
  isCampaignAutoReplyEmailWorkflowId: boolean;
  campaignAutoReplyWebsiteLinkWorkflowId: boolean;
  isEventCampaignTemplatePreview: boolean;
  isSharedEventCampaignTemplatePreview:boolean;
  statusCode = 0;
  eventCampaign:EventCampaign = new EventCampaign();
  constructor(public referenceService:ReferenceService,public authenticationService:AuthenticationService,public xtremandLogger:XtremandLogger,
    public route:ActivatedRoute,public processor:Processor,public properties:Properties) { }

  ngOnInit() {
    let currentRouterUrl = this.referenceService.getCurrentRouteUrl();
    this.isCampaignTemplatePreview = currentRouterUrl.indexOf("/pv/ct/")>-1;
    this.isSharedCampaignTemplatePreview = currentRouterUrl.indexOf("/pv/sct/")>-1;
    this.isSharedEventCampaignTemplatePreview = currentRouterUrl.indexOf("/pv/sect/")>-1;
    this.isVendorCompanyViewingWorkflowTemplate = currentRouterUrl.indexOf("/pv/wt/")>-1;
    this.isVendorCampaignAutoReplyEmailWorkflowId = currentRouterUrl.indexOf("/pv/scwaret")>-1;
    this.isCampaignAutoReplyEmailWorkflowId = currentRouterUrl.indexOf("/pv/cwaret")>-1;
    this.vendorCampaignAutoReplyWebsiteLinkWorkflowId = currentRouterUrl.indexOf("/pv/scwarwlt")>-1;
    this.campaignAutoReplyWebsiteLinkWorkflowId = currentRouterUrl.indexOf("/pv/cwarwlt")>-1;
    this.isEventCampaignTemplatePreview = currentRouterUrl.indexOf("/pv/evt")>-1;
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
      let vendorCampaignIdOrCampaignIdParameter = this.isSharedCampaignTemplatePreview   ? "vendorCampaignId" : this.isSharedEventCampaignTemplatePreview ? "vendorEventCampaignId":"campaignId";
      URL_SUFFIX = vendorCampaignIdOrCampaignIdParameter+"/"+this.campaignId;
      if(this.isSharedEventCampaignTemplatePreview){
        this.eventCampaign = this.authenticationService.getLocalStorageItemByKey(this.properties.eventCampaignTemplateLocalStorageKey);
        if(this.eventCampaign!=undefined){
          let hostedBy = this.eventCampaign.fromName;
          let fromEmail = this.eventCampaign.email;
          URL_SUFFIX = URL_SUFFIX+"/"+hostedBy+"/"+fromEmail;
        }
      }
    }else if(this.isCampaignAutoReplyEmailWorkflowId){
      URL_SUFFIX = "campaignAutoReplyEmailWorkflowId/"+this.id;
    }else if(this.campaignAutoReplyWebsiteLinkWorkflowId){
      URL_SUFFIX = "campaignAutoReplyWebsiteLinkWorkflowId/"+this.id;
    }else if(this.isVendorCampaignAutoReplyEmailWorkflowId){
      URL_SUFFIX = "vendorCampaignAutoReplyEmailWorkflowId/"+this.id;
    }else if(this.vendorCampaignAutoReplyWebsiteLinkWorkflowId){
      URL_SUFFIX = "vendorCampaignAutoReplyWebsiteLinkWorkflowId/"+this.id;
    }else{
      URL_SUFFIX = this.isVendorCompanyViewingWorkflowTemplate ? "workflowTemplateId/"+this.id:"id/"+this.id;
    }
    this.authenticationService.getEmailTemplateHtmlBodyAndMergeTagsInfo(URL_SUFFIX).subscribe(
      response=>{
        this.statusCode = response.statusCode;
        let data = response.data;
        if(this.statusCode==200){
          this.success = true;
          let htmlBody = data.htmlBody;
          if(this.isEventCampaignTemplatePreview){
            htmlBody = this.replaceEventCampaignMergeTags(htmlBody);
          }
          document.getElementById('html-preview').innerHTML = htmlBody;
          this.loggedInUserCompanyLogo = data.companyLogo;
        }else{
          if(this.statusCode==403){
            this.loggedInUserCompanyLogo = data.companyLogo;
          }
          this.customResponse = new CustomResponse('ERROR',this.properties.pageNotFound,true);
        }
        this.processor.remove(this.processor);
      },error=>{
        this.statusCode = 500;
        this.processor.remove(this.processor);
        this.customResponse = new CustomResponse('ERROR',this.properties.serverErrorMessage,true);
      });
  }


  private replaceEventCampaignMergeTags(htmlBody: any) {
    this.eventCampaign = this.authenticationService.getLocalStorageItemByKey(this.properties.eventCampaignTemplateLocalStorageKey);
    if(this.eventCampaign!=undefined){
      let dateFormat = require('dateformat');
      if (this.eventCampaign.campaign) {
        htmlBody = htmlBody.replace("{{event_title}}", this.eventCampaign.campaign);
      }
      if (this.eventCampaign.campaignEventTimes[0].startTimeString) {
        let date1 = new Date(this.eventCampaign.campaignEventTimes[0].startTimeString);
        date1 = dateFormat(date1, "dddd, mmmm dS, yyyy, h:MM TT");
        if (!this.eventCampaign.campaignEventTimes[0].allDay) {
          htmlBody = htmlBody.replace("{{event_start_time}}", date1);
          htmlBody = htmlBody.replace("&lt;To&gt;", 'To');
          htmlBody = htmlBody.replace("{{To}}", 'To');
        } else {
          htmlBody = htmlBody.replace("{{event_start_time}}", date1 + " " + '(All Day)');
          htmlBody = htmlBody.replace("{{event_end_time}}", " ");
        }
      }
  
      if (this.eventCampaign.campaignEventTimes[0].endTimeString) {
        let date2 = new Date(this.eventCampaign.campaignEventTimes[0].endTimeString);
        date2 = dateFormat(date2, "dddd, mmmm dS, yyyy, h:MM TT");
  
        htmlBody = htmlBody.replace("{{event_end_time}}", date2);
      }
      else if (this.eventCampaign.campaignEventTimes[0].allDay) {
        htmlBody = htmlBody.replace("&lt;To&gt;", ' ');
        htmlBody = htmlBody.replace("{{To}}", ' ');
      }
  
      if (this.eventCampaign.message) {
        htmlBody = htmlBody.replace("{{event_description}}", this.eventCampaign.message);
      }
      if (!this.eventCampaign.onlineMeeting) {
  
        if (this.eventCampaign.campaignLocation.street === undefined) {
          this.eventCampaign.campaignLocation.street = "";
        }
  
        if (this.eventCampaign.campaignLocation.address2 === undefined) {
          this.eventCampaign.campaignLocation.address2 = "";
        }
  
        if (this.eventCampaign.campaignLocation.city === undefined) {
          this.eventCampaign.campaignLocation.city = "";
        }
  
        if (this.eventCampaign.campaignLocation.state === undefined) {
          this.eventCampaign.campaignLocation.state = "";
        }
  
        if (this.eventCampaign.campaignLocation.zip === undefined) {
          this.eventCampaign.campaignLocation.zip = "";
        }
  
        if (this.eventCampaign.campaignLocation.location) {
          let address1 = this.eventCampaign.campaignLocation.location;
          let address2 = "";
          let address3 = "";
          let address4 = "";
          let fullAddress = "";
          if (this.eventCampaign.campaignLocation.street && this.eventCampaign.campaignLocation.address2) {
            address2 = this.eventCampaign.campaignLocation.street + "<br>" + this.eventCampaign.campaignLocation.address2;
          } else if (this.eventCampaign.campaignLocation.street) {
            address2 = this.eventCampaign.campaignLocation.street;
          } else if (this.eventCampaign.campaignLocation.address2) {
            address2 = this.eventCampaign.campaignLocation.address2;
          } else {
            address2 = "";
          }
  
          if (this.eventCampaign.campaignLocation.state && this.eventCampaign.campaignLocation.city) {
            address3 = this.eventCampaign.campaignLocation.city + ", " + this.eventCampaign.campaignLocation.state;
          } else if (this.eventCampaign.campaignLocation.state) {
            address3 = this.eventCampaign.campaignLocation.state;
          } else if (this.eventCampaign.campaignLocation.city) {
            address3 = this.eventCampaign.campaignLocation.city;
          } else {
            address3 = "";
          }
  
          if (this.eventCampaign.campaignLocation.country && this.eventCampaign.campaignLocation.zip) {
            address4 = this.eventCampaign.campaignLocation.zip + " " + this.eventCampaign.campaignLocation.country;
          } else if (this.eventCampaign.campaignLocation.country) {
            address4 = this.eventCampaign.campaignLocation.country;
          } else if (this.eventCampaign.campaignLocation.zip) {
            address4 = this.eventCampaign.campaignLocation.zip;
          } else {
            address4 = "";
          }
  
          if (address2 && address3 && address4) {
            fullAddress = address1 + "<br>" + address2 + "<br>" + address3 + "<br>" + address4;
          } else if (address2 && !address3 && !address4) {
            fullAddress = address1 + "<br>" + address2;
          } else if (address2 && address3 && !address4) {
            fullAddress = address1 + "<br>" + address2 + "<br>" + address3;
          } else if (!address2 && address3 && address4) {
            fullAddress = address1 + "<br>" + address3 + "<br>" + address4;
          } else if (!address2 && address3 && !address4) {
            fullAddress = address1 + "<br>" + address3;
          } else if (!address2 && !address3 && address4) {
            fullAddress = address1 + "<br>" + address4;
          } else if (address2 && !address3 && address4) {
            fullAddress = address1 + "<br>" + address2 + "<br>" + address4;
          } else {
            fullAddress = address1;
          }
          htmlBody = htmlBody.replace(/{{event_address}}/g, fullAddress);
        }
      } else {
        htmlBody = htmlBody.replace(/{{event_address}}/g, "Online Meeting");
        htmlBody = htmlBody.replace(/{{event_address}}/g, " ");
      }
      if (this.eventCampaign.fromName) {
        htmlBody = htmlBody.replace("{{event_fromName}}", this.eventCampaign.fromName);
      }
      if (this.eventCampaign.email) {
        htmlBody = htmlBody.replace("{{event_emailId}}", this.eventCampaign.email);
      }
  
      if (this.eventCampaign.email) {
        htmlBody = htmlBody.replace("{{vendor_name}}", this.authenticationService.user.firstName + " " + this.authenticationService.user.lastName);
      }
      if (this.eventCampaign.email) {
        htmlBody = htmlBody.replace("VENDOR_TITLE", this.authenticationService.user.jobTitle);
      }
      if (this.eventCampaign.email) {
        htmlBody = htmlBody.replace("{{vendor_emailId}}", this.authenticationService.user.emailId);
      }
      if (!this.eventCampaign.isRedistributeEvent && !this.eventCampaign.isPreviewEvent) {
        if (this.eventCampaign.email) {
            htmlBody = htmlBody.replace("{{vendor_name}}", this.authenticationService.user.firstName + " " + this.authenticationService.user.lastName);
        }
        if (this.eventCampaign.email) {
            htmlBody = htmlBody.replace("VENDOR_TITLE", this.authenticationService.user.jobTitle);
        }
        if (this.eventCampaign.email) {
            htmlBody = htmlBody.replace("{{vendor_emailId}}", this.authenticationService.user.emailId);
        }
    } else {
        htmlBody = htmlBody.replace("{{vendor_name}}", this.eventCampaign.userDTO.firstName + " " + this.eventCampaign.userDTO.lastName);
        htmlBody = htmlBody.replace("{{vendor_emailId}}", this.eventCampaign.userDTO.emailId);
    }
      if (!this.eventCampaign.enableCoBrandingLogo) {
        htmlBody = htmlBody.replace("https://xamp.io/vod/images/co-branding.png", "https://aravindu.com/vod/images/emptyImg.png");
      }
      if (this.eventCampaign.campaignEventMedias[0].filePath) {
        htmlBody = htmlBody.replace("https://xamplify.s3.amazonaws.com/images/bee-259/rocket-color.png", this.eventCampaign.campaignEventMedias[0].filePath);
      } else {
        htmlBody = htmlBody.replace("https://xamplify.s3.amazonaws.com/images/bee-259/rocket-color.png", "https://xamplify.s3.amazonaws.com/images/bee-259/rocket-color.png");
      }
  
      if (this.eventCampaign.campaignLocation.location) {
        htmlBody = htmlBody.replace("LOCATION_MAP_URL", "https://maps.google.com/maps?q=" + this.eventCampaign.campaignLocation.location + "," + this.eventCampaign.campaignLocation.street + "," + this.eventCampaign.campaignLocation.city + "," + this.eventCampaign.campaignLocation.state + "," + this.eventCampaign.campaignLocation.zip + "&z=15&output=embed");
      } else {
        htmlBody = htmlBody.replace("LOCATION_MAP_URL", "https://maps.google.com/maps?q=42840 Christy Street, uite 100 Fremont, US CA 94538&z=15&output=embed");
      }
  
      if (this.eventCampaign.email) {
        htmlBody = htmlBody.replace("https://aravindu.com/vod/images/us_location.png", " ");
      }
    }
    return htmlBody;
  }
}
