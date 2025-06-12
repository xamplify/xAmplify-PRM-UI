import { Component, OnInit } from '@angular/core';
import { ChatGptSettingsService } from 'app/dashboard/chat-gpt-settings.service';

@Component({
  selector: 'app-domain-color-configuration',
  templateUrl: './domain-color-configuration.component.html',
  styleUrls: ['./domain-color-configuration.component.css']
})
export class DomainColorConfigurationComponent implements OnInit {
  theme: any = {};
  message: string = '';

  colorFields = [
    { label: 'background', key: 'backgroundColor' },
    { label: 'button-text', key: 'buttonColor' },
    { label: 'footer-bg', key: 'footerColor' },
    { label: 'footer-text', key: 'textColor' },
    { label: 'header-text', key: 'headerColor' }
  ];

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
    console.log('Updating theme:', this.theme);
    this.chatGptSettingsService.updateDomainColorConfiguration(this.theme).subscribe(
      (res: any) => {
        if (res && res.statusCode === 200) {
          this.loadColorConfiguration();
        } else {
          this.handleError('Failed to update color', res);
        }
      },
      (error) => {
        console.error('Update failed:', error);
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

}
