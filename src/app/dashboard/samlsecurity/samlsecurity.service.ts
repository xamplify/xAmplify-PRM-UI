import { Injectable } from "@angular/core";
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { AuthenticationService } from "app/core/services/authentication.service";
import { Observable } from "rxjs/Observable";
import { SamlSecurity } from "../models/samlsecurity";

@Injectable()
export class SamlSecurityService {

    constructor(private http: Http, private authenticationService: AuthenticationService) { }

    getSamlDetailsByUserName(userName:string){
        const url = this.authenticationService.REST_URL + "saml/sso/getUserSaml?userName=" + userName + "&access_token=" + this.authenticationService.access_token;
        return this.http.get(url).map(this.extractData).catch(this.handleError);
    }

    saveSamlSecurity(samlSecurity: any): Observable<SamlSecurity> {
        const url = this.authenticationService.REST_URL + "saml/save?access_token=" + this.authenticationService.access_token;
        return this.http.post(url, samlSecurity)
            .map(this.extractData)
            .catch(this.handleError);
    }

    updateSamlSecurity() {
        const url = this.authenticationService.REST_URL;
    }

    getAllSamlSecurity() {
        const url = this.authenticationService.REST_URL;
        return this.http.get(url).map(this.extractData).catch(this.handleError);
    }

    uploadMetadataFile(event: any, sId: any):Observable<SamlSecurity> {
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            let file: File = fileList[0];
            let formData: FormData = new FormData();
            formData.append('sId', sId);
            formData.append('file', file, file.name);
            let headers = new Headers();
            headers.append('Accept', 'application/json');
            let options = new RequestOptions({ headers: headers });
            const url = this.authenticationService.REST_URL + "saml/update?access_token=" + this.authenticationService.access_token;
            return this.http.post(url, formData, options)
                .map(this.extractData)
                .catch(this.handleError);                
        }
    }

    login(companyProfileName: any) {
        const url = this.authenticationService.REST_URL+ `/saml/sso/login/${companyProfileName}`;
        return this.http.get(url).map(this.extractData).catch(this.handleError);
    }

    extractData(res: Response) {
        let body = res.json();
        console.log(body);
        return body || {};
    }

    handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server   error';
        return Observable.throw(error);
    }

    /** XNFR-534, XNFR-579 **/
    saveSaml2Security(samlSecurity: any): Observable<SamlSecurity> {
        const url = this.authenticationService.REST_URL + "saml2/sso/save?access_token=" + this.authenticationService.access_token;
        return this.http.post(url, samlSecurity)
            .map(this.extractData)
            .catch(this.handleError);
    }

    uploadSaml2MetadataFile(event: any, sId: any, loggedInUserId: any, emailAttributeName: string, idpName : string):Observable<SamlSecurity> {
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            let file: File = fileList[0];
            let formData: FormData = new FormData();
            formData.append('sId', sId);
            formData.append('file', file, file.name);
            let headers = new Headers();
            headers.append('Accept', 'application/json');
            let options = new RequestOptions({ headers: headers });
            const url = this.authenticationService.REST_URL + "saml2/sso/update?loggedInUserId=" + loggedInUserId + "&emailAttributeName=" + emailAttributeName + "&identityProviderName="+ idpName + "&access_token=" + this.authenticationService.access_token;
            return this.http.post(url, formData, options)
                .map(this.extractData)
                .catch(this.handleError);                
        }
    }
}