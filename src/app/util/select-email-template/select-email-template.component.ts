import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { CampaignService } from 'app/campaigns/services/campaign.service';
import { Properties } from 'app/common/models/properties';
import { Pagination } from 'app/core/models/pagination';
import { SortOption } from 'app/core/models/sort-option';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PagerService } from 'app/core/services/pager.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { UtilService } from 'app/core/services/util.service';
import { EmailTemplate } from 'app/email-template/models/email-template';
import { EmailTemplateService } from 'app/email-template/services/email-template.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';

declare var $:any;
@Component({
  selector: 'app-select-email-template',
  templateUrl: './select-email-template.component.html',
  styleUrls: ['./select-email-template.component.css'],
  providers:[Properties,SortOption],
})
export class SelectEmailTemplateComponent implements OnInit {

  emailTemplatesPagination:Pagination = new Pagination();
  @Output() selectedEmailTemplateEventEmitter = new EventEmitter();
  @Input() selectedEmailTemplateId = 0;
  emailTemplatesLoader = false;
  ngxLoading: boolean;
  emailTemplateIdForSendTestEmail: any;
  emailTemplateNameForSendTestEmail: any;
  emailTemplate: any;
  isEmailTemplateSelected = false;
  sendTestEmailToolTip = "";
  selectedEmailTemplateIdForPreview = 0;
  selectedEmailTemplateNameForPreview = "";
  isPreviewEmailTemplateButtonClicked = false;
  emailTemplatesSortOption:SortOption = new SortOption();
  loggedInUserId: any;
  selectedEmailTemplate = {};
  openEditTemplateModalPopup = false;
  constructor(private campaignService:CampaignService,private xtremandLogger:XtremandLogger,
    private pagerService:PagerService,private properties:Properties,
    private authenticationService:AuthenticationService,
    private emailTemplateService:EmailTemplateService,private utilService:UtilService,public referenceService:ReferenceService) { }

  ngOnInit() {
    this.emailTemplatesLoader = true;
    this.emailTemplatesPagination.maxResults = 4;
    this.loggedInUserId = this.authenticationService.getUserId();
    this.emailTemplatesPagination.userId = this.loggedInUserId;
    this.findEmailTemplates(this.emailTemplatesPagination);
  }

  findEmailTemplates(pagination:Pagination){
    this.emailTemplatesLoader = true;
    this.campaignService.findCampaignEmailTemplates(pagination).subscribe(
      response=>{
          const data = response.data;
          pagination.totalRecords = data.totalRecords;
          this.emailTemplatesSortOption.totalRecords = data.totalRecords;
          pagination = this.pagerService.getPagedItems(pagination, data.list);
          this.emailTemplatesLoader = false;
      },error=>{
          this.xtremandLogger.errorPage(error);
      });
  }

  findEmailTemplatesOnEnterKeyPress(eventKeyCode:number){
    if(eventKeyCode==13){
        this.searchEmailTemplates();
    }
}

  paginateEmailTempaltes(event:any){
    this.emailTemplatesPagination.pageIndex = event.page;
    this.findEmailTemplates(this.emailTemplatesPagination);
  }

  sortEmailTemplates(text: any) {
    this.emailTemplatesSortOption.selectedCampaignEmailTemplateDropDownOption = text;
    this.setSearchAndSortOptionsForEmailTemplates(this.emailTemplatesPagination, this.emailTemplatesSortOption);
  }

  searchEmailTemplates(){
      this.setSearchAndSortOptionsForEmailTemplates(this.emailTemplatesPagination,this.emailTemplatesSortOption);
  }

  setSearchAndSortOptionsForEmailTemplates(pagination: Pagination, emailTemplatesSortOption: SortOption){
    pagination.pageIndex = 1;
    pagination.searchKey = emailTemplatesSortOption.searchKey;
    pagination = this.utilService.sortOptionValues(emailTemplatesSortOption.selectedCampaignEmailTemplateDropDownOption, pagination);
    this.findEmailTemplates(pagination);
  }

  callEmitter(emailTemplateId:number){
    this.selectedEmailTemplateId = emailTemplateId;
    this.selectedEmailTemplateEventEmitter.emit(emailTemplateId);
  }

  selectEmailTemplate(emailTemplate:any){
    this.ngxLoading = true;
    this.emailTemplateIdForSendTestEmail = emailTemplate.id;
    this.emailTemplateNameForSendTestEmail = emailTemplate.name;
    this.emailTemplateService.getById(emailTemplate.id)
        .subscribe(
            (data: any) => {
                this.emailTemplate = data;
                this.selectedEmailTemplateId = emailTemplate.id;
                this.isEmailTemplateSelected = true;
                this.sendTestEmailToolTip = "Send Test Email";
                this.selectedEmailTemplateEventEmitter.emit(this.selectedEmailTemplateId);
                this.ngxLoading = false;
            },
            error => {
                this.isEmailTemplateSelected = false;
                this.ngxLoading = false;
    });
}

previewEmailTemplate(emailTemplate:any){
    this.selectedEmailTemplateIdForPreview = emailTemplate.id;
    this.selectedEmailTemplateNameForPreview = emailTemplate.name;
    this.isPreviewEmailTemplateButtonClicked = true;

}

previewEmailTemplateModalPopupEventReceiver(){
  this.selectedEmailTemplateIdForPreview = 0;
  this.selectedEmailTemplateNameForPreview = "";
  this.isPreviewEmailTemplateButtonClicked = false;
}

editTemplate(emailTemplate:any){
    this.selectedEmailTemplate = emailTemplate;
    this.openEditTemplateModalPopup = true;

}

closeEditTemplateModalPopup(){
  this.selectedEmailTemplate = {};
  this.openEditTemplateModalPopup = false;
}



  



}
