import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { ContactList } from '../models/contact-list';
import { SocialContact } from '../models/social-contact';
import { ZohoContact } from '../models/zoho-contact';
import { SalesforceContact } from '../models/salesforce-contact';
import { SalesforceListViewContact } from '../models/salesforce-list-view-contact';
import { User } from '../../core/models/user';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Logger } from "angular2-logger/core";
import { Router, ActivatedRoute } from '@angular/router';
import { Pagination } from '../../core/models/pagination';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import {ReferenceService} from '../../core/services/reference.service';

declare var swal: any;
@Injectable()
export class ContactService {

    public successMessage: boolean;
    public deleteUserSucessMessage: boolean;
    public socialContact: SocialContact[];
    public zohoContact: ZohoContact;
    public salesforceContact: SalesforceContact;
    public salesforceListViewContact: SalesforceListViewContact;
    public googleCallBack: boolean;
    public salesforceContactCallBack: boolean;
    public pagination: Pagination;

    log: Logger;
    url = this.authenticationService.REST_URL + "admin/";
    googleContactsUrl = this.authenticationService.REST_URL + 'googleOauth/';
    zohoContactsUrl = this.authenticationService.REST_URL + 'authenticateZoho';
    salesforceContactUrl = this.authenticationService.REST_URL + 'salesforce';
    constructor( private authenticationService: AuthenticationService, private _http: Http, private logger: Logger, private activatedRoute: ActivatedRoute, private refService: ReferenceService ) {
        console.log( logger );
    }

    loadUsersOfContactList( contactListId: number, pagination: Pagination ): Observable<User[]> {
        return this._http.post( this.url + "userlist/" + contactListId + "?access_token=" + this.authenticationService.access_token, pagination )
            .map( this.extractData )
            .catch( this.handleError );
    }

    loadContactLists( pagination: Pagination ): Observable<ContactList[]> {
        this.logger.info( "Service class loadContact() completed" );
        return this._http.post( this.url + "userlist?" + 'userId='+this.authenticationService.user.id+ "&access_token=" + this.authenticationService.access_token, pagination )
            .map( this.extractData )
            .catch( this.handleError );
    }
    
    unlinkSocailAccount(socialNetwork: string, isDeleteContactList:boolean): Observable<ContactList[]> {
        this.logger.info( "unlinkSocailAccount() method invoked" );
        return this._http.get( this.url + "unlink-account?" + "access_token=" + this.authenticationService.access_token + '&userId='+this.authenticationService.user.id + '&socialNetwork='+ socialNetwork + '&deleteContactList=' + isDeleteContactList)
            .map( this.extractData )
            .catch( this.handleErrorDelete );
    }
    
    loadContactListsNames(): Observable<ContactList[]> {
        this.logger.info( "Service class loadContactsNames() completed" );
        return this._http.get( this.url + "getUserlistNames?" + 'userId='+this.authenticationService.user.id+ "&access_token=" + this.authenticationService.access_token)
            .map( this.extractData )
            .catch( this.handleError );
    }

    loadContactLists1( pagination: Pagination ): Observable<ContactList[]> {
        this.logger.info( "Service class loadContact() completed" );
        return this._http.post( this.url + "userlist?" +"access_token=" + this.authenticationService.access_token, pagination+'&userId='+this.authenticationService.user.id)
            .map( this.extractData )
            .catch( this.handleError );
    }
    
    listContactsByType(contactType: string, pagination: Pagination ): Observable<ContactList[]> {
        this.logger.info( "ContactService listContactsByType():  contactType=" + contactType );
        return this._http.post( this.url + "contacts?contactType="+ contactType + '&userId='+this.authenticationService.user.id+ "&access_token=" + this.authenticationService.access_token, pagination )
            .map( this.extractData )
            .catch( this.handleError );
    }
 

    loadContactsCount() {
        this.logger.info( "Service class loadContactCount() completed" );
        return this._http.get( this.url + "contacts_count?" + 'userId='+this.authenticationService.user.id+ "&access_token=" + this.authenticationService.access_token )
            .map( this.extractData )
            .catch( this.handleError );
    }
    
    loadContactsCountInDashboard(userId: number) {
        this.logger.info( "Service class loadContactCount() completed" );
        return this._http.get( this.url + "contacts_count?userId=" + userId + "&access_token=" + this.authenticationService.access_token )
            .map( this.extractData )
            .catch( this.handleError );
    }
    
    loadActiveContactsUsers( contactListId: number, pagination: Pagination ): Observable<ContactList[]> {
        this.logger.info( "Service class loadActiveContact() completed" );
        return this._http.post( this.url + "contacts/" + contactListId + "?contactType=active" + "&access_token=" + this.authenticationService.access_token, pagination )
            .map( this.extractData )
            .catch( this.handleError );
    }

