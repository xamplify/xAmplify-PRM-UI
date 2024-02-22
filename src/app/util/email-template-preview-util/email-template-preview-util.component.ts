import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';

declare var $:any;
@Component({
  selector: 'app-email-template-preview-util',
  templateUrl: './email-template-preview-util.component.html',
  styleUrls: ['./email-template-preview-util.component.css']
})
export class EmailTemplatePreviewUtilComponent implements OnInit,OnDestroy {
  
  loadingEmailTemplate = false;
  emailTemplateName: any;
  htmlContent = "#modal-body-content";
  modalId = "#emailTemplatePreview";
  constructor(public referenceService: ReferenceService,public authenticationService:AuthenticationService) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    $(this.modalId).modal('hide');
   }

  previewEmailTemplate(emailTemplate:any){
    this.loadingEmailTemplate = true;
    this.emailTemplateName = emailTemplate.name;
    let htmlBody = emailTemplate.htmlBody;
    $(this.htmlContent).empty();
    $('.modal .modal-body').css('overflow-y', 'auto');
    $(this.modalId).modal('show');
    $('.modal .modal-body').css('max-height', $(window).height() * 0.75);
    htmlBody = htmlBody.replace( "https://xamp.io/vod/replace-company-logo.png", this.authenticationService.MEDIA_URL + this.referenceService.companyProfileImage );
    if(this.referenceService.hasMyMergeTagsExits(htmlBody)){
      this.referenceService.getSenderMergeTagsData().subscribe(
              response => {
                  if(response.statusCode==200){
                    htmlBody = this.referenceService.replaceMyMergeTags(response.data, htmlBody);
                      this.showModal(htmlBody);
                  }
              },
              error => {
                  this.showModal(htmlBody);
              }
          );

  }else{
      this.showModal(htmlBody);
  }
  }

    
  showModal(body:string){
    $(this.htmlContent).append(body);
    /*** 18-02-2024(THARAK) ADD NEW CLASS TO <tbody> TAG*****/
    $('tbody').addClass('preview-shown')
    $('.modal .modal-body').css('overflow-y', 'auto');
    $(this.modalId).modal('show');
    this.loadingEmailTemplate = false;
}



}
