import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { AssetDetailsViewDto } from 'app/dam/models/asset-details-view-dto';
import { ChatGptSettingsService } from 'app/dashboard/chat-gpt-settings.service';
import { ChatGptIntegrationSettingsDto } from 'app/dashboard/models/chat-gpt-integration-settings-dto';
declare var  $: any;

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
  chatGptIntegrationSettingsDto = new ChatGptIntegrationSettingsDto();
  @Output() notifyParent: EventEmitter<any> = new EventEmitter();
  @Input() pdfFile: Blob;
  uploadedFileId: any;
  isLoading : boolean = false;
  assetDetailsViewDtoOfPartner: AssetDetailsViewDto = new AssetDetailsViewDto();
  loading: boolean;
  constructor(public authenticationService: AuthenticationService, private chatGptSettingsService: ChatGptSettingsService, private referenceService: ReferenceService,) { }

  ngOnInit() {
    this.getSharedAssetDetailsById(this.assetDetailsViewDto.id);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['pdfFile'] && changes['pdfFile'].currentValue) {
      console.log('PDF file loaded:', this.pdfFile);
      if (this.pdfFile) {
        // this.getUploadedFileId();
      }
    }
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
    this.notifyParent.emit();
  }
  validateInputText() {
    this.trimmedText = this.referenceService.getTrimmedData(this.inputText);
    this.isValidInputText = this.trimmedText != undefined && this.trimmedText.length > 0;
  }
  
  AskAiTogetData() {
    this.openHistory = true;
    this.isLoading = true;
    if ($('.scrollable-card').length) {
      $('.scrollable-card').animate({
        scrollTop: $('.scrollable-card')[0].scrollHeight
      }, 500);
    }
    this.messages.push({ role: 'user', content: this.trimmedText });
    this.inputText = '';
    var self = this;
    this.chatGptIntegrationSettingsDto.uploadedFileId = this.uploadedFileId;
    this.chatGptIntegrationSettingsDto.prompt = this.trimmedText;
    this.chatGptSettingsService.generateAssistantText(this.chatGptIntegrationSettingsDto).subscribe(
      function (response) {
        console.log('API Response:', response);
        self.isLoading = false;
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
        self.isLoading = false;
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

  getUploadedFileId() {
    this.chatGptSettingsService.onUpload(this.pdfFile).subscribe(
      (response: any) => {
        const responseObject = JSON.parse(response);
        this.uploadedFileId = responseObject.id;
        console.log(this.uploadedFileId);
      },
      (error: string) => {
        console.log('API Error:', error);;
      }
    );
  }
  getSharedAssetDetailsById(id: number) {
    this.loading = true;
    this.chatGptSettingsService.getSharedAssetDetailsById(id).subscribe(
      (response:any) => {
        this.loading = false;
        if (response.statusCode == 200) {
          this.assetDetailsViewDtoOfPartner = response.data;
          console.log('API Response:', response);
        }
      },
      (error) => {
        this.loading = false;
        console.error('API Error:', error);
      }
    );
  }
  errorHandler(event: any) {
    event.target.src = 'assets/images/icon-user-default.png';
  }
}
