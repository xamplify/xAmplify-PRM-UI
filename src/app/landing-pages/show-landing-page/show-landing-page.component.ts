import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { ActivatedRoute,Router,NavigationStart, NavigationEnd  } from '@angular/router';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { Processor } from '../../core/models/processor';
import { CustomResponse } from '../../common/models/custom-response';
import { filter, pairwise } from 'rxjs/operators';
import { LandingPageService } from '../services/landing-page.service';
import { UtilService } from '../../core/services/util.service';
import { Ng2DeviceService } from 'ng2-device-detector';
import { GeoLocationAnalytics } from '../../util/geo-location-analytics';
import { GeoLocationAnalyticsType } from '../../util/geo-location-analytics-type.enum';


declare var $:any;
@Component({
  selector: 'app-show-landing-page',
  templateUrl: './show-landing-page.component.html',
  styleUrls: ['./show-landing-page.component.css','../../../assets/css/loader.css'],
  providers: [HttpRequestLoader,Processor,LandingPageService],

})
export class ShowLandingPageComponent implements OnInit {
    deviceInfo: any;
    hasLandingPage=true;
    customResponse: CustomResponse = new CustomResponse();
    alias: any;
    alertClass ="";
    successAlertClass = "alert alert-success";
    errorAlertClass = "alert alert-danger";
    show: boolean;
    message: string;
  constructor(private route: ActivatedRoute,private referenceService:ReferenceService,private landingPageService:LandingPageService,
          private authenticationService:AuthenticationService,private logger:XtremandLogger,public httpRequestLoader: HttpRequestLoader,
          public processor:Processor,private router:Router,private utilService:UtilService,public deviceService: Ng2DeviceService) { }

  ngOnInit() {
      this.processor.set(this.processor);
      this.alias = this.route.snapshot.params['alias'];
      if(this.router.url.includes("/showCampaignLandingPage/")){
          this.getHtmlBodyCampaignLandingPageAlias(this.alias);
      }else if(this.router.url.includes("/clpl/")){
          this.redirectToOriginalUrl(this.alias);
      }
      else{
          this.getHtmlBodyAlias(this.alias);
      }
  }
  redirectToOriginalUrl(alias: any) {
    this.landingPageService.getOriginalUrlByAlias(alias)
    .subscribe(
      (response: any) => {
        if (response.statusCode === 200) {
          let data = response.data;
          let campaignId = data.campaignId;
          let userId = data.userId;
          let url = data.url;
          let landingPageAlias = data.landingPageAlias;
          this.getLocationDetails(campaignId,userId,landingPageAlias,url,data.analyticsType,data.analyticsTypeString,data.formId);
        } else {
          this.hasLandingPage = false;
          this.addHeaderMessage("Oops! This link does not exists.",this.errorAlertClass);
        }
        this.processor.remove(this.processor);
      },
      (error: string) => {
        this.processor.remove(this.processor);
        this.hasLandingPage = false;
        this.addHeaderMessage("Oops! Something went wrong.Please try after sometime",this.errorAlertClass);
      }
    );
   
  }

  
  getLocationDetails(campaignId:number,userId:number,alias:string,url:string,analyticsType:GeoLocationAnalyticsType,analyticsTypeString:string,formId:number){
      this.utilService.getJSONLocation()
      .subscribe(
        (response: any) => {
            let landingPageAnalytics = new GeoLocationAnalytics();
            this.deviceInfo = this.deviceService.getDeviceInfo();
            if (this.deviceInfo.device === 'unknown') {
                this.deviceInfo.device = 'computer';
            }
            landingPageAnalytics.openedTime =new Date();
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
            landingPageAnalytics.landingPageAlias = alias;
            landingPageAnalytics.campaignId = campaignId;
            landingPageAnalytics.userId = userId;
            landingPageAnalytics.analyticsType = analyticsType;
            if(analyticsTypeString=="CAMPAIGN_LANDING_PAGE_FORM" && formId>0){
                landingPageAnalytics.formId = formId;
            }
            if(url!=null){
              landingPageAnalytics.url = url;
            }
            this.saveAnalytics(landingPageAnalytics);
            if(analyticsTypeString!="CAMPAIGN_LANDING_PAGE_FORM"){
                if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
                    window.location.href = url;
                  } else if (url && !(url.startsWith("http://") || url.startsWith("https://"))) {
                    url = 'http://'+ url;
                    window.location.href = url;
                  }
            }else{
                alert("dont do anything");
            }
            

        },
        (error: string) => {
            this.logger.error( "Error In Fetching Location Details" ); 
        }
      );
  }
  
  
  saveAnalytics(geoLocationAnalytics:GeoLocationAnalytics){
      this.landingPageService.saveAnalytics(geoLocationAnalytics)
      .subscribe(
        (data: any) => {
        },
        (error: string) => {
            this.logger.error( "Error In saving Location Details",error); 
        }
      );
      
  }
  
  
  
  getHtmlBodyAlias(alias:string){
      this.landingPageService.getHtmlContentByAlias(alias)
      .subscribe(
        (response: any) => {
          if (response.statusCode === 200) {
            this.hasLandingPage = true;
            document.getElementById('landing-page-html-body').innerHTML = response.message;
            this.getLocationDetails(null,null,this.alias,null,response.data,null,0);
          } else {
            this.hasLandingPage = false;
            this.addHeaderMessage("Oops! This landing page does not exists.",this.errorAlertClass);
          }
          this.processor.remove(this.processor);
        },
        (error: string) => {
          this.processor.remove(this.processor);
          this.hasLandingPage = false;
          this.addHeaderMessage("Oops! Something went wrong.Please try after sometime",this.errorAlertClass);
        }
      );
  }
  
  
  getHtmlBodyCampaignLandingPageAlias(alias:string){
      this.landingPageService.getHtmlContentByCampaignLandingPageAlias(alias)
      .subscribe(
        (response: any) => {
          if (response.statusCode === 200) {
            this.hasLandingPage = true;
            let data = response.data;
            document.getElementById('landing-page-html-body').innerHTML = data.body;
            let campaignId = data.campaignId;
            let userId = data.userId;
            let alias = data.landingPageAlias;
            let analyticsType = data.analyticsType;
            this.getLocationDetails(campaignId,userId,alias,null,analyticsType,data.analyticsTypeString,0);
          } else {
            this.hasLandingPage = false;
            this.addHeaderMessage("Oops! This is invalid link.",this.errorAlertClass);
          }
          this.processor.remove(this.processor);
        },
        (error: string) => {
          this.processor.remove(this.processor);
          this.hasLandingPage = false;
          this.addHeaderMessage("Oops! Something went wrong.Please try after sometime",this.errorAlertClass);
        }
      );
  }
  

  addHeaderMessage(message:string,divAlertClass:string){
      this.show = true;
      this.message = message;
      this.alertClass = divAlertClass;
  }
  removeErrorMessage(){
    this.show = false;
  }
}
