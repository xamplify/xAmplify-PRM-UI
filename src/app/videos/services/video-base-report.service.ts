import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class VideoBaseReportService {
  myvalues: any;
  countryData = [["in", 1], ["us", 2],["au", 3], ["br",1],["cl",92]];
  constructor() { }
    getSparklineData() {
       this.myvalues = [2, 11, 12, 13, 18, 13, 10, 4, 1, 11, 11, 12, 11, 4, 10, 12, 11, 8];
    }
   getCampaignVideoCountries() {
         this.countryData = [["in", 1], ["us", 2],["au", 3], ["br",1],["cl",92]];
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
