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
    { label: 'Background Color', key: 'backgroundColor' },
    { label: 'Header Color', key: 'headerColor' },
    { label: 'Footer Color', key: 'footerColor' },
    { label: 'Text Color', key: 'textColor' },
    { label: 'Button Color', key: 'buttonColor' }
  ];

  constructor(public chatGptSettingsService: ChatGptSettingsService) { }

  ngOnInit() {
    this.loadColorConfiguration();
  }

  private loadColorConfiguration(): void {
    this.chatGptSettingsService.getDomainColorConfigurationByUserId().subscribe(
      (res: any) => {
        if (res && res.statusCode === 200 && res.data) {
          this.theme = {
            backgroundColor: res.data.backgroundColor ,
            headerColor: res.data.headerColor,
            footerColor: res.data.footerColor,
            textColor: res.data.textColor,
            buttonColor: res.data.buttonColor
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
  console.log(this.theme); 
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
      alert('Error while updating theme');
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
}
