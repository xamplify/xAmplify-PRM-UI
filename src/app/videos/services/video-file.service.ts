import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Observable } from 'rxjs/Observable';
import { SaveVideoFile } from '../models/save-video-file';
import { Category } from '../models/category';
import { Pagination } from '../../core/models/pagination';
import { XtremandLog } from '../models/xtremand-log';
import { User } from '../../core/models/user';
import { environment } from 'environments/environment.prod';
import { EnvService } from 'app/env.service';

@Injectable()
export class VideoFileService {
    actionValue: string;
    saveVideoFile: SaveVideoFile;
    categories: Category[];
    showSave: boolean;
    showUpadte: boolean;
    pagination: Pagination;
    Xtremandlog: XtremandLog;
    viewBytemp: string;
    logEnded: number;
    videoViewBy: string;
    replyVideo = false;
    timeValue: any;
    campaignTimeValue: any;
    pauseAction: boolean;
    pause360Action: boolean;
    categoryNumber = 0;
    viewsCategoryNumber = 0;
    isProgressBar = false;
    isSliderClicked = false;
    seekbarTime: any;
    videoType: any;
    videoFileSweetAlertMessage: boolean;
    contentRedirect = false;
    URL: string = this.authenticationService.REST_URL + 'videos/';
    campaignReport : boolean = false;
    constructor(public envService: EnvService, private http: Http, private authenticationService: AuthenticationService,public httpClient: HttpClient) {
    }
    processVideoFile(responsePath: any): Observable<any> {
        const url = this.URL + 'process-video?path=' + responsePath + '&userId=' +
            this.authenticationService.user.id + '&access_token=' + this.authenticationService.access_token;
        return this.http.post(url, '')
            .map(this.extractData)
            .catch(this.handleError);
    }
    saveRecordedVideo(formData: any) {
        const url = this.URL + 'save-recorded-video?&userId=' + this.authenticationService.user.id +
            '&access_token=' + this.authenticationService.access_token;
        return this.http.post(url, formData)
            .map(this.extractData)
            .catch(this.handleError);
    }
    saveOwnThumbnailFile(file: any) { // not using this api
        const formData: FormData = new FormData();
        formData.append('file', file);
        const headers = new Headers();
        headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json');
        const options = new RequestOptions({ headers: headers });
        const url = this.URL + 'upload-own-thumbnail?access_token=' + this.authenticationService.access_token +
            '&userId=' + this.authenticationService.user.id;
        return this.http.post(url, formData)
            .map(this.extractData)
            .catch(this.handleError);
    }

