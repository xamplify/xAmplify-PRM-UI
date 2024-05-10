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
  @Output() editTemplate = new EventEmitter();
  @ViewChild("emailTemplatePreviewPopupComponent") emailTemplatePreviewUtilComponent:EmailTemplatePreviewUtilComponent;
  constructor(private vanityURLService: VanityURLService, public httpRequestLoader: HttpRequestLoader, private authenticationService: AuthenticationService, private referenceService: ReferenceService, private pagerService: PagerService, private properties: Properties) { }

  ngOnInit() {
    this.getVanityEmailTemplates(this.pagination);
  }

  getVanityEmailTemplates(pagination: Pagination) {
    if (this.authenticationService.vanityURLEnabled) {
      this.referenceService.loading(this.httpRequestLoader, true);
      pagination.vendorCompanyProfileName = this.authenticationService.companyProfileName;
      pagination.userId = this.authenticationService.getUserId();
      pagination.maxResults = 24;
      this.vanityURLService.getVanityEmailTemplates(pagination).subscribe(result => {
        const data = result.data;
        if (result.statusCode === 200) {
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
    if(this.authenticationService.isLocalHost()){
      this.referenceService.previewVanityEmailTemplateInNewTab(emailTemplate.id);
    }else{
      this.emailTemplatePreviewUtilComponent.previewEmailTemplate(emailTemplate);
    }
  }
}
