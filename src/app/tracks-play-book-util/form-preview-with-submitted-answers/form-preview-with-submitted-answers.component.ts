import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ReferenceService } from '../../core/services/reference.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { FormService } from '../../forms/services/form.service';
import { Form } from '../../forms/models/form';
import { ColumnInfo } from '../../forms/models/column-info';
import { FormOption } from '../../forms/models/form-option';
import { CustomResponse } from '../../common/models/custom-response';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { SortOption } from '../../core/models/sort-option';
import { UtilService } from '../../core/services/util.service';
import { environment } from 'environments/environment';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
import { DomSanitizer } from "@angular/platform-browser";
import { EnvService } from 'app/env.service';

declare var swal, $: any;

@Component({
  selector: 'app-form-preview-with-submitted-answers',
  templateUrl: './form-preview-with-submitted-answers.component.html',
  styleUrls: ['./form-preview-with-submitted-answers.component.css'],
  providers: [HttpRequestLoader, Pagination, SortOption, FormService]
})
export class FormPreviewWithSubmittedAnswersComponent implements OnInit, OnDestroy {

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
    selectedPartnerFormAnswers : Map<number, any> = new Map<number, any>();

    constructor(private formService: FormService, public envService: EnvService, public logger: XtremandLogger, public authenticationService: AuthenticationService,
        public referenceService: ReferenceService, public sortOption: SortOption, public pagerService: PagerService, public utilService: UtilService,
        public router: Router, private vanityUrlService: VanityURLService, public sanitizer: DomSanitizer) {
        this.pagination.vanityUrlFilter = this.vanityUrlService.isVanityURLEnabled();
        this.siteKey = this.envService.captchaSiteKey;
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        $('#form-preview-modal').modal('hide');
    }

    resolved(captchaResponse: string) {
              console.log(captchaResponse)
    }

    setFormSubmitValues() {
        let self = this;
        $.each(this.form.formLabelDTOs, function (index: number, value: ColumnInfo) {
           if(self.selectedPartnerFormAnswers !== undefined && self.selectedPartnerFormAnswers[value.id] !== undefined) {
               value.value = self.selectedPartnerFormAnswers[value.id];
           } else {
            value.value = "";
           }
        });
    }

    showFormWithAnswers(selectedPartnerFormAnswers: Map<number, any>, formId: number, formInput: Form, formBackgroundImage: string, pageBackgroundColor: string){
        this.form = formInput;
        this.selectedPartnerFormAnswers = selectedPartnerFormAnswers;
        this.formBackgroundImage = formBackgroundImage;
        this.pageBackgroundColor = pageBackgroundColor;
        this.setFormSubmitValues();
        $('#form-preview-modal').modal('show');
    }
 }
