import { Injectable ,OnInit} from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import {SaveVideoFile} from '../models/save-video-file';
import { AuthenticationService } from '../../core/services/authentication.service';
import {Observable} from 'rxjs';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {Category} from '../models/Category';
import {Pagination} from '../../core/models/pagination';
import {User} from '../../core/models/user';

@Injectable()
export class VideoFileService {

    public actionValue: string;
    public saveVideoFile: SaveVideoFile;
    public categories: Category[];
    public showSave: boolean;
    public showUpadte: boolean;
    public pagination: Pagination;
    public URL: string = this.authenticationService.REST_URL + 'admin/';

    public body:any = null;
    constructor(private http: Http, private authenticationService: AuthenticationService) {
        console.log("VideoFileService constructor");
    }
   
    processVideoFile(responsePath: any): Observable<any> {
        console.log("response path in service " + responsePath);
        let url = this.URL + 'process_video?path='+responsePath + '&access_token=' + this.authenticationService.access_token;
        let option:any ={} ;
        return this.http.post(url,"")
        .map( this.extractData )
        .catch( this.handleError );
    }

    saveRecordedVideo(formData:any){
          var url = this.URL +'saveRecordedVideo?access_token='+this.authenticationService.access_token;
          return this.http.post(url,formData)
          .map( this.extractData )
          .catch( this.handleError );
      }
    
    saveVideo(saveVideoFile: SaveVideoFile) {
        var url = this.URL + 'save?access_token=' + this.authenticationService.access_token;
        return this.http.post(url, saveVideoFile)
        .map( this.extractData )
        .catch( this.handleError );
    }

   loadVideoFiles(pagination:Pagination): Observable<SaveVideoFile[]> {
        if(pagination.filterBy==null)
           pagination.filterBy=0;
        pagination.maxResults = 12;
        console.log(pagination)
        var url = this.URL + 'listVideosNew/'+pagination.filterBy+'?access_token=' + this.authenticationService.access_token;
        console.log(url);
        return this.http.post(url,pagination,"")
        .map( this.extractData )
        .catch( this.handleError );
    } 

    getVideo(alias: string): Observable<SaveVideoFile> {
        console.log(alias);
        var url = this.URL + 'getMobinar?alias=' + alias + '&access_token=' + this.authenticationService.access_token;
       // var url = this.URL + 'getMobinar?alias='+alias;
        return this.http.get(url)
        .map( this.extractData )
        .catch( this.handleError );
    }

    deleteVideoFile(alias: string): Observable<SaveVideoFile> {
        console.log("deleted video alias is " + alias);
        let url = this.URL + 'videoStatusChange/' + alias + '?status=DELETE&' + this.authenticationService.access_token;
        console.log("delete url is " + url)
        return this.http.post(url , "")
        .map( this.extractData )
        .catch( this.handleError );
    }
    
    searchVideos(searchKey:string){
          console.log("search videos " +searchKey);
          let url = this.URL+'searchVideos?searchKey='+searchKey+'&access_token='+this.authenticationService.access_token;
          console.log("url is  " + url);
          return this.http.get(url)
          .map( this.extractData )
          .catch( this.handleError );
    }
    saveCalltoActionUser(user:User){
         console.log(user);
         let url = this.authenticationService.REST_URL+'register/callAction/user?access_token='+this.authenticationService.access_token;
         return this.http.post(url,user)
         .map( this.extractData )
         .catch( this.handleError );
    }
    
    extractData( res: Response ) {
       let body = res.json();
       console.log(body);
       return body || {};
    }

    handleError( error: any ) {
       let errMsg = ( error.message ) ? error.message :
           error.status ? `${error.status} - ${error.statusText}` : 'Server   error';
       return Observable.throw( errMsg );
    }

}