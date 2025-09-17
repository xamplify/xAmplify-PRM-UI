import { Injectable } from '@angular/core';
import { AuthenticationService } from "app/core/services/authentication.service";
import { Http } from "@angular/http";
import { XtremandLogger } from "app/error-pages/xtremand-logger.service";
import { Pagination } from "app/core/models/pagination";
import { ReferenceService } from './../../core/services/reference.service';
@Injectable()
export class AzugaService {

  AZUGA_PREFIX_URL = this.authenticationService.REST_URL + "azuga";
  ACCESS_TOKEN_SUFFIX_URL = "?access_token=";

  constructor(private http: Http, private authenticationService: AuthenticationService,private referenceService:ReferenceService) { }

  findDevices(){
    let url = this.AZUGA_PREFIX_URL+"/devices"+this.ACCESS_TOKEN_SUFFIX_URL+this.authenticationService.access_token;
    return this.http.get(url,"")
          .map(this.authenticationService.extractData)
          .catch(this.authenticationService.handleError);
  }

  moveDevicesData(){
    let url = this.AZUGA_PREFIX_URL+"/moveDevicesData"+this.ACCESS_TOKEN_SUFFIX_URL+this.authenticationService.access_token;
    return this.http.get(url,"")
          .map(this.authenticationService.extractData)
          .catch(this.authenticationService.handleError);
  }
}
