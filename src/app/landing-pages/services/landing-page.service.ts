import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Pagination } from '../../core/models/pagination';
import { LandingPage } from '../models/landing-page';
import { LandingPageGetDto } from '../models/landing-page-get-dto';
import {LandingPageAnalyticsPostDto} from '../models/landing-page-analytics-post-dto';
import { Router } from '@angular/router';
import { GeoLocationAnalytics } from "../../util/geo-location-analytics";
import { UtilService } from 'app/core/services/util.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { MarketPlaceCategory } from '../../dashboard/models/market-place-category';
declare var  $: any;
@Injectable()
export class LandingPageService {
    
    jsonBody: any = "";
    id: number = 0;
    URL = this.authenticationService.REST_URL + "landing-page/";
    superAdminUrl = this.authenticationService.REST_URL + "superadmin/"
    vendorJourney:boolean = false;
    isMasterLandingPages:boolean = false;
    welcomePages:boolean = false;
    isPartnerJourneyPages:boolean = false;
    isVendorMarketplacePages:boolean = false;
    constructor( private http: Http, private authenticationService: AuthenticationService, private logger: XtremandLogger,
         private router: Router,private utilService:UtilService,public referenceService:ReferenceService) { }

    listDefault( pagination: Pagination ): Observable<any> {
        let encodedUrl = this.referenceService.getEncodedUri(pagination.searchKey);
        return this.http.post( this.URL + "default?searchKey="+encodedUrl+"&access_token=" + this.authenticationService.access_token, pagination )
            .map( this.extractData )
            .catch( this.handleError );
    }

    list(pagination: Pagination,isPartnerLandingPage:boolean): Observable<any> {
        let listOrPartnerPagesUrl = "list";
        if(isPartnerLandingPage){
            listOrPartnerPagesUrl = "partner";
        /******XNFR-252*****/
        let subDomain = this.authenticationService.getSubDomain();
        if(subDomain.length==0){
            let loginAsUserId = this.utilService.getLoggedInVendorAdminCompanyUserId();
            if(loginAsUserId>0){
                pagination.loginAsUserId = loginAsUserId;
            }
        }
        }
        let encodedUrl = this.referenceService.getEncodedUri(pagination.searchKey);
        return this.http.post( this.URL +listOrPartnerPagesUrl+"?searchKey="+encodedUrl+"&access_token=" + this.authenticationService.access_token, pagination )
            .map( this.extractData )
            .catch( this.handleError );
    }
    
    
    listAnalytics( pagination: Pagination,countryCode:string ): Observable<any> {
        let url = this.URL + "analytics/list?";
        if($.trim(countryCode).length>0){
            url = this.URL + "analytics/list?countryCode="+countryCode+"&";
        }
        return this.http.post(url+"access_token=" + this.authenticationService.access_token, pagination )
            .map( this.extractData )
            .catch( this.handleError );
    }
    
    listBarChartAnalytics(pagination: Pagination,timePeriod:string,value:any,analyticsType:string): Observable<any> {
        let url = this.URL + "analytics/bar-chart-filter-views/"+timePeriod+"/"+value +"/"+analyticsType+"?";
        return this.http.post(url+"access_token=" + this.authenticationService.access_token,pagination)
            .map( this.extractData )
            .catch( this.handleError );
    }
    
    getCountryViewershipMapData(landingPageAnalyticsDto:LandingPageAnalyticsPostDto): Observable<any> {
        return this.http.post( this.URL + "analytics/get-country-views?access_token=" + this.authenticationService.access_token,landingPageAnalyticsDto)
            .map( this.extractData )
            .catch( this.handleError );
    }
    
    getBarCharViews(landingPageAnalyticsDto:LandingPageAnalyticsPostDto): Observable<any> {
        return this.http.post( this.URL + "analytics/barchart-views?access_token=" + this.authenticationService.access_token,landingPageAnalyticsDto)
            .map( this.extractData )
            .catch( this.handleError );
    }

    getAvailableNames( userId: number, isWelcomePage:boolean) {
        let url;
        if(isWelcomePage){
            url = this.URL + "/listAvailableNamesForWelcomePage/";
        }else{
            url = this.URL + "/listAvailableNames/";

        }
        return this.http.get( url + userId + "?access_token=" + this.authenticationService.access_token, "" )
            .map( this.extractData )
            .catch( this.handleError );
    }

    getById( id: number ): Observable<any> {
        let isVanityUrlFilter = this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '';
        let landingPageId = "landingPageId="+id;
        let vanityUrlFilter = "&vanityUrlFilter="+isVanityUrlFilter;
        let companyProfileName = isVanityUrlFilter?"&vanityCompanyProfileName="+this.authenticationService.companyProfileName:"";
        return this.http.get( this.URL + "getById?"+landingPageId+vanityUrlFilter+companyProfileName +"&access_token=" + this.authenticationService.access_token, "" )
            .map( this.extractData )
            .catch( this.handleError );
    }

