import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { ActivatedRoute,Router,NavigationStart, NavigationEnd  } from '@angular/router';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { Processor } from '../../core/models/processor';
import { CustomResponse } from '../../common/models/custom-response';
import { LandingPageService } from '../services/landing-page.service';
import { UtilService } from '../../core/services/util.service';
import { Ng2DeviceService } from 'ng2-device-detector';
import { GeoLocationAnalytics } from '../../util/geo-location-analytics';
import { GeoLocationAnalyticsType } from '../../util/geo-location-analytics-type.enum';
import {VanityURLService} from 'app/vanity-url/services/vanity.url.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { LandingPageType } from 'app/landing-pages/models/landing-page-type.enum';
import { LandingPage } from '../models/landing-page';


declare var $:any;
@Component({
  selector: 'app-show-landing-page',
  templateUrl: './show-landing-page.component.html',
  styleUrls: ['./show-landing-page.component.css','../../../assets/css/loader.css'],
  providers: [HttpRequestLoader,Processor,LandingPageService],

})
export class ShowLandingPageComponent implements OnInit {
    landingPage: LandingPage = new LandingPage();
  
    deviceInfo: any;
    hasLandingPage=true;
    customResponse: CustomResponse = new CustomResponse();
    alias: any;
    alertClass ="";
    successAlertClass = "alert alert-success";
    errorAlertClass = "alert alert-danger";
    show: boolean;
    message: string;
    isPartnerLandingPage:boolean=false;
    isVendorJourney:boolean = false;
    isMasterLandingPage: boolean = false;
    isFromMasterLandingPage:boolean = false;
    isPartnerJourneyPage: boolean = false;
    isVendorMarketplacePage: boolean = false;
    isFromVendorMarketplacePage:boolean = false;
    isProtectedLandingPage: boolean = false;
    userId = 0;


  constructor(private route: ActivatedRoute,private landingPageService:LandingPageService,private logger:XtremandLogger,public httpRequestLoader: HttpRequestLoader,
          public processor:Processor,private router:Router,private utilService:UtilService,public deviceService: Ng2DeviceService,private vanityURLService:VanityURLService,
          public referenceService:ReferenceService,public authenticationService:AuthenticationService) {
                    this.userId = this.authenticationService.getUserId();

          }

