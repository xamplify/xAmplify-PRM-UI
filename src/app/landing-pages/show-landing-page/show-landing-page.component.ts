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
import { LandingPageAnalytics } from '../models/landing-page-analytics';
import { Ng2DeviceService } from 'ng2-device-detector';


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
    ngxLoading = false;
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
      }else{
          this.getHtmlBodyAlias(this.alias);
      }
  }

  
  getLocationDetails(campaignId:number,userId:number,alias:string){
      this.utilService.getJSONLocation()
      .subscribe(
        (response: any) => {
            let landingPageAnalytics = new LandingPageAnalytics();
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
            this.saveAnalytics(landingPageAnalytics);

        },
        (error: string) => {
            this.logger.error( "Error In Fetching Location Details" ); 
        }
      );
  }
  
  
  saveAnalytics(landingPageAnalytics:LandingPageAnalytics){
      this.landingPageService.saveAnalytics(landingPageAnalytics)
      .subscribe(
        (data: any) => {
        },
        (error: string) => {
            this.logger.error( "Error In saving Location Details",error); 
        }
      );
      
  }
  
  
  
  getHtmlBodyAlias(alias:string){
      this.ngxLoading = true;
      this.landingPageService.getHtmlContentByAlias(alias)
      .subscribe(
        (response: any) => {
          if (response.statusCode === 200) {
            this.hasLandingPage = true;
            document.getElementById('landing-page-html-body').innerHTML = response.message;
            this.getLocationDetails(null,null,this.alias);
          } else {
            this.hasLandingPage = false;
            this.addHeaderMessage("Oops! This landing page does not exists.",this.errorAlertClass);
          }
          this.processor.remove(this.processor);
          this.ngxLoading = false;
        },
        (error: string) => {
          this.processor.remove(this.processor);
          this.logger.errorPage(error);
          this.referenceService.showServerError(this.httpRequestLoader);
        }
      );
  }
  
  
  getHtmlBodyCampaignLandingPageAlias(alias:string){
      this.ngxLoading = true;
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
            this.getLocationDetails(campaignId,userId,alias);
          } else {
            this.hasLandingPage = false;
            this.addHeaderMessage("Oops! This is invalid link.",this.errorAlertClass);
          }
          this.processor.remove(this.processor);
          this.ngxLoading = false;
        },
        (error: string) => {
          this.processor.remove(this.processor);
          this.logger.errorPage(error);
          this.referenceService.showServerError(this.httpRequestLoader);
        }
      );
  }
  

  addHeaderMessage(message:string,divAlertClass:string){
      this.ngxLoading = false;
      this.show = true;
      this.message = message;
      this.alertClass = divAlertClass;
  }
  removeErrorMessage(){
    this.show = false;
  }
}
