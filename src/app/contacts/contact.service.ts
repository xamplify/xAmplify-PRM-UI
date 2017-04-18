import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { ContactList } from './models/contact-list';
import { SocialContact } from './models/social-contact';
import { ZohoContact } from './models/zoho-contact';
import {SalesforceContact} from './models/salesforce-contact';
import {SalesforceListViewContact} from './models/salesforce-list-view-contact';
import { User } from '../core/models/user';
import { AuthenticationService } from '../core/services/authentication.service';
import { Logger } from "angular2-logger/core";
import { Router, ActivatedRoute } from '@angular/router';
/*import {Pagination} from '../videos/models/Pagination';*/
import {Pagination} from '.././shared/Pagination';



import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

declare var swal: any;
@Injectable()
export class ContactService {
    
    public successMessage: boolean;
    public socialContact : SocialContact;
    public zohoContact : ZohoContact;
    public salesforceContact : SalesforceContact;
    public salesforceListViewContact : SalesforceListViewContact;  
    public googleCallBack:boolean;
    public salesforceContactCallBack:boolean;
    public pagination: Pagination;

    log:Logger;
    url = this.authenticationService.REST_URL+"admin/";
    //https://127.0.0.1:8443/xtremand-rest/googleOauth/authorizeLogin?access_token=XXXX
    googleContactsUrl = this.authenticationService.REST_URL+'googleOauth/';
    zohoContactsUrl = this.authenticationService.REST_URL+'authenticateZoho';
    salesforceContactUrl = this.authenticationService.REST_URL+'salesforce';
    constructor( private authenticationService: AuthenticationService, private _http: Http,private logger: Logger,private activatedRoute: ActivatedRoute) {
        console.log(logger);
    }
    
    loadUsersOfContactList( contactListId: number ): Observable<User[]> {
        return this._http.get( this.url + "userlist/" + contactListId + "?access_token=" + this.authenticationService.access_token, )
            .map( this.extractData )
            .catch( this.handleError );
    }
    
    loadContactLists(pagination:Pagination): Observable<ContactList[]> {
        this.logger.info("Service class loadContact() completed");
        return this._http.post( this.url + "userlist?" + "access_token=" + this.authenticationService.access_token,pagination )
            .map( this.extractData )
            .catch( this.handleError );
    }
    
    loadAllContacts(pagination:Pagination): Observable<ContactList[]> {
        this.logger.info("Service class loadAllContact() completed");
        return this._http.post( this.url + "contacts?contactType=all" + "&access_token=" + this.authenticationService.access_token,pagination)
            .map( this.extractData )
            .catch( this.handleError );
    }
    
  /*  
    loadAllContacts(): Observable<ContactList[]> {
        this.logger.info("Service class loadAllContact() completed");
        return this._http.post( this.url + "contacts?contactType=all" + "&access_token=" + this.authenticationService.access_token,+"")
            .map( this.extractData )
            .catch( this.handleError );
    }
    */
    loadActiveContacts(pagination:Pagination): Observable<ContactList[]> {
        this.logger.info("Service class loadActiveContact() completed");
        return this._http.post( this.url + "contacts?contactType=active" + "&access_token=" + this.authenticationService.access_token,pagination)
            .map( this.extractData )
            .catch( this.handleError );
    }

    loadNonActiveContacts(pagination:Pagination): Observable<ContactList[]> {
        this.logger.info("Service class loadNonActiveContact() completed");
        return this._http.post( this.url + "contacts?contactType=non-active" + "&access_token=" + this.authenticationService.access_token,pagination)
            .map( this.extractData )
            .catch( this.handleError );
    }

    loadInvalidContacts(pagination:Pagination): Observable<ContactList[]> {
        this.logger.info("Service class loadInvalidContact() completed");
        return this._http.post( this.url + "contacts?contactType=all" + "&access_token=" + this.authenticationService.access_token,pagination)
            .map( this.extractData )
            .catch( this.handleError );
    }
    
    loadUnSubscribedContacts(pagination:Pagination): Observable<ContactList[]> {
        this.logger.info("Service class loadUnSubscribedContact() completed");
        return this._http.post( this.url + "contacts?contactType=all" + "&access_token=" + this.authenticationService.access_token,pagination)
            .map( this.extractData )
            .catch( this.handleError );
    }
    