    deletebById( id: number, isVendorJourney:boolean): Observable<any> {
        let url
        if(isVendorJourney){
            url = this.URL +"vendorJourneyLandingpagedeleteById/"
        }else{
           url =  this.URL + "delete/"
        }
        return this.http.get( url + id + "/"+this.authenticationService.getUserId()+"?access_token=" + this.authenticationService.access_token, "" )
            .map( this.extractData )
            .catch( this.handleError );
    }

    getHtmlContent(landingPageDto:LandingPageGetDto): Observable<any> {
        return this.http.post( this.URL + "getHtmlBodyById?access_token=" + this.authenticationService.access_token, landingPageDto )
            .map( this.extractData )
            .catch( this.handleError );
    }
    
    getHtmlContentByAlias( landingPageHtmlDto:any,isPartnerLandingPage:boolean, isMasterLandingPage:boolean) {
        landingPageHtmlDto['vanityUrlFilter']  = this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '';
        landingPageHtmlDto['vanityCompnayProfileName'] = this.authenticationService.companyProfileName;
        let url = this.authenticationService.REST_URL;
        if(isPartnerLandingPage){
            url = url +"/getPartnerHtmlBodyByAlias"
        }else if(isMasterLandingPage){
            url = url +"/getMasterLandingPageHtmlBodyByAlias"
        }else{
            url = url +"/getHtmlBodyByAlias"
        }
        return this.http.post( url,landingPageHtmlDto)
        .map( this.extractData )
        .catch( this.handleError );

    }
    
    getHtmlContentByCampaignLandingPageAlias( alias: string ) {
        let vanityUrlFilter = this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '';
        let url = this.authenticationService.REST_URL + "/getCampaignLandingPageContent/" + alias;
        if(vanityUrlFilter){
            url+="/"+vanityUrlFilter;
        }
        return this.http.get(url, "" )
            .map( this.extractData )
            .catch( this.handleError );
    }

    getOriginalUrlByAlias( alias: string ) {
        return this.http.get( this.authenticationService.REST_URL + "/getOriginalLinkByAlias/" + alias, "" )
            .map( this.extractData )
            .catch( this.handleError );
    }
    
    saveAnalytics( geoLocationAnalytics: GeoLocationAnalytics ): Observable<any> {
        return this.http.post( this.authenticationService.REST_URL + "save/geoLocationAnalytics", geoLocationAnalytics )
            .map( this.extractData )
            .catch( this.handleError );
    }



    save( landingPage: LandingPage,isLoggedInAsAdmin:boolean,id:number ): Observable<any> {
        let suffixUrl = isLoggedInAsAdmin ? this.superAdminUrl+'saveAsDefaultPage':this.URL+'save';
        if(isLoggedInAsAdmin){
            landingPage.id = id;
        }
        return this.http.post(suffixUrl+ "?access_token=" + this.authenticationService.access_token, landingPage )
            .map( this.extractData )
            .catch( this.handleError );
    }

    update( landingPage: LandingPage ): Observable<any> {
        return this.http.post( this.URL + "update?access_token=" + this.authenticationService.access_token, landingPage )
            .map( this.extractData )
            .catch( this.handleError );
    }

    deleteDefaultPage( id: number ): Observable<any> {
        return this.http.get( this.superAdminUrl + "deleteDefaultPage/" + id+"?access_token=" + this.authenticationService.access_token, "" )
            .map( this.extractData )
            .catch( this.handleError );
    }
    
    getAllCompanyProfileImages(userId:number){
        return this.http.get(this.authenticationService.REST_URL+"admin/listAllCompanyProfileImages/"+userId+"?access_token="+this.authenticationService.access_token,"")
        .map(this.extractData)
        .catch(this.handleError);
    }


    goToManage() {
        if ( "/home/pages/manage" == this.router.url ) {
            this.router.navigate( [this.router.url] );
        }
    }

    getJsonContent(id:number): Observable<any> {
        return this.http.get( this.URL + "getJsonBodyById/"+id+"?access_token=" + this.authenticationService.access_token)
            .map( this.extractData )
            .catch( this.handleError );
    }

    getOpenLinksInNewTab(id:number): Observable<any> {
        return this.http.get( this.URL + "getOpenLinksInNewTab/"+id+"?access_token=" + this.authenticationService.access_token)
            .map( this.extractData )
            .catch( this.handleError );
    }

    updateJsonAndHtmlBody(ladingPage:LandingPage): Observable<any> {
        return this.http.post(this.URL + "updateJsonAndHtmlBody?access_token=" + this.authenticationService.access_token,ladingPage)
            .map( this.extractData )
            .catch( this.handleError );
    }

    /*  XNFR-432 */
    copy(landingPage: LandingPage) {
        let url = this.URL+"copy?access_token="+this.authenticationService.access_token;
        landingPage.userId = this.authenticationService.getUserId();
        return this.authenticationService.callPostMethod(url,landingPage);
    }

    private extractData( res: Response ) {
        const body = res.json();
        return body || {};
    }


    private handleError( error: any ) {
        return Observable.throw( error );
    }

