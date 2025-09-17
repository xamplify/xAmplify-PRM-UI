import { Component, OnInit, Input } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { XtremandLogger } from 'app//error-pages/xtremand-logger.service';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { CustomResponse } from 'app/common/models/custom-response';
import {DashboardAnalyticsDto} from "app/dashboard/models/dashboard-analytics-dto";
import { DashboardService } from 'app/dashboard/dashboard.service';
import {VendorActivityViewDto} from "app/dashboard/models/vendor-activity-view-dto";
import {VanityURLService} from "app/vanity-url/services/vanity.url.service";
declare  var $:any;
@Component({
  selector: 'app-vendor-activity-analytics',
  templateUrl: './vendor-activity-analytics.component.html',
  styleUrls: ['./vendor-activity-analytics.component.css'],
  providers:[HttpRequestLoader],

})
export class VendorActivityAnalyticsComponent implements OnInit {
  loggedInUserId: number;
  dashboardAnalyticsDto:DashboardAnalyticsDto = new DashboardAnalyticsDto();
  vendorActivityViewDtos: Array<VendorActivityViewDto> = new Array<VendorActivityViewDto>();
  statusCode:number = 0;
  divClass = "col-xs-12 col-sm-4";
  ngxLoading=false;
  showVendorActivity = false;
  @Input() isDraggingEnabled: boolean;
  constructor(public authenticationService: AuthenticationService,public referenceService:ReferenceService,
    private xtremandLogger: XtremandLogger, public router: Router,public httpRequestLoader: HttpRequestLoader,public dashboardService:DashboardService,public route:ActivatedRoute,private vanityUrlService:VanityURLService) { }

  ngOnInit() {
    this.loggedInUserId = this.authenticationService.getUserId();
  }

}