    loadNonActiveContactsUsers( contactListId: number, pagination: Pagination ): Observable<ContactList[]> {
        this.logger.info( "Service class loadNonActiveContact() completed" );
        return this._http.post( this.url + "contacts/" + contactListId + "?contactType=non-active" + "&access_token=" + this.authenticationService.access_token, pagination )
            .map( this.extractData )
            .catch( this.handleError );
    }

    loadInvalidContactsUsers( contactListId: number, pagination: Pagination ): Observable<ContactList[]> {
        this.logger.info( "Service class loadInvalidContact() completed" );
        return this._http.post( this.url + "contacts/" + contactListId + "?contactType=invalid" + "&access_token=" + this.authenticationService.access_token, pagination )
            .map( this.extractData )
            .catch( this.handleError );
    }

    loadUnSubscribedContactsUsers( contactListId: number, pagination: Pagination ): Observable<ContactList[]> {
        this.logger.info( "Service class loadUnSubscribedContact() completed" );
        return this._http.post( this.url + "contacts/" + contactListId + "?contactType=all" + "&access_token=" + this.authenticationService.access_token, pagination )
            .map( this.extractData )
            .catch( this.handleError );
    }

    deleteContactList( contactListId: number ) {
        return this._http.post( this.url + "userlist/" + contactListId + "/remove?access_token=" + this.authenticationService.access_token, +"" )
            .map( this.extractData )
            .catch( this.handleErrorDelete );
    }

    deleteContactListFromEdit( contactListId: number ) {
        this.deleteUserSucessMessage = true;
        return this._http.post( this.url + "userlist/" + contactListId + "/remove?access_token=" + this.authenticationService.access_token, +"" )
             .map( this.extractData )
             .catch( this.handleErrorDelete );
     }
    
    
    saveContactList( contactListName: string, users: Array<User> ): Observable<User[]> {
        this.successMessage = true;
        var requestoptions = new RequestOptions( {
            body: users,
        })
        var headers = new Headers();
        headers.append( 'Content-Type', 'application/json' );
        var options = {
            headers: headers
        };
        var url = this.url + "save_user_list?userListName=" + contactListName + '&userId='+this.authenticationService.user.id+ "&access_token=" + this.authenticationService.access_token;
        this.logger.info( users );
        return this._http.post( url, options, requestoptions )
            .map( this.extractData )
            .catch( this.handleError );
    }

    updateContactList( contactListId: number, users: Array<User> ): Observable<User[]> {
        var requestoptions = new RequestOptions( {
            body: users,
        })
        var headers = new Headers();
        headers.append( 'Content-Type', 'application/json' );
        var options = {
            headers: headers
        };
        var url = this.url + "userlist/" + contactListId + "/update?"+ 'userId='+this.authenticationService.user.id +"&access_token=" + this.authenticationService.access_token;
        this.logger.info( users );
        return this._http.post( url, options, requestoptions )
            .map( this.extractData )
            .catch( this.handleError );
    }

    removeContactList( contactListId: number, removeUserIds: Array<number> ): Observable<Object> {
        this.logger.info( contactListId + "--" + removeUserIds );
        var newUrl = this.url + "userlist/" + contactListId + "/removeUsers?"+ 'userId='+this.authenticationService.user.id + "&access_token=" + this.authenticationService.access_token;
        return this._http.post( newUrl, removeUserIds )
            .map(( response: any ) => response.json() )
           .catch( this.handleErrorDeleteUsers);
    }

    removeInvalidContactListUsers( removeUserIds: Array<number> ): Observable<Object> {
        this.logger.info( removeUserIds );
        var newUrl = this.url + "removeInvalidUsers?access_token=" + this.authenticationService.access_token;
        return this._http.post( newUrl, removeUserIds )
            .map(( response: any ) => response.json() );
    }

    downloadContactList( contactListId: number ): Observable<Response> {
        this.logger.info( contactListId );
        return this._http.get( this.url + "userlist/" + contactListId + "/download?access_token=" + this.authenticationService.access_token)
            .map(( response: any ) => response );
    }
    
    socialContactImages() {
        this.logger.info(this.authenticationService.REST_URL + "checkauthentication?access_token=" + this.authenticationService.access_token+"&userId=" + this.authenticationService.user.id);
        return this._http.get( this.authenticationService.REST_URL + "checkauthentication?access_token=" + this.authenticationService.access_token+"&userId=" + this.authenticationService.user.id)
            .map( this.extractData )
            .catch( this.handleError );
    }

