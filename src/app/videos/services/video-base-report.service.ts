import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class VideoBaseReportService {

  constructor() { }


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
