import { Injectable } from "@angular/core";
import { AuthenticationService } from "app/core/services/authentication.service";
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { XtremandLogger } from "app/error-pages/xtremand-logger.service";
import { Observable } from "rxjs";
import { Form } from "app/forms/models/form";
import { ColumnInfo } from "app/forms/models/column-info";
import { FormType } from "app/forms/models/form-type.enum";
import { FormOption } from "app/forms/models/form-option";
import { MdfRequest } from "../models/mdf.request";
import { Pagination } from "app/core/models/pagination";
import { MdfCreditTransaction } from "../models/mdf.credit.history";
import { MdfFunds } from "../models/mdf.funds";

@Injectable()
export class MdfService {
    URL = this.authenticationService.REST_URL + "mdf/";
    form: Form = new Form();
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

    saveMdfRequestForm(userName: String, companyProfileName: String): Observable<Form> {
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
        return formOption;
    }

    getAllMdfRequestsForPagination(): Observable<MdfRequest> {
        return this.http.get(this.URL + "getMdfRequests?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    saveMdfRequest(mdfRequest: MdfRequest): Observable<MdfRequest> {
        return this.http.post(this.URL + "request/save?access_token=" + this.authenticationService.access_token, mdfRequest)
            .map(this.extractData)
            .catch(this.handleError);
    }

    updateMdfRequest(mdfRequest: MdfRequest): Observable<MdfRequest> {
        return this.http.post(this.URL + "request/update?access_token=" + this.authenticationService.access_token, mdfRequest)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getMdfWorkflowSteps(wfStepsFilePath: string): Observable<any> {
        return this.http.get(wfStepsFilePath).map(this.extractData).catch(this.handleError);
    }

    getMdfFundsAnalyticsForTiles(vendorCompanyId: number) {
        return this.http.get(this.URL + "funds/analytics/tiles/" + vendorCompanyId + "?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getMdfFundsAnalyticsForPagination(pagination: Pagination) {
        return this.http.post(this.URL + "funds/analytics/partnersInfo?access_token=" + this.authenticationService.access_token, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getMdfRequestsAnalyticsForTiles(vendorCompanyId: number) {
        return this.http.get(this.URL + "requests/analytics/tiles/" + vendorCompanyId + "?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getMdfRequestsAnalyticsForPagination(pagination: Pagination): Observable<MdfRequest> {
        return this.http.post(this.URL + "requests/analytics/partnersInfo?access_token=" + this.authenticationService.access_token, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getMdfRequestStatusAndBalanceDetails(vendorCompanyId: number, partnerCompanyId: number) {
        return this.http.get(this.URL + "request/" + vendorCompanyId + "/" + partnerCompanyId + "?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getMdfRequestOwnerAndPartnerManagerDetails(partnerCompanyId: number) {
        return this.http.get(this.URL + "request/" + partnerCompanyId + "?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    addCreditTransaction(mdfCreditTransaction: MdfCreditTransaction): Observable<MdfRequest> {
        return this.http.post(this.URL + "creditTransaction?access_token=" + this.authenticationService.access_token, mdfCreditTransaction)
            .map(this.extractData)
            .catch(this.handleError);
    }

    addDefaultMdfAmountToPartners(companyId:number,mdfAmount:number): Observable<any> {
        return this.http.get(this.authenticationService.REST_URL + "addDefaultMdfCredit/"+companyId+"/"+mdfAmount+"?access_token=" + this.authenticationService.access_token, "")
            .map(this.extractData)
            .catch(this.handleError);
    }

    getMdfCreditDetailsById(id: number) {
        return this.http.get(this.URL + "getMdfCreditDetailsById/" + id + "?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    addCreditBalance(mdfFunds: MdfFunds) {
        return this.http.post(this.URL + "addCreditBalance?access_token=" + this.authenticationService.access_token, mdfFunds)
            .map(this.extractData)
            .catch(this.handleError);
    }
    updateMdfRequestByVendor(mdfRequest: MdfRequest) {
        return this.http.post(this.URL + "request/update?access_token=" + this.authenticationService.access_token, mdfRequest)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getMdfRequestsAnalyticsTilesForPartner(partnerCompanyId: number) {
        return this.http.get(this.URL + "requests/analytics/tiles/partner/" + partnerCompanyId + "?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }


    listMdfAccessVendorCompanyDetailsByPartnerCompanyId(partnerCompanyId: number) {
        return this.http.get(this.URL + "listMdfAccessVendorCompanyDetailsByPartnerCompanyId/" + partnerCompanyId + "?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getPartnerMdfBalance(vendorCompanyId: number,partnerCompanyId:number) {
        return this.http.get(this.URL + "requests/partnerMdfBalance/" + vendorCompanyId + "/"+partnerCompanyId+"?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getMdfRequestForm(companyId: number) {
        return this.http.get(this.URL + "getMdfRequestForm/" + companyId + "?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }


    listMdfRequestsForPartners(pagination: Pagination) {
        return this.http.post(this.URL + "requests/analytics/partnersInfoForPartner?access_token=" + this.authenticationService.access_token, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getMdfRequestsOwnerAndOtherDetails(companyId: number,mdfId:number) {
        return this.http.get(this.URL + "/request/" + companyId + "/"+mdfId+"?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }




    extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server   error';
        return Observable.throw(error);
    }
}