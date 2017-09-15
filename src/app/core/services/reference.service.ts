import { Injectable, OnInit } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { SaveVideoFile } from '../../videos/models/save-video-file';
import { AuthenticationService } from './authentication.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Category } from '../../videos/models/category';
import { Logger } from 'angular2-logger/core';
import { User } from '../models/user';
import { DefaultVideoPlayer } from '../../videos/models/default-video-player';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
declare var $: any;

@Injectable()
export class ReferenceService {

    public refcategories: Category[];
    public userName: any;
    public selectedCampaignType: string = "";
    public isCampaignFromVideoRouter:boolean = false;
    campaignSuccessMessage: string = "";
    isCreated: boolean = false;
    isUpdated: boolean = false;
    errorPrepender: string = "Error In";
    campaignVideoFile: SaveVideoFile;
    public videoTitles: string[];
    defaultPlayerSettings: DefaultVideoPlayer;
    public homeMethodsCalled = false;
    defaulgVideoMethodCalled = false;
    uploadRetrivejsCalled = false;
    topNavbarUserService = false;
    isFromTopNavBar:boolean = false;
    topNavBarNotificationDetails:any= new Object();
    topNavBarUserDetails = { 'displayName': '....', 'profilePicutrePath': 'assets/admin/pages/media/profile/icon-user-default.png' };
    userDefaultPage: string = 'welcome';
    public URL: string = this.authenticationService.REST_URL + 'admin/';
    constructor(private http: Http, private authenticationService: AuthenticationService, private logger: Logger,
        private router: Router) {
        console.log('reference service constructor');
    }

    getCategories(): Observable<Category[]> {
        const url = this.URL + 'categories?access_token=' + this.authenticationService.access_token;
        return this.http.get(url, "")
            .map(this.extractData)
            .catch(this.handleError);
    }
    getVideoTitles(): Observable<String[]> {
        const url = this.URL + 'getVideoTitles?access_token=' + this.authenticationService.access_token + '&userId=' +
            this.authenticationService.user.id;
        return this.http.get(url, "")
            .map(this.extractData)
            .catch(this.handleError);
    }
    listCampaignEmailNotifications(userId:number){
        return this.http.get(this.URL+"get-campaign-email-notifications/"+userId+"?access_token="+this.authenticationService.access_token,"")
        .map(this.extractData)
        .catch(this.handleError);
    }
    
    listCampaignVideoNotifications(userId:number){
        return this.http.get(this.URL+"get-campaign-video-notifications/"+userId+"?access_token="+this.authenticationService.access_token,"")
        .map(this.extractData)
        .catch(this.handleError);
    }
    
    markNotificationsAsRead(id:number,type:string){
        let url = "update-campaign-email-notification/";
        if(type=="video"){
            url = "update-campaign-video-notification/"
        }
        return this.http.get(this.URL+url+id+"?access_token="+this.authenticationService.access_token,"")
        .map(this.extractData)
        .catch(this.handleError);
    }
    
    
    
    showErrorPage(error: any) {
        this.router.navigate(['/home/error-occured-page/', error.status]);
    }
    showError(cause: string, methodName: string, componentName: string) {
        let message = "Error In " + methodName + "() " + componentName;
        this.logger.error(message + ":", cause);
    }
    showServerError(httpRequestLoader: HttpRequestLoader) {
        httpRequestLoader.isLoading = false;
        httpRequestLoader.isServerError = true;
        // httpRequestLoader.statusCode = 500;
        return httpRequestLoader;
    }
    loading(httpRequestLoader: HttpRequestLoader, isLoading: boolean) {
        httpRequestLoader.isLoading = isLoading;
    }
    showInfo(info: string, data: any) {
        this.logger.debug(info, data);
    }
    extractData(res: Response) {
        let body = res.json();
        console.log(body);
        return body || {};
    }

    handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server   error';
        return Observable.throw(errMsg);
    }
    goToTop() {
        $(window).scrollTop(0);
    }
    removeDuplicates(list: any) {
        let result = [];
        $.each(list, function (i, e) {
            if ($.inArray(e, result) == -1) result.push(e);
        });
        return result;
    }

    removeDuplicatesFromTwoArrays(array1: any, array2: any) {
        for (var i = 0; i < array2.length; i++) {
            var arrlen = array1.length;
            for (var j = 0; j < arrlen; j++) {
                if (array2[i] == array1[j]) {
                    array1 = array1.slice(0, j).concat(array1.slice(j + 1, arrlen));
                }//if close
            }//for close
        }//for close
        return array1;
    }
    replaceMultipleSpacesWithSingleSpace(text:string){
        if(text!=undefined){
            return  text.replace(/ +(?= )/g,'').trim();
        }else{
            return "";
        }
        
     }
    
    validateEmailId(emailId:string){
    /*    if(emailId.length>0){
            emailId = emailId.trim();
            var regex = /^[A-Za-z0-9]+(\.[_A-Za-z0-9]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$/;
            return regex.test(emailId);
        }else{
            return false;
        }
        
        emailId = emailId.trim();*/
        var regex = /^[A-Za-z0-9]+(\.[_A-Za-z0-9]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$/;
        return regex.test(emailId);
        
    }
}