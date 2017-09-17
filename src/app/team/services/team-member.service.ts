import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable }     from 'rxjs/Rx';

import { AuthenticationService } from '../../core/services/authentication.service';
import { TeamMember } from '../models/team-member';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import {Pagination} from '../../core/models/pagination';
import {ReferenceService} from "../../core/services/reference.service";

@Injectable()
export class TeamMemberService{
    
    URL = this.authenticationService.REST_URL;
    constructor( private http: Http,  private authenticationService: AuthenticationService,
            private refService:ReferenceService ) {
      }
    
    
    save(teams:Array<TeamMember>,userId:number){
        var url =this.URL+"admin/saveTeamMembers?userId="+userId+"&access_token="+this.authenticationService.access_token;
        return this.http.post(url,teams)
        .map(this.extractData)
        .catch(this.handleError);
    }
    
    list(pagination:Pagination,userId:number) {
        var url =this.URL+"admin/listTeamMembers/"+userId+"?access_token="+this.authenticationService.access_token;
        return this.http.post(url, pagination)
        .map(this.extractData)
        .catch(this.handleError);   
    }
    
    
    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    private handleError(error: any) {
        return Observable.throw(error);
        
    }
    
}