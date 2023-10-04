import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { Properties } from 'app/common/models/properties';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { EmailTemplate } from 'app/email-template/models/email-template';
import { EmailTemplateService } from 'app/email-template/services/email-template.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';

declare var $:any;
@Component({
  selector: 'app-edit-template-or-page-modal-popup',
  templateUrl: './edit-template-or-page-modal-popup.component.html',
  styleUrls: ['./edit-template-or-page-modal-popup.component.css'],
  providers:[Properties]
})
export class EditTemplateOrPageModalPopupComponent implements OnInit {
  @Input() emailTemplate:any;
  @Output() editTemplateOrPageModalPopupEventEmitter = new EventEmitter();
  ngxloading = false;
  isShowEditTemplateMessageDiv: boolean;
  isEditTemplateLoader: boolean;
  beeContainerInput = {};
  isShowEditTemplatePopup: boolean;
  editTemplateMergeTagsInput= {};
  templateMessageClass: string;
  templateUpdateMessage: string;
  constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService,public xtremandLogger:XtremandLogger,
    public properties:Properties,public emailTemplateService:EmailTemplateService) { }

  ngOnInit() {
    this.isEditTemplateLoader = true;
    this.referenceService.openModalPopup("edit-template-modal");
    this.editTemplate(this.emailTemplate);
  }



  editTemplate(emailTemplate:any){
    this.isShowEditTemplateMessageDiv = false;
    if (emailTemplate['emailTemplateType'] != 'UPLOADED' && emailTemplate.userDefined) {
        this.isEditTemplateLoader = true;
        this.referenceService.goToTop();
       $('#email-templates-list').hide(600);
       $('#edit-email-template').show(600);
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
                this.ngxloading = false;
            }, error => {
                this.ngxloading = false;
                this.closeModal();
                this.referenceService.showSweetAlertServerErrorMessage();
            }
        );
    } else {
        this.ngxloading = false;
        this.isEditTemplateLoader = false;
        this.closeModal();
        this.referenceService.showSweetAlertErrorMessage('Uploaded Templates Cannot Be Edited');
    }
  }
  
  closeModal() {
    this.editTemplateOrPageModalPopupEventEmitter.emit();
    this.referenceService.closeModalPopup("edit-template-modal");
    this.isShowEditTemplatePopup = false;
    this.isEditTemplateLoader = false;
    this.beeContainerInput = {};
    this.editTemplateMergeTagsInput = {};
  }
  
  updateTemplate(event:any){
    this.ngxloading =true;
    this.updateEmailTemplate(event);
  }
  updateEmailTemplate(event: any) {
   let emailTemplate = new EmailTemplate();
   emailTemplate.id = event.id;
   emailTemplate.jsonBody = event.jsonContent;
   emailTemplate.body = event.htmlContent;
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
    this.ngxloading =false;
    this.isShowEditTemplateMessageDiv = true;
    this.templateMessageClass = "alert alert-success";
    this.templateUpdateMessage = "Template Updated Successfully";
    this.referenceService.goToTop();
  }
  
  showTemplateUpdateErrorMessage(){
    this.ngxloading =false;
    this.templateMessageClass = "alert alert-danger";
    this.templateUpdateMessage = this.properties.serverErrorMessage;
    this.isShowEditTemplateMessageDiv = true;
  }
  
  showUpdateTemplateErrorMessage(message: string){
    this.ngxloading =false;
    this.templateMessageClass = "alert alert-danger";
    if (message != undefined && message != null && message.trim().length > 0) {
        this.templateUpdateMessage = message;
    } else {
        this.templateUpdateMessage = this.properties.serverErrorMessage;
    }
    
    this.isShowEditTemplateMessageDiv = true;
  }
    

}
