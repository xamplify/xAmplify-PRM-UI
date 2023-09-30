import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { CampaignService } from 'app/campaigns/services/campaign.service';
import { Properties } from 'app/common/models/properties';
import { Pagination } from 'app/core/models/pagination';
import { SortOption } from 'app/core/models/sort-option';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PagerService } from 'app/core/services/pager.service';
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
  isShowEditTemplateMessageDiv: boolean;
  isEditTemplateLoader: boolean;
  referenceService: any;
  beeContainerInput: any;
  isShowEditTemplatePopup: boolean;
  editTemplateMergeTagsInput: {};
  loggedInUserId: any;
  templateMessageClass: string;
  templateUpdateMessage: string;
  constructor(private campaignService:CampaignService,private xtremandLogger:XtremandLogger,
    private pagerService:PagerService,private properties:Properties,
    private authenticationService:AuthenticationService,
    private emailTemplateService:EmailTemplateService,private utilService:UtilService) { }

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

  callEmitter(){
    this.selectedEmailTemplateEventEmitter.emit('S u c c e s s ');
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
  this.isShowEditTemplateMessageDiv = false;
  if (emailTemplate['emailTemplateType'] != 'UPLOADED' && emailTemplate.userDefined) {
      this.isEditTemplateLoader = true;
      this.referenceService.goToTop();
     $('#campaign-details-and-launch-tabs').hide(600);
     $('#edit-campaign-template').show(600);
     this.beeContainerInput['emailTemplateName'] = emailTemplate.name;
     this.emailTemplateService.findJsonBody(emailTemplate.id).subscribe(
          response => {
              this.beeContainerInput['module'] = "emailTemplates";
              this.beeContainerInput['jsonBody'] = response;
              this.beeContainerInput['id'] = emailTemplate.id;
              /****XBI-1685******/
              let anyCoBrandingTemplate = emailTemplate['regularCoBrandingTemplate'] || emailTemplate['surveyCoBrandingTemplate'] ||
              emailTemplate['videoCoBrandingTemplate'] || emailTemplate['beeEventCoBrandingTemplate'] ;
              this.beeContainerInput['anyCoBrandingTemplate'] =anyCoBrandingTemplate;
              this.beeContainerInput['isVideoTemplate'] = emailTemplate['videoTemplate'] || emailTemplate['videoCoBrandingTemplate'] || emailTemplate['beeVideoTemplate'];
              /****XBI-1685******/
              this.isShowEditTemplatePopup = true;
              this.isEditTemplateLoader = false;
          }, error => {
              this.hideEditTemplateDiv();
              this.referenceService.showSweetAlertServerErrorMessage();
          }
      );
  } else {
      this.referenceService.showSweetAlertErrorMessage('Uploaded Templates Cannot Be Edited');
  }
}

hideEditTemplateDiv() {
  $('#edit-campaign-template').hide(600);
  this.isShowEditTemplatePopup = false;
  this.isEditTemplateLoader = false;
  this.beeContainerInput = {};
  this.editTemplateMergeTagsInput = {};
  $('#campaign-details-and-launch-tabs').show(600);
}

updateTemplate(event:any){
  this.ngxLoading =true;
  let module = event['module'];
  this.updateEmailTemplate(event);
}
updateEmailTemplate(event: any) {
 let emailTemplate = new EmailTemplate();
 emailTemplate.id = event.id;
 emailTemplate.jsonBody = event.jsonContent;
 emailTemplate.body = event.htmlContent;
 emailTemplate.userId = this.loggedInUserId;
 this.emailTemplateService.updateJsonAndHtmlBody(emailTemplate).subscribe(
     response => {
         if (response.statusCode == 200) {
             this.showTemplateUpdatedSuccessMessage();
         } else if (response.statusCode == 500) {
             this.showUpdateTemplateErrorMessage(response.message);
         }                
     }, error => {
         this.showTemplateUpdateErrorMessage();
     }
 )
}


showTemplateUpdatedSuccessMessage(){
  this.ngxLoading =false;
  this.isShowEditTemplateMessageDiv = true;
  this.templateMessageClass = "alert alert-success";
  this.templateUpdateMessage = "Template Updated Successfully";
  this.referenceService.goToTop();
}

showTemplateUpdateErrorMessage(){
  this.ngxLoading =false;
  this.templateMessageClass = "alert alert-danger";
  this.templateUpdateMessage = this.properties.serverErrorMessage;
  this.isShowEditTemplateMessageDiv = true;
}

showUpdateTemplateErrorMessage(message: string){
  this.ngxLoading =false;
  this.templateMessageClass = "alert alert-danger";
  if (message != undefined && message != null && message.trim().length > 0) {
      this.templateUpdateMessage = message;
  } else {
      this.templateUpdateMessage = this.properties.serverErrorMessage;
  }
  
  this.isShowEditTemplateMessageDiv = true;
}
  

  



}
