import { Component, OnInit } from '@angular/core';
import { ChatGptSettingsService } from 'app/dashboard/chat-gpt-settings.service';
declare var $: any;
@Component({
  selector: 'app-domain-color-configuration',
  templateUrl: './domain-color-configuration.component.html',
  styleUrls: ['./domain-color-configuration.component.css']
})
export class DomainColorConfigurationComponent implements OnInit {
  theme: any = {};
  message: string = '';
  loading = false;

  colorFields = [
    { key: 'backgroundColor', label: 'Background Color', placeholder: '#eeeeee', group: 'theme' },
    { key: 'headerColor', label: 'Header Color', placeholder: '#eeeeee', group: 'theme' },
    { key: 'footerColor', label: 'Footer Color', placeholder: '#eeeeee', group: 'theme' },
    { key: 'buttonColor', label: 'Button Color', placeholder: '#eeeeee', group: 'theme' },
    { key: 'textColor', label: 'Background Text Color', placeholder: '#eeeeee', group: 'theme' },
    { key: 'headertextColor', label: 'Header Text Color', placeholder: '#eeeeee', group: 'theme' },
    { key: 'footertextColor', label: 'Footer Text Color', placeholder: '#eeeeee', group: 'theme' },
    { key: 'logoColor1', label: '', placeholder: '#eeeeee', group: 'logo' },
    { key: 'logoColor2', label: '', placeholder: '#eeeeee', group: 'logo' },
    { key: 'logoColor3', label: '', placeholder: '#eeeeee', group: 'logo' },
  ];

  companyProfile: any;
  selectedRefereshButton: boolean;
  hexRegex = /^#([A-Fa-f0-9]{6})$/;
    errorMessages: { [key: string]: string } = {};



  constructor(public chatGptSettingsService: ChatGptSettingsService) {}

  ngOnInit() {
    this.loadColorConfiguration();
  }

  private loadColorConfiguration(): void {
    this.loading = true;
    this.chatGptSettingsService.getDomainColorConfigurationByUserId().subscribe(
      (res: any) => {
        this.loading = false;
        if (res.statusCode === 200 && res.data) {
          this.theme = {
            backgroundColor: res.data.backgroundColor,
            headerColor: res.data.headerColor,
            footerColor: res.data.footerColor,
            buttonColor: res.data.buttonColor,
            textColor: res.data.textColor,
            headertextColor: res.data.headertextColor,
            footertextColor: res.data.footertextColor,
            logoColor1: res.data.logoColor1,
            logoColor2: res.data.logoColor2,
            logoColor3: res.data.logoColor3,
          };
          this.message = '';
          this.errorMessages = {};
        } else {
          this.handleError('No colors found for the user', null);
          this.errorMessages = {};
        }
      },
      (error) => this.handleError('Error fetching color data', error)
    );
  }


  updateTheme() {
    if (!this.theme) return;
    this.chatGptSettingsService.updateDomainColorConfiguration(this.theme).subscribe(
      (res: any) => {
        if (res && res.statusCode === 200) {
          // this.loadColorConfiguration();
        } else {
          this.handleError('Failed to update color', res);
        }
      },
      (error) => {
        this.handleError('Update failed', error);
      }
    );
  }

  private handleError(message: string, error: any): void {
    this.message = message;
    this.theme = {};
     this.selectedRefereshButton= false;
    if (error) {
      console.error(message, error);
    }
  }

 isThemeValid(): boolean {
    return this.colorFields.every(field =>
      this.hexRegex.test(this.theme[field.key] || '')
    );
  }

   onHexChange(key: string, value: string) {
    if (this.hexRegex.test(value)) {
      this.theme[key] = value;
      this.errorMessages[key] = '';     
    } else {
      this.errorMessages[key] = `Invalid hex for ${this.getLabel(key)} – use format #RRGGBB.`;
    }
  }

  getLabel(key: string): string {
    const f = this.colorFields.find(field => field.key === key);
    return f ? (f.label || 'color') : key;
  }

  

  toggleClass(id: string) {
    $("i#" + id).toggleClass("fa-minus fa-plus");
  }

  openColorPicker(fieldKey: string): void {
  const input = document.getElementById('color-picker-' + fieldKey) as HTMLInputElement;
  if (input) {
    input.click();
  }
}
getCompanyProfile(companyProfile: any) {
  this.companyProfile = companyProfile;
}

  getColorsByReferesh() {
    this.selectedRefereshButton = true;
    this.loading = true;
    this.chatGptSettingsService.checkDomainColorConfigurationExists().subscribe(
      (res: any) => {
        if (res && res.statusCode === 200 && res.access == true) {
          this.selectedRefereshButton = false;
          this.loading = false;
          this.loadColorConfiguration();
        } else {
          this.handleError('No colors found for the user', null);
          this.selectedRefereshButton = false;
          this.loading = false;
        }
      },
      (error) => this.handleError('Error fetching color data', error)
    );
  }

}