    deleteContactList( contactListId: number ) {
        return this._http.post( this.url + "userlist/" + contactListId + "/remove?access_token=" + this.authenticationService.access_token, +"" )
            .map( this.extractData )
            .catch( this.handleError );
    }
    
    saveContactList( contactListName: string, users : Array<User>): Observable<User[]> {
        
        this.successMessage = true;
        var requestoptions = new RequestOptions({
           body:users,
            })
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var options = {
            headers: headers
        };
        var url =this.url + "save_user_list?userListName=" + contactListName + "&access_token=" + this.authenticationService.access_token;
        this.logger.info(users);
        return this._http.post(url, options, requestoptions)
            .map( this.extractData )
            .catch( this.handleError );
    } 
    
    updateContactList(contactListId: number,users : Array<User>): Observable<User[]> {
       
        var requestoptions = new RequestOptions({
           body:users,
            })
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var options = {
            headers: headers
        };
        var url =this.url + "userlist/" + contactListId + "/update?&access_token=" + this.authenticationService.access_token;
        this.logger.info(users);
        return this._http.post(url, options, requestoptions)
            .map( this.extractData )
            .catch( this.handleError );
    } 

    removeContactList(contactListId: number, removeUserIds:Array<number>): Observable<Object> {
        this.logger.info(contactListId+"--"+removeUserIds);
        var newUrl = this.url + "userlist/" + contactListId + "/removeUsers?access_token=" + this.authenticationService.access_token;
        return this._http.post(newUrl, removeUserIds)
            .map((response: any) => response.json());
    }
    
    downloadContactList(contactListId: number): Observable<Response> {
        this.logger.info(contactListId);
        return this._http.get(this.url + "userlist/" + contactListId + "/download?access_token=" + this.authenticationService.access_token)
        .map((response: any) => response);
    }
    
    googleLogin() {
       this.logger.info(this.googleContactsUrl+"authorizeLogin?access_token=" + this.authenticationService.access_token);
        return this._http.get(this.googleContactsUrl+"authorizeLogin?access_token=" + this.authenticationService.access_token)
        .map(this.extractData)
        .catch(this.handleError);
    }
    
    googleCallback(): Observable<String>{
        let queryParam: string;
        this.activatedRoute.queryParams.subscribe(
           (param: any) => {
            let code = param['code'];
            let denied = param['denied'];
            queryParam = "?code="+code;
          });
        return this._http.get(this.authenticationService.REST_URL+"googleOauth/callback"+queryParam+"&access_token="+this.authenticationService.access_token+"&userAlias="+localStorage.getItem('userAlias'))
        .map(this.extractData)
        .catch(this.handleError);
    }
    
    getGoogleContacts(socialContact : SocialContact){
        this.logger.info("get google contacts :"+socialContact);
        this.successMessage = true;
        var requestoptions = new RequestOptions({
           body:socialContact,
            })
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var options = {
            headers: headers
        };
        var url =this.authenticationService.REST_URL+"getContacts?&access_token="+this.authenticationService.access_token;
        this.logger.info("testURlpost"+url, options, requestoptions);
        this.logger.info("contactService getGoogleContacts():"+ this.authenticationService.REST_URL+"getContacts?&access_token="+this.authenticationService.access_token);
        return this._http.post(url,socialContact)
            .map( this.extractData )
            .catch( this.handleError );
            
    }
    
    saveSocialContactList(socialContact :SocialContact): Observable<User[]> {
        
        this.successMessage = true;
        
        var requestoptions = new RequestOptions({
            body:socialContact,
             })
         var headers = new Headers();
         headers.append('Content-Type', 'application/json');
         var options = {
             headers: headers
         };
         
        var url = this.authenticationService.REST_URL+ "saveContacts?"+ "&access_token=" + this.authenticationService.access_token;
        return this._http.post(url,options,requestoptions)
            .map( this.extractData )
            .catch( this.handleError );
    } 
    
    googleContactsSynchronize(contactListId: number,socialContact :SocialContact): Observable<Response> {
        var requestoptions = new RequestOptions({
            body:socialContact,
             })
         var headers = new Headers();
         headers.append('Content-Type', 'application/json');
         var options = {
             headers: headers
         };
         
        var url = this.authenticationService.REST_URL+ "synchronizeContacts/"+contactListId+"?&access_token=" + this.authenticationService.access_token;
        return this._http.post(url,options,requestoptions)
            .map( this.extractData )
            .catch( this.handleError );
    }
    
