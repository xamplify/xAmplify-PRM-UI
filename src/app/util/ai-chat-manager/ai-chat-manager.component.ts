import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { AssetDetailsViewDto } from 'app/dam/models/asset-details-view-dto';
import { ChatGptSettingsService } from 'app/dashboard/chat-gpt-settings.service';

@Component({
  selector: 'app-ai-chat-manager',
  templateUrl: './ai-chat-manager.component.html',
  styleUrls: ['./ai-chat-manager.component.css']
})
export class AiChatManagerComponent implements OnInit {
  @Input() assetDetailsViewDto: AssetDetailsViewDto = new AssetDetailsViewDto();
  openHistory: boolean;
  messages: any[] = [];
  isValidInputText: boolean;
  inputText: string = "";
  trimmedText: string = "";
  chatGptGeneratedText: string = "";
  properties: any;
  @Output() notifyParent: EventEmitter<any> = new EventEmitter();
  @Input() pdfFile: File;
  constructor(public authenticationService: AuthenticationService, private chatGptSettingsService: ChatGptSettingsService, private referenceService: ReferenceService,) { }

  ngOnInit() {
    alert(this.pdfFile);
    // this.chatGptSettingsService.onUpload(this.pdfFile);
  }
  setInputText(text: string) {
    this.inputText = text;
    this.validateInputText();
  }

  submitdata() {
    this.openHistory = true;
    this.AskAiTogetData();
  }
  closeHistory() {
    this.openHistory = false;
  }
  validateInputText() {
    this.trimmedText = this.referenceService.getTrimmedData(this.inputText);
    this.isValidInputText = this.trimmedText != undefined && this.trimmedText.length > 0;
  }
  
  AskAiTogetData() {
    this.openHistory = true; 
    this.messages.push({ role: 'user', content: this.trimmedText });
    this.inputText = '';
    var self = this;
    this.chatGptSettingsService.generateText(this.trimmedText).subscribe(
      function (response) {
        console.log('API Response:', response);

        var data = response.data;
        var reply = 'No response received from ChatGPT.';

        if (data && data.apiResponse && data.apiResponse.choices && data.apiResponse.choices.length > 0) {
          var content = data.apiResponse.choices[0].message.content;
          self.chatGptGeneratedText = self.referenceService.getTrimmedData(content);
          self.messages.push({ role: 'assistant', content: self.chatGptGeneratedText });
        } else {
          self.messages.push({ role: 'assistant', content: 'Invalid response from ChatGPT.' });
        }
        this.trimmedText = '';
      },
      function (error) {
        console.log('API Error:', error);
        self.messages.push({ role: 'assistant', content: self.properties.serverErrorMessage });
      }
    );
  }
  closeAi() {
    this.notifyParent.emit();
  }
  copyAiText(text: string) {
    this.copyToClipboard(text);
  }
  
  copyToClipboard(text: string) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.pdfFile = file;
      console.log('PDF selected:', file.name);
      this.assetDetailsViewDto.assetName = file.name.replace(/\.pdf/i, '');
      this.assetDetailsViewDto.displayTime = new Date();
      this.chatGptSettingsService.onUpload(this.pdfFile);
    } else {
      alert('Please upload a valid PDF file.');
    }
  }
  
}
