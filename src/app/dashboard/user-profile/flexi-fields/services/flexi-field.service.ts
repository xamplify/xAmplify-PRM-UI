import { Injectable } from '@angular/core';
import { Pagination } from 'app/core/models/pagination';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { FlexiField } from '../models/flexi-field';

@Injectable()
export class FlexiFieldService {

  URL = this.authenticationService.REST_URL;
  ACCESS_TOKEN_SUFFIX_URL = "?access_token=";
  FLEXI_FIELD_PREFIX_URL = this.authenticationService.REST_URL + "flexi-fields";
  FLEXI_FIELD_URL = this.FLEXI_FIELD_PREFIX_URL+this.ACCESS_TOKEN_SUFFIX_URL;

  constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService) { }

  findPaginatedCustomFields(pagination:Pagination){
    let userId = this.authenticationService.getUserId();
    let pageableUrl = this.referenceService.getPagebleUrl(pagination);
    let findAllUrl = this.FLEXI_FIELD_PREFIX_URL+'/paginated'+'/userId/'+userId+this.ACCESS_TOKEN_SUFFIX_URL+this.authenticationService.access_token+pageableUrl;
    return this.authenticationService.callGetMethod(findAllUrl);
  }

  findCustomFieldsData() {
    let userId = this.authenticationService.getUserId();
    return this.authenticationService.callGetMethod(this.FLEXI_FIELD_PREFIX_URL + '/by-user/' + userId + this.ACCESS_TOKEN_SUFFIX_URL + this.authenticationService.access_token);
  }

  saveOrUpdateCustomField(customField:FlexiField,isAdd:boolean){
    customField.loggedInUserId = this.authenticationService.getUserId();
    return this.authenticationService.callPostMethod(this.FLEXI_FIELD_URL + this.authenticationService.access_token,customField);


  }

   

}