    zohoContactsSynchronize(contactListId: number,socialContact :SocialContact): Observable<Response> {
        var requestoptions = new RequestOptions({
            body:socialContact,
             })
         var headers = new Headers();
         headers.append('Content-Type', 'application/json');
         var options = {
             headers: headers
         };
         
        var url = this.authenticationService.REST_URL+ "synchronizeContacts/"+contactListId+"?&access_token=" + this.authenticationService.access_token;
        return this._http.post(url,options,requestoptions)
            .map( this.extractData )
            .catch( this.handleError );
    }
    
    
    salesforceContactsSynchronize(contactListId: number,socialContact :SocialContact): Observable<Response> {
        var requestoptions = new RequestOptions({
            body:socialContact,
             })
         var headers = new Headers();
         headers.append('Content-Type', 'application/json');
         var options = {
             headers: headers
         };
         
        var url = this.authenticationService.REST_URL+ "synchronizeContacts/"+contactListId+"?&access_token=" + this.authenticationService.access_token;
        return this._http.post(url,options,requestoptions)
            .map( this.extractData )
            .catch( this.handleError );
    }
    
    getZohoContacts(username:string,password:string,contactType:string) {
        this.zohoContact= {"userName":username, "password": password,"contactType": contactType };
        var requestoptions = new RequestOptions({
            body: this.zohoContact,
             })
         var headers = new Headers();
         headers.append('Content-Type', 'application/json');
         var options = {
             headers: headers
         };
         var url =this.zohoContactsUrl+"?access_token="+this.authenticationService.access_token;
         return this._http.post(url,this.zohoContact)
             .map( this.extractData )
             .catch( this.handleError );
     }
    
    salesforceLogin() {
        this.logger.info(this.salesforceContactUrl+"/authorizeLogin?access_token=" + this.authenticationService.access_token);
         return this._http.get(this.salesforceContactUrl+"/authorizeLogin?access_token=" + this.authenticationService.access_token)
         .map(this.extractData)
         .catch(this.handleError);
     }
    
    salesforceCallback(): Observable<String>{
        let queryParam: string;
        this.activatedRoute.queryParams.subscribe(
           (param: any) => {
            let code = param['code'];
            let denied = param['denied'];
            queryParam = "?code="+code;
          });
        return this._http.get(this.authenticationService.REST_URL+"salesforceOauth/callback"+queryParam+"&access_token="+this.authenticationService.access_token+"&userAlias="+localStorage.getItem('userAlias'))
        .map(this.extractData)
        .catch(this.handleError);
    }
    
    getSalesforceContacts(socialNetwork:string, contactType:string){
        this.successMessage = true;
        this.salesforceContact= {"socialNetwork":socialNetwork,"contactType": contactType };
         var requestoptions = new RequestOptions({
           body:this.salesforceContact,
            })
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var options = {
            headers: headers
        };
        var url =this.authenticationService.REST_URL+"getContacts?access_token="+this.authenticationService.access_token;
        this.logger.info("contactService salesforceContacts():"+ this.authenticationService.REST_URL+"getContacts?&access_token="+this.authenticationService.access_token);
        return this._http.post(url,this.salesforceContact)
            .map( this.extractData )
            .catch( this.handleError );
            
    }
    
    getSalesforceListViewContacts(socialNetwork:string, contactType:string,listviewId:string,listviewName:string){
        this.successMessage = true;
        this.salesforceListViewContact= {"socialNetwork":socialNetwork,"contactType": contactType,"alias":listviewId,"contactName": listviewName };
         var requestoptions = new RequestOptions({
           body:this.salesforceListViewContact,
            })
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var options = {
            headers: headers
        };
        var url =this.authenticationService.REST_URL+"getContacts?access_token="+this.authenticationService.access_token;
        this.logger.info("contactService salesforceContacts():"+ this.authenticationService.REST_URL+"getContacts?&access_token="+this.authenticationService.access_token);
        return this._http.post(url,this.salesforceListViewContact)
            .map( this.extractData )
            .catch( this.handleError );
            
    }
    
     extractData( res: Response ) {
        let body = res.json();
        console.log(body);
        return body || {};
    }

     handleError( error: any ) {
        let errMsg = ( error.message ) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server   error';
        return Observable.throw( errMsg );
    }
}
