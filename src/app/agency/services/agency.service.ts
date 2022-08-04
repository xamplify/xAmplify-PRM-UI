import { AgencyDto } from './../models/agency-dto';
import { Injectable } from '@angular/core';
import { AuthenticationService } from "app/core/services/authentication.service";
import { Http } from "@angular/http";
import { XtremandLogger } from "app/error-pages/xtremand-logger.service";
import { Pagination } from "app/core/models/pagination";
import { ReferenceService } from './../../core/services/reference.service';
import { AgencyPostDto } from '../models/agency-post-dto';

@Injectable()
export class AgencyService {
  ACCESS_TOKEN_SUFFIX_URL = "?access_token=";
  AGENCY_PREFIX_URL = this.authenticationService.REST_URL + "agencies";
  AGENCY_URL = this.AGENCY_PREFIX_URL+this.ACCESS_TOKEN_SUFFIX_URL;
  constructor(private http: Http, private authenticationService: AuthenticationService,private referenceService:ReferenceService) { }

  findAll(pagination:Pagination){
    let pageableUrl = this.referenceService.getPagebleUrl(pagination);
    let findAllUrl = this.AGENCY_URL+this.authenticationService.access_token+pageableUrl;
    return this.http.get(findAllUrl,"")
          .map(this.authenticationService.extractData)
          .catch(this.authenticationService.handleError);
  }

  findAllModules(){
    let url = this.AGENCY_PREFIX_URL+"/modules"+this.ACCESS_TOKEN_SUFFIX_URL+this.authenticationService.access_token;
    return this.http.get(url,"")
          .map(this.authenticationService.extractData)
          .catch(this.authenticationService.handleError);
  }

  save(agencyDtos:Array<AgencyPostDto>){
    let dto = {};
    dto['agencies'] = agencyDtos;
    return this.http.post(this.AGENCY_URL,dto)
          .map(this.authenticationService.extractData)
          .catch(this.authenticationService.handleError);
  }

  getById(id:number){
    let url = this.AGENCY_PREFIX_URL+"/"+id+this.ACCESS_TOKEN_SUFFIX_URL+this.authenticationService.access_token;
    return this.http.get(url)
          .map(this.authenticationService.extractData)
          .catch(this.authenticationService.handleError);
  }

  update(agencyPostDto:AgencyPostDto){
    let url = this.AGENCY_PREFIX_URL+"/"+agencyPostDto.id+this.ACCESS_TOKEN_SUFFIX_URL+this.authenticationService.access_token;
    return this.http.put(url,agencyPostDto)
          .map(this.authenticationService.extractData)
          .catch(this.authenticationService.handleError);
  }

  delete(id:number){
    let url = this.AGENCY_PREFIX_URL+"/"+id+this.ACCESS_TOKEN_SUFFIX_URL+this.authenticationService.access_token;
    return this.http.delete(url)
          .map(this.authenticationService.extractData)
          .catch(this.authenticationService.handleError);
  }

  resendEmailInvitation(id:number){
    let companyProfileName = this.authenticationService.getSubDomain();
    let url = "";
    if(companyProfileName.length>0){
      url = this.AGENCY_PREFIX_URL+"/"+id+"/subDomain/"+companyProfileName+"/emailInvitation"+this.ACCESS_TOKEN_SUFFIX_URL+this.authenticationService.access_token;
    }else{
      url = this.AGENCY_PREFIX_URL+"/"+id+"/emailInvitation"+this.ACCESS_TOKEN_SUFFIX_URL+this.authenticationService.access_token;
    }
    alert(url);
    return this.http.get(url)
          .map(this.authenticationService.extractData)
          .catch(this.authenticationService.handleError);
  }

  hasAgencyAccess(){
    let companyProfileName = this.authenticationService.getSubDomain();
    let url = "";
    if(companyProfileName.length>0){
      url = this.AGENCY_PREFIX_URL+"/subDomain/"+companyProfileName+"/access"+this.ACCESS_TOKEN_SUFFIX_URL+this.authenticationService.access_token;
    }else{
      url = this.AGENCY_PREFIX_URL+"/access"+this.ACCESS_TOKEN_SUFFIX_URL+this.authenticationService.access_token;
    }
    return this.http.get(url)
          .map(this.authenticationService.extractData)
          .catch(this.authenticationService.handleError);
  }

}
