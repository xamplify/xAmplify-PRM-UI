import { Component, OnInit, Input } from '@angular/core';
import { Campaign } from '../models/campaign';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { CustomResponse } from '../../common/models/custom-response';
import { UtilService } from '../../core/services/util.service';
import { Properties } from '../../common/models/properties';
import { CampaignService } from '../services/campaign.service';
import { Reply } from '../models/campaign-reply';
import { Url } from '../models/campaign-url';
declare var $: any;
@Component({
  selector: 'app-campaign-work-flows-util',
  templateUrl: './campaign-work-flows-util.component.html',
  styleUrls: ['./campaign-work-flows-util.component.css'],
  providers: [HttpRequestLoader, Properties]
})
export class CampaignWorkFlowsUtilComponent implements OnInit {

  loader: HttpRequestLoader = new HttpRequestLoader();
  urlLinks = [];
  reply: Reply = new Reply();
  url: Url = new Url();
  replies: Array<Reply> = new Array<Reply>();
  urls: Array<Url> = new Array<Url>();
  workflowOptions = [];
  allItems = [];
  campaign: Campaign = new Campaign();
  dataError = false;
  workflowsMap: Map<string, any[]> = new Map<string, any[]>();
  @Input() campaignOutPut: Campaign;
  hasError = false;
  constructor(public referenceService: ReferenceService, public utilService: UtilService, public authenticationService: AuthenticationService, public properties: Properties, private logger: XtremandLogger, private campaignService: CampaignService) {
  }


  ngOnInit() {
    this.campaign = this.campaignOutPut;
    this.showContent();
  }

  showContent() {
    this.referenceService.loading(this.loader, true);
    this.listWebsiteUrlsByCampaignId(this.campaign.campaignId);
    this.listWorkflowsOptions();
  }

  listWebsiteUrlsByCampaignId(campaignId: number) {
    this.campaignService.listCampaignEmailTemplateUrls(campaignId)
      .subscribe(
        data => {
          this.urlLinks = data;
        },
        error => {
          this.urlLinks = [];
          this.logger.error(error);
        }
      );
  }

  listWorkflowsOptions() {
    this.campaignService.listCampaignWorkflowsOptions()
      .subscribe(
        data => {
          this.workflowsMap = data.map;
          console.log(this.workflowsMap);
          this.referenceService.loading(this.loader, false);
        },
        error => {
          this.logger.error(error);
          this.referenceService.loading(this.loader, false);
        }
      );
  }

  isEven(n) {
    if (n % 2 === 0) { return true; }
    return false;
  }

  /*********Add Reply********** */
  addReplyRows() {
    this.reply = new Reply();
    let length = this.allItems.length;
    length = length + 1;
    var id = 'reply-' + length;
    this.reply.divId = id;
    this.reply.actionId = 0;
    this.reply.subject = this.referenceService.replaceMultipleSpacesWithSingleSpace(this.campaign.subjectLine);
    this.replies.push(this.reply);
    this.allItems.push(id);
    console.log(this.allItems);
    // this.loadEmailTemplatesForWorkFlows(this.reply);
  }

  remove(divId: string, type: string) {
    if (type == "replies") {
      this.replies = this.referenceService.spliceArray(this.replies, divId);
    } else {
      this.urls = this.referenceService.spliceArray(this.urls, divId);
    }
    $('#' + divId).remove();
    let errorLength = $('div.portlet.light.dashboard-stat2.border-error').length;
    if (errorLength == 0) {
      this.hasError = false;
    }
  }

  getRepliesData() {
    for (var i = 0; i < this.replies.length; i++) {
      let reply = this.replies[i];
      $('#' + reply.divId).removeClass('portlet light dashboard-stat2 border-error');
      this.removeStyleAttrByDivId('reply-days-' + reply.divId);
      this.removeStyleAttrByDivId('reply-subject-' + reply.divId);
      this.removeStyleAttrByDivId('email-template-' + reply.divId);
      this.removeStyleAttrByDivId('reply-message-' + reply.divId);
      $('#' + reply.divId).addClass('portlet light dashboard-stat2');
      this.validateReplySubject(reply);
      if (reply.actionId !== 16 && reply.actionId !== 17 && reply.actionId !== 18) {
        this.validateReplyInDays(reply);
        this.validateEmailTemplateForAddReply(reply);
      } else {
        this.validateEmailTemplateForAddReply(reply);
      }
      var errorLength = $('div.portlet.light.dashboard-stat2.border-error').length;
     
    }
  }





  validateReplyInDays(reply: Reply) {
    if (reply.actionId !== 22 && reply.actionId !== 23 && reply.replyInDays == null) {
      this.addReplyDaysErrorDiv(reply);
    } else if (reply.actionId == 22 || reply.actionId == 23) {
      if (reply.replyInDays == null || reply.replyInDays == 0) {
        this.addReplyDaysErrorDiv(reply);
      }
    }
  }

  addReplyDaysErrorDiv(reply: Reply) {
    this.addReplyDivError(reply.divId);
    $('#reply-days-' + reply.divId).css('color', 'red');
  }


  validateReplySubject(reply: Reply) {
    if (reply.subject == null || reply.subject == undefined || $.trim(reply.subject).length == 0) {
      this.addReplyDivError(reply.divId);
      console.log("Added Reply Subject Eror");
      $('#reply-subject-' + reply.divId).css('color', 'red');
    }
  }

  validateEmailTemplateForAddReply(reply: Reply) {
    if (reply.defaultTemplate && reply.selectedEmailTemplateId == 0) {
      $('#' + reply.divId).addClass('portlet light dashboard-stat2 border-error');
      $('#email-template-' + reply.divId).css('color', 'red');
    } else if (!reply.defaultTemplate && (reply.body == null || reply.body == undefined || $.trim(reply.body).length == 0)) {
      $('#' + reply.divId).addClass('portlet light dashboard-stat2 border-error');
      $('#reply-message-' + reply.divId).css('color', 'red');
    }
  }

  addReplyDivError(divId: string) {
    $('#' + divId).addClass('portlet light dashboard-stat2 border-error');
  }
  removeStyleAttrByDivId(divId: string) {
    $('#' + divId).removeAttr("style");
  }



  saveWorkflows() {
    this.referenceService.goToTop();
    this.getRepliesData();
    let errorLength = $('div.portlet.light.dashboard-stat2.border-error').length;
    if(errorLength==0){
      this.hasError = false;
      console.log(this.replies);
    }else{
      this.hasError = true;
    }

  }

}
