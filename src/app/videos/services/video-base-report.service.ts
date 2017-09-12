import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { AuthenticationService } from '../../core/services/authentication.service';

@Injectable()
export class VideoBaseReportService {
  myvalues: any;
  countryData = [["in", 1], ["us", 2],["au", 3], ["br",1],["cl",92]];
  public URL: string = this.authenticationService.REST_URL + 'admin/';
  constructor(public http: Http, public authenticationService: AuthenticationService) { }
    getSparklineData() {
       this.myvalues = [2, 11, 12, 13, 18, 13, 10, 4, 1, 11, 11, 12, 11, 4, 10, 12, 11, 8];
    }
   getCampaignVideoCountriesAndViews(alias: any) {
       //  this.countryData = [["in", 1], ["us", 2],["au", 3], ["br",1],["cl",92]];
      const url =  this.URL + 'videos/monthwise_countrywise_views/' + alias + '?access_token='
      + this.authenticationService.access_token;
            return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
   }
  getWatchedFullyData(alias: any) {
      const url =  this.URL + 'videos/watchedfully_minuteswatched_views/' + alias + '?access_token='
      + this.authenticationService.access_token;
            return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
   }
   extractData(res: Response) {
        const body = res.json();
        console.log(body);
        return body || {};
    }
    handleError(error: any) {
        const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server   error';
            return Observable.throw(error);
    }
}
