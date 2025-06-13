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

  colorFields = [
    { key: 'backgroundColor', label: 'Background Color', placeholder: '#eeeeee'},
    { key: 'headerColor', label: 'Header Color', placeholder: '#eeeeee'},
    { key: 'footerColor', label: 'Footer Color', placeholder: '#eeeeee' },
    { key: 'buttonColor', label: 'Button Color', placeholder: '#eeeeee' },
    { key: 'textColor', label: 'Text Color', placeholder: '#eeeeee' }
  ];
  companyProfile: any;

  constructor(public chatGptSettingsService: ChatGptSettingsService) {}

  ngOnInit() {
    this.loadColorConfiguration();
  }

  private loadColorConfiguration(): void {
    this.chatGptSettingsService.getDomainColorConfigurationByUserId().subscribe(
      (res: any) => {
        if (res && res.statusCode === 200 && res.data) {
          this.theme = {
            backgroundColor: res.data.backgroundColor,
            buttonColor: res.data.buttonColor,
            footerColor: res.data.footerColor,
            textColor: res.data.textColor,
            headerColor: res.data.headerColor
          };
          this.message = '';
        } else {
          this.handleError('No colors found for the user', null);
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
          this.loadColorConfiguration();
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
    if (error) {
      console.error(message, error);
    }
  }

  isThemeValid(): boolean {
    const hexRegex = /^#([A-Fa-f0-9]{6})$/;
    return this.colorFields.every(field =>
      this.theme[field.key] && hexRegex.test(this.theme[field.key])
    );
  }

  onHexChange(key: string, value: string) {
    const hexRegex = /^#([A-Fa-f0-9]{6})$/;
    if (value && hexRegex.test(value)) {
      this.theme[key] = value;
    }
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
    this.chatGptSettingsService.checkDomainColorConfigurationExists().subscribe(
      (res: any) => {
        if (res && res.statusCode === 200 && res.access == true) {
          this.loadColorConfiguration();
        } else {
          this.handleError('No colors found for the user', null);
        }
      },
      (error) => this.handleError('Error fetching color data', error)
    );
  }

}
