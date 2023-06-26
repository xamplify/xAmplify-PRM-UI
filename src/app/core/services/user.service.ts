import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../models/user';
import { DefaultVideoPlayer } from '../../videos/models/default-video-player';
import { AuthenticationService } from '../services/authentication.service';
import { HttpClient } from '@angular/common/http';
import { Pagination } from '../models/pagination';
import { RequestDemo } from '../../authentication/request-demo/request-demo';
import { GdprSetting } from '../../dashboard/models/gdpr-setting';
import { UtilService } from './util.service';
@Injectable()
export class UserService {
	
    private token: string;
    pagination: Pagination;

    loggedInUserData: User;

    URL = this.authenticationService.REST_URL;
    GDPR_SETTING_URL = this.authenticationService.REST_URL + "gdpr/setting/";
    CATEGORIES_URL = this.URL + 'category/';
    MODULE_URL = this.URL+ 'module/';
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    unreadNotificationsCount: number;
    TAG_URL = this.URL + 'tag/';
    ADMIN_URL = this.URL+'admin/';
    
    constructor(
        private http: Http,
        private authenticationService: AuthenticationService, public httpClient: HttpClient,private utilService:UtilService) {
    }

    getUsers(): Observable<User[]> {
        // get users from api
        return this.http.get('/api/users', this.authenticationService.getOptions())
            .map((response: Response) => response.json());
    }

    getVideoDefaultSettings() {
        if (this.authenticationService.user.roles.length > 1) {
            return this.http.get(this.URL + 'videos/video-default-settings?userId=' + this.authenticationService.user.id + '&access_token=' + this.authenticationService.access_token)
                .map(this.extractData)
                .catch(this.handleError);
        }
        else {
            console.log("user role ");
        }
    }
    updatePlayerSettings(defaultVideoSettings: DefaultVideoPlayer) {
        if (this.authenticationService.user.roles.length > 1) {
            return this.http.post(this.URL + 'videos/video-default-settings?userId=' + this.authenticationService.user.id + '&access_token=' + this.authenticationService.access_token
                , defaultVideoSettings)
                .map(this.extractData)
                .catch(this.handleError);
        }
        else {
            console.log("user role ");
        }
    }

    signUp(data: User) {
        return this.http.post(this.URL + "register/signup/user?companyProfileName=" + this.authenticationService.companyProfileName, data)
            .map(this.extractData)
            .catch(this.signUpHandleError);

    }

    sendPassword(emailId: string) {
        return this.http.get(this.URL + "register/forgotpassword?emailId=" + emailId + "&companyProfileName=" + this.authenticationService.companyProfileName)
            .map(this.extractData)
            .catch(this.handleError);

    }

