import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ListLoaderValue } from 'app/common/models/list-loader-value';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PagerService } from 'app/core/services/pager.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { ParterService } from '../services/parter.service';
import { UtilService } from 'app/core/services/util.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';

@Component({
  selector: 'app-partner-detailed-analytics',
  templateUrl: './partner-detailed-analytics.component.html',
  styleUrls: ['./partner-detailed-analytics.component.css']
})
export class PartnerDetailedAnalyticsComponent implements OnInit {
  @Input() partnerCompanyId: any;
  @Output() notifyCloseDetailedAnalytics = new EventEmitter();

  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  loggedInUserId: number = 0;
  partnerJourneyAnalytics: any;

  constructor(public listLoaderValue: ListLoaderValue, public authenticationService: AuthenticationService,
    public referenseService: ReferenceService, public parterService: ParterService,
    public pagerService: PagerService, public utilService: UtilService,
    public xtremandLogger: XtremandLogger) {
      this.loggedInUserId = this.authenticationService.getUserId();
    }

  ngOnInit() {
    alert(this.partnerCompanyId);
    this.getPartnerCompanyInfo();
  }
  getPartnerCompanyInfo() {
    this.referenseService.loading(this.httpRequestLoader, true);
    this.parterService.getPartnerJourneyAnalytics(this.partnerCompanyId, this.loggedInUserId).subscribe(
			(response: any) => {	
        this.referenseService.loading(this.httpRequestLoader, false);
        if (response.statusCode == 200) {
          this.partnerJourneyAnalytics = response.data;	
        }        	
			},
			(_error: any) => {
        this.httpRequestLoader.isServerError = true;
        this.xtremandLogger.error(_error);
			}
		);
  }

  closeDetailedAnalytics(){
    this.notifyCloseDetailedAnalytics.emit();
  }

}
