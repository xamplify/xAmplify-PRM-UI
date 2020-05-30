import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

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
        var url =this.URL+"admin/saveTeamMembers?userId="+userId+ "&companyProfileName=" + this.authenticationService.companyProfileName + "&access_token="+this.authenticationService.access_token;
        return this.http.post(url,teams)
        .map(this.extractData)
        .catch(this.handleError);
    }
    
    update(teams:Array<TeamMember>,userId:number){
        var url =this.URL+"admin/updateTeamMembers/"+userId+"?access_token="+this.authenticationService.access_token;
        return this.http.post(url,teams)
        .map(this.extractData)
        .catch(this.handleError);
    }
    
    list(pagination:Pagination,userId:number) {
       
        userId = this.authenticationService.user.id;
        
        userId = this.authenticationService.checkLoggedInUserId(userId);
        
        if(this.authenticationService.vanityURLEnabled && this.authenticationService.companyProfileName){
            pagination.vanityUrlFilter = true;
            pagination.vendorCompanyProfileName = this.authenticationService.companyProfileName;
        }
        var url =this.URL+"admin/listTeamMembers/"+userId+"?access_token="+this.authenticationService.access_token;
        return this.http.post(url, pagination)
        .map(this.extractData)
        .catch(this.handleError);   
    }
    
    listAllOrgAdminsAndSupervisors(userId:number){
        return this.http.get(this.URL + "admin/list-org-all/" + userId + "?access_token=" + this.authenticationService.access_token)
        .map(this.extractData)
        .catch(this.handleError);
    }

    listPartnerAndTeamMembers(userId:number){
        return this.http.get(this.URL + "admin/partner-team-members/" + userId + "?access_token=" + this.authenticationService.access_token)
        .map(this.extractData)
        .catch(this.handleError);
    }
  

    listEmailIdsForTransferData(userId:number,isPartner:boolean){
        let url =this.URL;
        if(isPartner){
            url+= "admin/partner-team-members/";
        }else{
            url+="admin/list-org-all/";
        }
        return this.http.get(url + userId + "?access_token=" + this.authenticationService.access_token)
        .map(this.extractData)
        .catch(this.handleError);


    }
    
    listTeamMemberEmailIds() {
        return this.http.get(this.URL + "admin/listTeamMemberEmailIds?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    listOrganizationTeamMembers(userId:number) {
        return this.http.get(this.URL + "admin/listTeamMemberEmailIds/"+userId+"?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    listDisabledTeamMemberEmailIds() {
        return this.http.get(this.URL + "admin/listDisabledTeamMemberEmailIds?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    listAllOrgAdminsEmailIds() {
        return this.http.get(this.URL + "admin/listAllOrgAdminEmailIds?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    listAllPartnerEmailIds(){
        return this.http.get(this.URL + "admin/listAllPartnerEmailIds?access_token=" + this.authenticationService.access_token)
        .map(this.extractData)
        .catch(this.handleError);
    }

    getAllEmailIds(){
        return this.http.get(this.URL + "admin/getAllEmailIds?access_token=" + this.authenticationService.access_token)
        .map(this.extractData)
        .catch(this.handleError);
    }
    
    
    delete(teamMember:TeamMember) {
        return this.http.post(this.URL + "admin/deleteTeamMember?access_token=" + this.authenticationService.access_token,teamMember)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    changeStatus(teamMember:TeamMember) {
        return this.http.post(this.URL + "admin/changeTeamMemberStatus?access_token=" + this.authenticationService.access_token,teamMember)
            .map(this.extractData)
            .catch(this.handleError);
    }

    listTeamMemberModules(input:any){
        let vanityUrlFilter = this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '';
        input['vanityUrlFilter'] = vanityUrlFilter;
        input['vanityUrlDomainName'] = this.authenticationService.companyProfileName;
        var url =this.URL+"teamMember/listTeamMemberModulesByUserId/?access_token="+this.authenticationService.access_token;
        return this.http.post(url, input)
        .map(this.extractData)
        .catch(this.handleError);   
    }

    listTeamMembers(pagination:Pagination){
        let vanityUrlFilter = this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '';
        pagination.vanityUrlFilter = vanityUrlFilter;
        pagination.vendorCompanyProfileName = this.authenticationService.companyProfileName;
        var url =this.URL+"teamMember/listTeamMembers?access_token="+this.authenticationService.access_token;
        return this.http.post(url, pagination)
        .map(this.extractData)
        .catch(this.handleError);   
    }

    updateTeamMember(teamMember:TeamMember){
        let vanityUrlFilter = this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '';
        teamMember.vanityUrlFilter = vanityUrlFilter;
        teamMember.vanityUrlDomainName = this.authenticationService.companyProfileName;
        teamMember.loggedInUserId =this.authenticationService.getUserId();
        var url =this.URL+"teamMember/updateTeamMember?access_token="+this.authenticationService.access_token;
        return this.http.post(url,teamMember)
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