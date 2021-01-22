import { Component, OnInit, OnDestroy, ViewChild, } from '@angular/core';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { LmsService } from '../services/lms.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Form } from '../../forms/models/form';
import { FormService } from '../../forms/services/form.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { CustomResponse } from '../../common/models/custom-response';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { SortOption } from '../../core/models/sort-option';
import { ColumnInfo } from '../../forms/models/column-info';
import { DomSanitizer } from "@angular/platform-browser";
import { EnvService } from 'app/env.service'
import { UtilService } from '../../core/services/util.service';
import { Tag } from 'app/dashboard/models/tag'
import { UserService } from '../../core/services/user.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Lms } from '../models/lms'
import { DragulaService } from 'ng2-dragula';

declare var $, CKEDITOR: any;
@Component({
  selector: 'app-add-lms',
  templateUrl: './add-lms.component.html',
  styleUrls: ['./add-lms.component.css'],
  providers: [HttpRequestLoader, Pagination, SortOption, FormService]
})
export class AddLmsComponent implements OnInit {

  form: Form = new Form();
  ngxloading = false;
  loading = false;
  formError = false;
  customResponse: CustomResponse = new CustomResponse();
  formsError: boolean = false;
  pagination: Pagination = new Pagination();
  formsLoader: HttpRequestLoader = new HttpRequestLoader();
  name = 'ng2-ckeditor';
  ckeConfig: any;
  @ViewChild("myckeditor") ckeditor: any;
  formBackgroundImage = "";
  pageBackgroundColor = "";
  siteKey = "";
  selectedFormData: Array<Form> = [];
  selectedFormId: number;
  selectedTags: number[] = [];
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  loggedInUserId = 0;
  tags: Array<Tag> = new Array<Tag>();
  tagPagination: Pagination = new Pagination();
  categoryNames: any;
  activeTabName: string = "";
  lms: Lms = new Lms();
  forms: Array<Form> = new Array<Form>();
  quizForms= [];
  selectedDams = [
    { 'id': '0', 'name': ''}
  ];
  damList = [
    { 'id': '1', 'name': 'DAM-1' },
    { 'id': '2', 'name': 'DAM-2' },
    { 'id': '3', 'name': 'DAM-3' },
    { 'id': '4', 'name': 'DAM-4' },
    { 'id': '5', 'name': 'DAM-5' }
  ];

  selectedGroups = [
    { 'id': '0', 'name': ''}
  ];
  selectedCompanies = [
    { 'id': '0', 'name': ''}
  ];

  groupsList = [
    { 'id': '1', 'name': 'GROUP-1' },
    { 'id': '2', 'name': 'GROUP-2' },
    { 'id': '3', 'name': 'GROUP-3' },
    { 'id': '4', 'name': 'GROUP-4' },
    { 'id': '5', 'name': 'GROUP-5' }
  ];

  companiesList = [
    { 'id': '1', 'name': 'COMPANY-1' },
    { 'id': '2', 'name': 'COMPANY-2' },
    { 'id': '3', 'name': 'COMPANY-3' },
    { 'id': '4', 'name': 'COMPANY-4' },
    { 'id': '5', 'name': 'COMPANY-5' }
  ];

  constructor(public userService: UserService, private dragulaService: DragulaService, public logger: XtremandLogger, private formService: FormService, private route: ActivatedRoute, public referenceService: ReferenceService, public authenticationService: AuthenticationService, public lmsService: LmsService, private router: Router, public sortOption: SortOption, public pagerService: PagerService, public sanitizer: DomSanitizer, public envService: EnvService, public utilService: UtilService) {
    this.siteKey = this.envService.captchaSiteKey;
    this.loggedInUserId = this.authenticationService.getUserId();
    this.listTags(this.tagPagination);
    this.listCategories();
    dragulaService.setOptions('asset-options', {})
    dragulaService.dropModel.subscribe((value) => {
      this.onDropModel(value);
    });
    this.pagination.userId = this.loggedInUserId;
    this.listForms(this.pagination);
  }

  ngOnInit() {
    this.activeTabName = 'content';
    this.pagination.userId = this.loggedInUserId;
  }

  ngOnDestroy() {
    this.dragulaService.destroy('asset-options');
  }

