import { Injectable } from '@angular/core';
import { Http,Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Pagination } from '../../core/models/pagination';
import { LandingPage } from '../models/landing-page';


@Injectable()
export class LandingPageService {


    URL = this.authenticationService.REST_URL + "landing-page/";
  constructor(private http: Http, private authenticationService: AuthenticationService, private logger: XtremandLogger ) { }
  
  list( pagination: Pagination ): Observable<any> {
      return this.http.post( this.URL + "list?access_token=" + this.authenticationService.access_token, pagination )
          .map( this.extractData )
          .catch( this.handleError );
  }
  
  getById( id: number ): Observable<any> {
      return this.http.get( this.URL + "getById/"+id+"?access_token=" + this.authenticationService.access_token,"")
          .map( this.extractData )
          .catch( this.handleError );
  }
  

  private extractData( res: Response ) {
      const body = res.json();
      return body || {};
  }


  private handleError( error: any ) {
      return Observable.throw( error );
  }

}
