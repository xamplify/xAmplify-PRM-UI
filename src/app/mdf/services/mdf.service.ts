import { Injectable } from "@angular/core";
import { AuthenticationService } from "app/core/services/authentication.service";
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { XtremandLogger } from "app/error-pages/xtremand-logger.service";
import { Observable } from "rxjs";
import { Form } from "app/forms/models/form";
import { ColumnInfo } from "app/forms/models/column-info";
import { FormOption } from "app/forms/models/form-option";
import { Pagination } from "app/core/models/pagination";
import { MdfDetails } from '../models/mdf-details';
import { VanityLoginDto } from '../../util/models/vanity-login-dto';
import { SaveMdfRequest } from '../models/save-mdf-request';
import { MdfRequestDto } from "../models/mdf-request-dto";
import { MdfRequestCommentDto } from '../models/mdf-request-comment-dto';
import { UtilService } from "app/core/services/util.service";


@Injectable()
export class MdfService {
  URL = this.authenticationService.REST_URL + "mdf/";
  form: Form = new Form();
  mdfDetails: MdfDetails = new MdfDetails();
  columnInfos: Array<ColumnInfo> = new Array<ColumnInfo>();


  defaultMdfRequestLabels = [
    { 'labelName': 'Title', 'labelType': 'text' },
    { 'labelName': 'Activity', 'labelType': 'select' },
    { 'labelName': 'Request Amount', 'labelType': 'number' },
    { 'labelName': 'Event Date', 'labelType': 'date' },
    { 'labelName': 'Description', 'labelType': 'textarea' }
  ];

  defaultActivityOptions = ["Advertisement", "Event", "Promotion", "Seminar", "Trade Show", "Webinar"];
  rowInfos = [];

  constructor(private http: Http, private authenticationService: AuthenticationService, private logger: XtremandLogger,private utilService:UtilService) { }

