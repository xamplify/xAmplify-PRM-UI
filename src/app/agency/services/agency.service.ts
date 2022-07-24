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
  ACCESS_TOKEN_SUFFIX_URL = "?access_token="+this.authenticationService.access_token;
  AGENCY_PREFIX_URL = this.authenticationService.REST_URL + "agencies";
  AGENCY_URL = this.AGENCY_PREFIX_URL+this.ACCESS_TOKEN_SUFFIX_URL;
  constructor(private http: Http, private authenticationService: AuthenticationService, 
    private logger: XtremandLogger,private referenceService:ReferenceService) { }

  /***Get All Agencies****/
  findAll(pagination:Pagination){
    let pageableUrl = this.referenceService.getPagebleUrl(pagination);
    let findAllUrl = this.AGENCY_URL+pageableUrl;
    return this.http.get(findAllUrl,"")
          .map(this.authenticationService.extractData)
          .catch(this.authenticationService.handleError);
  }

  /***Get All Modules */
  findAllModules(){
    let url = this.AGENCY_PREFIX_URL+"/modules"+this.ACCESS_TOKEN_SUFFIX_URL;
    return this.http.get(url,"")
          .map(this.authenticationService.extractData)
          .catch(this.authenticationService.handleError);
  }

  /****Save****/
  save(agencyDtos:Array<AgencyPostDto>){
    let dto = {};
    dto['agencies'] = agencyDtos;
    return this.http.post(this.AGENCY_URL,dto)
          .map(this.authenticationService.extractData)
          .catch(this.authenticationService.handleError);
  }

  /***Get By Id ***/
  getById(id:number){
    let url = this.AGENCY_PREFIX_URL+"/"+id+this.ACCESS_TOKEN_SUFFIX_URL;
    return this.http.get(url)
          .map(this.authenticationService.extractData)
          .catch(this.authenticationService.handleError);
  }

  update(agencyPostDto:AgencyPostDto){
    return this.http.put(this.AGENCY_URL,agencyPostDto)
          .map(this.authenticationService.extractData)
          .catch(this.authenticationService.handleError);
  }

}
