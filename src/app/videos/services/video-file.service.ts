import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { Observable } from 'rxjs/Observable';
import { SaveVideoFile } from '../models/save-video-file';
import { Category } from '../models/category';
import { Pagination } from '../../core/models/pagination';
import { XtremandLog } from '../models/xtremand-log';
import { User } from '../../core/models/user';

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
    URL: string = this.authenticationService.REST_URL + 'videos/';
    constructor(private http: Http, private authenticationService: AuthenticationService,
        private refService: ReferenceService, public httpClient: HttpClient) {
        console.log('VideoFileService constructor');
    }
    processVideoFile(responsePath: any): Observable<any> {
        console.log('response path in service ' + responsePath);
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
    saveOwnThumbnailFile(file: any) {
        const formData: FormData = new FormData();
        formData.append('file', file);
        const headers = new Headers();
        headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json');
        console.log(formData);
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
        console.log(pagination);
        let url: any
        if (this.authenticationService.isOnlyPartner()) {
            url = this.URL + 'channel-videos/' + this.categoryNumber + '?userId=' + this.authenticationService.user.id + '&access_token=' + this.authenticationService.access_token;
        } else {
            if (this.videoType === 'myVideos') {
                url = this.URL + this.categoryNumber + '?userId=' + this.authenticationService.user.id + '&access_token=' + this.authenticationService.access_token;
            } else if (this.videoType === 'partnerVideos') {
                url = this.URL + 'channel-videos/' + this.categoryNumber + '?userId=' + this.authenticationService.user.id + '&access_token=' + this.authenticationService.access_token;
            }
            else { console.log('load videos not called'); }
        }
        console.log(url);
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }
    loadVideoForViewsReport(pagination: Pagination): Observable<SaveVideoFile[]> {
        console.log(pagination);
        const constURL = this.authenticationService.REST_URL + 'admin/';
        const url = constURL + 'video_report/' + this.viewsCategoryNumber +
            '?userId=' + this.authenticationService.user.id + '&access_token=' + this.authenticationService.access_token;
        console.log(url);
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
        console.log(alias);
        const url = this.URL + 'video-by-alias/' + alias + '?viewBy=' + viewBy;
        return this.http.get(url, '')
            .map(this.extractData)
            .catch(this.handleError);
    }
    getVideoByShortenerUrlAlias(shortnerUrlAlias: string): Observable<SaveVideoFile> {
        console.log(shortnerUrlAlias);
        const url = this.URL + 'video-by-shortenerurlalias?shortenUrlAlias=' + shortnerUrlAlias;
        return this.http.get(url, '')
            .map(this.extractData)
            .catch(this.handleError);
    }
    getShortnerUrlAlias(viewBy: string, alias: string) {
        return this.http.get(this.authenticationService.REST_URL + 'videos/shortener-url-alias?viewBy=' + viewBy
            + "&videoAlias=" + alias + "&userId=" + this.authenticationService.user.id, '')
            .map(this.extractData)
            .catch(this.handleError);
    }
    shareMetaTags(shareShortUrl: string) {
        return this.http.get(shareShortUrl)
            .map(this.extractData)
            .catch(this.handleError);

    }
    deleteVideoFile(alias: string): Observable<SaveVideoFile> {
        console.log('deleted video alias is ' + alias);
        const url = this.URL + 'video-status-change/' + alias + '?status=DELETE&access_token=' + this.authenticationService.access_token;
        console.log('delete url is ' + url);
        return this.http.get(url, '')
            .map(this.extractData)
            .catch(this.handleErrorDelete);
    }
    saveCalltoActionUser(user: User) {
        console.log(user);
        try {
            const url = this.URL + 'user/save-call-action-user';
            return this.httpClient.post(url, user).catch(this.handleError);
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
        xtremandLog.userId = 0;
        console.log(this.timeValue);
        try {
            if (xtremandLog.actionId === 8) { xtremandLog.startDuration = this.seekbarTime; }
            if (xtremandLog.actionId === 2 || xtremandLog.actionId === 1) { this.campaignTimeValue = xtremandLog.startDuration; }
            console.log(this.campaignTimeValue);
            if ((xtremandLog.actionId === 8 && this.replyVideo === true) || (xtremandLog.actionId === 1 && this.pause360Action === true)
                || (xtremandLog.actionId === 2 && this.pause360Action === true)) {
                console.log('skipped api calling for video log');
                this.replyVideo = false;
            } else {
                //    if(xtremandLog.actionId === 8 ) { this.isSliderClicked = true;}
                console.log(xtremandLog);
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
            console.log(this.campaignTimeValue);
            if ((xtremandLog.actionId === 8 && this.replyVideo === true) || (xtremandLog.actionId === 1 && this.pauseAction === true)
                || (xtremandLog.actionId === 2 && this.pauseAction === true)) {
                console.log('service called replyed and ended the video');
                this.replyVideo = false;
            } else {
                console.log(xtremandLog);
                const url = this.authenticationService.REST_URL + 'user/logVideoAction';
                return this.http.post(url, xtremandLog)
                    .map(this.extractData)
                    .catch(this.handleErrorLogAction);
            }
        } catch (error) {
            console.log('error comes here');
        }
    }
    logVideoViews(alias: string) {
        const url = this.authenticationService.REST_URL + 'admin/video/increment_view?alias=' + alias;
        return this.http.post(url, '')
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
        console.log(pagination);
        const url = this.URL + categoryId +
            '?userId=' + this.authenticationService.user.id + '&access_token=' + this.authenticationService.access_token;
        console.log(url);
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
    extractData(res: Response) {
        const body = res.json();
        console.log(body);
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
}