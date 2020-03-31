import { Component, OnInit } from '@angular/core';
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
  constructor(public authenticationService: AuthenticationService,public referenceService:ReferenceService,
    private xtremandLogger: XtremandLogger, public router: Router,public httpRequestLoader: HttpRequestLoader,public dashboardService:DashboardService,public route:ActivatedRoute,private vanityUrlService:VanityURLService) { }

  ngOnInit() {
    this.loggedInUserId = this.authenticationService.getUserId();
    this.dashboardAnalyticsDto = this.vanityUrlService.addVanityUrlFilterDTO(this.dashboardAnalyticsDto);
    this.getVendorActivityAnalytics();
  }

  getVendorActivityAnalytics(){
    this.referenceService.loading( this.httpRequestLoader, true );
    this.dashboardService.getVendorActivityAnalytics(this.dashboardAnalyticsDto)
    .subscribe(
      response => {
        let statusCode = response.statusCode;
        this.statusCode = statusCode;
        if(statusCode==200){
          this.vendorActivityViewDtos = response.data;
          let size = this.vendorActivityViewDtos.length;
          if(size==4){
            this.divClass = "col-lg-3 col-md-3 col-sm-3 col-xs-6";
        }else if(size==5){
           this.divClass = "col-lg-2 col-md-2 col-sm-2 col-xs-6";
        }else if(size==6){
            this.divClass = "col-lg-2 col-md-2 col-sm-2 col-xs-6";
        }
        }
        this.referenceService.loading( this.httpRequestLoader, false );
      },
      error => this.xtremandLogger.log(error),
      () => { }
  );
  }

  goToRedistributeDiv(campaignType:string){
    this.ngxLoading = true;
    let baseUrl = 'home/campaigns/partner/';
    if("Page"==campaignType){
        this.router.navigate(['home/pages/partner']);
    }else if("Email"==campaignType){
        baseUrl+= "regular";
        this.router.navigate([baseUrl]);
    }else if("Video"==campaignType){
      baseUrl+= "video";
      this.router.navigate([baseUrl]);
    }else if("Event"==campaignType){
      baseUrl+= "event";
      this.router.navigate([baseUrl]);

    }else if("Social"==campaignType){
      baseUrl+= "social";
      this.router.navigate([baseUrl]);

    }
}

}
