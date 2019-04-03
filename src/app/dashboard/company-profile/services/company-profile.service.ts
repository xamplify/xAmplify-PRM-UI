import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { CompanyProfile } from '../models/company-profile';
import { AuthenticationService } from '../../../core/services/authentication.service';

@Injectable()
export class CompanyProfileService {

    URL = this.authenticationService.REST_URL+"admin/";
    constructor( private authenticationService: AuthenticationService, private http: Http, public httpClient:HttpClient ) { }

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

    saveCompanyProfileLogo(file:any){
      const formData = new FormData();
      formData.append('file', file, file.name);
      return this.httpClient.post(this.URL+"company-profile/upload-logo?userId="+this.authenticationService.user.id+"&access_token="+this.authenticationService.access_token,formData)
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
