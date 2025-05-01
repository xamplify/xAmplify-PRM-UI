import { Component, Input, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { ChatGptSettingsService } from 'app/dashboard/chat-gpt-settings.service';
import { CustomResponse } from '../models/custom-response';
import { Properties } from '../models/properties';
import { SortOption } from 'app/core/models/sort-option';
import { ChatGptIntegrationSettingsDto } from 'app/dashboard/models/chat-gpt-integration-settings-dto';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { DamService } from 'app/dam/services/dam.service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { HttpClient } from '@angular/common/http';
declare var $: any;
@Component({
  selector: 'app-chat-gpt-modal',
  templateUrl: './chat-gpt-modal.component.html',
  styleUrls: ['./chat-gpt-modal.component.css'],
  providers: [Properties, SortOption, DamService]
})
export class ChatGptModalComponent implements OnInit {
  @Input() isChatGptIconDisplayed: boolean;
  @Input() isShowingRouteLoadIndicator: boolean;
  @Input() showLoaderForAuthGuard: boolean;
  inputText = "";
  isValidInputText = false;
  chatGptGeneratedText = "";
  isTextLoading = false;
  isCopyButtonDisplayed = false;
  customResponse: CustomResponse = new CustomResponse();
  showIcon: boolean = true;
  activeTab: string = 'new-chat';
  selectedValueForWork: any = {};
  chatGptIntegrationSettingsDto = new ChatGptIntegrationSettingsDto();
  actionType: string;
  showEmailModalPopup: boolean;
  emailBody: any;
  subjectText: string;
  messages: any[] = [];
  showCopiedMessage: boolean;
  showOpenHistory: boolean;
  socialContent: any;
  openShareOption: boolean;
  isWelcomePageUrl: boolean = false;
  copiedText: any;
  isSpeakingText: any;
  speakingIndex: any;
  isEmailCopied: boolean;
  hasAcess: boolean = false;
  isMinimizeOliver: boolean;
  preventImmediateExpand: boolean = false;
  showView: boolean = false;
  pdfFiles: { file: Blob; assetName: any; }[];
  threadId: any;
  assetLoader: boolean;
  constructor(public authenticationService: AuthenticationService, private chatGptSettingsService: ChatGptSettingsService,
    private referenceService: ReferenceService, public properties: Properties, public sortOption: SortOption, public router: Router, private cdr: ChangeDetectorRef, private http: HttpClient) {
  }

  ngOnInit() {
    this.selectedValueForWork = this.sortOption.wordOptionsForOliver[0].value;
    this.sortBy(this.selectedValueForWork);
  }



  validateInputText() {
    let trimmedText = this.referenceService.getTrimmedData(this.inputText);
    this.isValidInputText = trimmedText != undefined && trimmedText.length > 0;
  }

  ngOnDestroy() {
    this.showIcon = true;
    this.isWelcomePageUrl = false;
  }

  generateChatGPTText() {
    this.customResponse = new CustomResponse();
    this.isTextLoading = true;
    this.chatGptGeneratedText = '';
    if ($('.main-container').length) {
      $('.main-container').animate({
        scrollTop: $('.main-container')[0].scrollHeight
      }, 500);
    }
    // let askOliver = 'Paraphrase this:' + this.inputText
    this.messages.push({ role: 'user', content: this.inputText });
    let askOliver = this.activeTab == 'writing'
      ? 'In ' + (this.sortOption.selectWordDropDownForOliver.name || '') + ' ' + this.inputText
      : this.inputText;
    this.inputText = this.activeTab == 'paraphraser' ? this.inputText : '';
    this.chatGptIntegrationSettingsDto.prompt = askOliver;
    this.showOpenHistory = true;
    this.chatGptSettingsService.generateAssistantText(this.chatGptIntegrationSettingsDto).subscribe(
      response => {
        let statusCode = response.statusCode;
        let data = response.data;

        if (statusCode === 200) {
          let chatGptGeneratedText = data['apiResponse']['choices'][0]['message']['content'];
          this.chatGptGeneratedText = this.referenceService.getTrimmedData(chatGptGeneratedText);
          this.messages.push({ role: 'assistant', content: this.chatGptGeneratedText });
          this.isCopyButtonDisplayed = this.chatGptGeneratedText.length > 0;
        } else if (statusCode === 400) {
          this.chatGptGeneratedText = response.message;
          this.messages.push({ role: 'assistant', content: response.message });
        } else {
          let errorMessage = data['apiResponse']['error']['message'];
          this.customResponse = new CustomResponse('ERROR', errorMessage, true);
          this.messages.push({ role: 'assistant', content: errorMessage });
        }
        this.isTextLoading = false;
        this.inputText = this.activeTab == 'paraphraser' ? this.inputText : '';

      }, error => {
        this.isTextLoading = false;
        this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
        this.messages.push({ role: 'assistant', content: this.properties.serverErrorMessage });
        this.inputText = '';
      });
  }


  copyChatGPTText(chatGptGeneratedTextInput: any) {
    this.isEmailCopied = true;
    $('#copied-chat-gpt-text-message').hide();
    chatGptGeneratedTextInput.select();
    document.execCommand('copy');
    chatGptGeneratedTextInput.setSelectionRange(0, 0);
    setTimeout(() => {
      this.isEmailCopied = false;
    }, 2000)
    $('#copied-chat-gpt-text-message').show(500);
  }

  resetValues() {
    this.isWelcomePageUrl = this.router.url.includes('/welcome-page');
    this.inputText = "";
    this.isSpeakingText = false;
    this.speakingIndex = null;
    this.isValidInputText = false;
    this.chatGptGeneratedText = "";
    this.isCopyButtonDisplayed = false;
    this.customResponse = new CustomResponse();
    $('#copied-chat-gpt-text-message').hide();
    this.showIcon = false;
    this.activeTab = 'askpdf';
    this.selectedValueForWork = this.sortOption.wordOptionsForOliver[0].value;
    this.sortBy(this.selectedValueForWork);
    this.messages = [];
    this.showOpenHistory = false;
    this.openShareOption = false;
    this.showEmailModalPopup = false;
    this.showView = false;
  }

  showOliverIcon() {
    this.showIcon = true;
  }

  sortBy(selectedValue: string) {
    this.selectedValueForWork = selectedValue;
    this.sortOption.selectWordDropDownForOliver = this.sortOption.wordOptionsForOliver.find(
      option => option.value === selectedValue
    );
  }

  setActiveTab(tab: string) {
    this.isValidInputText = false;
    this.inputText = "";
    this.isTextLoading = false;
    this.messages = [];
    this.chatGptGeneratedText = "";
    this.isCopyButtonDisplayed = false;
    this.selectedValueForWork = this.sortOption.wordOptionsForOliver[0].value;
    this.sortBy(this.selectedValueForWork);
    this.showOpenHistory = false;
    this.openShareOption = false;
    this.showEmailModalPopup = false;
    this.activeTab = tab;
  }
  openEmailModalPopup(markdown: any) {
    let text = markdown.innerHTML;
    if (text != undefined) {
      this.emailBody = text.replace(/<\/?markdown[^>]*>/g, '');
    }
    this.parseHTMLBody(this.emailBody);
    this.actionType = 'oliveAi';
    this.showEmailModalPopup = true;
  }
  parseHTMLBody(emailContent: string): void {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = emailContent;
    let plainText = tempDiv.innerHTML;
    let subject = "";
    let body = "";
    let subjectStartIndex = plainText.indexOf("<p>Subject:");
    if (subjectStartIndex !== -1) {
      let subjectEndIndex = plainText.indexOf("</p>", subjectStartIndex);
      if (subjectEndIndex !== -1) {
        this.subjectText = plainText.substring(subjectStartIndex + 3, subjectEndIndex)
          .replace("Subject:", "").trim();
      }
      this.emailBody = plainText.substring(subjectEndIndex + 4).trim();
      let lastHrIndex = this.emailBody.lastIndexOf("<hr");
      if (lastHrIndex !== -1) {
        this.emailBody = this.emailBody.substring(0, lastHrIndex).trim();
      }
    }
    console.log("Subject:", subject);
    console.log("Body:", body);
  }
  closeEmailModalPopup(event: any) {
    this.showEmailModalPopup = false;
    this.subjectText = "";
    this.emailBody = "";
    if (event) {
      this.referenceService.showSweetAlertSuccessMessage(event);
    }
  }
  openSocialShare(markdown: any) {
    let text = markdown.innerHTML;
    if (text != undefined) {
      this.socialContent = text.replace(/<\/?markdown[^>]*>/g, '');
    }
    this.parseTextBody(this.socialContent);
    this.referenceService.scrollSmoothToTop();
    this.openShareOption = true;
  }
  parseTextBody(socialContent: string) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = socialContent;
    const firstHrIndex = socialContent.indexOf("<hr>");
    const lastHrIndex = socialContent.lastIndexOf("<hr>");
    if (firstHrIndex === -1) {
      this.socialContent = socialContent.trim();
    }

    if (firstHrIndex !== -1 && firstHrIndex === lastHrIndex) {
      this.socialContent = socialContent.substring(0, firstHrIndex).trim();
    }
    if (firstHrIndex !== -1 && lastHrIndex !== -1 && firstHrIndex !== lastHrIndex) {
      this.socialContent = socialContent.substring(firstHrIndex + 4, lastHrIndex).trim();
    }
    tempDiv.innerHTML = this.socialContent;
    this.socialContent = tempDiv.textContent || tempDiv.innerText || "";
  }

  closeSocialShare(event: any) {
    this.openShareOption = false;
    this.showOpenHistory = true;
    if (event) {
      this.referenceService.showSweetAlertSuccessMessage(event);
    }
    this.openShareOption = false;
  }

  speakTextOn(index: number, element: any) {
    let text = element.innerText || element.textContent;
    if (this.isSpeakingText && this.speakingIndex === index) {
      this.authenticationService.stopSpeech();
      this.isSpeakingText = false;
      this.speakingIndex = null;
    } else {
      this.speakingIndex = index;
      this.isSpeakingText = true;
      this.authenticationService.readText(text, () => {
        this.isSpeakingText = false;
        this.speakingIndex = null;
        this.cdr.detectChanges();
      });
    }
  }

  speakTextForParaprasher(element: any) {
    let text = element.innerText || element.textContent;
    if (this.isSpeakingText) {
      this.authenticationService.stopSpeech();
      this.isSpeakingText = false;
    } else {
      this.isSpeakingText = true;
      this.authenticationService.readText(text, () => {
        this.isSpeakingText = false;
        this.cdr.detectChanges();
      });
    }
  }

  onMinimizeClick(event: MouseEvent) {
    event.stopPropagation(); // prevent modal click
    this.minimizeOliver();
  }

  minimizeOliver() {
    this.isMinimizeOliver = true;
    this.preventImmediateExpand = true;
    setTimeout(() => {
      this.preventImmediateExpand = false;
    }, 500);
    console.log('Minimized');
  }

  expandIfMinimized() {
    if (this.preventImmediateExpand) return;

    if (this.isMinimizeOliver) {
      this.isMinimizeOliver = false;
      console.log('Expanded on hover');
    }
  }

  searchDataOnKeyPress(keyCode: any) {
    if (keyCode === 13 && this.inputText != undefined && this.inputText.length > 0) {
      this.generateChatGPTText();
    }
  }

  openAssetsPage() {
    this.showView = true;
  }

  getSelectedAsset(event: any) {
    this.assetLoader= true;
    this.getPdfByAssetPaths(event)
    this.showView = false;
  }

  getPdfByAssetPaths(assetsPath: any[]) {
    const requests = assetsPath.map(path =>
      this.http.get(path.proxyUrlForOliver + path.assetPath + '&access_token=' + encodeURIComponent(this.authenticationService.access_token), {
        responseType: 'blob'
      })
    );
    forkJoin(requests).subscribe({
      next: (responses: Blob[]) => {
        this.pdfFiles = responses.map((blob, index) => ({
          file: blob,
          assetName: assetsPath[index].assetName
        }));

        this.getUploadedFileIds();
      },
      error: (err) => {
        console.error('Failed to load all PDFs', err);
      }
    });
  }

  getUploadedFileIds() {
    this.chatGptSettingsService.onUploadFiles(this.pdfFiles, this.chatGptIntegrationSettingsDto).subscribe(
      (response: any) => {
        let data = response.data;
        this.threadId = data.threadId;
        this.assetLoader = false;
        this.inputText = 'Give a overview of the documents';
        this.AskAiTogetData();
      },
      (error: string) => {
        console.log('API Error:', error);
      }
    );
  }

  AskAiTogetData() {
    this.showOpenHistory = true;
    this.isTextLoading = true;
    if ($('.scrollable-card').length) {
      $('.scrollable-card').animate({
        scrollTop: $('.scrollable-card')[0].scrollHeight
      }, 500);
    }
    this.messages.push({ role: 'user', content: this.inputText });
    var self = this;
    this.chatGptIntegrationSettingsDto.prompt = this.inputText;
    self.chatGptIntegrationSettingsDto.threadId = self.threadId;
    self.inputText = '';
    this.chatGptSettingsService.generateAssistantTextByAssistant(this.chatGptIntegrationSettingsDto).subscribe(
      function (response) {
        self.isTextLoading = false;
        console.log('API Response:', response);
        var content = response.data;
        if (content) {
          self.chatGptGeneratedText = self.referenceService.getTrimmedData(content.message);
          self.messages.push({ role: 'assistant', content: self.chatGptGeneratedText });
          self.threadId = content.threadId;
        } else {
          self.messages.push({ role: 'assistant', content: 'Invalid response from Oliver.' });
        }
        this.trimmedText = '';
      },
      function (error) {
        console.log('API Error:', error);
        self.messages.push({ role: 'assistant', content: self.properties.serverErrorMessage });
      }
    );
  }

  onKeyPressForAsekOliver(keyCode: any) {
    if (keyCode === 13 && this.inputText != undefined && this.inputText.length > 0) {
      this.AskAiTogetData();
    }
  }
}
