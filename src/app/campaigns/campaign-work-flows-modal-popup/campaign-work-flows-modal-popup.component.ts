import { Component, OnInit,ViewChild } from '@angular/core';
import { Campaign } from '../models/campaign';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { UtilService } from '../../core/services/util.service';
import { Properties } from '../../common/models/properties';
import { CampaignWorkFlowsUtilComponent} from '../campaign-work-flows-util/campaign-work-flows-util.component';

declare var $: any;
@Component({
  selector: 'app-campaign-work-flows-modal-popup',
  templateUrl: './campaign-work-flows-modal-popup.component.html',
  styleUrls: ['./campaign-work-flows-modal-popup.component.css'],
  providers: [HttpRequestLoader, Properties]
})
export class CampaignWorkFlowsModalPopupComponent implements OnInit {

  campaignName: string = "";
  modalPopupId = "campaign-work-flows-modal-popup";
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  @ViewChild('campaignWorkflowsUtilComponent') campaignWorkflowsUtilComponent: CampaignWorkFlowsUtilComponent;
  constructor(public referenceService: ReferenceService, public utilService: UtilService, public authenticationService: AuthenticationService, public properties: Properties,private logger:XtremandLogger) {
  }

  ngOnInit() {
  }

  showPopup(campaign: Campaign) {
    this.campaignName = campaign.campaignName;
    $('#' + this.modalPopupId).modal('show');
  }

}
