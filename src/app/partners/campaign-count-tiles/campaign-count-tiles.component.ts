import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { ParterService } from '../services/parter.service';
import { UtilService } from 'app/core/services/util.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { PartnerJourneyRequest } from '../models/partner-journey-request';

@Component({
  selector: 'app-campaign-count-tiles',
  templateUrl: './campaign-count-tiles.component.html',
  styleUrls: ['./campaign-count-tiles.component.css']
})
export class CampaignCountTilesComponent implements OnInit {
  @Input() partnerCompanyId: any;
  @Input() teamMemberId: any;

  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  loggedInUserId: number = 0;
  campaignCounts: any;

  constructor(public authenticationService: AuthenticationService,
    public referenseService: ReferenceService, public parterService: ParterService,
    public utilService: UtilService, public xtremandLogger: XtremandLogger) {
      this.loggedInUserId = this.authenticationService.getUserId(); 
  }

  ngOnInit() {
    this.getCampaignCounts();
  }

  getCampaignCounts() {
    this.referenseService.loading(this.httpRequestLoader, true);
    this.parterService.getPartnerJourneyCampaignCounts(this.partnerCompanyId, this.loggedInUserId).subscribe(
			(response: any) => {	
        this.referenseService.loading(this.httpRequestLoader, false);
        if (response.statusCode == 200) {
          this.campaignCounts = response.data;	
        }        	
			},
			(_error: any) => {
        this.httpRequestLoader.isServerError = true;
        this.xtremandLogger.error(_error);
			}
		);
  }

}
