import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ReferenceService } from '../../core/services/reference.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { FormService } from '../services/form.service';
import { Form } from '../models/form';
import { ColumnInfo } from '../models/column-info';
import { CustomResponse } from '../../common/models/custom-response';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { SortOption } from '../../core/models/sort-option';
import { UtilService } from '../../core/services/util.service';
import { environment } from 'environments/environment';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
import { DomSanitizer } from "@angular/platform-browser";
import { EnvService } from 'app/env.service'

declare var swal, $: any;
@Component({
    selector: 'app-preview-popup',
    templateUrl: './preview-popup.component.html',
    styleUrls: ['./preview-popup.component.css'],
    providers: [HttpRequestLoader, Pagination, SortOption, FormService] 
})
export class PreviewPopupComponent implements OnInit {
    form: Form = new Form();
    ngxloading = false;
    formError = false;
    customResponse: CustomResponse = new CustomResponse();
    columnInfos: Array<ColumnInfo> = new Array<ColumnInfo>();
    formsError: boolean = false;
    pagination: Pagination = new Pagination();
    formsLoader: HttpRequestLoader = new HttpRequestLoader();
    showButton = false;
    selectedFormData: Array<Form> = [];
    selectedFormId: number;
    formAliasUrl: string = "";
    formBackgroundImage = "";
    pageBackgroundColor = "";
    siteKey = "";
    showDefaultForms = false;

    // 1.Regular
    // 2.Quiz
    // 3.Survey
    @Input() filter: any[];


    constructor(private formService: FormService, public envService: EnvService, public logger: XtremandLogger, public authenticationService: AuthenticationService,
        public referenceService: ReferenceService, public sortOption: SortOption, public pagerService: PagerService, public utilService: UtilService,
        public router: Router, private vanityUrlService: VanityURLService, public sanitizer: DomSanitizer) {
        this.pagination.vanityUrlFilter = this.vanityUrlService.isVanityURLEnabled();
        this.siteKey = this.envService.captchaSiteKey;
    }

    ngOnInit() {
        this.showDefaultForms = this.router.url.indexOf("/home/pages/saveAsDefault")>-1;
        if (this.router.url.indexOf("/home/emailtemplates/create") > -1 ||
            this.router.url.indexOf("/home/pages/add") > -1 || this.router.url.indexOf("/home/campaigns/create") > -1 
            || this.router.url.indexOf("/home/campaigns/edit") > -1) {
            this.showButton = true;
        }
        if (this.authenticationService.isShowForms) {
            this.pagination.campaignType = 'EVENT';
        }
    }

    /************List Available Forms******************/
    showForms() {
        this.formsError = false;
        this.customResponse = new CustomResponse();
        if(this.showDefaultForms){
            this.pagination = new Pagination();
            this.pagination.pageIndex = 1;
        }else{
            this.pagination.userId = this.authenticationService.getUserId();
        }
        this.listForms(this.pagination);
    }

    listForms(pagination: Pagination) {
        $('#forms-list').modal('show');
        this.referenceService.loading(this.formsLoader, true);
        this.formService.findDefaultFormsOrUserDefinedForms(pagination,this.showDefaultForms).subscribe(
            (response: any) => {
                const data = response.data;
                pagination.totalRecords = data.totalRecords;
                this.sortOption.totalRecords = data.totalRecords;
                pagination = this.pagerService.getPagedItems(pagination, data.forms);
                this.referenceService.loading(this.formsLoader, false);
            },
            (error: any) => {
                this.formsError = true;
                this.customResponse = new CustomResponse('ERROR', 'Unable to get forms.Please Contact Admin.', true);
            });
    }

    /********************Pagaination&Search Code*****************/

    /*************************Sort********************** */
    sortBy(text: any) {
        this.sortOption.formsSortOption = text;
        this.getAllFilteredResults(this.pagination);
    }


    /*************************Search********************** */
    searchForms() {
        this.getAllFilteredResults(this.pagination);
    }

