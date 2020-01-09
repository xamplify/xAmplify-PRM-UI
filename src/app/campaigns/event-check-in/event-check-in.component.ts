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
import { CustomResponse } from '../../common/models/custom-response';
import { UtilService } from '../../core/services/util.service';
import { EventCampaign } from '../models/event-campaign';
import { SortOption } from '../../core/models/sort-option';
declare var swal, $: any;
@Component({
  selector: 'app-event-check-in',
  templateUrl: './event-check-in.component.html',
  styleUrls: ['./event-check-in.component.css'],
  providers:[Pagination, HttpRequestLoader,SortOption]
})
export class EventCheckInComponent implements OnInit {

    campaignId: number = 0;
    exportingObject:any={};
    constructor( public referenceService: ReferenceService,
        public httpRequestLoader: HttpRequestLoader, public pagerService:
            PagerService, public authenticationService: AuthenticationService,
        public router: Router, public logger: XtremandLogger,
        public sortOption: SortOption, private utilService: UtilService, private route: ActivatedRoute ) { }

    ngOnInit() {
        this.campaignId = this.route.snapshot.params['campaignId'];
        this.exportingObject['campaignAlias'] = this.campaignId;
        this.exportingObject['checkInLeads'] = true;
    }

}
