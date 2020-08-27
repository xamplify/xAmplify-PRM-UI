import { Injectable } from "@angular/core";
import { AuthenticationService } from "app/core/services/authentication.service";
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { XtremandLogger } from "app/error-pages/xtremand-logger.service";
import { Observable } from "rxjs";
import { Form } from "app/forms/models/form";
import { ColumnInfo } from "app/forms/models/column-info";
import { FormType } from "app/forms/models/form-type.enum";
import { FormOption } from "app/forms/models/form-option";
import { Pagination } from "app/core/models/pagination";
import {MdfDetails} from '../models/mdf-details';


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

  constructor(private http: Http, private authenticationService: AuthenticationService, private logger: XtremandLogger) { }

  saveMdfRequestForm(userName: string, companyProfileName: string): Observable<Form> {
    this.frameMdfRequestForm(userName, companyProfileName);
    return this.http.post(this.URL + "requestForm/save?access_token=" + this.authenticationService.access_token, this.form)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateMdfRequestForm(form: Form): Observable<Form> {
    return this.http.post(this.URL + "requestForm/update?access_token=" + this.authenticationService.access_token, form)
      .map(this.extractData)
      .catch(this.handleError);
  }

  frameMdfRequestForm(userName: String, companyProfileName: String) {
    this.form.name = companyProfileName + "-" + "mdf-request-form";
    this.form.description = this.form.name;
    this.form.userName = userName;
    this.form.createdByAdmin = true;
    this.defaultMdfRequestLabels.forEach(labelDetails => {
      this.frameFormLabelData(labelDetails);
    });
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

  getVendorMdfAmountTilesInfo(vendorCompanyId: number) {
    return this.http.get(this.URL + "getVendorMdfAmountTilesInfo/" + vendorCompanyId + "?access_token=" + this.authenticationService.access_token)
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

  extractData(res: Response) {
    let body = res.json();
    return body || {};
  }

  handleError(error: any) {
    return Observable.throw(error);
  }

}
