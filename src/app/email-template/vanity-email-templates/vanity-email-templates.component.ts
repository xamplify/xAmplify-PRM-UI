import { Component, OnInit,Output,EventEmitter,ViewChild } from '@angular/core';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
import { Pagination } from 'app/core/models/pagination';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { PagerService } from 'app/core/services/pager.service';
import { VanityEmailTempalte } from '../models/vanity-email-template';
import { Properties } from 'app/common/models/properties';
import { CustomResponse } from 'app/common/models/custom-response';
import {EmailTemplatePreviewUtilComponent} from 'app/util/email-template-preview-util/email-template-preview-util.component';
import { SortOption } from 'app/core/models/sort-option';
import { UtilService } from 'app/core/services/util.service';

@Component({
  selector: 'app-vanity-email-templates',
  templateUrl: './vanity-email-templates.component.html',
  styleUrls: ['./vanity-email-templates.component.css'],
  providers: [Properties, HttpRequestLoader]
})
export class VanityEmailTemplatesComponent implements OnInit {

  pagination: Pagination = new Pagination();
  customResponse: CustomResponse = new CustomResponse();
  vanityEmailTemplate:VanityEmailTempalte = new VanityEmailTempalte();
  ngxloading = false;
  searchKey = "";
  isZeroDefaultsTemplates :boolean = false;
  vanityEmailSortOption: SortOption = new SortOption();

  @Output() editTemplate = new EventEmitter();
  @ViewChild("emailTemplatePreviewPopupComponent") emailTemplatePreviewUtilComponent:EmailTemplatePreviewUtilComponent;
  selectedTypeIndex = 0;
  constructor(private vanityURLService: VanityURLService, public httpRequestLoader: HttpRequestLoader, private authenticationService: AuthenticationService, private referenceService: ReferenceService, private pagerService: PagerService, private properties: Properties,public utilService: UtilService) { }

  ngOnInit() {
    this.showAllVanityTemplates('DEFAULT', 0);
  }

  
  showAllVanityTemplates(type: string, index: number) {
    this.selectedTypeIndex = index;
    this.pagination.filterKey = type;
    this.pagination.pageIndex = 1;
    this.vanityEmailSortOption.searchKey = "";
    this.pagination.searchKey = this.vanityEmailSortOption.searchKey;
    this.pagination = this.utilService.sortOptionValues(this.vanityEmailSortOption.vanityEmailTemplates, this.pagination);
    if(index == 1){
      this.pagination.sortcolumn ="subject";
    }
    this.getVanityEmailTemplates(this.pagination);
}
  getVanityEmailTemplates(pagination: Pagination) {
    if (this.authenticationService.vanityURLEnabled) {
      this.referenceService.loading(this.httpRequestLoader, true);
      pagination.vendorCompanyProfileName = this.authenticationService.companyProfileName;
      pagination.userId = this.authenticationService.getUserId();
      pagination.isAdmin = this.authenticationService.module.isAdmin;
      pagination.companyId = this.referenceService.companyId;
      pagination.maxResults = 12;
      this.vanityURLService.getVanityEmailTemplates(pagination).subscribe(result => {
        const data = result.data;
        if (result.statusCode === 200) {
          if(data.vanityEmailTemplates.length == 0 && (this.pagination.searchKey == '' || this.pagination.searchKey == "") && this.pagination.filterKey == "DEFAULT"){
            this.isZeroDefaultsTemplates = true;
            this.showAllVanityTemplates("CUSTOM" ,1);
            return;
          }
          pagination.totalRecords = data.totalRecords;
          pagination = this.pagerService.getPagedItems(pagination, data.vanityEmailTemplates);
        }
        this.referenceService.loading(this.httpRequestLoader, false);
      });
    }
  }

  saveOrUpdateVanityEmailTempalte(){
    this.vanityEmailTemplate.userId = this.authenticationService.getUserId();
    this.vanityEmailTemplate.companyProfileName = this.authenticationService.companyProfileName;
    this.vanityURLService.saveOrUpdateEmailTemplate(this.vanityEmailTemplate).subscribe(result => {
      if(result.statusCode === 200){
        this.customResponse = new CustomResponse('ERROR', this.properties.VANITY_URL_ET_SUCCESS_TEXT, true);
        this.getVanityEmailTemplates(this.pagination);
      }
    }, error => {
      this.customResponse = new CustomResponse('ERROR', this.properties.VANITY_URL_EMAIL_TEMPLATE_ERROR_TEXT, true)
    });
  }

  deleteVanityEmailTemplate(defaultEmailTemplateId:number){
    this.vanityURLService.deleteEmailTempalte(defaultEmailTemplateId).subscribe(result =>{
      if (result.statusCode === 200) {
        this.customResponse = new CustomResponse('SUCCESS', this.properties.VANITY_URL_ET_DELETE_TEXT, true);
        if (this.pagination.pageIndex === this.pagination.pager.totalPages && this.pagination.pagedItems.length === 1) {
          this.pagination.pageIndex = 1;
        }
        this.getVanityEmailTemplates(this.pagination);        
      }
    }, error => {
      this.customResponse = new CustomResponse('ERROR', "Error while deleting Email Template", true);
    })
  }
  designTemplate(emailTemplate:VanityEmailTempalte){
    this.editTemplate.emit(emailTemplate);
  }

  previewTemplate(emailTemplate:VanityEmailTempalte){
    this.referenceService.previewVanityEmailTemplateInNewTab(emailTemplate.id);
  }
  searchVanityEventHandler(keyCode: any) { if (keyCode === 13) { this.searchVanityEmailTemp(); } }

  searchVanityEmailTemp(){
    this.pagination.pageIndex = 1;
		this.pagination.searchKey = this.vanityEmailSortOption.searchKey;
    this.getVanityEmailTemplates(this.pagination);  

  }


  /*************************Sort********************** */
  sortEmailTemplates(text: any) {
    this.vanityEmailSortOption.vanityEmailTemplates = text;
    this.getAllFilteredResults(this.pagination);
  }
  getAllFilteredResults(pagination: Pagination) {
	this.pagination.pageIndex = 1;
	this.pagination.searchKey = this.vanityEmailSortOption.searchKey;
	this.pagination = this.utilService.sortOptionValues(this.vanityEmailSortOption.vanityEmailTemplates, this.pagination);
  if(this.selectedTypeIndex == 1){
    this.pagination.sortcolumn = "subject";
  }
	this.getVanityEmailTemplates(this.pagination);
}

setPage(event: any) {
	this.pagination.pageIndex = event.page;
	this.getVanityEmailTemplates(this.pagination);
}
}
