import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import{FormsModule } from '@angular/forms';
import { AuthenticationService } from 'app/core/services/authentication.service';
declare var swal:any;
@Component({
  selector: 'app-choose-emailtemplate',
  templateUrl: './choose-emailtemplate.component.html',
  styleUrls: ['./choose-emailtemplate.component.css']
})
export class ChooseEmailtemplateComponent implements OnInit {
@Input () selectedTemplateList: any[] = [];
@Output() notifyData: EventEmitter<any> = new EventEmitter();
selectedTemplate : any;
 selectedEmailTemplateRow = 0;
 @Input() fromOliverPopup: boolean = false;
 selectedTemplatetype: any[] = [];
  filterType: string;
@Input() pageView : boolean = false;
TemplateColorSelection = ['Default Colors', 'Brand Colors'];
isOliverCreateUrl: boolean;
selectedType: any = this.TemplateColorSelection[0];
  isConfirmed: boolean;
  constructor(public authenticationService: AuthenticationService) { }

  ngOnInit() {
    if(this.pageView){
      this.showPageTemplates('All');
    }else{
      this.showEmailTemplates('All');
    }
  }

  generateEmailTemplate() {
    this.notifyData.emit({
      selectedTemplate: this.selectedTemplate,
      isConfirmed: this.isConfirmed
    });
    this.isConfirmed = false;

  }
  selectEmailTemplate(emailTemplate: any) {
    this.selectedEmailTemplateRow = emailTemplate.id;
    this.selectedTemplate = emailTemplate;
  }
  closeSelectionTemplate() {
    this.selectedTemplate = null;
    this.selectedEmailTemplateRow = 0;
    this.notifyData.emit();
  }
  showEmailTemplates(type: any) {
    this.filterType = type;
    if(type == 'Email') {
        this.selectedTemplatetype = this.selectedTemplateList.filter((item: any) => item.beeRegularTemplate == true);
    } else if(type == 'EmailCo-branding') {
      this.selectedTemplatetype = this.selectedTemplateList.filter((item: any) => item.regularCoBrandingTemplate == true);
    }else{
      this.selectedTemplatetype = this.selectedTemplateList;
      if (this.authenticationService.module.isMarketing || this.authenticationService.module.isMarketingCompany || this.authenticationService.module.isMarektingAndPartner ||
        this.authenticationService.module.isMarketingAndPartnerTeamMember || this.authenticationService.module.isMarketingTeamMember) {
        this.selectedTemplatetype = this.selectedTemplatetype.filter(
          (item: any) => item.regularCoBrandingTemplate !== true
        );
      }
    }
  }

  showPageTemplates(type: any) {
    this.filterType = type;
    if(type == 'Regular') {
        this.selectedTemplatetype = this.selectedTemplateList.filter((item: any) => item.coBranded == false);
    } else if(type == 'Cobranded') {
      this.selectedTemplatetype = this.selectedTemplateList.filter((item: any) => item.coBranded == true);
    } else {
      this.selectedTemplatetype = this.selectedTemplateList;
      if (this.authenticationService.module.isMarketing || this.authenticationService.module.isMarketingCompany || this.authenticationService.module.isMarektingAndPartner ||
        this.authenticationService.module.isMarketingAndPartnerTeamMember || this.authenticationService.module.isMarketingTeamMember) {
        this.selectedTemplatetype = this.selectedTemplatetype.filter(
          (item: any) => item.coBranded !== true
        );
      }
    }
  }
  
  showSweetAlertForBrandColors() {
  let self = this;
  swal({
    title: 'Generate Template',
    text: 'Do you want to generate this template with brand colors?',
    type: 'info',
    showCancelButton: true,
    confirmButtonColor: '#54a7e9',
    cancelButtonColor: '#999',
    confirmButtonText: 'Yes',
    cancelButtonText: 'No'
  }).then(function (result: any) {
    self.isConfirmed = true;
    self.generateEmailTemplate();
  }, function (dismiss: any) {
    self.isConfirmed = false;
    self.generateEmailTemplate();
  });
}
}
