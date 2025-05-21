import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import{FormsModule } from '@angular/forms';

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
  constructor() { }

  ngOnInit() {
   this.showEmailTemplates('All');
  }

  generateEmailTemplate() {
    this.notifyData.emit(this.selectedTemplate);
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
    }
  }
}
