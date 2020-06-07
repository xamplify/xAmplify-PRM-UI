import { Component, OnInit } from '@angular/core';
import { ReferenceService } from '../../core/services/reference.service';

declare var $,swal:any;
@Component({
  selector: 'app-email-template-preview-util',
  templateUrl: './email-template-preview-util.component.html',
  styleUrls: ['./email-template-preview-util.component.css']
})
export class EmailTemplatePreviewUtilComponent implements OnInit {
  loadingEmailTemplate = false;
  emailTemplateName: any;
  htmlContent = "#modal-body-content";
  modalId = "#emailTemplatePreview";
  constructor(public referenceService: ReferenceService) { }

  ngOnInit() {
  }

  previewEmailTemplate(emailTemplate:any){
    this.loadingEmailTemplate = true;
    this.emailTemplateName = emailTemplate.name;
    let htmlBody = emailTemplate.htmlBody;
    $(this.htmlContent).empty();
    $('.modal .modal-body').css('overflow-y', 'auto');
    $(this.modalId).modal('show');
    $('.modal .modal-body').css('max-height', $(window).height() * 0.75);
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
    $('.modal .modal-body').css('overflow-y', 'auto');
    $(this.modalId).modal('show');
    this.loadingEmailTemplate = false;
}



}
