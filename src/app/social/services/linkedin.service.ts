import { Injectable } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Observable } from 'rxjs/Observable';
import { SocialConnection } from '../models/social-connection';
import { Http, Response } from '@angular/http';

@Injectable()
export class LinkedinService {
    URL = this.authService.REST_URL + 'linkedin/';
    
    constructor(private http: Http,private authService: AuthenticationService) { 
    }

  public getTotalCountOfConnectionsAndFollowers(socialConnection: SocialConnection) {
    return this.http.get(this.URL + 'total-count' + '?access_token=' + this.authService.access_token +"&profileId="+ socialConnection.profileId + 
                            "&userId=" + socialConnection.userId)
        .map(this.extractData)
        .catch(this.handleError);
}

  private extractData(res: Response) {
      const body = res.json();
      console.log(body);
      return body || {};
    }

  private handleError(error: any) {
      const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server   error';
      return Observable.throw(errMsg);
    }

}