    updatePassword(data: any) {
        return this.http.post(this.URL + "admin/updatePassword?access_token=" + this.authenticationService.access_token, data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    comparePassword(data: any) {
        return this.http.post(this.URL + "admin/comparePassword", data, this.authenticationService.getOptions())
            .map(this.extractData)
            .catch(this.handleError);
    }

    updateUserProfile(data: any, userId: number) {
        return this.http.post(this.URL + "admin/updateUser/" + userId + "?access_token=" + this.authenticationService.access_token, data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getUserByUserName(userName: string) {
        return this.http.post(this.URL + "admin/getUserByUserName?userName=" + userName + "&access_token=" + this.authenticationService.access_token, '')
            .map((res: Response) => { return res.json() })
            .catch((error: any) => { return error });
    }
    activateAccount(alias: string) {
        return this.http.get(this.URL + "register/verifyemail/user?alias=" + alias + "&companyProfileName=" + this.authenticationService.companyProfileName)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getUserDefaultPage(userId: number) {
        return this.http.get(this.URL + "admin/get-user-default-page?userId=" + userId + "&access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    setUserDefaultPage(userId: number, defaultPage: string) {
        return this.http.get(this.URL + "admin/set-user-default-page?userId=" + userId + "&defaultPage=" + defaultPage + "&access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    isGridView(userId: number) {
        return this.http.get(this.URL + "admin/get-user-gridview/" + userId + "?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    setGridView(userId: number, isGridView: boolean) {
        return this.http.get(this.URL + "admin/set-user-gridview/" + userId + "?isGridView=" + isGridView + "&access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getOrgAdminsCount(userId: number) {
        return this.http.get(this.URL + "admin/getOrgAdminCount/" + userId + "?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    disableOrgAdmin(userId: number) {
        return this.http.get(this.URL + "admin/disableAsOrgAdmin/" + userId + "?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    listNotifications(userId: number) {
        return this.http.get(this.URL + `notifications/${userId}?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getUnreadNotificationsCount(userId: number) {
        return this.http.get(this.URL + `notifications/unread-count/${userId}?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    markAllAsRead(userId: number) {
        return this.http.get(this.URL + `notifications/mark-all-as-read/${userId}?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    markAsRead(notification: any) {
        return this.http.post(this.URL + `notifications/mark-as-read?access_token=${this.authenticationService.access_token}`, notification)
            .map(this.extractData)
            .catch(this.handleError);
    }

    saveBrandLogo(logoPath: string, logoDesc: string, userId: number) {
        console.log("")
    }

    isAddedByVendor(userId: number) {
        return this.http.get(this.URL + "admin/get-team-member-details/" + userId + "?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

	

    getRoles(userId: number) {
        return this.http.get(this.URL + "admin/getRolesByUserId/" + userId + "?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getTeamMemberRoles(userId: number) {
        return this.http.get(this.URL + "admin/getTeamMemberRoles/" + userId + "?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getHomeRoles(uRl) {
        const url = this.URL + uRl;
        return this.http.get(url, '')
            .map(this.extractData)
            .catch(this.handleError);
    }

    getEventAccessTab(uRl) {
        const url = this.URL + uRl;
        return this.http.get(url, '')
            .map(this.extractData)
            .catch(this.handleError);
    }

    loadVendorDetails(uRl, pagination: Pagination) {
        const url = this.authenticationService.REST_URL + uRl;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);

    }

    resendActivationMail(emailId: string) {
        return this.http.get(this.URL + '/register/resend/activationemail?email=' + emailId)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getSingUpUserDatails(alias: string) {
        return this.http.get(this.URL + 'user/' + alias)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getUserByAlias(alias: string) {
        return this.http.get(this.URL + 'getUserByAlias/' + alias +"?companyProfileName=" + this.authenticationService.companyProfileName)
            .map(this.extractData)
            .catch(this.handleError);
    }
    saveForm(userId: number, form: any) {
        return this.http.post(this.authenticationService.REST_URL + "/users/" + userId + "/forms/save?access_token=" + this.authenticationService.access_token, form)
            .map(this.extractData)
            .catch(this.handleError);
    }
    updateForm(userId: number, form: any) {
        return this.http.post(this.authenticationService.REST_URL + "/users/" + userId + "/forms/update?access_token=" + this.authenticationService.access_token, form)
            .map(this.extractData)
            .catch(this.handleError);
    }
    listForm(userId: number) {
        return this.http.get(this.authenticationService.REST_URL + "/users/" + userId + "/forms/list?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }
    deleteQuestion(question: any) {
        return this.http.post(this.authenticationService.REST_URL + "users/question/remove?access_token=" + this.authenticationService.access_token, question)
            .map(this.extractData)
            .catch(this.handleError);
    }

    saveUserProfileLogo(file: any) {
        const formData = new FormData();
        formData.append('file', file, file.name);
        const url = this.URL + "admin/uploadProfilePicture/" + this.authenticationService.user.id + "?access_token=" + this.authenticationService.access_token
        return this.httpClient.post(url, formData)
            .catch(this.handleError);
    }
    saveDemoRequest(requestDemo: RequestDemo) {
        return this.http.post(this.URL + "save/requestDemo", requestDemo)
            .map(this.extractData)
            .catch(this.handleError);
    }

    accessAccount(data: any) {
        return this.http.post(this.URL + "accessAccount/updatePassword", data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    saveGdprSetting(gdprSetting: GdprSetting) {
        return this.http.post(this.GDPR_SETTING_URL + "save?access_token=" + this.authenticationService.access_token, gdprSetting)
            .map(this.extractData)
            .catch(this.handleServerError);
    }
    updateGdprSetting(gdprSetting: GdprSetting) {
        return this.http.post(this.GDPR_SETTING_URL + "update?access_token=" + this.authenticationService.access_token, gdprSetting)
            .map(this.extractData)
            .catch(this.handleServerError);
    }

    getGdprSettingByCompanyId(companyId: number) {
        return this.http.get(this.GDPR_SETTING_URL + "getByCompanyId/" + companyId + "?access_token=" + this.authenticationService.access_token, "")
            .map(this.extractData)
            .catch(this.handleServerError);
    }

    isGdprEnabled(userId: number) {
        return this.http.get(this.GDPR_SETTING_URL + "isGdprEnabled/" + userId + "?access_token=" + this.authenticationService.access_token, "")
            .map(this.extractData)
            .catch(this.handleServerError);
    }

    getCategories(pagination: Pagination) {
        /****XNFR-252*****/
        let companyProfileName = this.authenticationService.companyProfileName;
        let xamplifyLogin =  companyProfileName== undefined || companyProfileName.length==0; 
        if(xamplifyLogin){
            pagination.loginAsUserId = this.utilService.getLoggedInVendorAdminCompanyUserId();
        }
        /****XNFR-252*****/
        return this.http.post(this.CATEGORIES_URL + "listAll?access_token=" + this.authenticationService.access_token, pagination)
            .map(this.extractData)
            .catch(this.handleServerError);
    }

    saveOrUpdateCategory(category: any) {
        let domainName = this.authenticationService.getSubDomain();
        category['domainName'] = domainName;
        let url = this.CATEGORIES_URL + "save";
        if (category.id > 0) {
            url = this.CATEGORIES_URL + "update";
        }
        return this.http.post(url + "?access_token=" + this.authenticationService.access_token, category)
            .map(this.extractData)
            .catch(this.handleServerError);
    }

    listExistingCategoryNames(companyId: number) {
        return this.http.get(this.CATEGORIES_URL + "listAllCategoryNames/" + companyId + "?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getCategoryById(id: number) {
        return this.http.get(this.CATEGORIES_URL + "getById/" + id + "?access_token=" + this.authenticationService.access_token, "")
            .map(this.extractData)
            .catch(this.handleServerError);
    }

    deleteCategory(category:any){
        let userId = this.authenticationService.getUserId();
        let url =  this.CATEGORIES_URL+"deleteById/"+category.id+"/"+userId;
        if(category.isMoveAndDelete){
            url =  this.CATEGORIES_URL+"moveAndDeleteCategory/"+category.id+"/"+category.idToMoveItems+"/"+userId;
        }
        return this.http.get(url + "?access_token=" + this.authenticationService.access_token, "")
            .map(this.extractData)
            .catch(this.handleError);
    }

    getItemsCount(categoryId:number,loggedInUserId:number){
       let vanityUrlFilter = this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '';
       let input = {};
       input['loggedInUserId'] = loggedInUserId;
       input['categoryId'] = categoryId;
       input['vanityUrlFilter'] = vanityUrlFilter;
       input['vendorCompanyProfileName'] = this.authenticationService.companyProfileName;
        return this.http.post(this.CATEGORIES_URL+"getItemsCountDetailsByCategoryId?access_token=" + this.authenticationService.access_token,input)
        .map( this.extractData )
        .catch( this.handleError );
    }

    getDashboardType(){
       let vanityUrlFilter = this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '';
       let input = {};
       input['userId'] = this.authenticationService.getUserId();
       input['vanityUrlFilter'] = vanityUrlFilter;
       input['vendorCompanyProfileName'] = this.authenticationService.companyProfileName;
       return this.http.post(this.MODULE_URL+"getDashboardType?access_token=" + this.authenticationService.access_token,input)
        .map( this.extractData )
        .catch( this.handleError );
    }

    getModulesDisplayDefaultView( userId: number ) {
        return this.http.get( this.URL + "admin/getModulesDisplayDefaultView/" + userId + "?access_token=" + this.authenticationService.access_token )
            .map( this.extractData )
            .catch( this.handleError );
    }

    updateDefaultDisplayView( userId: number,type:string ) {
        return this.http.get( this.URL + "admin/updateDefaultDisplayView/" + userId + "/"+type+"?access_token=" + this.authenticationService.access_token )
            .map( this.extractData )
            .catch( this.handleError );
    }

    getAllPreferredLanguages(preferredLangFilePath:string) :Observable<any>{
        return this.http.get(preferredLangFilePath).map(this.extractData).catch(this.handleError);
    }

    listFormByCompanyId(companyId: number) {
        return this.http.get(this.authenticationService.REST_URL + "/users/company/" + companyId + "/forms/list?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getTags(pagination: Pagination) {
        return this.http.post(this.authenticationService.REST_URL + "tag/getTagsByCompanyId?access_token=" + this.authenticationService.access_token, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getTagsSearchTagName(pagination: Pagination) {
        return this.http.post(this.authenticationService.REST_URL + "tag/getTagsByCompanyId/tag-name-search?access_token=" + this.authenticationService.access_token, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    saveOrUpdateTag(tag: any) {
        let url = this.TAG_URL + "save";
        if (tag.id > 0) {
            url = this.TAG_URL + "update";
        }
        return this.http.post(url + "?access_token=" + this.authenticationService.access_token, tag)
            .map(this.extractData)
            .catch(this.handleServerError);
    }

    deleteTag(tag: any){
        return this.http.post(this.TAG_URL+"delete?access_token=" + this.authenticationService.access_token, tag)
            .map(this.extractData)
            .catch(this.handleError);
    }

    findAdminsAndTeamMembers(pagination:Pagination){
        return this.http.post(this.ADMIN_URL+"findAdminsAndTeamMembers?access_token=" + this.authenticationService.access_token, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private handleServerError(error: any) {
        return Observable.throw(error);
    }




    private extractData(res: Response) {
        const body = res.json();
        // return body || {};
        return body;
    }
    private signUpHandleError(error: any) {
        const body = error['_body'];
        if (body !== "") {
            const response = JSON.parse(body);
            return Observable.throw(response);
        }
    }
    private handleError(error: any) {
        const body = error['_body'];
        if (body !== "") {
            var response = JSON.parse(body);
            if (response.message != undefined) {
                return Observable.throw(response.message);
            } else {
                return Observable.throw(response.error);
            }

        } else {
            let errMsg = (error.message) ? error.message :
                error.status ? `${error.status} - ${error.statusText}` : 'Server   error';
            return Observable.throw(error);
        }

    }
    saveExcludedUsers(excludedUsers: User[], loggedInUserId : number) {
        return this.http.post(this.URL + "exclude/save-users/"+ loggedInUserId +"?access_token=" + this.authenticationService.access_token, excludedUsers)
           .map(this.extractData)
           .catch(this.handleError);
   }
    
    listExcludedUsers(loggedInUserId : number, excludeUserPagination:Pagination) {
        return this.http.post(this.URL + "exclude/list-users/"+ loggedInUserId +"?access_token=" + this.authenticationService.access_token, excludeUserPagination)
           .map(this.extractData)
           .catch(this.handleError);
   }
    
    deleteExcludedUser(loggedInUserId : number, excludedUserId : number){
    	return this.http.get(this.URL + "exclude/delete-user/"+ excludedUserId+"/"+loggedInUserId +"?access_token=" + this.authenticationService.access_token)
        .map(this.extractData)
        .catch(this.handleError);
    	
    }
    
    saveExcludedDomains(domainNames: string[], loggedInUserId : number){
    	 return this.http.post(this.URL + "exclude/save-domains/"+loggedInUserId +"?access_token=" + this.authenticationService.access_token, domainNames)
         .map(this.extractData)
         .catch(this.handleError);
    	
    }
    
    listExcludedDomains(loggedInUserId : number, excludeDomainPagination:Pagination) {
        return this.http.post(this.URL + "exclude/list-domains/"+ loggedInUserId +"?access_token=" + this.authenticationService.access_token, excludeDomainPagination)
           .map(this.extractData)
           .catch(this.handleError);
   }
    
    deleteExcludedDomain(loggedInUserId : number, domain : string){
        return this.http.get(this.URL + "exclude/delete-domain/"+ domain+"/"+loggedInUserId +"?access_token=" + this.authenticationService.access_token)
        .map(this.extractData)
        .catch(this.handleError);
        
    }
    
    getFirstNameLastNameAndEmailIdByUserId(userId: number) {
        return this.http.get(this.URL + "getFirstNameLastNameAndEmailIdByUserId/"+userId+"?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    /****XNFR-224*****/
    isLoginAsPartnerOptionEnabledForVendor(companyProfileName:string) {
        let userId = this.authenticationService.getUserId();
        return this.http.get(this.MODULE_URL + "isLoginAsPartnerOptionEnabledForVendor/" + companyProfileName + "/"+userId+"?access_token=" + this.authenticationService.access_token)
        .map(this.extractData)
        .catch(this.handleServerError);
        
    }

    /****XNFR-224*****/
    updateLoginAsPartnerOptionEnabledForVendor(companyProfileName: string, loginAsPartnerOptionEnabledForVendor: boolean) {
        let userId = this.authenticationService.getUserId();
		return this.http.get(this.MODULE_URL + "updateLoginAsPartnerOptionEnabledForVendor/" + companyProfileName +"/"+userId+ "/"+loginAsPartnerOptionEnabledForVendor+"?access_token=" + this.authenticationService.access_token)
        .map(this.extractData)
        .catch(this.handleServerError);
	}

    /**** user-guides ***** */
     showUserGuide(tagName: string) {
        return this.http.get(this.authenticationService.REST_URL + 'user/guide/get/' + tagName + '?access_token=' + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

}
