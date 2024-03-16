import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { CompanyProfile } from '../models/company-profile';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { CampaignAccess } from '../../../campaigns/models/campaign-access';
import { CustomLoginScreen } from 'app/vanity-url/models/custom-login-screen';
import { CompanyLoginTemplateActive } from 'app/email-template/models/company-login-template-active';


@Injectable()
export class CompanyProfileService {

    URL = this.authenticationService.REST_URL + "admin/";
    constructor(private authenticationService: AuthenticationService, private http: Http, public httpClient: HttpClient) { }

    getByUserId(userId: number) {
        return this.http.get(this.URL + "company-profile/get/" + userId + "?access_token=" + this.authenticationService.access_token, "")
            .map(this.extractData)
            .catch(this.handleError);
    }

    save(companyProfile: CompanyProfile, userId: number) {
        return this.http.post(this.URL + "company-profile/save/" + userId + "?access_token=" + this.authenticationService.access_token, companyProfile)
            .map(this.extractData)
            .catch(this.handleError);
    }

    update(companyProfile: CompanyProfile, userId: number) {
        return this.http.post(this.URL + "company-profile/update/" + userId + "?access_token=" + this.authenticationService.access_token, companyProfile)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getAllCompanyNames() {
        return this.http.post(this.URL + "company-profile/company-names?access_token=" + this.authenticationService.access_token, "")
            .map(this.extractData)
            .catch(this.handleError);
    }

    getAllCompanyProfileNames() {
        return this.http.post(this.URL + "company-profile/company-profile-names?access_token=" + this.authenticationService.access_token, "")
            .map(this.extractData)
            .catch(this.handleError);
    }

    saveCompanyProfileLogo(file: any) {
        const formData = new FormData();
        formData.append('file', file, file.name);
        return this.httpClient.post(this.URL + "company-profile/upload-logo?userId=" + this.authenticationService.user.id + "&access_token=" + this.authenticationService.access_token, formData)
            .catch(this.handleError);
    }
    /***Uploading File Along With JSON**** */
    saveCompanyProfileByAdmin(file: any, companyProfile: CompanyProfile) {
        const formData = new FormData();
        formData.append('file', file, file.name);
        formData.append('accountDto', new Blob([JSON.stringify(companyProfile)],
            {
                type: "application/json"
            }));
        return this.httpClient.post(this.authenticationService.REST_URL + "superadmin/saveUserAndCompanyProfile?access_token=" + this.authenticationService.access_token, formData)
            .catch(this.handleError);

    }

    getByEmailId(emailId: string) {
        let data = {};
        data['emailId'] = emailId;
        return this.http.post(this.URL + "getByEmailId?access_token=" + this.authenticationService.access_token, data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    upgradeToVendorRole(campaignAccess: CampaignAccess) {
        return this.http.post(this.URL + "upgradeToVendor?access_token=" + this.authenticationService.access_token, campaignAccess)
            .map(this.extractData)
            .catch(this.handleError);
    }

    createNewVendorRole(companyProfile: CompanyProfile) {
        return this.http.post(this.authenticationService.REST_URL + "superadmin/account/create?access_token=" + this.authenticationService.access_token, companyProfile)
            .map(this.extractData)
            .catch(this.handleError);
    }

    uploadFavIconFile(event: any) {
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            let file: File = fileList[0];
            let formData: FormData = new FormData();
            formData.append('favIconFile', file, file.name);
            let headers = new Headers();
            //headers.append('Accept', 'multipart/form-data');
            let options = new RequestOptions({ headers: headers });
            const url = this.URL + "company-profile/saveFavIcon/" + this.authenticationService.getUserId() + "?access_token=" + this.authenticationService.access_token;
            return this.http.post(url, formData, options)
                .map(this.extractData)
                .catch(this.handleError);
        }
    }

    uploadBgImageFile(file: any) {
        //let fileList: FileList = event.target.files;
        //if (fileList.length > 0) {
        // let file: File = event;
        let formData: FormData = new FormData();
        formData.append('bgImageFile', file, file.name);
        let headers = new Headers();
        //headers.append('Accept', 'multipart/form-data');
        let options = new RequestOptions({ headers: headers });
        const url = this.URL + "company-profile/saveBgImage/" + this.authenticationService.getUserId() + "?access_token=" + this.authenticationService.access_token;
        return this.http.post(url, formData, options)
            .map(this.extractData)
            .catch(this.handleError);
        //   }
    }
    /*** XNFR-233 */
    updateCustomLogInScreenData(customLoginScreen: CustomLoginScreen){
        return this.http.post(this.URL + "company-profile/customLogIn/"+ this.authenticationService.getUserId()+ "?access_token=" + this.authenticationService.access_token, customLoginScreen)
        .map(this.extractData)
        .catch(this.handleError);
    }
    saveOrUpdateTemplateForCompany(companyLoginTemplateActive: CompanyLoginTemplateActive){
        return this.http.post(this.URL + "company-profile/activateLoginTemplate?access_token=" + this.authenticationService.access_token, companyLoginTemplateActive)
        .map(this.extractData)
        .catch(this.handleError);
    }
    // getLogInScreenDetails(){
    //     return this.http.get(this.URL + "company-profile/customLogInScreenDetails/" + this.authenticationService.getUserId() + "?access_token=" + this.authenticationService.access_token, "")
    //         .map(this.extractData)
    //         .catch(this.handleError);
    // }
    /** XNFR-233 */
    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    private handleError(error: any) {
        return Observable.throw(error);
    }
    

       getPartnerDetails() {
         return this.http.get(this.authenticationService.REST_URL + "userlists/partner-details/" + this.authenticationService.getUserId() + "?access_token=" + this.authenticationService.access_token, "")
            .map(this.extractData)
            .catch(this.handleError);
    }
    
      validatePartnerCompany(companyProfile: CompanyProfile, partnerCompanyId: number) {
        return this.http.post(this.URL + "validatePartnerCompany" + "/" + this.authenticationService.getUserId() + "?access_token=" + this.authenticationService.access_token, companyProfile)
            .map(this.extractData)
            .catch(this.handleError);

    }
}
