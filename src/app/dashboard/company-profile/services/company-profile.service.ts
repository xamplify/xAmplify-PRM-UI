import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import{CompanyProfile} from '../models/company-profile';
import { AuthenticationService } from '../../../core/services/authentication.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable()
export class CompanyProfileService {


    URL = this.authenticationService.REST_URL+"admin/";
    constructor( private authenticationService: AuthenticationService, private http: Http ) { }


    getByUserId( userId: number ) {
        return this.http.get(this.URL+"company-profile/get/"+userId+"?access_token="+this.authenticationService.access_token,"")
        .map(this.extractData)
        .catch(this.handleError);
   }
    
    
    save(companyProfile:CompanyProfile,userId:number){
        return this.http.post(this.URL+"company-profile/save/"+userId+"?access_token="+this.authenticationService.access_token,companyProfile)
        .map(this.extractData)
        .catch(this.handleError);
    }
    
    update(companyProfile:CompanyProfile,userId:number){
        return this.http.post(this.URL+"company-profile/update/"+userId+"?access_token="+this.authenticationService.access_token,companyProfile)
        .map(this.extractData)
        .catch(this.handleError);
    }
    
    
    getAllCompanyNames(){
        return this.http.post(this.URL+"company-profile/company-names?access_token="+this.authenticationService.access_token,"")
        .map(this.extractData)
        .catch(this.handleError);
    }
    
    getAllCompanyProfileNames(){
        return this.http.post(this.URL+"company-profile/company-profile-names?access_token="+this.authenticationService.access_token,"")
        .map(this.extractData)
        .catch(this.handleError);
    }

    private extractData( res: Response ) {
        let body = res.json();
        return body || {};
    }

    private handleError( error: any ) {
        return Observable.throw( error );
    }
}