    shareVendorJourneyLandingPageToPartners(shareLeadsDTO: any) {
        return this.http.post(this.URL + "shareVendorJourneyLandingPageToPartners?access_token=" + this.authenticationService.access_token, shareLeadsDTO)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    findPartnerVendorJourneyLandingPages(pagination: any) {
        return this.http.post(this.URL + "findPartnerVendorJourneyLandingPages?searchKey=" + pagination.searchKey + "&access_token=" + this.authenticationService.access_token, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getLandingPageSharedDetails( landingPageId: number ) {
        return this.http.get( this.URL + "landingPageSharedDetails/" + landingPageId + "?access_token=" + this.authenticationService.access_token, "" )
            .map( this.extractData )
            .catch( this.handleError );
    }

    getVendorLogoDetailsByPartnerDetails( userId: number, companyId: number, landingPageId:number ) {
        return this.http.get( this.URL + "/getVendorLogoDetailsByPartner/" + userId +"/"+companyId+"/"+landingPageId+"?access_token=" + this.authenticationService.access_token, "" )
            .map( this.extractData )
            .catch( this.handleError );
    }
    
      listMarketPlaceCategories(pagination: any) {
        let userId = this.authenticationService.getUserId();
        return this.http.post(this.URL + userId +"/list-market-place-categories?access_token=" + this.authenticationService.access_token, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    } 
    
    saveOrUpdateCategory( marketPlaceCategory: MarketPlaceCategory ) {
        return this.http.post( this.URL + "save-or-update-market-place-category?access_token=" + this.authenticationService.access_token, marketPlaceCategory )
            .map( this.extractData )
            .catch( this.handleError );
    }
    
      deleteMarketPlaceCategory( categoryId: number) {
        return this.http.get( this.URL + "delete/" + categoryId +"?access_token=" + this.authenticationService.access_token, "" )
            .map( this.extractData )
            .catch( this.handleError );
    }

    updateWelcomePage(landingPage:LandingPage) {
        landingPage.userId = this.authenticationService.getUserId();
        const url = this.URL +"/activate-welcome-page?access_token=" + this.authenticationService.access_token;
        return this.authenticationService.callPutMethod(url,landingPage);

    } 
    
    getActiveWelcomePageByVanity( landingPageHtmlDto:any) {
        let vanityUrlFilter  = this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '';
        let vanityCompnayProfileName = this.authenticationService.companyProfileName;
        const url = this.URL + "/getActiveWelcomePageByVanity?vanityUrlFilter=" + vanityUrlFilter + "&vanityCompnayProfileName=" + vanityCompnayProfileName + "&access_token=" + this.authenticationService.access_token;
        return this.authenticationService.callGetMethod(url);
    }

    unPublishWelcomePage(landingPage:LandingPage) {
        landingPage.userId = this.authenticationService.getUserId();
        const url = this.URL + "/unpublish-welcome-page?access_token=" + this.authenticationService.access_token;
        return this.authenticationService.callPutMethod(url,landingPage);
    } 

    welcomePageDeletebById( id: number): Observable<any> {   
        const url =this.URL +"welcomePageDelete/" + id + "/"+this.authenticationService.getUserId()+"?access_token=" + this.authenticationService.access_token;
        return this.authenticationService.callDeleteMethod(url);
    }

    getVendorCompaniesByAlias( alias:string, isMasterLandingPage) {
        const url = this.authenticationService.REST_URL + "/getVendorCompaniesByAlias/" + alias+"/"+isMasterLandingPage ;
        return this.authenticationService.callGetMethod(url);
    }

    sharePartnerJourneyLandingPageToPartners(shareLeadsDTO: any) {
        return this.http.post(this.URL + "sharePartnerJourneyPageToVendors?access_token=" + this.authenticationService.access_token, shareLeadsDTO)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getPartnerJourneyPageSharedDetails( landingPageId: number ) {
        return this.http.get( this.URL + "findVendorCompanyIdsByLandingPageId/" + landingPageId + "?access_token=" + this.authenticationService.access_token, "" )
            .map( this.extractData )
            .catch( this.handleError );
    }

    findVendorPartnerJourneyLandingPages(pagination: any) {
        return this.http.post(this.URL + "findVendorPartnerJourneyLandingPages?searchKey=" + pagination.searchKey + "&access_token=" + this.authenticationService.access_token, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getPartnerDetailsByVendorCompany(companyId: number, landingPageId:number ) {
        return this.http.get( this.URL + "getPartnerDetailsByVendorCompany/"+companyId+"/"+landingPageId+"?access_token=" + this.authenticationService.access_token, "" )
            .map( this.extractData )
            .catch( this.handleError );
    }

    getPartnerCompanyDetailsByVendorLandscapePageAlias(alias:any) {
        let vanityUrlFilter  = this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '';
        let vanityCompnayProfileName = this.authenticationService.companyProfileName;
        const url = this.authenticationService.REST_URL + "/getPartnerCompanyDetailsByVendorLandscapePageAlias?alias="+alias+"&vanityUrlFilter=" + vanityUrlFilter + "&vanityCompnayProfileName=" + vanityCompnayProfileName;
        return this.authenticationService.callGetMethod(url);
    }
}
