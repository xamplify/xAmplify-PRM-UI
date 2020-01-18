import { Component, OnInit } from '@angular/core';
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
  providers: [HttpRequestLoader]
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
  campaign:Campaign = new Campaign();
  dataError = false;
  workflowsMap: Map<string, any[]> = new Map<string, any[]>();

  constructor(public referenceService: ReferenceService, public utilService: UtilService, public authenticationService: AuthenticationService, public properties: Properties, private logger: XtremandLogger, private campaignService: CampaignService) {
  }


  ngOnInit() {

  }

  showContent(campaign: Campaign) {
    this.campaign = campaign;
    console.log(this.campaign);
    this.referenceService.loading(this.loader, true);
    this.listWebsiteUrlsByCampaignId(campaign.campaignId);
    this.listWorkflowsOptions();
  }

  listWebsiteUrlsByCampaignId(campaignId:number){
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

  listWorkflowsOptions(){
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
  addReplyRows(){
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

}
