import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CampaignService } from '../services/campaign.service';
import { ReferenceService } from '../../core/services/reference.service';
import { Campaign } from '../models/campaign';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { SortOption } from '../../core/models/sort-option';
import { Properties } from '../../common/models/properties';
@Component({
    selector: 'app-event-check-in',
    templateUrl: './event-check-in.component.html',
    styleUrls: ['./event-check-in.component.css'],
    providers: [Pagination, HttpRequestLoader, SortOption, Properties]
})
export class EventCheckInComponent implements OnInit {

    campaignId: any;
    exportingObject: any = {};
    statusCode: number = 0;
    campaignTitle: any;
    constructor(public referenceService: ReferenceService, public httpRequestLoader: HttpRequestLoader, public pagerService:
        PagerService, public authenticationService: AuthenticationService,
        public router: Router, public logger: XtremandLogger,
        public sortOption: SortOption, private route: ActivatedRoute, private campaignService: CampaignService, public properties: Properties) { }

    ngOnInit() {
        this.campaignId = this.referenceService.decodePathVariable(this.route.snapshot.params['campaignId']);
        this.campaignTitle = this.route.snapshot.params['campaignTitle'];
        this.exportingObject['campaignAlias'] = this.campaignId;
        this.exportingObject['checkInLeads'] = true;
        this.exportingObject['totalAttendees'] = true;
        this.checkAccess();
    }

    checkAccess() {
        this.referenceService.loading(this.httpRequestLoader, true);
        this.campaignService.checkCampaignAccess(this.campaignId, this.authenticationService.getUserId()).subscribe(
            (response: any) => {
                const data = response.data;
                this.statusCode = response.statusCode;
                if (this.statusCode == 200) {
                    this.exportingObject['publicEventAlias'] = data;
                } else {
                    this.referenceService.goToPageNotFound();
                }
                this.referenceService.loading(this.httpRequestLoader, false);
            },
            (error: any) => { this.referenceService.showSweetAlert(this.properties.serverErrorMessage, "", "error"); this.referenceService.loading(this.httpRequestLoader, false); });
    }

    goToCampaignAnalytics(){
        let campaign = {};
        campaign['campaignId'] = this.campaignId;
        campaign['campaignTitle'] = this.campaignTitle;
        this.referenceService.navigateBackToCampaignAnalytics(campaign);
    }

}