  private onDropModel(args) {
  }

  /************List Available Forms******************/
  getFormsList() {
    this.formsError = false;
    this.customResponse = new CustomResponse();
    this.pagination.userId = this.loggedInUserId;
    this.listForms(this.pagination);
    $('#forms-list').modal('show');
  }

  listForms(pagination: Pagination) {
    this.referenceService.loading(this.httpRequestLoader, true);
    const self = this;
    this.formService.list(pagination).subscribe(
      (response: any) => {
        const data = response.data;
        pagination.totalRecords = data.totalRecords;
        this.sortOption.totalRecords = data.totalRecords;
        pagination = this.pagerService.getPagedItems(pagination, data.forms);
        self.quizForms = [];
        $.each(data.forms, function (index: number, form: Form) {
          if (form.quizForm) {
            self.quizForms.push(form);
          }
        });
        this.referenceService.loading(this.httpRequestLoader, false);
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

  // if(CKEDITOR!=undefined){
  //   for (var instanceName in CKEDITOR.instances) {
  //       CKEDITOR.instances[instanceName].updateElement();
  //       this.form.footer = CKEDITOR.instances[instanceName].getData();
  //   }
  // }

  /*****************Preview Form*******************/
  previewForm(id: number) {
    this.customResponse = new CustomResponse();
    this.ngxloading = true;
    this.formService.getById(id)
      .subscribe(
        (data: any) => {
          if (data.statusCode === 200) {
            this.form = data.data;
            if (this.form.showBackgroundImage) {
              this.formBackgroundImage = this.form.backgroundImage;
              this.pageBackgroundColor = "";
            } else {
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

  updateSelectedTags(tag: Tag, event: any) {
    if (event.target.checked) {
      this.selectedTags.push(tag.id);
    } else {
      this.selectedTags.splice($.inArray(tag.id), 1);
    }
    console.log(this.selectedTags)
  }

  listTags(pagination: Pagination) {
    pagination.userId = this.loggedInUserId;
    this.referenceService.startLoader(this.httpRequestLoader);
    this.userService.getTags(pagination)
      .subscribe(
        response => {
          const data = response.data;
          this.tags = data.tags;
          this.referenceService.stopLoader(this.httpRequestLoader);
        },
        (error: any) => {
          this.customResponse = this.referenceService.showServerErrorResponse(this.httpRequestLoader);
        },
        () => this.logger.info('Finished listTags()')
      );
  }

  listCategories() {
    this.referenceService.startLoader(this.httpRequestLoader);
    this.authenticationService.getCategoryNamesByUserId(this.loggedInUserId).subscribe(
      (data: any) => {
        this.categoryNames = data.data;
        this.referenceService.stopLoader(this.httpRequestLoader);
      },
      error => { this.logger.error("error in getCategoryNamesByUserId(" + this.loggedInUserId + ")", error); },
      () => this.logger.info("Finished listCategories()"));
  }

  activateTab(activeTabName: any) {
    this.activeTabName = activeTabName;
  }

  clearCustomResponse() { this.customResponse = new CustomResponse(); }

  addDam(){
    this.selectedDams.push({'id':'0','name':'',});
  }

  removeDam(index: number){
    if(this.selectedDams.length > 1){
      this.selectedDams.splice(index, 1);
    }
  }

  updateSelectedDams(index: number, dam:any){
    this.selectedDams[index].id = dam.id;
  }

  addGroup(){
    this.selectedGroups.push({'id':'0','name':'',});
  }

  removeGroup(index: number){
    if(this.selectedGroups.length > 1 || this.selectedCompanies.length > 0){
      this.selectedGroups.splice(index, 1);
    }
  }
  
  updateSelectedGroups(index: number, group:any){
    this.selectedGroups[index].id = group.id;
  }

  addCompany(){
    this.selectedCompanies.push({'id':'0','name':'',});
  }

  removeCompany(index: number){
    if(this.selectedCompanies.length > 1 || this.selectedGroups.length > 0){
      this.selectedCompanies.splice(index, 1);
    }
  }

  updateSelectedCompanies(index: number, company:any){
    this.selectedCompanies[index].id = company.id;
  }

}
