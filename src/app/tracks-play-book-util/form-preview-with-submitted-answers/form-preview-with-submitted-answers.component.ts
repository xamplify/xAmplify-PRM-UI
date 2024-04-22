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
    selectedPartnerFormAnswers : any;
    quizScore:number;
    maxScore: number;

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

    setFormSubmitValues(data: any) {
      this.quizScore = data.score;
      this.maxScore = data.maxScore;
      let answers = data.submittedData;
      $.each(this.form.formLabelDTORows, function (index: number, formLabelDTORow: any) {
        $.each(formLabelDTORow.formLabelDTOs, function (columnIndex: number, value: any) {
          if (answers !== undefined && answers[value.id] !== undefined) {
            if (value.labelType === "select") {
              value.value = answers[value.id].submittedAnswer[0];
            } else {
              value.value = answers[value.id].submittedAnswer;
              if (value.labelType === "upload") {
                let lastIndex = value.value.lastIndexOf("/");
                let fileName = value.value.substring(lastIndex + 1);
                value['fileName'] = fileName;
              }
            }
            let choices: any;
            if (value.labelType === "quiz_radio" || value.labelType === "quiz_checkbox") {
              choices = value.choices;
            } else if (value.labelType === "radio") {
              choices = value.radioButtonChoices;
            } else if (value.labelType === "checkbox") {
              choices = value.checkBoxChoices;
            }
            $.each(choices, function (index: number, choice: any) {
              if (value.value.indexOf(choice.id) > -1) {
                choice.isSelected = true;
              } else {
                choice.isSelected = false;
              }
            });
            value.skipped = answers[value.id].skipped;
            value.submittedAnswerCorrect = answers[value.id].submittedAnswerCorrect;
          } else {
            value.value = "";
            value.skipped = true;
          }
        });
      });
    }
    
    showFormWithAnswers(selectedPartnerFormAnswers: Map<number, any>, formId: number, formInput: Form, formBackgroundImage: string, pageBackgroundColor: string){
        this.form = formInput;
        this.selectedPartnerFormAnswers = selectedPartnerFormAnswers;
        this.formBackgroundImage = formBackgroundImage;
        this.pageBackgroundColor = pageBackgroundColor;
        this.setFormSubmitValues(this.selectedPartnerFormAnswers);
        this.setCustomCssValues();
        $('#form-preview-modal').modal('show');
    }

    setCustomCssValues() {
      document.documentElement.style.setProperty('--form-page-bg-color', this.pageBackgroundColor);
      document.documentElement.style.setProperty('--form-border-color', this.form.borderColor);
      document.documentElement.style.setProperty('--form-label-color', this.form.labelColor);
      document.documentElement.style.setProperty('--form-description-color', this.form.descriptionColor);
      document.documentElement.style.setProperty('--form-title-color', this.form.titleColor);
      document.documentElement.style.setProperty('--form-bg-color', this.form.backgroundColor);
      require("style-loader!../../../assets/admin/layout2/css/themes/form-custom-skin.css");
  }
 }
