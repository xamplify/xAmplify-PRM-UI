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
import { DeleteTeamMemberPartnerRequestDto } from 'app/util/models/delete-team-member-partner-request-dto';

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

    resendTeamMemberInvitation(input:any){
        let vanityUrlFilter = this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '';
        input['vanityUrlFilter'] = vanityUrlFilter;
        input['vanityUrlDomainName'] = this.authenticationService.companyProfileName;
        if(vanityUrlFilter){
        input['vendorCompanyProfileName'] = this.authenticationService.companyProfileName;
        }
        var url =this.URL+"teamMember/resendTeamMemberInvitation?access_token="+this.authenticationService.access_token;
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
    
      saveTeamMembers(teams:Array<TeamMember>){
        let teamMemberPostDto = {};
        teamMemberPostDto['teamMemberDTOs'] = teams;
        teamMemberPostDto['userId'] = this.authenticationService.getUserId();
        teamMemberPostDto['vanityUrlFilter'] = this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '';
        teamMemberPostDto['vanityUrlDomainName'] =this.authenticationService.companyProfileName;
        var url =this.URL+"teamMember/saveTeamMembers?access_token="+this.authenticationService.access_token;
        return this.http.post(url,teamMemberPostDto)
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

    validateTeamMemberEmailIds(teamMember:TeamMember){
        var url =this.URL+"teamMember/validateTeamMemberEmailIds?access_token="+this.authenticationService.access_token;
        return this.http.post(url,teamMember)
        .map(this.extractData)
        .catch(this.handleError);
    }

    getVanityUrlRoles(emailId:any){
        let input = {};
        let vanityUrlFilter = this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '';
        input['vanityUrlFilter'] = vanityUrlFilter;
        input['vendorCompanyProfileName'] = this.authenticationService.companyProfileName;
        input['emailId'] = emailId;
        var url =this.URL+"teamMember/getVanityUrlRoles/?access_token="+this.authenticationService.access_token;
        return this.http.post(url, input)
        .map(this.extractData)
        .catch(this.handleError);   
    }

	/************XNFR-2***********************/
	findDefaultModules() {
		let input = {};
		let vanityUrlFilter = this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '';
		input['vanityUrlFilter'] = vanityUrlFilter;
		input['vanityUrlDomainName'] = this.authenticationService.companyProfileName;
		input['userId'] = this.authenticationService.getUserId();
		var url = this.URL + "teamMemberGroup/findDefaultModules?access_token=" + this.authenticationService.access_token;
		return this.http.post(url, input)
			.map(this.extractData)
			.catch(this.handleError);
	}

	findTeamMemberGroups(pagination: Pagination) {
		pagination.userId = this.authenticationService.getUserId();
		const url = this.URL + "teamMemberGroup/findAll" + '?access_token=' + this.authenticationService.access_token;
		return this.http.post(url, pagination)
			.map(this.extractData)
			.catch(this.handleError);
	}

	saveOrUpdateGroup(groupDto: any, isAdd: boolean) {
        groupDto.userId = this.authenticationService.getUserId();
        groupDto.defaultGroup = false;
		let suffixUrl = isAdd ? 'save' : 'update';
		var url = this.URL + "teamMemberGroup/" + suffixUrl + "?access_token=" + this.authenticationService.access_token;
		return this.http.post(url, groupDto)
			.map(this.extractData)
			.catch(this.handleError);
	}

	findTeamMemberGroupById(id: number) {
		let input = {};
		let vanityUrlFilter = this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '';
		input['vanityUrlFilter'] = vanityUrlFilter;
		input['vanityUrlDomainName'] = this.authenticationService.companyProfileName;
		input['userId'] = this.authenticationService.getUserId();
		let map = { "teamMemberGroupId": id };
		input['map'] = map;
		const url = this.URL + "teamMemberGroup/findById?access_token=" + this.authenticationService.access_token;
		return this.http.post(url, input)
			.map(this.extractData)
			.catch(this.handleError);
    }
    
    previewTeamMemberGroup(id:number){
        const url = this.URL + "teamMemberGroup/previewById/"+id+"?access_token=" + this.authenticationService.access_token;
		return this.http.get(url)
			.map(this.extractData)
			.catch(this.handleError);
    }

	deleteTeamMemberGroups(id: number) {
		const url = this.URL + "teamMemberGroup/delete/" + id + '?access_token=' + this.authenticationService.access_token;
		return this.http.get(url)
			.map(this.extractData)
			.catch(this.handleError);
	}

	/************XNFR-2********************** */
	findAll(pagination: Pagination) {
		return this.authenticationService.findAllTeamMembers(pagination);
	}

	findAllTeamMemberGroupIdsAndNames(addDefaultOption:boolean) {
		return this.authenticationService.findAllTeamMemberGroupIdsAndNames(addDefaultOption);
	}

	saveTeamMembersXNFR2(teamMember:any){
		var url = this.URL + "teamMember/save?access_token=" + this.authenticationService.access_token;
		return this.http.post(url, teamMember)
		.map(this.extractData)
		.catch(this.handleError);
	}

	updateTeamMemberXNFR2(teamMember:any){
		var url = this.URL + "teamMember/update?access_token=" + this.authenticationService.access_token;
		return this.http.post(url, teamMember)
		.map(this.extractData)
		.catch(this.handleError);
    }
    
    findById(id:number){
		var url = this.URL + "teamMember/findById/"+id+"?access_token=" + this.authenticationService.access_token;
		return this.http.get(url)
		.map(this.extractData)
		.catch(this.handleError);
	}

	findUsersToTransferData() {
		let url = this.URL+"teamMember/findUsersToTransferData/"+this.authenticationService.getUserId();
		return this.http.get(url+ "?access_token=" + this.authenticationService.access_token)
			.map(this.extractData)
			.catch(this.handleError);
	}

	delete(teamMember: any) {
		teamMember['userId'] = this.authenticationService.getUserId();
		return this.http.post(this.URL + "teamMember/delete?access_token=" + this.authenticationService.access_token, teamMember)
			.map(this.extractData)
			.catch(this.handleError);
	}

	hasSuperVisorRole(teamMemberGroupId:number){
		return this.http.get(this.URL + "teamMemberGroup/hasSuperVisorRole/"+teamMemberGroupId+"?access_token=" + this.authenticationService.access_token)
			.map(this.extractData)
			.catch(this.handleError);
	}

    /*****XNFR-97***********/
    findPartners(pagination:Pagination){
        var url =this.URL+"teamMember/findPartners?access_token="+this.authenticationService.access_token;
        return this.http.post(url, pagination)
        .map(this.extractData)
        .catch(this.handleError);   
    }

    deletePartners(deleteTeamMemberPartnerRequestDto: DeleteTeamMemberPartnerRequestDto) {
        deleteTeamMemberPartnerRequestDto.loggedInUserId = this.authenticationService.getUserId();
		const url = this.URL + "teamMember/deletePartners?access_token="+this.authenticationService.access_token;
		return this.http.post(url,deleteTeamMemberPartnerRequestDto)
			.map(this.extractData)
			.catch(this.handleError);
	}

    getPartnersCount(teamMemberGroupId:number){
		return this.http.get(this.URL + "teamMemberGroup/getPartnersCount/"+teamMemberGroupId+"?access_token=" + this.authenticationService.access_token)
			.map(this.extractData)
			.catch(this.handleError);
	}

    /****XNFR-139****/
    findMaximumAdminsLimitDetails(){
        let url = this.URL +"teamMember/findMaximumAdminsLimitDetails/"+this.authenticationService.getUserId()+"?access_token=" + this.authenticationService.access_token;
        return this.http.get(url)
        .map(this.extractData)
        .catch(this.handleError);
    }

    

    /****XNFR-139*****/
    updatePrimaryAdmin(teamMemberUserId:number){
        let url = this.URL +"teamMember/updatePrimaryAdmin/"+this.authenticationService.getUserId()+"/"+teamMemberUserId+"?access_token=" + this.authenticationService.access_token;
        return this.http.get(url)
        .map(this.extractData)
        .catch(this.handleError);
    }

     /****XNFR-139*****/
     findPrimaryAdminAndExtraAdmins(){
        let url = this.URL +"teamMember/findPrimaryAdminAndExtraAdmins/"+this.authenticationService.getUserId()+"?access_token=" + this.authenticationService.access_token;
        return this.http.get(url)
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