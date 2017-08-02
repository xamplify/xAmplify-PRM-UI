import { Injectable, OnInit} from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService} from '../../core/services/reference.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { SaveVideoFile } from '../models/save-video-file';
import { Category } from '../models/category';
import { Pagination } from '../../core/models/pagination';
import { XtremandLog } from '../models/xtremand-log';
import { ActionLog } from '../models/action';
import { User } from '../../core/models/user';
declare var swal: any;

@Injectable()
export class VideoFileService {
    public actionValue: string;
    public saveVideoFile: SaveVideoFile;
    public categories: Category[];
    public showSave: boolean;
    public showUpadte: boolean;
    public pagination: Pagination;
    public actionLog: ActionLog;
    public Xtremandlog: XtremandLog;
    public viewBytemp: string;
    public logEnded: number;
    public videoViewBy: string;
    public replyVideo = false;
    public timeValue: any;
    public campaignTimeValue: any;
    public pauseAction: boolean;
    public pause360Action: boolean;
    public URL: string = this.authenticationService.REST_URL + 'admin/';
    constructor(private http: Http, private authenticationService: AuthenticationService, private refService: ReferenceService) {
        console.log('VideoFileService constructor');
    }
    processVideoFile(responsePath: any): Observable<any> {
        console.log('response path in service ' + responsePath);
        const url = this.URL + 'process_video?path=' + responsePath + '&userId=' +
        this.authenticationService.user.id + '&access_token=' + this.authenticationService.access_token;
        return this.http.post(url, '')
            .map(this.extractData)
            .catch(this.handleError);
    }
    saveRecordedVideo(formData: any) {
        const url = this.URL + 'saveRecordedVideo?access_token=' + this.authenticationService.access_token;
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
        const url = this.URL + 'uploadOwnThumbnail?access_token=' + this.authenticationService.access_token +
         '&userId=' + this.authenticationService.user.id;
        return this.http.post(url , formData  )
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
        if (pagination.filterBy == null) { pagination.filterBy = 0; }
        console.log(pagination);
        const url = this.URL + 'listVideosNew/' + pagination.filterBy +
            '?userId=' + this.authenticationService.user.id + '&access_token=' + this.authenticationService.access_token;
        console.log(url);
        return this.http.post(url, pagination, '')
            .map(this.extractData)
            .catch(this.handleError);
    }
    loadVideoForViewsReport(pagination: Pagination): Observable<SaveVideoFile[]> {
        if (pagination.filterBy == null) { pagination.filterBy = 0; }
        console.log(pagination);
        const url = this.URL + 'video_report/' + pagination.filterBy +
            '?userId=' + this.authenticationService.user.id + '&access_token=' + this.authenticationService.access_token;
        console.log(url);
        return this.http.post(url, pagination, '')
            .map(this.extractData)
            .catch(this.handleError);
    }
    loadVideosCount() {
        // this.logger.info( "Service class loadContactCount() completed" );
       const url =  this.URL + 'videos_count?' + 'userId=' + this.authenticationService.user.id + '&access_token='
       + this.authenticationService.access_token;
        return this.http.get(url)
            .map( this.extractData )
            .catch( this.handleError );
    }
    getVideo(alias: string, viewBy: string): Observable<SaveVideoFile> {
        this.viewBytemp = viewBy;
        console.log(alias);
        const url = this.URL + 'getMobinar?alias=' + alias + '&viewBy=' + viewBy;
        // var url = this.URL + 'getMobinar?alias='+alias;
        return this.http.get(url, '')
            .map(this.extractData)
            .catch(this.handleError);
    }
    deleteVideoFile(alias: string): Observable<SaveVideoFile> {
        console.log('deleted video alias is ' + alias);
        const url = this.URL + 'videoStatusChange/' + alias + '?status=DELETE&access_token=' + this.authenticationService.access_token;
        console.log('delete url is ' + url);
        return this.http.get(url, '')
            .map(this.extractData)
            .catch(this.handleErrorDelete);
    }
    searchVideos(searchKey: string) {
        console.log('search videos ' + searchKey);
        const url = this.URL + 'searchVideos?searchKey=' + searchKey + '&access_token=' + this.authenticationService.access_token;
        console.log('url is  ' + url);
        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }
    saveCalltoActionUser(user: User) {
        console.log(user);
        try {
            const url = this.authenticationService.REST_URL + 'user/log_embedvideo_action';
            return this.http.post(url, user)
                .map(this.extractData)
                .catch(this.handleError);
        } catch (error) {
	           // this.refService.showError(error, "saveCalltoActionUser","VideoFileService ts file")
        }
    }
    showCampaignVideo(typeValue: string, videoAlias: string, campaignAlias: string, userAlias: string) {
       try {
            const url = this.authenticationService.REST_URL + 'user/showCampaignVideo?type=' + typeValue + '&videoAlias=' +
            videoAlias + '&campaignAlias=' + campaignAlias + '&userAlias=' + userAlias;
            return this.http.get(url, '')
                .map(this.extractData)
                .catch(this.handleErrorLogAction);
        } catch (error) {
	           // this.refService.showError(error, "saveCalltoActionUser","VideoFileService ts file")
        }
    }
    logEmbedVideoActions(actionLog: ActionLog) {
       console.log(this.timeValue);
       try {
        if (actionLog.actionId === 2 || actionLog.actionId === 1) { this.campaignTimeValue = actionLog.startDuration; }
        console.log(this.campaignTimeValue);
        if ((actionLog.actionId === 8 && this.replyVideo === true) || (actionLog.actionId === 1 && this.pause360Action === true)
         || (actionLog.actionId === 2 && this.pause360Action === true)) {
           console.log('service called replyed and ended the video');
           this.replyVideo = false;
         } else {
           console.log(actionLog);
           const url = this.authenticationService.REST_URL + 'user/log_embedvideo_action';
           return this.http.post(url, actionLog)
              .map(this.extractData)
              .catch(this.handleErrorLogAction);
        }
      } catch(err) {
          console.log(err);
      }
    }
     logCampaignVideoActions(xtremandLog: XtremandLog) {
       try {
        if (xtremandLog.actionId === 2 || xtremandLog.actionId === 1) { this.campaignTimeValue = xtremandLog.startDuration; }
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
         const url = this.authenticationService.REST_URL + 'admin/video/increment_view?alias='+alias;
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
    extractData(res: Response) {
        const body = res.json();
        console.log(body);
        return body || {};
    }
    handleErrorLogAction( error: any ) {
        const errMsg = ( error.message ) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server   error';
        return Observable.throw( errMsg );
     }
    handleError(error: any) {
    /*    const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server   error';
        return Observable.throw(errMsg); */
        if (error.status === 500) {
            const response =  JSON.parse(error['_body']);
            return Observable.throw(new Error(response.message));
        } else if (error.status === 400) {
            return Observable.throw(new Error(error.status));
        } else if (error.status === 409) {
            return Observable.throw(new Error(error.status));
        } else if (error.status === 406) {
            return Observable.throw(new Error(error.status));
        }
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