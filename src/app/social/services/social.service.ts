import {Injectable} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import {SocialStatus} from '../models/social-status';
import {SocialConnection} from '../models/social-connection';
import {SocialCampaign} from '../models/social-campaign';

import {AuthenticationService} from '../../core/services/authentication.service';
import { Pagination } from '../../core/models/pagination';

@Injectable()
export class SocialService {
  URL = this.authenticationService.REST_URL;
  public REST_URL: string;
  public socialConnections: SocialConnection[];
  selectedFeed: any;
  selectedCustomFeed:any;

  constructor(private http: Http, private router: Router,
    private authenticationService: AuthenticationService, private activatedRoute: ActivatedRoute) {
    this.socialConnections = new Array<SocialConnection>();
  }

  login(socialProvider: string): Observable<String> {
    return this.http.get(this.URL + socialProvider + '/login')
      .map(this.extractData)
      .catch(this.handleError);
  }

  getSocialConnection( profileId: string, source: string ) {
    return this.http.get(this.URL + `social/account/${source}/${profileId}?access_token=${this.authenticationService.access_token}`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getSocialConnectionByUserIdAndProfileId( userId: number, profileId: string ) {
    return this.http.get(this.URL + `social/account/${userId}/${profileId}?access_token=${this.authenticationService.access_token}`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  callback(socialProvider: string,parentWindowUserId:number,loggedInThroughVanityUrl:string): Observable<SocialConnection> {
    let queryParam: string;
    let isDenied = false;

    this.activatedRoute.queryParams.subscribe(
      (param: any) => {
        const oauth_token = param['oauth_token'];
        const oauth_verifier = param['oauth_verifier'];
        const denied = param['denied'];
        const code = param['code'];
        const error = param['error'];
        const error_code = param['error_code'];
        const error_message = param['error_message'];
        const error_description = param['error_description'];

        if (oauth_token != null && oauth_verifier != null) {
          queryParam = '?oauth_token=' + oauth_token + '&oauth_verifier=' + oauth_verifier;
        } else if (denied != null || ( (error_code != null || error != null) && (error_message != null || error_description != null))) {
          isDenied = true;
        } else {
          queryParam = '?code=' + code;
        }
      });

      if(loggedInThroughVanityUrl=="true"){
        if(parentWindowUserId!=undefined && parentWindowUserId!=0){
          queryParam += '&userId=' + parentWindowUserId;
        }
      }else{
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
          const userId = JSON.parse(currentUser)['userId'];
          queryParam += '&userId=' + userId;
        }
      }
    if (isDenied) {
      // User has denied the permission to login through social account.
      this.router.navigate(['/']);
    } else {
      return this.http.get(this.URL + socialProvider + '/callback' + queryParam)
        .map(this.extractData)
        .catch(this.handleError);
    }
  }

  listAccounts(userId: number, source: string, type: string) {
      userId = this.authenticationService.checkLoggedInUserId(userId);
      return this.http.get(this.URL + `social/accounts/${userId}/${source}/${type}?access_token=${this.authenticationService.access_token}`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  saveAccounts(socialConnections: SocialConnection[]) {
    return this.http.post(this.URL + 'social/accounts?access_token=' + this.authenticationService.access_token, socialConnections)
      .map(this.extractData)
      .catch(this.handleError);
  }

  removeAccount(socialConnectionId: number){
    return this.http.get(this.URL + `social/accounts/${socialConnectionId}?access_token=${this.authenticationService.access_token}`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  listEvents(request: any) {
    return this.http.post(this.URL + 'social/list/?access_token=' + this.authenticationService.access_token, request)
      .map(this.extractData)
      .catch(this.handleError);
  }

  postStatus(socialStatusList: Array<SocialStatus>) {
    return this.http.post(this.URL + 'social/status?access_token=' + this.authenticationService.access_token, socialStatusList)
      .map(this.extractData)
      .catch(this.handleError);
  }

  createSocialCampaign(socialCampaign: SocialCampaign) {
    return this.http.post(this.URL + 'social/campaign?access_token=' + this.authenticationService.access_token, socialCampaign)
      .map(this.extractData)
      .catch(this.handleError);
  }



  redistributeSocialCampaign(socialCampaign: SocialCampaign) {
    return this.http.post(this.URL + 'social/redistribute?access_token=' + this.authenticationService.access_token, socialCampaign)
      .map(this.extractData)
      .catch(this.handleError);
  }

 


  updateStatus(socialStatus: SocialStatus) {
    return this.http.post(this.URL + 'social/update-status?access_token=' + this.authenticationService.access_token, socialStatus)
      .map(this.extractData)
      .catch(this.handleError);
  }

  deleteStatus(socialStatus: SocialStatus) {
    return this.http.post(this.URL + 'social/delete-status?access_token=' + this.authenticationService.access_token, socialStatus)
      .map(this.extractData)
      .catch(this.handleError);
  }

  uploadMedia(formData: FormData) {
    const headers = new Headers();
    headers.set('Accept', 'application/json');
    const options = new RequestOptions({headers: headers});
    return this.http.post(this.URL + 'social/upload-media?access_token=' + this.authenticationService.access_token, formData, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  removeMedia(fileName: String) {
    return this.http.get(this.URL + 'social/remove-media?access_token='
      + this.authenticationService.access_token + '&fileName=' + fileName)
      .map(this.extractData)
      .catch(this.handleError);
  }

  listVideos() {
    return this.http.get(this.URL + 'admin/listVideosNew?access_token=' + this.authenticationService.access_token)
      .map(this.extractData)
      .catch(this.handleError);
  }

  setDefaultAvatar(socialConnections: SocialConnection[]) {
    for (const i in socialConnections) {
      if (socialConnections[i].profileImage == null) {
        socialConnections[i].profileImage = 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/profle-256.png';
      }
    }
    return socialConnections;
  }

  genderDemographics(userId: number) {
    return this.http.get(this.URL + `social/gender-demographics?access_token=${this.authenticationService.access_token}&userId=${userId}`)
      .map(this.extractData)
      .catch(this.handleError);
  }


  getSocialCampaignByAlias(alias: string) {
    return this.http.get(this.URL + 'social/status-by-campaign-alias/' + alias + '?access_token=' + this.authenticationService.access_token)
      .map(this.extractData)
      .catch(this.handleError);
  }
  
  getSocialCampaignByCampaignId(campaignId: number) {
    return this.http.get(this.URL + 'social/status-by-campaign-id/' + campaignId + '?access_token=' + this.authenticationService.access_token)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    const body = res.json();
    console.log(body);
    return body || {};
  }

    private handleError( error: any ) {
        const body = error['_body'];
        if ( body !== "" ) {
            var response = JSON.parse( body );
            if ( response.message != undefined ) {
                return Observable.throw( response.message );
            } else {
                return Observable.throw( response.error );
            }

        } else {
            let errMsg = ( error.message ) ? error.message :
                error.status ? `${error.status} - ${error.statusText}` : 'Server   error';
            return Observable.throw( error );
        }
    }
    getRSSCategoriesWithChannelCount() {
      return this.http.get(this.URL + 'rss/categoriesWithChannelCount?access_token=' + this.authenticationService.access_token)
        .map(this.extractData)
        .catch(this.handleError);
    }

    getFeeds() {
      return this.http.get(this.URL + 'rss/feeds?access_token=' + this.authenticationService.access_token)
        .map(this.extractData)
        .catch(this.handleError);
    }

    getFeedsByUserId(userId: number){
        return this.http.get(this.URL + `rss/user/${userId}/feeds?access_token=${this.authenticationService.access_token}`)
        .map(this.extractData)
        .catch(this.handleError);
    }

    getRSSFeedsByChannel(channelId: number){
        return this.http.get(this.URL + `rss/channel/${channelId}/feeds?access_token=${this.authenticationService.access_token}`)
        .map(this.extractData)
        .catch(this.handleError);
    }

    getRSSFeedsByCategory(categoryId: number){
        return this.http.get(this.URL + `rss/category/${categoryId}/feeds?access_token=${this.authenticationService.access_token}`)
        .map(this.extractData)
        .catch(this.handleError);
    }

    getRSSFeedsByTag(tagId: number){
        return this.http.get(this.URL + `rss/tag/${tagId}/feeds?access_token=${this.authenticationService.access_token}`)
        .map(this.extractData)
        .catch(this.handleError);
    }

    getFavouritesByUserId(userId: number){
        return this.http.get(this.URL + `rss/user/${userId}/favourites?access_token=${this.authenticationService.access_token}`)
        .map(this.extractData)
        .catch(this.handleError);
    }

    getOgMetaTags(requestBody: any){
      return this.http.post(this.URL + `rss/ogtags?access_token=${this.authenticationService.access_token}`, requestBody)
            .map(this.extractData)
            .catch(this.handleError);
    }

    saveFeed(socialStatus: SocialStatus) {
      return this.http.post(this.URL + 'social/vendor/feed/save?access_token=' + this.authenticationService.access_token, socialStatus)
        .map(this.extractData)
        .catch(this.handleError);
    }

    updateFeed(socialStatus: SocialStatus) {
      return this.http.post(this.URL + 'social/vendor/feed/edit?access_token=' + this.authenticationService.access_token, socialStatus)
        .map(this.extractData)
        .catch(this.handleError);
    }

    listAllFeeds( pagination: Pagination): Observable<any> {
      return this.http.post( this.URL + 'social/vendor/feeds?access_token=' + this.authenticationService.access_token, pagination )
          .map( this.extractData )
          .catch( this.handleError );
  }

  publishFeed( socialStatus: SocialStatus): Observable<any> {
    return this.http.post( this.URL + 'social/vendor/feed/publish?access_token=' + this.authenticationService.access_token, socialStatus )
        .map( this.extractData )
        .catch( this.handleError );
    }

  deleteFeed(socialStatus: SocialStatus){
    return this.http.post( this.URL + 'social/vendor/feed/delete?access_token=' + this.authenticationService.access_token, socialStatus )
    .map( this.extractData )
    .catch( this.handleError );
  }

  getFeedById(feedId: number,userId:number){
    return this.http.get( this.URL + 'social/'+userId+'/feed/'+feedId+'?access_token=' + this.authenticationService.access_token,"" )
    .map( this.extractData )
    .catch( this.handleError );
  }
  
}