    googleLogin() {
        this.logger.info( this.googleContactsUrl + "authorizeLogin?access_token=" + this.authenticationService.access_token );
        return this._http.post( this.googleContactsUrl + "authorizeLogin?access_token=" + this.authenticationService.access_token+"&userId=" + this.authenticationService.user.id, "")
            .map( this.extractData )
            .catch( this.handleError );
    }

    googleCallback(): Observable<String> {
        let queryParam: string;
        this.activatedRoute.queryParams.subscribe(
            ( param: any ) => {
                let code = param['code'];
                let denied = param['denied'];
                queryParam = "?code=" + code;
            });
        return this._http.get( this.authenticationService.REST_URL + "googleOauth/callback" + queryParam  + "&userAlias=" + localStorage.getItem( 'userAlias' ) )
            .map( this.extractData )
            .catch( this.handleError );
    }

    getGoogleContacts( socialContact: SocialContact ) {
        this.logger.info( "get google contacts :" + socialContact );
        this.successMessage = true;
        var requestoptions = new RequestOptions( {
            body: socialContact,
        })
        var headers = new Headers();
        headers.append( 'Content-Type', 'application/json' );
        var options = {
            headers: headers
        };
        var url = this.authenticationService.REST_URL + "getContacts?&access_token=" + this.authenticationService.access_token+"&userId=" + this.authenticationService.user.id;
        this.logger.info( "testURlpost" + url, options, requestoptions );
        this.logger.info( "contactService getGoogleContacts():" + this.authenticationService.REST_URL + "getContacts?&access_token=" + this.authenticationService.access_token );
        return this._http.post( url, socialContact )
            .map( this.extractData )
            .catch( this.handleError );
    }

    saveSocialContactList( socialContact: SocialContact ): Observable<Response> {
        this.successMessage = true;
        var requestoptions = new RequestOptions( {
            body: socialContact,
        })
        var headers = new Headers();
        headers.append( 'Content-Type', 'application/json' );
        var options = {
            headers: headers
        };
        var url = this.authenticationService.REST_URL + "saveContacts?access_token=" + this.authenticationService.access_token+"&userId=" + this.authenticationService.user.id;
        return this._http.post( url, options, requestoptions )
            .map( this.extractData )
            .catch( this.handleError );
    }

    contactListSynchronization( contactListId: number, socialContact: SocialContact ): Observable<Response> {
        var requestoptions = new RequestOptions( {
            body: socialContact,
        })
        var headers = new Headers();
        headers.append( 'Content-Type', 'application/json' );
        var options = {
            headers: headers
        };
        var url = this.authenticationService.REST_URL + "synchronizeContacts/" + contactListId + "?&access_token=" + this.authenticationService.access_token+"&userId=" + this.authenticationService.user.id;

        return this._http.post( url, options, requestoptions )
            .map( this.extractData )
            .catch( this.handleError );
    }

    /*zohoContactsSynchronize( contactListId: number, socialContact: SocialContact ): Observable<Response> {
        var requestoptions = new RequestOptions( {
            body: socialContact,
        })
        var headers = new Headers();
        headers.append( 'Content-Type', 'application/json' );
        var options = {
            headers: headers
        };
        var url = this.authenticationService.REST_URL + "synchronizeContacts/" + contactListId + "?&access_token=" + this.authenticationService.access_token+"&userId=" + this.authenticationService.user.id;
        return this._http.post( url, options, requestoptions )
            .map( this.extractData )
            .catch( this.handleError );
    }

    salesforceContactsSynchronize( contactListId: number, socialContact: SocialContact ): Observable<Response> {
        var requestoptions = new RequestOptions( {
            body: socialContact,
        })
        var headers = new Headers();
        headers.append( 'Content-Type', 'application/json' );
        var options = {
            headers: headers
        };
        var url = this.authenticationService.REST_URL + "synchronizeContacts/" + contactListId + "?&access_token=" + this.authenticationService.access_token +"&userId=" + this.authenticationService.user.id;
        return this._http.post( url, options, requestoptions )
            .map( this.extractData )
            .catch( this.handleError );
    }
    */
    checkingZohoAuthentication() {
        this.logger.info( this.authenticationService.REST_URL + "zoho/authorizeLogin?access_token=" + this.authenticationService.access_token );
        return this._http.get( this.authenticationService.REST_URL + "zoho/authorizeLogin?access_token=" + this.authenticationService.access_token+"&userId=" + this.authenticationService.user.id)
            .map( this.extractData )
            .catch( this.handleError );
    }

    getZohoContacts( username: string, password: string, contactType: string ) {
        this.zohoContact = { "userName": username, "password": password, "contactType": contactType };
        var requestoptions = new RequestOptions( {
            body: this.zohoContact,
        })
        var headers = new Headers();
        headers.append( 'Content-Type', 'application/json' );
        var options = {
            headers: headers
        };
        var url = this.zohoContactsUrl + "?userId=" + this.authenticationService.user.id + "&access_token=" + this.authenticationService.access_token;
        return this._http.post( url, this.zohoContact )
            .map( this.extractData )
            .catch( this.handleError );
    }
    