  saveMdfRequestForm(userName: string, companyProfileName: string): Observable<Form> {
    this.frameMdfRequestForm(userName, companyProfileName);
    return this.http.post(this.URL + "createMdfForm?access_token=" + this.authenticationService.access_token, this.form)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateMdfRequestForm(form: Form): Observable<Form> {
    return this.http.post(this.URL + "updateMdfForm?access_token=" + this.authenticationService.access_token, form)
      .map(this.extractData)
      .catch(this.handleError);
  }

  frameMdfRequestForm(userName: string, companyProfileName: string) {
    this.form.name = companyProfileName + "-" + "mdf-request-form";
    this.form.description = this.form.name;
    this.form.userName = userName;
    this.form.createdByAdmin = true;
    this.defaultMdfRequestLabels.forEach(labelDetails => {
      this.frameFormLabelData(labelDetails);
    });
    /***Added By Sravan On 06/07/2024****/
    const rowInfo: any = {};
    rowInfo['formLabelDTOs'] = this.columnInfos;
    this.rowInfos.push(rowInfo);
    this.form.formLabelDTORows = this.rowInfos;
    /***Added By Sravan On 06/07/2024****/
    this.form.formLabelDTOs = this.columnInfos;
  }

  frameFormLabelData(labelData: any) {
    let columnInfo = new ColumnInfo();
    columnInfo.labelName = labelData.labelName;
    columnInfo.labelId = labelData.labelName.toLowerCase();
    columnInfo.hiddenLabelId = columnInfo.labelId;
    columnInfo.placeHolder = labelData.labelName;
    columnInfo.required = true;
    columnInfo.labelLength = "16";
    columnInfo.labelType = labelData.labelType;
    columnInfo.defaultColumn = true;
    if (labelData.labelType === 'textarea') {
      columnInfo.labelLength = "255";
    }
    else if (labelData.labelType === 'select') {
      let activityOptionsList: Array<FormOption> = new Array<FormOption>();
      for (let i = 0; i < this.defaultActivityOptions.length; i++) {
        activityOptionsList.push(this.frameOptions(this.defaultActivityOptions[i]));
      }
      columnInfo.dropDownChoices = activityOptionsList;
    }
    this.columnInfos.push(columnInfo);
  }

  frameOptions(option: any) {
    const formOption = new FormOption();
    formOption.name = option;
    formOption.labelId = option.toLowerCase();
    formOption.hiddenLabelId = formOption.labelId;
    formOption.defaultColumn = true;
    return formOption;
  }

  getVendorMdfAmountTilesInfo(vendorCompanyId: number,applyFilter:boolean) {
    return this.http.get(this.URL + "getVendorMdfAmountTilesInfo/" + vendorCompanyId +"/"+this.authenticationService.getUserId()+"/"+applyFilter+"?access_token=" + this.authenticationService.access_token)
        .map(this.extractData)
        .catch(this.handleError);
}

listPartners(pagination:Pagination){
  return this.http.post(this.URL + "listPartners?access_token=" + this.authenticationService.access_token,pagination)
        .map(this.extractData)
        .catch(this.handleError);
}

updateMdfAmount(mdfDetails:MdfDetails){
  return this.http.post(this.URL + "updateMdfAmount?access_token=" + this.authenticationService.access_token,mdfDetails)
        .map(this.extractData)
        .catch(this.handleError);
}

getMdfRequestTilesInfoForPartners(vanityLoginDto:VanityLoginDto){
   /********XNFR-252*******/
   let subDomaiName = this.authenticationService.getSubDomain();
   if(subDomaiName.length==0){
     let loginAsUserId = this.utilService.getLoggedInVendorAdminCompanyUserId();
     if(loginAsUserId>0){
       vanityLoginDto.loginAsUserId = loginAsUserId;
     }
   }
  return this.http.post(this.URL + "getMdfRequestTilesInfoForPartners?access_token=" + this.authenticationService.access_token,vanityLoginDto)
  .map(this.extractData)
  .catch(this.handleError);
}

getMdfRequestTilesInfoForVendors(loggedInUserCompanyId:number,filter:boolean){
  return this.http.get(this.URL + "getMdfRequestTilesInfoForVendors/"+loggedInUserCompanyId+"/"
  +this.authenticationService.getUserId()+"/"+filter+"?access_token=" + this.authenticationService.access_token,"")
  .map(this.extractData)
  .catch(this.handleError);
}

getPartnerMdfAmountTilesInfo(vendorCompanyId: number,partnerCompanyId:number) {
  return this.http.get(this.URL + "getPartnerMdfAmountTilesInfo/" + vendorCompanyId + "/"+partnerCompanyId+"?access_token=" + this.authenticationService.access_token)
      .map(this.extractData)
      .catch(this.handleError);
}
listMdfAccessVendors(pagination: Pagination) {
  /********XNFR-252*******/
  let subDomaiName = this.authenticationService.getSubDomain();
  if(subDomaiName.length==0){
    let loginAsUserId = this.utilService.getLoggedInVendorAdminCompanyUserId();
    if(loginAsUserId>0){
      pagination.loginAsUserId = loginAsUserId;
    }
  }
  return this.http.post(this.URL + "listMdfAccessVendors?access_token=" + this.authenticationService.access_token,pagination)
      .map(this.extractData)
      .catch(this.handleError);
}

getMdfRequestFormForPartner(vendorCompanyId:number){
  return this.http.get(this.URL + "getMdfRequestFormForPartner/" + vendorCompanyId+"?access_token=" + this.authenticationService.access_token)
      .map(this.extractData)
      .catch(this.handleError);
}

saveMdfRequest(saveMdfRequestDto:SaveMdfRequest){
  return this.http.post(this.URL + "saveMdfRequest?access_token=" + this.authenticationService.access_token,saveMdfRequestDto)
  .map(this.extractData)
  .catch(this.handleError);
}

getMdfFormAnalytics(pagination:Pagination){
  return this.http.post(this.URL + "listMdfFormDetails?access_token=" + this.authenticationService.access_token,pagination)
        .map(this.extractData)
        .catch(this.handleError);
}

getMdfRequestDetailsById(requestId:number,loggedInUserCompanyId:number){
  return this.http.get(this.URL + "getRequestDetailsById/" + requestId+"/"+loggedInUserCompanyId+"?access_token=" + this.authenticationService.access_token)
      .map(this.extractData)
      .catch(this.handleError);
}
updateMdfRequest(mdfRequest:MdfRequestDto){
  return this.http.post(this.URL + "updateMdfRequest?access_token=" + this.authenticationService.access_token,mdfRequest)
        .map(this.extractData)
        .catch(this.handleError);
}

getMdfRequestForm(companyId: number) {
  return this.http.get(this.URL + "getMdfRequestForm/" + companyId + "?access_token=" + this.authenticationService.access_token)
      .map(this.extractData)
      .catch(this.handleError);
}

getRequestDetailsAndTimeLineHistory(requestId:number,loggedInUserCompanyId:number){
  return this.http.get(this.URL + "getRequestDetailsAndTimeLineHistory/" + requestId+"/"+loggedInUserCompanyId+"?access_token=" + this.authenticationService.access_token)
      .map(this.extractData)
      .catch(this.handleError);
}

getPartnerAndMdfAmountDetails(partnershipId:number){
  return this.http.get(this.URL + "getPartnerAndMdfAmountDetails/" + partnershipId+"?access_token=" + this.authenticationService.access_token)
      .map(this.extractData)
      .catch(this.handleError);
}

getMdfDetailsTimeLineHistory(mdfDetailsId:number,loggedInUserCompanyId:number){
  return this.http.get(this.URL + "getMdfDetailsTimeLineHistory/" + mdfDetailsId+"/"+loggedInUserCompanyId+"?access_token=" + this.authenticationService.access_token)
      .map(this.extractData)
      .catch(this.handleError);
}

  uploadFile(formData: FormData, mdfRequestUploadDto: any) {
    formData.append('mdfRequestUploadDto', new Blob([JSON.stringify(mdfRequestUploadDto)],
      {
        type: "application/json"
      }));
    return this.http.post(this.URL + "uploadDocuments?access_token=" + this.authenticationService.access_token, formData)
      .map(this.extractData)
      .catch(this.handleError);
  }

listMdfRequestDocuments(pagination:Pagination){
  return this.http.post(this.URL + "listMdfRequestDocuments?access_token=" + this.authenticationService.access_token,pagination)
        .map(this.extractData)
        .catch(this.handleError);
}

saveComment(mdfRequestCommentDto:MdfRequestCommentDto){
  return this.http.post(this.URL + "saveComment?access_token=" + this.authenticationService.access_token,mdfRequestCommentDto)
        .map(this.extractData)
        .catch(this.handleError);
}

listComments(requestId:number){
  return this.http.get(this.URL + "listComments/"+requestId+"?access_token=" + this.authenticationService.access_token,"")
        .map(this.extractData)
        .catch(this.handleError);
}



  extractData(res: Response) {
    let body = res.json();
    return body || {};
  }

  handleError(error: any) {
    return Observable.throw(error);
  }

}