    saveVideo(saveVideoFile: SaveVideoFile) {
        if (this.viewBytemp === 'DRAFT') {
            saveVideoFile.action = 'save';
        }
        const url = this.URL + 'save' + '?userId=' + this.authenticationService.user.id + '&access_token=' +
            this.authenticationService.access_token;
        return this.http.post(url, saveVideoFile)
            .map(this.extractData)
            .catch(this.handleError);
    }
    loadVideoFiles(pagination: Pagination): Observable<SaveVideoFile[]> {
        let url: any
        let userId = this.authenticationService.user.id;

        userId = this.authenticationService.checkLoggedInUserId(userId);

        if (this.authenticationService.isOnlyPartner()) {
            url = this.URL + 'channel-videos/' + this.categoryNumber + '?userId=' + userId + '&access_token=' + this.authenticationService.access_token;
        } else {
           url = this.URL + 'loadVideos/'+this.categoryNumber + '?userId=' + userId + '&access_token=' + this.authenticationService.access_token;
            /*if (this.videoType === 'myAssets') {
                url = this.URL + 'loadVideos/'+this.categoryNumber + '?userId=' + userId + '&access_token=' + this.authenticationService.access_token;
            } else if (this.videoType === 'partnerVideos') {
                url = this.URL + 'channel-videos/' + this.categoryNumber + '?userId=' + userId + '&access_token=' + this.authenticationService.access_token;
            }*/
        }
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }
    loadVideoForViewsReport(pagination: Pagination): Observable<SaveVideoFile[]> {
        const constURL = this.authenticationService.REST_URL + 'admin/';
        const url = constURL + 'video_report/' + this.viewsCategoryNumber +
            '?userId=' + this.authenticationService.user.id + '&access_token=' + this.authenticationService.access_token;
        return this.http.post(url, pagination, '')
            .map(this.extractData)
            .catch(this.handleError);
    }
    loadVideosCount(userId: number) {
        const constURL = this.authenticationService.REST_URL + 'admin/';
        const url = constURL + 'videos_count?userId=' + userId + '&access_token=' + this.authenticationService.access_token;
        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getVideo(alias: string, viewBy: string): Observable<SaveVideoFile> {
        this.viewBytemp = viewBy;
        const url = this.URL + 'video-by-alias/' + alias +"/" + this.authenticationService.user.id  +'?viewBy=' + viewBy;
        return this.http.get(url, '')
            .map(this.extractData)
            .catch(this.handleError);
    }
    getVideoByShortenerUrlAlias(shortnerUrlAlias: string): Observable<SaveVideoFile> {
        const url = this.URL + 'video-by-shortenerurlalias?shortenUrlAlias=' + shortnerUrlAlias;
        return this.http.get(url, '')
          .map(this.extractData)
          .catch(this.handleError);
    }
    getVideoByShortenerUrlAliasXamplify(shortnerUrlAlias: string): Observable<SaveVideoFile> {
      const url = this.envService.SERVER_URL+'xtremand-rest/videos/' + 'video-by-shortenerurlalias?shortenUrlAlias=' + shortnerUrlAlias;
      return this.http.get(url, '')
        .map(this.extractData)
        .catch(this.handleError);
    }
    getShortnerUrlAlias(viewBy: string, alias: string) {
        
        /*let isChannelVideo: boolean;
         if (this.videoType === 'myAssets') {
            isChannelVideo = false;
        } else if (this.videoType === 'partnerVideos') {
            isChannelVideo = true;
        }*/
        return this.http.get(this.authenticationService.REST_URL + 'videos/shortener-url-alias?viewBy=' + viewBy
            + '&videoAlias=' + alias + '&userId=' + this.authenticationService.user.id + '&isChannelVideo=false', '')
            .map(this.extractData)
            .catch(this.handleError);
    }
    shareMetaTags(shareShortUrl: string) {
        return this.http.get(shareShortUrl)
            .map(this.extractData)
            .catch(this.handleError);

    }
    deleteVideoFile(alias: string): Observable<SaveVideoFile> {
        const url = this.URL + 'video-status-change/' + alias +"/"+ this.authenticationService.user.id +'?status=DELETE&access_token=' + this.authenticationService.access_token;
        return this.http.get(url, '')
            .map(this.extractData)
            .catch(this.handleErrorDelete);
    }
    saveCalltoActionUser(emailLogReport, id) {
        try {
            const url = this.URL + id+'/user/save-call-action-user';
            return this.httpClient.post(url, emailLogReport).catch(this.handleError);
        } catch (error) { console.log(error); }
    }
    showCampaignVideo(emailLog: any) {
        try {
            const url = this.authenticationService.REST_URL + 'user/showCampaignVideo';
            return this.http.post(url, emailLog)
                .map(this.extractData)
                .catch(this.handleErrorLogAction);
        } catch (error) { console.log(error); }
    }
    showCampaignEmail(alias: string) {
        const url = this.authenticationService.REST_URL;
        return this.http.get(url + 'showCampaignEmail?shortenUrlAlias=' + alias, '')
            .map(this.extractData)
            .catch(this.handleError);
    }
    logEmbedVideoActions(xtremandLog: XtremandLog) {
        xtremandLog.campaignId = 0;
       // xtremandLog.userId = 0;
        try {
            if (xtremandLog.actionId === 8) { xtremandLog.startDuration = this.seekbarTime; }
            if (xtremandLog.actionId === 2 || xtremandLog.actionId === 1) { this.campaignTimeValue = xtremandLog.startDuration; }
            if ((xtremandLog.actionId === 8 && this.replyVideo === true) || (xtremandLog.actionId === 1 && this.pause360Action === true)
                || (xtremandLog.actionId === 2 && this.pause360Action === true)) {
                this.replyVideo = false;
            } else {
                const url = this.authenticationService.REST_URL + 'user/log_embedvideo_action';
                return this.http.post(url, xtremandLog)
                    .map(this.extractData)
                    .catch(this.handleErrorLogAction);
            }
        } catch (err) {
            console.log(err);
        }
    }
    logCampaignVideoActions(xtremandLog: XtremandLog) {
        try {
            if (xtremandLog.actionId === 8) { xtremandLog.startDuration = this.seekbarTime; }
            let skipPause: any;
            if (xtremandLog.actionId === 2 || xtremandLog.actionId === 1) { this.campaignTimeValue = xtremandLog.startDuration; }
            if (xtremandLog.actionId === 8) { skipPause = true; }
            if ((xtremandLog.actionId === 8 && this.replyVideo === true) || (xtremandLog.actionId === 1 && this.pauseAction === true)
                || (xtremandLog.actionId === 2 && this.pauseAction === true)) {
                this.replyVideo = false;
            } else {
                const url = this.authenticationService.REST_URL + 'user/logVideoAction';
                return this.http.post(url, xtremandLog)
                    .map(this.extractData)
                    .catch(this.handleErrorLogAction);
            }
        } catch (error) {
            console.log('error comes here');
        }
    }
    logVideoViews(alias: string,urlAlias:string) {
        const url = this.authenticationService.REST_URL + 'admin/video/increment_view?alias=' + alias+ '&urlAlias='+ urlAlias;
        return this.http.post(url,'')
            .map(this.extractData)
            .catch(this.handleErrorLogAction);
    }
    getJSONLocation(): Observable<any> {
        const locationurl = 'https://pro.ip-api.com/json/?key=7bvBGuqMHI5QTtq';
        return this.http.get(locationurl, '')
            .map(this.extractData)
            .catch(this.handleErrorLogAction);
    }
    loadCampaignVideos(pagination: Pagination, categoryId: number) {
        const url = this.URL + 'loadVideos/'+ categoryId +
            '?userId=' + this.authenticationService.user.id + '&access_token=' + this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    loadChannelVideos(pagination: Pagination, categoryId: number) {
        const url = this.URL + "channel-videos/" + categoryId +
            '?userId=' + this.authenticationService.user.id + '&access_token=' + this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    loadPublicVideos(companyId:number){
        const url = this.URL + "public/" + companyId +'?access_token=' + this.authenticationService.access_token;
        return this.http.get(url, '')
        .map(this.extractData)
        .catch(this.handleError);
    }
    
     logCampaignVideoActionsSms(xtremandLog: XtremandLog) {
        try {
            if (xtremandLog.actionId === 8) { xtremandLog.startDuration = this.seekbarTime; }
            let skipPause: any;
            if (xtremandLog.actionId === 2 || xtremandLog.actionId === 1) { this.campaignTimeValue = xtremandLog.startDuration; }
            if (xtremandLog.actionId === 8) { skipPause = true; }
            if ((xtremandLog.actionId === 8 && this.replyVideo === true) || (xtremandLog.actionId === 1 && this.pauseAction === true)
                || (xtremandLog.actionId === 2 && this.pauseAction === true)) {
                this.replyVideo = false;
            } else {
                const url = this.authenticationService.REST_URL + 'user/logVideoActionSms';
                return this.http.post(url, xtremandLog)
                    .map(this.extractData)
                    .catch(this.handleErrorLogAction);
            }
        } catch (error) {
            console.log('error comes here');
        }
    }
    logVideoViewsSms(alias: string,urlAlias:string) {
        const url = this.authenticationService.REST_URL + 'admin/video/increment_view_sms?alias=' + alias+ '&urlAlias='+ urlAlias;
        return this.http.post(url,'')
            .map(this.extractData)
            .catch(this.handleErrorLogAction);
    }
    showSmsCampaignVideo(smsLog: any) {
        try {
            const url = this.authenticationService.REST_URL + 'user/showSmsCampaignVideo';
            return this.http.post(url, smsLog)
                .map(this.extractData)
                .catch(this.handleErrorLogAction);
        } catch (error) { console.log(error); }
    }
    showCampaignSMS(alias: string) {
        const url = this.authenticationService.REST_URL;
        return this.http.get(url + 'smsShowCampaign/' + alias)
            .map(this.extractData)
            .catch(this.handleError);
    }
    showEventCampaignSMS(alias: string) {
        const url = this.authenticationService.REST_URL;
        return this.http.get(url + 'smsShowEventCampaign/' + alias)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    hasVideoAccess(userId : number){
        try {
            const url = this.URL  + userId +  '/has-video-access?access_token=' + this.authenticationService.access_token;
            return this.http.get(url)
                .map(this.extractData)
                .catch(this.handleError);
        } catch (error) { console.log(error); }
   }
    
    extractData(res: Response) {
        const body = res.json();
        return body || {};
    }
    handleErrorLogAction(error: any) {
        const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server   error';
        return Observable.throw(error);
    }
    handleError(error: any) {
        const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server   error';
        return Observable.throw(error);
    }
    handleErrorDelete(error: any) {
        const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server   error';
        const errorbody = error._body;
        if (errorbody.indexOf('mobinar is being used in one or more campaigns. Please delete those campaigns') >= 0) {
            return Observable.throw(errorbody);
        } else {
            return Observable.throw(error);
        }
    }
    
    updateVideoContent(videoFile: SaveVideoFile) {
    	let requestParam =  'userId=' + this.authenticationService.user.id + '&access_token=' + this.authenticationService.access_token;
        let url = this.authenticationService.REST_URL ;
        return this.http.post(url + "dam/update-video?" +requestParam, videoFile)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
      getVideoById(videoId: number, viewBy: string): Observable<SaveVideoFile> {
        this.viewBytemp = viewBy;
        const url = this.URL + 'video-by-id/' + videoId +"/" + this.authenticationService.user.id  +'?viewBy=' + viewBy + '&access_token=' + this.authenticationService.access_token;;
        return this.http.get(url, '')
            .map(this.extractData)
            .catch(this.handleError);
    }

  
    
}
