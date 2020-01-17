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
  allItems = [];
  campaign:Campaign;
  dataError = false;
  constructor(public referenceService: ReferenceService, public utilService: UtilService, public authenticationService: AuthenticationService, public properties: Properties, private logger: XtremandLogger, private campaignService: CampaignService) {
  }


  ngOnInit() {

  }

  showContent(campaign: Campaign) {
    this.campaign = campaign;
    this.referenceService.loading(this.loader, true);
    this.campaignService.listCampaignEmailTemplateUrls(campaign.campaignId)
      .subscribe(
        data => {
          this.urlLinks = data;
          this.referenceService.loading(this.loader, false);
          console.log(this.urlLinks);
        },
        error => {
          this.logger.errorPage(error);
        }
      );

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
