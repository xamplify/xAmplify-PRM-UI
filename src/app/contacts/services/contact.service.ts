import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ContactList } from '../models/contact-list';
import { SocialContact } from '../models/social-contact';
import { ZohoContact } from '../models/zoho-contact';
import { SalesforceContact } from '../models/salesforce-contact';
import { SalesforceListViewContact } from '../models/salesforce-list-view-contact';
import { User } from '../../core/models/user';
import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Pagination } from '../../core/models/pagination';
import { EditUser } from '../models/edit-user';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { UserUserListWrapper } from '../models/user-userlist-wrapper';
import { UserListPaginationWrapper } from '../models/userlist-pagination-wrapper';
import { UtilService } from 'app/core/services/util.service';

@Injectable()
export class ContactService {

    saveAsSuccessMessage: string;
    saveAsErrorMessage: any;
    successMessage: boolean;
    deleteUserSucessMessage: boolean;
    addUserSuccessMessage: boolean = false;
    socialContact: SocialContact[];
    zohoContact: ZohoContact;
    salesforceContact: SalesforceContact;
    salesforceListViewContact: SalesforceListViewContact;
    isContactModalPopup = false;
    socialProviderName = "";
    vanitySocialProviderName: string;
    pagination: Pagination;
    allPartners: User[];
    partnerListName: string;
    socialCallbackName: string;
    isLoadingList: boolean;
    publicList: boolean;
    assignedToPartner: boolean;
    contactType: string
    isEmptyFormList: boolean = false;


    url = this.authenticationService.REST_URL + "admin/";
    companyUrl = this.authenticationService.REST_URL + "companies/"
    contactsUrl = this.authenticationService.REST_URL + "userlists/";
    googleContactsUrl = this.authenticationService.REST_URL + 'googleOauth/';
    zohoContactsUrl = this.authenticationService.REST_URL + 'authenticateZoho';
    salesforceContactUrl = this.authenticationService.REST_URL + 'salesforce';
    hubSpotContactUrl = this.authenticationService.REST_URL + 'hubSpot';
    oauthCallbackMessage: string = "";
    isUnsubscribeContactModalPopup: boolean = false;
    isresubscribeContactModalPopup: boolean = false;

    constructor(private router: Router, private authenticationService: AuthenticationService, private _http: Http, private logger: XtremandLogger, private utilService: UtilService) {
    }