    paginationDropdown(items: any) {
        this.sortOption.itemsSize = items;
        this.getAllFilteredResults(this.pagination);
    }

    /************Page************** */
    setPage(event: any) {
        this.pagination.pageIndex = event.page;
        this.listForms(this.pagination);
    }

    getAllFilteredResults(pagination: Pagination) {
        this.pagination.pageIndex = 1;
        this.pagination.searchKey = this.sortOption.searchKey;
        this.pagination = this.utilService.sortOptionValues(this.sortOption.formsSortOption, this.pagination);
        this.listForms(this.pagination);
    }

    eventHandler(keyCode: any) { if (keyCode === 13) { this.searchForms(); } }

    copyInputMessage(inputElement, type: string, index: number) {
        $('.ml').css({ 'margin-bottom': '0px' });
        $('.cmif').css({ 'margin-bottom': '0px' });
        $(".success").hide();
        $('#copied-message-' + index).hide();
        $('#embed-copied-message-' + index).hide();
        inputElement.select();
        document.execCommand('copy');
        inputElement.setSelectionRange(0, 0);
        if (type === "Page Link") {
            $('#copied-message-' + index).show(500);
            $('#custom-margin-' + index).css({ 'margin-bottom': '32px' });
        } else {
            $('#embed-copied-message-' + index).show(500);
            $('#cmif-' + index).css({ 'margin-bottom': '13px' });
        }
    }


    /*****************Preview Form*******************/
    previewForm(id: number) {
        this.customResponse = new CustomResponse();
        this.ngxloading = true;
        this.formService.getById(id)
            .subscribe(
                (data: any) => {
                    if (data.statusCode === 200) {
                        this.form = data.data;
                        if(this.form.showBackgroundImage){
                            this.formBackgroundImage = this.form.backgroundImage;
                            this.pageBackgroundColor = "";
                        }else{
                            this.pageBackgroundColor = this.form.pageBackgroundColor;
                            this.formBackgroundImage = "";
                        }
                        $.each(this.form.formLabelDTOs, function (index: number, value: ColumnInfo) {
                            if (value.labelType == 'quiz_radio') {
                                //value.labelType = 'quiz'
                                value.choices = value.radioButtonChoices;
                                //value.choiceType = "radio";

                            } else if (value.labelType == 'quiz_checkbox') {
                                //value.labelType = 'quiz'
                                value.choices = value.checkBoxChoices;
                                //value.choiceType = "checkbox";
                            }
                        });
                        console.log(data.data);
                        this.formError = false;
                    } else {
                        this.formError = true;
                        this.customResponse = new CustomResponse('ERROR', 'Unable to load the form.Please Contact Admin', true);
                    }
                    this.ngxloading = false;
                },
                (error: string) => {
                    this.ngxloading = false;
                    this.customResponse = new CustomResponse('ERROR', 'Unable to load the form.Please Contact Admin', true);
                }
            );
        $('#form-preview-modal').modal('show');
    }

    formPreviewBeforeSave(columnInfos: Array<ColumnInfo>, form: Form) {
        this.ngxloading = true;
        this.form = form;
        this.form.formLabelDTOs = columnInfos;
        this.formError = false;
        this.ngxloading = false;
        if(this.form.showBackgroundImage){
            this.formBackgroundImage = this.form.backgroundImage;
            this.pageBackgroundColor = "";
        }else{
            this.pageBackgroundColor = this.form.pageBackgroundColor;
            this.formBackgroundImage = "";
        }
        $('#form-preview-modal').modal('show');
    }

    selectedForm(form: any, event) {
        if (event.target.checked) {
            this.selectedFormId = form.id;
            this.selectedFormData = [];
            this.selectedFormData.push(form);
        } else {
            this.selectedFormId = null;
            this.selectedFormData = [];
        }
    }

    resolved(captchaResponse: string) {
              console.log(captchaResponse)
    }
}