  ngOnInit() {
    $('.loader-container').hide();
    this.processor.set(this.processor);
    // $("#xamplify-index-head").html("");
    // $('#page-loader-index-html').css({'display':'block'});
    if (this.vanityURLService.isVanityURLEnabled()) {
      this.vanityURLService.checkVanityURLDetails();
    }
    this.userId = this.authenticationService.getUserId();
    this.alias = this.route.snapshot.params['alias'];
    // this.referenceService.clearHeadScriptFiles();
    if (this.router.url.includes("/showCampaignLandingPage/") || this.router.url.includes("/scp/")) {
      this.getHtmlBodyCampaignLandingPageAlias(this.alias);
    } else if (this.router.url.includes("/clpl/")) {
      this.redirectToOriginalUrl(this.alias);
    } else if (this.router.url.includes("/pl/")) {
      this.isPartnerLandingPage = true;
      this.getHtmlBodyAlias(this.alias);
    } else if (this.router.url.includes("/vjpl/")) {
      this.isPartnerLandingPage = true;
      this.isVendorJourney = true;
      this.getHtmlBodyAlias(this.alias);
    } else if (this.router.url.includes("/mlvjpl/")) {
      this.isPartnerLandingPage = true;
      this.isVendorJourney = true;
      this.isFromMasterLandingPage = true;
      this.getHtmlBodyAlias(this.alias);
    } else if (this.router.url.includes("/mlpl/")) {
      this.isMasterLandingPage = true;
      this.getHtmlBodyAlias(this.alias);
    } else if (this.router.url.includes("/pjpl/")) {
      this.isPartnerLandingPage = true;
      this.isPartnerJourneyPage = true;
      this.getHtmlBodyAlias(this.alias);
    } else if (this.router.url.includes("/vmpjpl/")) {
      this.isPartnerLandingPage = true;
      this.isPartnerJourneyPage = true;
      this.isFromVendorMarketplacePage = true;
      this.getHtmlBodyAlias(this.alias);
    } else if (this.router.url.includes("/vmpl/")) {
      this.isVendorMarketplacePage = true;
      this.getHtmlBodyAlias(this.alias);
    }
    else {
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
            landingPageAnalytics.openedInBrowser = true;
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
            if(this.isPartnerLandingPage){
                landingPageAnalytics.partnerLandingPageAlias = this.alias;
                  landingPageAnalytics.vendorJourney = this.isVendorJourney;
                  landingPageAnalytics.fromMasterLandingPage = this.isFromMasterLandingPage;
                  landingPageAnalytics.partnerJourneyPage = this.isPartnerJourneyPage;
                  landingPageAnalytics.fromVendoeMarketplacePage = this.isFromVendorMarketplacePage;
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
                let updatedFormUrl  = this.router.url.replace("/clpl/","/f/");
                window.location.href = updatedFormUrl;
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
  getHtmlBodyAlias(alias: string) {
    const userId = this.authenticationService.getUserId();
    const landingPageHtmlDto = {
      alias: alias,
      vendorJourney: this.isVendorJourney,
      masterLandingPage: this.isMasterLandingPage,
      fromMasterLandingPage: this.isFromMasterLandingPage,
      partnerJourneyPage: this.isPartnerJourneyPage,
      vendorMarketplacePage: this.isVendorMarketplacePage,
      fromVendorMarketplacePage: this.isFromVendorMarketplacePage,
      protectedUrlPage: this.isProtectedLandingPage
    };

    this.landingPageService
      .getHtmlContentByAlias(
        landingPageHtmlDto,
        this.isPartnerLandingPage,
        (this.isMasterLandingPage || this.isVendorMarketplacePage)
      )
      .subscribe(
        (response: any) => {
          if (response.statusCode === 200) {
            this.hasLandingPage = true;

            if (this.isPartnerLandingPage) {
              // ✅ Partner landing page
              const data = response.data;
              const landingPageAlias = data.landingPageAlias;
              const htmlBody = data.htmlBody;

              document.getElementById('landing-page-html-body').innerHTML = htmlBody;

              this.getLocationDetails(
                null,
                null,
                landingPageAlias,
                null,
                data.enumType,
                null,
                0
              );
            } else {
              // ✅ Non-partner landing page
              document.getElementById('landing-page-html-body').innerHTML =
                response.message;
              const typeFromResponse =
                response && response.map ? response.map.type : undefined;
              if (typeFromResponse) {
                this.landingPage.type = typeFromResponse as LandingPageType;
              }
      //  let companyProfileName = this.authenticationService.companyProfileName;
            // if (companyProfileName == 'versa-networks') {
              if (typeFromResponse === "PROTECTED") {
                const currentUser = localStorage.getItem('currentUser');

                if (!currentUser) {
                  const landingUrl = `/landing/${alias}`;
                  this.router.navigate(['/login'], {
                    queryParams: { returnUrl: landingUrl }
                  });
                  this.processor.remove(this.processor);
                  return;
                }
                this.isProtectedLandingPage = true;
                this.getLocationDetails(null, userId, this.alias, null, null, null, 0);

              }
            //  } 
             else {
                this.isProtectedLandingPage = false;
                this.getLocationDetails(null, null, this.alias, null, response.data, null, 0);
              }
            }
          } else {
            this.hasLandingPage = false;
            this.addHeaderMessage(
              "Oops! This page does not exist.",
              this.errorAlertClass
            );
          }

          this.processor.remove(this.processor);
        },
        (error: string) => {
          this.processor.remove(this.processor);
          this.hasLandingPage = false;
          this.addHeaderMessage(
            "Oops! Something went wrong. Please try after sometime",
            this.errorAlertClass
          );
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

handleProtectedPage(alias: string): void {
  this.isProtectedLandingPage = true;
  this.getHtmlBodyAlias(alias);
}
}