    loadUsersOfContactList(contactListId: number, pagination: Pagination) {
        let userId = this.authenticationService.user.id;
        userId = this.authenticationService.checkLoggedInUserId(userId);
        return this._http.post(this.contactsUrl + contactListId + "/contacts?access_token=" + this.authenticationService.access_token + "&userId=" + userId, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    loadPreviewCampaignUsersOfContactList(contactListId: number, campaignId: number, pagination: Pagination) {
        return this._http.post(this.contactsUrl + campaignId + "/" + contactListId + "/contacts?access_token=" + this.authenticationService.access_token, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    defaultPartnerList(userId: number) {
        return this._http.get(this.url + `default-partner-list/${userId}?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    listContactsOfDefaultPartnerList(userId: number, pagination: Pagination) {
        return this._http.post(this.url + `partners/${userId}?access_token=${this.authenticationService.access_token}`, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    loadContactLists(pagination: Pagination): Observable<ContactList[]> {
        let userId = this.authenticationService.user.id;
        userId = this.authenticationService.checkLoggedInUserId(userId);
        this.logger.info("Service class loadContact() completed");
        /****XNFR-252*****/
        let companyProfileName = this.authenticationService.companyProfileName;
        let xamplifyLogin = companyProfileName == undefined || companyProfileName.length == 0;
        if (xamplifyLogin) {
            pagination.loginAsUserId = this.utilService.getLoggedInVendorAdminCompanyUserId();
        }
        /****XNFR-252*****/

        /***XNFR-252****/
        return this._http.post(this.contactsUrl + '?userId=' + userId + "&access_token=" + this.authenticationService.access_token, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    findContactsAndPartnersForCampaign(pagination: Pagination) {
        let userId = this.authenticationService.user.id;
        userId = this.authenticationService.checkLoggedInUserId(userId);
        pagination.userId = userId;
        return this._http.post(this.contactsUrl + "findContactAndPartnerLists?access_token=" + this.authenticationService.access_token, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    loadAssignedLeadsLists(pagination: Pagination): Observable<ContactList[]> {
        let userId = this.authenticationService.user.id;
        userId = this.authenticationService.checkLoggedInUserId(userId);
        return this._http.post(this.contactsUrl + 'assign-leads-lists/' + userId + "?access_token=" + this.authenticationService.access_token, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    loadCampaignContactsList(pagination: Pagination): Observable<ContactList[]> {
        return this._http.post(this.contactsUrl + "campaign-user-lists" + "?access_token=" + this.authenticationService.access_token, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    unlinkSocailAccount(socialNetwork: string, isDeleteContactList: boolean): Observable<ContactList[]> {
        this.logger.info("unlinkSocailAccount() method invoked");
        return this._http.get(this.authenticationService.REST_URL + "unlink-account?" + "access_token=" + this.authenticationService.access_token + '&userId=' + this.authenticationService.getUserId() + '&socialNetwork=' + socialNetwork + '&deleteContactList=' + isDeleteContactList)
            .map(this.extractData)
            .catch(this.handleErrorDelete);
    }

    loadContactListsNames(): Observable<ContactList[]> {
        let userId = this.authenticationService.user.id;
        userId = this.authenticationService.checkLoggedInUserId(userId);
        this.logger.info("Service class loadContactsNames() completed");
        return this._http.get(this.contactsUrl + "names?" + 'userId=' + userId + "&access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    listContactsByType(userListPaginationWrapper: UserListPaginationWrapper) {
        let userId = this.authenticationService.user.id;
        userId = this.authenticationService.checkLoggedInUserId(userId);
        /****XNFR-252*****/
        let companyProfileName = this.authenticationService.companyProfileName;
        let xamplifyLogin = companyProfileName == undefined || companyProfileName.length == 0;
        if (xamplifyLogin) {
            userListPaginationWrapper.pagination.loginAsUserId = this.utilService.getLoggedInVendorAdminCompanyUserId();
            userListPaginationWrapper.pagination.vanityUrlFilter = userListPaginationWrapper.pagination.loginAsUserId > 0;
        }
        /****XNFR-252****/
        var requestoptions = new RequestOptions({
            body: userListPaginationWrapper
        })
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var options = {
            headers: headers
        };

        return this._http.post(this.contactsUrl + "/" + userId + "/all-contacts/?access_token=" + this.authenticationService.access_token, options, requestoptions)
            .map((response: any) => response.json())
            .catch(this.handleError);
    }

    loadContactsCount(contactListObject: ContactList) {
        let userId = this.authenticationService.user.id;
        userId = this.authenticationService.checkLoggedInUserId(userId);
        /****XNFR-252*****/
        let companyProfileName = this.authenticationService.companyProfileName;
        let xamplifyLogin = companyProfileName == undefined || companyProfileName.length == 0;
        if (xamplifyLogin) {
            contactListObject.loginAsUserId = this.utilService.getLoggedInVendorAdminCompanyUserId();
            if (contactListObject.loginAsUserId > 0) {
                contactListObject.vanityUrlFilter = true;
            }
        }
        /****XNFR-252****/


        this.logger.info("Service class loadContactCount() completed");
        return this._http.post(this.contactsUrl + "contacts_count/" + userId + "?access_token=" + this.authenticationService.access_token, contactListObject)
            .map(this.extractData)
            .catch(this.handleError);
    }

    listOfSelectedContactListByType(contactListId: number, contactType: string, pagination: Pagination) {
        this.logger.info("ContactService listContactsByType():  contactType=" + contactType);
        return this._http.post(this.contactsUrl + contactListId + "/contacts?contactType=" + contactType + "&access_token=" + this.authenticationService.access_token
            + '&userId=' + this.authenticationService.getUserId(), pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    contactListAssociatedCampaigns(contactListId: number, pagination: Pagination) {
        this.logger.info("ContactService ContactListAssociatedCampaigns():  contactListID=" + contactListId);
        return this._http.post(this.authenticationService.REST_URL + "campaign/launched-campaigns/" + contactListId + "?access_token=" + this.authenticationService.access_token, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    listOrgAdmins() {
        this.logger.info("ContactService LoadListOrgAdmins()");
        return this._http.get(this.url + "listOrgAdminEmailIdsForOrganization/" + this.authenticationService.getUserId() + "?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    sendCampaignEmails(campaigDetails: any) {
        var requestoptions = new RequestOptions({
            body: campaigDetails,
        })
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var options = {
            headers: headers
        };
        var url = this.authenticationService.REST_URL + "campaign/share-existing-campaigns?access_token=" + this.authenticationService.access_token + '&userId=' + this.authenticationService.getUserId();
        this.logger.info(campaigDetails);
        return this._http.post(url, options, requestoptions)
            .map(this.extractData)
            .catch(this.handleError);
    }

    deleteContactList(contactListId: number) {
        return this._http.post(this.contactsUrl + contactListId + "/remove?access_token=" + this.authenticationService.access_token + '&userId=' + this.authenticationService.getUserId(), +"")
            .map(this.extractData)
            .catch(this.handleErrorDelete);
    }

    deleteContactListFromSuperAdminScreen(contactListId: number,userId:any) {
        return this._http.post(this.contactsUrl + contactListId + "/remove?access_token=" + this.authenticationService.access_token + '&userId=' + userId, +"")
            .map(this.extractData)
            .catch(this.handleErrorDelete);
    }

    saveContactList(userUserListWrapper: UserUserListWrapper): Observable<any> {
        var requestoptions = new RequestOptions({
            body: userUserListWrapper,
        })
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var options = {
            headers: headers
        };
        //var url = this.contactsUrl + "save-userlist?" + 'userId='+ this.authenticationService.getUserId() + "&access_token=" + this.authenticationService.access_token + "&userListName="+ contactListName + "&isPartnerUserList="+isPartner ;
        var url = this.contactsUrl + "save-userlist/" + this.authenticationService.getUserId() + "?access_token=" + this.authenticationService.access_token;
        this.logger.info(userUserListWrapper);
        return this._http.post(url, options, requestoptions)
            .map((response: any) => response.json())
            .catch(this.handleError);
    }

    saveAssignedLeadsList(userUserListWrapper: UserUserListWrapper): Observable<any> {
        var requestoptions = new RequestOptions({
            body: userUserListWrapper
        })
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var options = {
            headers: headers
        };
        var url = this.contactsUrl + "save-assign-leads-list/" + this.authenticationService.getUserId() + "?access_token=" + this.authenticationService.access_token;

        return this._http.post(url, options, requestoptions)
            .map((response: any) => response.json())
            .catch(this.handleError);
    }

    saveAsSharedLeadsList(contactListObject: ContactList): Observable<any> {
        var requestoptions = new RequestOptions({
            body: contactListObject
        })
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var options = {
            headers: headers
        };

        var url = this.contactsUrl + "/save-as-share-leads/" + this.authenticationService.getUserId() + "?access_token=" + this.authenticationService.access_token;

        return this._http.post(url, options, requestoptions)
            .map((response: any) => response.json())
            .catch(this.handleError);
    }

    updateContactList(userUserListWrapper: UserUserListWrapper): Observable<any> {
        var requestoptions = new RequestOptions({
            body: userUserListWrapper,
        })
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var options = {
            headers: headers
        };
        var url = this.contactsUrl + "/update?" + 'userId=' + this.authenticationService.getUserId() + "&companyProfileName=" + this.authenticationService.companyProfileName + "&access_token=" + this.authenticationService.access_token;
        return this._http.post(url, options, requestoptions)
            .map(this.extractData)
            .catch(this.handleError);
    }

    updateContactListUser(contactListId: number, editUser: EditUser): Observable<any> {
        var requestoptions = new RequestOptions({
            body: editUser,
        })
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var options = {
            headers: headers
        };
        var newUrl = this.contactsUrl + contactListId + '/edit?userId=' + this.authenticationService.getUserId() + "&access_token=" + this.authenticationService.access_token;
        return this._http.post(newUrl, options, requestoptions)
            .map((response: any) => response.json())
            .catch(this.handleError);
    }

    updateContactListName(updatingObject: any): Observable<any> {
        var newUrl = this.contactsUrl + this.authenticationService.getUserId() + '/rename?access_token=' + this.authenticationService.access_token;
        this.logger.info(newUrl);
        return this._http.post(newUrl, updatingObject)
            .map((response: any) => response.json())
            .catch(this.handleError);
    }

    removeContactListUsers(contactListId: number, removeUserIds: Array<number>): Observable<Object> {
        this.logger.info(contactListId + "--" + removeUserIds);
        var newUrl = this.contactsUrl + contactListId + "/removeUsers?" + 'userId=' + this.authenticationService.getUserId() + "&access_token=" + this.authenticationService.access_token;
        return this._http.post(newUrl, removeUserIds)
            .map((response: any) => response.json())
            .catch(this.handleErrorDeleteUsers);
    }

    removeInvalidContactListUsers(removeUserIds: Array<number>, assignLeads: boolean): Observable<Object> {
        this.logger.info(removeUserIds);
        var newUrl = this.contactsUrl + this.authenticationService.getUserId() + "/" + assignLeads + "/removeInvalidUsers?access_token=" + this.authenticationService.access_token;
        return this._http.post(newUrl, removeUserIds)
            .map((response: any) => response.json());
    }


    validateUndelivarableEmailsAddress(validateUserIds: Array<number>, assignLeads: boolean): Observable<any> {
        this.logger.info(validateUserIds);
        var newUrl = this.contactsUrl + assignLeads + "/makeContactsValid?access_token=" + this.authenticationService.access_token + "&userId=" + this.authenticationService.getUserId();
        return this._http.post(newUrl, validateUserIds)
            .map((response: any) => response.json());
    }

    getValidUsersCount(selectedListIds: Array<number>): Observable<Object> {
        this.logger.info(selectedListIds);
        var newUrl = this.contactsUrl + "valid-contacts-count?access_token=" + this.authenticationService.access_token + "&userId=" + this.authenticationService.getUserId();
        return this._http.post(newUrl, selectedListIds)
            .map((response: any) => response.json());
    }

    findAllAndValidUserCounts(selectedListIds: Array<number>): Observable<Object> {
        var newUrl = this.contactsUrl + "findAllAndValidUsersCount/" + this.authenticationService.getUserId() + "?access_token=" + this.authenticationService.access_token;
        return this._http.post(newUrl, selectedListIds)
            .map((response: any) => response.json());
    }


    downloadContactList(pagination: Pagination): Observable<Response> {
        this.logger.info(pagination);
        return this._http.post(this.contactsUrl + "/download?access_token=" + this.authenticationService.access_token, pagination)
            .map((response: any) => response);
    }

    hasAccess(isPartner: boolean): Observable<any> {
        this.logger.info(isPartner);
        return this._http.get(this.contactsUrl + this.authenticationService.getUserId() + "/" + isPartner + "/has-access?access_token=" + this.authenticationService.access_token)
            .map((response: any) => response);
    }

    socialContactImages() {
        this.logger.info(this.authenticationService.REST_URL + "checkauthentication?access_token=" + this.authenticationService.access_token + "&userId=" + this.authenticationService.getUserId());
        return this._http.get(this.authenticationService.REST_URL + "checkauthentication?access_token=" + this.authenticationService.access_token + "&userId=" + this.authenticationService.getUserId())
            .map(this.extractData)
            .catch(this.handleError);
    }

    googleLogin(currentModule: any) {
        this.logger.info(this.googleContactsUrl + "authorizeLogin?access_token=" + this.authenticationService.access_token);
        return this._http.post(this.googleContactsUrl + "authorizeLogin?access_token=" + this.authenticationService.access_token + "&userId=" + this.authenticationService.getUserId() + "&module=" + currentModule, "")
            .map(this.extractData)
            .catch(this.handleError);
    }

    googleVanityLogin(currentModule: any) {
        this.logger.info(this.googleContactsUrl + "authorizeLogin?access_token=" + this.authenticationService.access_token);
        return this._http.post(this.googleContactsUrl + "authorizeLogin?userId=" + localStorage.getItem('vanityUserId') + "&module=" + currentModule, "")
            .map(this.extractData)
            .catch(this.handleError);
    }

    getGoogleContacts(socialContact: SocialContact) {
        this.logger.info("get google contacts :" + socialContact);
        //this.successMessage = true;
        var requestoptions = new RequestOptions({
            body: socialContact,
        })
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var options = {
            headers: headers
        };
        var url = this.authenticationService.REST_URL + "getContacts?&access_token=" + this.authenticationService.access_token + "&userId=" + this.authenticationService.getUserId();
        this.logger.info("testURlpost" + url, options, requestoptions);
        this.logger.info("contactService getGoogleContacts():" + this.authenticationService.REST_URL + "getContacts?&access_token=" + this.authenticationService.access_token);
        return this._http.post(url, socialContact)
            .map(this.extractData)
            .catch(this.handleError);
    }

    saveSocialContactList(socialContact: SocialContact): Observable<any> {
        this.successMessage = true;
        var requestoptions = new RequestOptions({
            body: socialContact,
        })
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var options = {
            headers: headers
        };
        var url = this.authenticationService.REST_URL + "saveContacts?access_token=" + this.authenticationService.access_token + "&userId=" + this.authenticationService.getUserId();
        return this._http.post(url, options, requestoptions)
            .map(this.extractData)
            .catch(this.handleError);
    }

    contactListSynchronization(contactListId: number, socialContact: SocialContact): Observable<Response> {
        var requestoptions = new RequestOptions({
            body: socialContact,
        })
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var options = {
            headers: headers
        };
        var url = this.authenticationService.REST_URL + "synchronizeContacts/" + contactListId + "?&access_token=" + this.authenticationService.access_token + "&userId=" + this.authenticationService.getUserId();

        return this._http.post(url, options, requestoptions)
            .map(this.extractData)
            .catch(this.handleError);
    }

    checkingZohoAuthentication(module: string) {
        return this._http.get(this.authenticationService.REST_URL + "zohoOauth/authorizeLogin?access_token=" + this.authenticationService.access_token + "&userId=" + this.authenticationService.getUserId() + "&module=" + module)
            .map(this.extractData)
            .catch(this.handleError);
    }

    checkingZohoVanityAuthentication(module: string) {
        return this._http.get(this.authenticationService.REST_URL + "zohoOauth/authorizeLogin?userId=" + localStorage.getItem('vanityUserId') + "&module=" + module)
            .map(this.extractData)
            .catch(this.handleError);
    }

    vanityConfigHubSpot() {
        return this._http.get(this.authenticationService.REST_URL + 'hubspot/' + localStorage.getItem('vanityUserId') + "/authorize")
            .map(this.extractData)
            .catch(this.handleError);
    }

    vanityConfigSalesForce() {
        return this._http.get(this.authenticationService.REST_URL + 'isalesforce/' + localStorage.getItem('vanityUserId') + "/authorize")
            .map(this.extractData)
            .catch(this.handleError);
    }

    vanityConfigMicrosoft() {
        return this._http.get(this.authenticationService.REST_URL + 'microsoft/' + localStorage.getItem('vanityUserId') + "/authorize")
            .map(this.extractData)
            .catch(this.handleError);
    }



    checkingZohoSyncAuthentication() {
        return this._http.get(this.authenticationService.REST_URL + "zohoOauth/checkSyncAuthorizeLogin?access_token=" + this.authenticationService.access_token + "&userId=" + this.authenticationService.getUserId())
            .map(this.extractData)
            .catch(this.handleError);
    }

    getZohoContacts(username: string, password: string, contactType: string) {
        this.zohoContact = { "userName": username, "password": password, "contactType": contactType };
        var requestoptions = new RequestOptions({
            body: this.zohoContact,
        })
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var options = {
            headers: headers
        };
        var url = this.zohoContactsUrl + "?userId=" + this.authenticationService.getUserId() + "&access_token=" + this.authenticationService.access_token;
        return this._http.post(url, this.zohoContact)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getZohoAutherizedContacts(socialContact: SocialContact) {
        this.logger.info("get zoho contacts :" + socialContact);
        //this.successMessage = true;
        var requestoptions = new RequestOptions({
            body: socialContact,
        })
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var options = {
            headers: headers
        };
        var url = this.authenticationService.REST_URL + "getContacts?&access_token=" + this.authenticationService.access_token + "&userId=" + this.authenticationService.getUserId();
        this.logger.info("contactService getzohoAuthorizedContacts():" + this.authenticationService.REST_URL + "getContacts?&access_token=" + this.authenticationService.access_token);
        return this._http.post(url, socialContact)
            .map(this.extractData)
            .catch(this.handleError);
    }


    getZohoAutherizedLeads(socialContact: SocialContact) {
        this.logger.info("get zoho leads :" + socialContact);
        //this.successMessage = true;
        var requestoptions = new RequestOptions({
            body: socialContact,
        })
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var options = {
            headers: headers
        };
        var url = this.authenticationService.REST_URL + "getZohoLeads?&access_token=" + this.authenticationService.access_token + "&userId=" + this.authenticationService.getUserId();
        this.logger.info("contactService getzohoAuthorizedLeads():" + this.authenticationService.REST_URL + "getLeads?&access_token=" + this.authenticationService.access_token);
        return this._http.post(url, socialContact)
            .map(this.extractData)
            .catch(this.handleError);
    }

    salesforceLogin(currentModule: any) {
        this.logger.info(this.salesforceContactUrl + "/authorizeLogin?access_token=" + this.authenticationService.access_token + "&userId=" + this.authenticationService.getUserId());
        return this._http.get(this.salesforceContactUrl + "/authorizeLogin?access_token=" + this.authenticationService.access_token + "&userId=" + this.authenticationService.getUserId() + "&module=" + currentModule)
            .map(this.extractData)
            .catch(this.handleError);
    }

    salesforceVanityLogin(currentModule: any) {
        this.logger.info(this.salesforceContactUrl + "/authorizeLogin?&userId=" + localStorage.getItem('vanityUserId'));
        return this._http.get(this.salesforceContactUrl + "/authorizeLogin?userId=" + localStorage.getItem('vanityUserId') + "&module=" + currentModule)
            .map(this.extractData)
            .catch(this.handleError);

    }


    hubSpotLogin(currentModule: any) {
        this.logger.info(this.hubSpotContactUrl + "/authorizeLogin?access_token=" + this.authenticationService.access_token + "&userId=" + this.authenticationService.getUserId());
        return this._http.get(this.hubSpotContactUrl + "/authorizeLogin?access_token=" + this.authenticationService.access_token + "&userId=" + this.authenticationService.getUserId() + "&module=" + currentModule)
            .map(this.extractData)
            .catch(this.handleError);
    }

    socialContactsCallback(queryParam: any): Observable<any> {
        /*let queryParam: string;
        this.activatedRoute.queryParams.subscribe(
            ( param: any ) => {
                let code = param['code'];
                let denied = param['denied'];
                queryParam = "?code=" + code;
            });*/
        let loggedInThroughVanityUrl = localStorage.getItem('vanityUrlFilter');
        if (loggedInThroughVanityUrl == 'true') {
            this.logger.info(this.authenticationService.REST_URL + this.socialCallbackName + "/callback" + queryParam + "&userAlias=" + localStorage.getItem('vanityUserAlias') + "&module=" + localStorage.getItem('vanityCurrentModule'));
            return this._http.get(this.authenticationService.REST_URL + this.socialCallbackName + "/callback" + queryParam + "&userAlias=" + localStorage.getItem('vanityUserAlias') + "&module=" + localStorage.getItem('vanityCurrentModule'))
                .map(this.extractData)
                .catch(this.handleError);
        }
        else {
            this.logger.info(this.authenticationService.REST_URL + this.socialCallbackName + "/callback" + queryParam + "&userAlias=" + localStorage.getItem('userAlias') + "&module=" + localStorage.getItem('currentModule'));
            return this._http.get(this.authenticationService.REST_URL + this.socialCallbackName + "/callback" + queryParam + "&userAlias=" + localStorage.getItem('userAlias') + "&module=" + localStorage.getItem('currentModule'))
                .map(this.extractData)
                .catch(this.handleError);
        }

    }

    /*salesforceCallback(): Observable<String> {
        let queryParam: string;
        this.activatedRoute.queryParams.subscribe(
            ( param: any ) => {
                let code = param['code'];
                let denied = param['denied'];
                queryParam = "?code=" + code;
            });
        return this._http.get( this.authenticationService.REST_URL + "salesforceOauth/callback" + queryParam + "&access_token=" + this.authenticationService.access_token + "&userAlias=" + localStorage.getItem( 'userAlias' ) + "&isPartner=" + localStorage.getItem( 'isPartner' ) )
            .map( this.extractData )
            .catch( this.handleError );
    }*/

    getSalesforceContacts(socialNetwork: string, contactType: string) {
        // this.successMessage = true;
        this.salesforceContact = { "socialNetwork": socialNetwork, "contactType": contactType };
        var requestoptions = new RequestOptions({
            body: this.salesforceContact,
        })
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var options = {
            headers: headers
        };
        var url = this.authenticationService.REST_URL + "getContacts?access_token=" + this.authenticationService.access_token + "&userId=" + this.authenticationService.getUserId();
        this.logger.info("contactService salesforceContacts():" + this.authenticationService.REST_URL + "getContacts?&access_token=" + this.authenticationService.access_token);
        return this._http.post(url, this.salesforceContact)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getSalesforceListViewContacts(socialNetwork: string, contactType: string, listviewId: string, listviewName: string) {
        // this.successMessage = true;
        this.salesforceListViewContact = { "socialNetwork": socialNetwork, "contactType": contactType, "alias": listviewId, "contactName": listviewName };
        var requestoptions = new RequestOptions({
            body: this.salesforceListViewContact,
        })
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var options = {
            headers: headers
        };
        var url = this.authenticationService.REST_URL + "getContacts?access_token=" + this.authenticationService.access_token + "&userId=" + this.authenticationService.getUserId();
        this.logger.info("contactService salesforceContacts():" + this.authenticationService.REST_URL + "getContacts?&access_token=" + this.authenticationService.access_token);
        return this._http.post(url, this.salesforceListViewContact)
            .map(this.extractData)
            .catch(this.handleError);
    }

    mailSend(pagination: Pagination) {
        return this._http.post(this.contactsUrl + "send-partner-mail?access_token=" + this.authenticationService.access_token, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    forceProcessList(contactListId: number) {
        this.logger.info(this.contactsUrl + "/process-userlist?access_token=" + this.authenticationService.access_token);
        return this._http.get(this.contactsUrl + contactListId + "/process-userlist?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    activateUnsubscribedUser(selectedUserId: number) {
        return this._http.post(this.contactsUrl + "resubscribeUser/" + selectedUserId + "?userId=" + this.authenticationService.getUserId() + "&access_token=" + this.authenticationService.access_token, "")
            .map(this.extractData)
            .catch(this.handleError);
    }

    loadAllContacts(userId: number, pagination: Pagination) {
        return this._http.post(this.contactsUrl + "?userId=" + userId + "&access_token=" + this.authenticationService.access_token, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }


    /**MARKETO */

    saveMarketoContactList(socialContact: SocialContact): Observable<any> {
        this.successMessage = true;
        var requestoptions = new RequestOptions({
            body: socialContact,
        })
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var options = {
            headers: headers
        };
        var url = this.authenticationService.REST_URL + "/marketo/" + this.authenticationService.getUserId() + "/saveContactList?access_token=" + this.authenticationService.access_token;
        return this._http.post(url, options, requestoptions)
            .map(this.extractData)
            .catch(this.handleError);
    }
    checkMarketoCredentials(userId: number) {
        return this._http.get(this.authenticationService.REST_URL + `/marketo/${userId}/checkCredentials?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }
    saveMarketoCredentials(formData: any) {
        return this._http.post(this.authenticationService.REST_URL + `/marketo/credentials?access_token=${this.authenticationService.access_token}`, formData)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getMarketoContacts(userId: number) {
        return this._http.get(this.authenticationService.REST_URL + `/marketo/${userId}/contacts?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }


    extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server   error';
        return Observable.throw(error);
    }

    handleErrorDelete(error: any) {
        const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server   error';
        const errorbody = error._body;
        if (errorbody.indexOf('Please Launch or Delete those campaigns first') >= 0) {
            return Observable.throw(errorbody);
        }
        else {
            return Observable.throw(error);
        }
    }
    handleErrorDeleteUsers(error: any) {
        const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server   error';
        const errorbody = error._body;
        if (errorbody.indexOf('Please Launch or Delete those campaigns first') >= 0) {
            return Observable.throw(errorbody);
        }
        else {
            return Observable.throw(error);
        }
    }

    listLegalBasisData(companyId: number) {
        return this._http.get(this.authenticationService.REST_URL + `/gdpr/setting/legal_basis/${companyId}?access_token=${this.authenticationService.access_token}`, "")
            .map(this.extractData)
            .catch(this.handleError);
    }

    getSfFormFields() {
        return this._http.get(this.authenticationService.REST_URL + "/salesforce/formfields/" + this.authenticationService.getUserId() + "?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    displaySfForm(dealId: number) {
        return this._http.get(this.authenticationService.REST_URL + "/salesforce/ui/formfields/" + this.authenticationService.getUserId() + "/" + dealId + "?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getSfForm(companyId: number, dealId: number) {
        return this._http.get(this.authenticationService.REST_URL + "/salesforce/ui/form/" + companyId + "/" + dealId + "?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    validatePartners(partnerListId: number, partners: any) {
        return this._http.post(this.contactsUrl + "validatePartners/" + partnerListId + "?access_token=" + this.authenticationService.access_token, partners)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getContactsLimit(partners: any, loggedInUserId: number) {
        return this._http.post(this.contactsUrl + "getContactsLimit/" + loggedInUserId + "?access_token=" + this.authenticationService.access_token, partners)
            .map(this.extractData)
            .catch(this.handleError);
    }


    getPartnerEmails() {
        this.logger.info(this.contactsUrl + "partner-emails/" + this.authenticationService.getUserId() + "?access_token=" + this.authenticationService.access_token);
        return this._http.get(this.contactsUrl + "partner-emails/" + this.authenticationService.getUserId() + "?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getPartners(pagination: Pagination) {
        this.logger.info(this.contactsUrl + "list-partners/" + this.authenticationService.getUserId() + "?access_token=" + this.authenticationService.access_token);
        return this._http.post(this.contactsUrl + "list-partners/" + this.authenticationService.getUserId() + "?access_token=" + this.authenticationService.access_token, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    assignLeadsListToPartner(contactListObject: ContactList) {
        return this._http.post(this.contactsUrl + "assign-leads-list-to-partner/" + this.authenticationService.getUserId() + "?access_token=" + this.authenticationService.access_token, contactListObject)
            .map(this.extractData)
            .catch(this.handleError);
    }

    deleteContactById(contactIds: any) {
        return this._http.post(this.contactsUrl + "deleteFromAllContactLists/" + this.authenticationService.getUserId() + "?access_token=" + this.authenticationService.access_token, contactIds)
            .map(this.extractData)
            .catch(this.handleError);
    }


    findUsersByUserListId(pagination: Pagination) {
        return this._http.post(this.contactsUrl + "findUsersByUserListId?access_token=" + this.authenticationService.access_token, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    shareLeadsListToPartners(shareLeadsDTO: any) {
        return this._http.post(this.contactsUrl + "share-leads-list-to-partners?access_token=" + this.authenticationService.access_token, shareLeadsDTO)
            .map(this.extractData)
            .catch(this.handleError);
    }

    showListSharedDetails(contactListId: number, pagination: Pagination) {
        return this._http.post(this.contactsUrl + contactListId + "/list-shared-details/" + "?access_token=" + this.authenticationService.access_token, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    saveAsNewList(contactListObject: ContactList): Observable<any> {
        var requestoptions = new RequestOptions({
            body: contactListObject
        })
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var options = {
            headers: headers
        };

        var url = this.contactsUrl + "/save-as-new-list/" + this.authenticationService.getUserId() + "?access_token=" + this.authenticationService.access_token;

        return this._http.post(url, options, requestoptions)
            .map((response: any) => response.json())
            .catch(this.handleError);
    }

    findUnsubscribeReasons(userId: number) {
        var url = this.contactsUrl + "/findAllUnsubscribeReasons/" + userId + "?access_token=" + this.authenticationService.access_token;
        return this._http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }

    unsubscribeOrResubscribeUser(object: any) {
        return this._http.post(this.contactsUrl + "unsubscribe-or-resubscribe-User" + "/" + this.authenticationService.getUserId() + "?access_token=" + this.authenticationService.access_token, object)
            .map(this.extractData)
            .catch(this.handleError);
    }

    validatePartnersCompany(partners: any, partnerListId: number) {
        return this._http.post(this.contactsUrl + "validate-partners" + "/" + partnerListId + "/" + this.authenticationService.getUserId() + "?access_token=" + this.authenticationService.access_token, partners)
            .map(this.extractData)
            .catch(this.handleError);

    }

    validatePartnerCompany(partner: User, partnerCompanyId: number) {
        let isAdd  = false;
        return this._http.post(this.contactsUrl + "validatePartnerCompany" + "/" + this.authenticationService.getUserId() + "/" + partnerCompanyId+ "/"  + isAdd + "?access_token=" + this.authenticationService.access_token, partner)
            .map(this.extractData)
            .catch(this.handleError);

    }

    excludedUserMakeAsValid(object: any) {
        return this._http.post(this.contactsUrl + "excluded-user-make-as-valid" + "/" + this.authenticationService.getUserId() + "?access_token=" + this.authenticationService.access_token, object)
            .map(this.extractData)
            .catch(this.handleError);
    }


    downloadPartnerListCsv(contactListId: number, userId: number, pagination: Pagination) {
        return this._http.post(this.contactsUrl + "download/" + contactListId + "/" + userId + "?access_token=" + this.authenticationService.access_token, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    downloadUserListCsv(userId: number, userListPaginationWrapper: UserListPaginationWrapper) {
        return this._http.post(this.contactsUrl + "download/" + userId + "?access_token=" + this.authenticationService.access_token, userListPaginationWrapper)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getCompaniesForDropdown() {
        var url = this.companyUrl + "list" + "/" + this.authenticationService.getUserId() + "?access_token=" + this.authenticationService.access_token;
        return this._http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getUserListByUserListId(userListId: number) {
        var url = this.contactsUrl + "list/" + "userListId/" + userListId + "?access_token=" + this.authenticationService.access_token;
        return this._http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }

    syncContactsInMasterContactList(userId: number) {
        return this._http.get(this.contactsUrl + "syncMasterContactList/" + userId + "/" + "?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    checkSyncStatus(userId: number) {
        return this._http.get(this.contactsUrl + "checkSyncStatus/" + userId + "/" + "?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);

    }

}
