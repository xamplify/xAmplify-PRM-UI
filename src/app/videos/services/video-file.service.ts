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
    public xtremandLog: XtremandLog;
    public viewBytemp: string;
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
            const url = this.authenticationService.REST_URL + 'register/callAction/user?access_token=' + 
            this.authenticationService.access_token;
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
            return this.http.get(url,"")
                .map(this.extractData)
                .catch(this.handleErrorLogAction);
        } catch (error) {
	           // this.refService.showError(error, "saveCalltoActionUser","VideoFileService ts file")
        }
    }
    logVideoActions(xtremandlog: XtremandLog) {
        try {
            const url = this.authenticationService.REST_URL + 'user/logVideoAction';
            return this.http.post(url, xtremandlog)
                .map(this.extractData)
                .catch(this.handleError);
        } catch (error) {
	           // this.refService.showError(error, "saveCalltoActionUser","VideoFileService ts file")
        }
    }
    getJSONLocation(): Observable<any> {
      const locationurl = 'https://pro.ip-api.com/json/?key=7bvBGuqMHI5QTtq';
        return this.http.get(locationurl,"")
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
            var response =  JSON.parse(error['_body']);
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