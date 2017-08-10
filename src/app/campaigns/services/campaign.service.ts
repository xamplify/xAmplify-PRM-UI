import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable }     from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { AuthenticationService } from '../../core/services/authentication.service';
import { Campaign } from '../models/campaign';
import {Pagination} from '../../core/models/pagination';

@Injectable()
export class CampaignService {

    campaign: Campaign;

    URL = this.authenticationService.REST_URL;

    constructor(private http: Http, private authenticationService: AuthenticationService) { }

    saveCampaignDetails(data: any) {
        return this.http.post(this.URL + "admin/saveCampaignDetails?access_token=" + this.authenticationService.access_token, data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    saveCampaignVideo(data: any) {
        return this.http.post(this.URL + "admin/saveCampaignVideo?access_token=" + this.authenticationService.access_token, data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    saveCampaignContactList(data: any) {
        return this.http.post(this.URL + "admin/saveCampaignContactList?access_token=" + this.authenticationService.access_token, data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    lauchCampaign(data: any) {
        return this.http.post(this.URL + "admin/launchCampaign?access_token=" + this.authenticationService.access_token, data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    saveCampaign(data: any) {
        return this.http.post(this.URL + "admin/createCampaign?access_token=" + this.authenticationService.access_token, data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    listCampaign(pagination:Pagination,userId:number) {
        var url =this.URL+"admin/listCampaign/"+userId+"?access_token="+this.authenticationService.access_token;
        return this.http.post(url, pagination)
        .map(this.extractData)
        .catch(this.handleError);   
      
       
    }

    getCampaignById(data: any) {
        return this.http.post(this.URL + "admin/getCampaignById?access_token=" + this.authenticationService.access_token, data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getCampaignNames(userId: number) {
        return this.http.get(this.URL + "admin/listCampaignNames/" + userId + "?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }
    delete(id: number) {
        return this.http.get(this.URL + "admin/deleteCampaign/" + id + "?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }


    sendTestEmail(data: any) {
        return this.http.post(this.URL + "admin/sendTestEmail?access_token=" + this.authenticationService.access_token, data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        console.log(body);
        return body || {};
    }
    
    getHeatMap( userId: number, campaignId: number ) {
        return this.http.get( this.URL + 'user-video-heat-map?access_token=' + this.authenticationService.access_token + '&userId='+userId+'&campaignId='+campaignId )
            .map( this.extractData )
            .catch( this.handleError );
    }
    
    getCampaignView(campaignId: number ) {
        return this.http.get( this.URL + 'campaignviews/'+campaignId+'?access_token=' + this.authenticationService.access_token)
            .map( this.extractData )
            .catch( this.handleError );
    }
    
    getEmailOpenCount( campaignId: number ) {
        return this.http.get( this.URL + 'email_open_count/' + campaignId + '?access_token=' + this.authenticationService.access_token + '&actionId=13' )
            .map( this.extractData )
            .catch( this.handleError );
    }
    
    getEmailClickedCount( campaignId: number ) {
        return this.http.get( this.URL + 'email_gif_clicked_count/' + campaignId + '?access_token=' + this.authenticationService.access_token + '&actionId=14' )
        .map( this.extractData )
        .catch( this.handleError );
    }
    
    getEmailSentCount( campaignId: number ) {
        return this.http.get( this.URL + 'emails_sent_count/' + campaignId + '?access_token=' + this.authenticationService.access_token)
        .map( this.extractData )
        .catch( this.handleError );
    }
    
    getCountryWiseCampaignViews( campaignId: number ) {
        return this.http.get( this.URL + 'world-campaign-views?access_token=' + this.authenticationService.access_token + '&campaignId=' + campaignId )
            .map( this.extractData )
            .catch( this.handleError );
    }
    
    listCampaignInteractionsData(customerId: number){
        return this.http.get( this.URL + 'admin/list-campaign-interactions?access_token=' + this.authenticationService.access_token + '&customerId=' + customerId )
        .map( this.extractData )
        .catch( this.handleError );
}

    private handleError(error: any) {
        if (error.status === 500) {
            console.log(error);
            var response =  JSON.parse(error['_body']);
            return Observable.throw(new Error(response.message));
        }
        else if (error.status === 400) {
            return Observable.throw(new Error(error.status));
        }
        else if (error.status === 409) {
            return Observable.throw(new Error(error.status));
        }
        else if (error.status === 406) {
            return Observable.throw(new Error(error.status));
        }
        /*var body = error['_body'];
        if (body != "") {
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
        }*/

    }
}
