import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router,NavigationStart, NavigationEnd  } from '@angular/router';
import { LandingPageService } from '../../landing-pages/services/landing-page.service';
import { UtilService } from '../../core/services/util.service';
import { Ng2DeviceService } from 'ng2-device-detector';
import { GeoLocationAnalytics } from '../../util/geo-location-analytics';
import { GeoLocationAnalyticsType } from '../../util/geo-location-analytics-type.enum';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Processor } from '../../core/models/processor';

@Component({
  selector: 'app-save-geo-location-analytics',
  templateUrl: './save-geo-location-analytics.component.html',
  styleUrls: ['./save-geo-location-analytics.component.css'],
  providers: [Processor,LandingPageService],
})
export class SaveGeoLocationAnalyticsComponent implements OnInit {

    deviceInfo: any;
    constructor(private route: ActivatedRoute,private landingPageService:LandingPageService,
            private logger:XtremandLogger,public processor:Processor,private router:Router,private utilService:UtilService,public deviceService: Ng2DeviceService) { }

    ngOnInit() {
    }

    getLocationDetails(landingPageAnalytics:GeoLocationAnalytics) {
        this.utilService.getJSONLocation()
            .subscribe(
            ( response: any ) => {
                this.deviceInfo = this.deviceService.getDeviceInfo();
                if ( this.deviceInfo.device === 'unknown' ) {
                    this.deviceInfo.device = 'computer';
                }
                landingPageAnalytics.openedTime = new Date();
                landingPageAnalytics.deviceType = this.deviceInfo.device;
                landingPageAnalytics.os = this.deviceInfo.os;
                landingPageAnalytics.city = response.city;
                landingPageAnalytics.country = response.country;
                landingPageAnalytics.isp = response.isp;
                landingPageAnalytics.ipAddress = response.query;
                landingPageAnalytics.state = response.regionName;
                landingPageAnalytics.zip = response.zip;
                landingPageAnalytics.latitude = response.lat;
                landingPageAnalytics.longitude = response.lon;
                landingPageAnalytics.countryCode = response.countryCode;
                landingPageAnalytics.timezone = response.timezone;
                this.saveAnalytics( landingPageAnalytics );
                let url = landingPageAnalytics.url;
                let analyticsTypeString = landingPageAnalytics.analyticsTypeString;
                if ( analyticsTypeString != "CAMPAIGN_LANDING_PAGE_FORM" ) {
                    if ( url && ( url.startsWith( "http://" ) || url.startsWith( "https://" ) ) ) {
                        window.location.href = url;
                    } else if ( url && !( url.startsWith( "http://" ) || url.startsWith( "https://" ) ) ) {
                        url = 'http://' + url;
                        window.location.href = url;
                    }
                } else {
                    let updatedFormUrl = this.router.url.replace( "/clpl/", "/f/" );
                    window.location.href = updatedFormUrl;
                }


            },
            ( error: string ) => {
                this.logger.error( "Error In Fetching Location Details" );
            }
            );
    }
    
    
    saveAnalytics(geoLocationAnalytics:GeoLocationAnalytics){
        console.log(geoLocationAnalytics);
        this.landingPageService.saveAnalytics(geoLocationAnalytics)
        .subscribe(
          (data: any) => {
              let response = data.data;
              if(data.statusCode==200){
                  this.logger.info("Location Details Saved Successfully");
              }else{
                  this.logger.error("Error In Saving Location Tracking Details");
              }
          },
          (error: string) => {
              this.logger.error( "Error In saving Location Details",error); 
          }
        );
        
    }

}
