import { Injectable , OnInit} from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import {SaveVideoFile} from '../models/save-video-file';
import { AuthenticationService } from '../../core/services/authentication.service';
import {ReferenceService} from '../../core/services/reference.service';
import {Observable} from 'rxjs';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {Category} from '../models/Category';
import {Pagination} from '../../core/models/pagination';
import {User} from '../../core/models/user';

declare var swal: any;
@Injectable()
export class VideoFileService {

    public actionValue: string;
    public saveVideoFile: SaveVideoFile;
    public categories: Category[];
    public showSave: boolean;
    public showUpadte: boolean;
    public pagination: Pagination;
    public viewBytemp :string;
    public URL: string = this.authenticationService.REST_URL + 'admin/';
    constructor(private http: Http, private authenticationService: AuthenticationService, private refService: ReferenceService) {
        console.log('VideoFileService constructor');
    }
     processVideoFile(responsePath: any): Observable<any> {
        console.log('response path in service ' + responsePath);
        const url = this.URL + 'process_video?path=' + responsePath + '&access_token=' + this.authenticationService.access_token;
        return this.http.post(url, '')
        .map( this.extractData )
        .catch( this.handleError );
    }

    saveRecordedVideo(formData: any) {
          const url = this.URL + 'saveRecordedVideo?access_token=' + this.authenticationService.access_token;
          return this.http.post(url, formData)
          .map( this.extractData )
          .catch( this.handleError );
      }
    
   saveVideo(saveVideoFile: SaveVideoFile) {
    
	   if(this.viewBytemp=="DRAFT"){
		  saveVideoFile.action = "save";
	   }
	   const url = this.URL + 'save?access_token=' + this.authenticationService.access_token;
        return this.http.post(url, saveVideoFile)
        .map( this.extractData )
        .catch( this.handleError );
    }

   loadVideoFiles(pagination: Pagination): Observable<SaveVideoFile[]> {
        if (pagination.filterBy == null) { pagination.filterBy = 0; }
        pagination.maxResults = 12;
        console.log(pagination);
        const url = this.URL + 'listVideosNew/' + pagination.filterBy + '?access_token=' + this.authenticationService.access_token;
        console.log(url);
        return this.http.post(url, pagination, '')
        .map( this.extractData )
        .catch( this.handleError );
    }
   getVideo(alias: string, viewBy:string): Observable<SaveVideoFile> {
        this.viewBytemp = viewBy;
	    console.log(alias);
        const url = this.URL + 'getMobinar?alias=' + alias + '&access_token=' + this.authenticationService.access_token+'&viewBy='+viewBy;
       // var url = this.URL + 'getMobinar?alias='+alias;
        return this.http.get(url,'')
        .map( this.extractData )
        .catch( this.handleError );
    }

    deleteVideoFile(alias: string): Observable<SaveVideoFile> {
   
        console.log('deleted video alias is ' + alias);
        const url = this.URL + 'videoStatusChange/' + alias + '?status=DELETE&access_token=' + this.authenticationService.access_token;
        console.log('delete url is ' + url);
        return this.http.get(url , '')
        .map( this.extractData )
        .catch( this.handleErrorDelete);
    }
    searchVideos(searchKey: string) {
          console.log('search videos ' + searchKey);
          const url = this.URL + 'searchVideos?searchKey=' + searchKey + '&access_token=' + this.authenticationService.access_token;
          console.log('url is  ' + url);
          return this.http.get(url)
          .map( this.extractData )
          .catch( this.handleError );
    }
    saveCalltoActionUser(user: User) {
     console.log(user);
    try{
     const url = this.authenticationService.REST_URL + 'register/callAction/user?access_token=' + this.authenticationService.access_token;
         return this.http.post(url, user)
         .map( this.extractData )
         .catch( this.handleError );
       }catch(error){
	           // this.refService.showError(error, "saveCalltoActionUser","VideoFileService ts file")
	        }

    }
    extractData( res: Response ) {
       const body = res.json();
       console.log(body);
       return body || {};
    }

    handleError( error: any ) {
        const errMsg = ( error.message ) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server   error';
        return Observable.throw( errMsg );
     }
    handleErrorDelete( error: any ) {
       const errMsg = ( error.message ) ? error.message :
           error.status ? `${error.status} - ${error.statusText}` : 'Server   error';
      const errorbody = error._body;
      if ( errorbody.indexOf('mobinar is being used in one or more campaigns. Please delete those campaigns') >= 0) {
         return Observable.throw( errorbody );
        }
      else {
      return Observable.throw( error );
       }
    }
}