    getZohoAutherizedContacts( socialContact: SocialContact ) {
        this.logger.info( "get zoho contacts :" + socialContact );
        this.successMessage = true;
        var requestoptions = new RequestOptions( {
            body: socialContact,
        })
        var headers = new Headers();
        headers.append( 'Content-Type', 'application/json' );
        var options = {
            headers: headers
        };
        var url = this.authenticationService.REST_URL + "getContacts?&access_token=" + this.authenticationService.access_token+"&userId=" + this.authenticationService.user.id;
        this.logger.info( "contactService getzohoAuthorizedContacts():" + this.authenticationService.REST_URL + "getContacts?&access_token=" + this.authenticationService.access_token );
        return this._http.post( url, socialContact )
            .map( this.extractData )
            .catch( this.handleError );
    }

    salesforceLogin() {
        this.logger.info( this.salesforceContactUrl + "/authorizeLogin?access_token=" + this.authenticationService.access_token +"&userId=" + this.authenticationService.user.id );
        return this._http.get( this.salesforceContactUrl + "/authorizeLogin?access_token=" + this.authenticationService.access_token +"&userId=" + this.authenticationService.user.id)
            .map( this.extractData )
            .catch( this.handleError );
    }

    salesforceCallback(): Observable<String> {
        let queryParam: string;
        this.activatedRoute.queryParams.subscribe(
            ( param: any ) => {
                let code = param['code'];
                let denied = param['denied'];
                queryParam = "?code=" + code;
            });
        return this._http.get( this.authenticationService.REST_URL + "salesforceOauth/callback" + queryParam + "&access_token=" + this.authenticationService.access_token + "&userAlias=" + localStorage.getItem( 'userAlias' ) )
            .map( this.extractData )
            .catch( this.handleError );
    }

    getSalesforceContacts( socialNetwork: string, contactType: string ) {
        this.successMessage = true;
        this.salesforceContact = { "socialNetwork": socialNetwork, "contactType": contactType };
        var requestoptions = new RequestOptions( {
            body: this.salesforceContact,
        })
        var headers = new Headers();
        headers.append( 'Content-Type', 'application/json' );
        var options = {
            headers: headers
        };
        var url = this.authenticationService.REST_URL + "getContacts?access_token=" + this.authenticationService.access_token+"&userId=" + this.authenticationService.user.id;
        this.logger.info( "contactService salesforceContacts():" + this.authenticationService.REST_URL + "getContacts?&access_token=" + this.authenticationService.access_token );
        return this._http.post( url, this.salesforceContact )
            .map( this.extractData )
            .catch( this.handleError );
    }

    getSalesforceListViewContacts( socialNetwork: string, contactType: string, listviewId: string, listviewName: string ) {
        this.successMessage = true;
        this.salesforceListViewContact = { "socialNetwork": socialNetwork, "contactType": contactType, "alias": listviewId, "contactName": listviewName };
        var requestoptions = new RequestOptions( {
            body: this.salesforceListViewContact,
        })
        var headers = new Headers();
        headers.append( 'Content-Type', 'application/json' );
        var options = {
            headers: headers
        };
        var url = this.authenticationService.REST_URL + "getContacts?access_token=" + this.authenticationService.access_token+"&userId=" + this.authenticationService.user.id;
        this.logger.info( "contactService salesforceContacts():" + this.authenticationService.REST_URL + "getContacts?&access_token=" + this.authenticationService.access_token );
        return this._http.post( url, this.salesforceListViewContact )
            .map( this.extractData )
            .catch( this.handleError );
    }

    extractData( res: Response ) {
        let body = res.json();
        console.log( body );
        return body || {};
    }

    handleError( error: any ) {
        let errMsg = ( error.message ) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server   error';
        return Observable.throw( error );
    }
    
    handleErrorDelete( error: any ) {
        const errMsg = ( error.message ) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server   error';
         const errorbody = error._body;
         if ( errorbody.indexOf('contactlist is being used in one or more campaigns. Please delete those campaigns first.') >= 0) {
            return Observable.throw( errorbody );
           }
         else {
            return Observable.throw( error );
          }
       }
    handleErrorDeleteUsers( error: any ) {
        const errMsg = ( error.message ) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server   error';
         const errorbody = error._body;
         if ( errorbody.indexOf('contactlist is being used in one or more campaigns. Please delete those campaigns first.') >= 0) {
            return Observable.throw( errorbody );
           }
         else {
            return Observable.throw( error );
          }
       }

}
