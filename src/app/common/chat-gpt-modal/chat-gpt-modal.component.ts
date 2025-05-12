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
import { add } from 'ngx-bootstrap/chronos';
import { XAMPLIFY_CONSTANTS } from 'app/constants/xamplify-default.constants';
import { EmailTemplateService } from 'app/email-template/services/email-template.service';
import { EmailTemplate } from 'app/email-template/models/email-template';
import { Pagination } from 'app/core/models/pagination';
import { PagerService } from 'app/core/services/pager.service';
declare var $: any, swal:any;
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
  pdfFiles: { file: Blob; assetName: any; }[] = [];
  threadId: any;
  assetLoader: boolean;
  selectedAssets: any[] = [];
  isfileProcessed: boolean = false;
  isReUpload: boolean = false;
  uploadedAssetIds: any[];
  vectorStoreId: any;
  selectedFolders: any[] = [];
  chatHistoryId: any;
  chatHistories: any[] = [];
  isSaveHistoryPopUpVisible: boolean = true;
  private readonly INSIGHTAGENT = "INSIGHTAGENT";
  private readonly BRAINSTORMAGENT = "BRAINSTORMAGENT";
  private readonly SPARKWRITERAGENT = "SPARKWRITERAGENT";
  private readonly PARAPHRASERAGENT = "PARAPHRASERAGENT";
  previousTitle: any;
  index: any;
  searchKey:string;
  isPartnerLoggedIn: boolean = false;
  vanityUrlFilter: boolean = false;
  showTemplate: boolean;
  selectedTemplateList: any[];
  selectedFilterIndex: number = 1;
  chatHistoryPagination: Pagination = new Pagination();
  chatHistorySortOption: SortOption = new SortOption();


  constructor(public authenticationService: AuthenticationService, private chatGptSettingsService: ChatGptSettingsService,
    private referenceService: ReferenceService, public properties: Properties, public sortOption: SortOption, public router: Router, private cdr: ChangeDetectorRef, private http: HttpClient,
    private emailTemplateService: EmailTemplateService, public pagerService: PagerService) {
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
    this.selectedAssets = [];
    this.selectedFolders = [];
  }

  generateChatGPTText(chatHistoryId:any) {
    // this.referenceService.showSweetAlertProceesor("Saving...");
    this.customResponse = new CustomResponse();
    // this.isTextLoading = true;
    // this.chatGptGeneratedText = '';
    // if ($('.main-container').length) {
    //   $('.main-container').animate({
    //     scrollTop: $('.main-container')[0].scrollHeight
    //   }, 500);
    // }
    // let askOliver = 'Paraphrase this:' + this.inputText
    // this.messages.push({ role: 'user', content: this.inputText });
    // let askOliver = this.activeTab == 'writing'
    //   ? 'In ' + (this.sortOption.selectWordDropDownForOliver.name || '') + ' ' + this.inputText
    //   : this.inputText;
    // this.inputText = this.activeTab == 'paraphraser' ? this.inputText : '';
    // this.chatGptIntegrationSettingsDto.prompt = askOliver;
    // this.showOpenHistory = true;
    this.chatGptIntegrationSettingsDto.contents = this.messages;
    this.chatGptIntegrationSettingsDto.chatHistoryId = chatHistoryId;
    this.messages = [];
    this.chatGptSettingsService.generateAssistantText(this.chatGptIntegrationSettingsDto).subscribe(
      response => {
        let statusCode = response.statusCode;
        let data = response.data;
        // swal.close();
        if (statusCode === 200) {
          let chatGptGeneratedText = data['apiResponse']['choices'][0]['message']['content'];
          // this.chatGptGeneratedText = this.referenceService.getTrimmedData(chatGptGeneratedText);
          // this.messages.push({ role: 'assistant', content: this.chatGptGeneratedText });
          // this.isCopyButtonDisplayed = this.chatGptGeneratedText.length > 0;
          // this.referenceService.showSweetAlertSuccessMessage('History saved successfully.');
        } else if (statusCode === 400) {
          // this.chatGptGeneratedText = response.message;
          // this.messages.push({ role: 'assistant', content: response.message });
        } else {
          // let errorMessage = data['apiResponse']['error']['message'];
          // this.customResponse = new CustomResponse('ERROR', errorMessage, true);
          // this.messages.push({ role: 'assistant', content: errorMessage });
        }
        // this.isTextLoading = false;
        // this.inputText = this.activeTab == 'paraphraser' ? this.inputText : '';

      }, error => {
        // swal.close();
        // this.isTextLoading = false;
        // this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
        // this.messages.push({ role: 'assistant', content: this.properties.serverErrorMessage });
        // this.inputText = '';
      }, () => {
        if (this.activeTab == 'history') {
          this.showChatHistories();
        }
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
    this.showDefaultTemplates();
    this.inputText = "";
    this.isSpeakingText = false;
    this.speakingIndex = null;
    this.isValidInputText = false;
    this.chatGptGeneratedText = "";
    this.isCopyButtonDisplayed = false;
    this.customResponse = new CustomResponse();
    $('#copied-chat-gpt-text-message').hide();
    this.showIcon = false;
    if (this.isWelcomePageUrl) {
      this.activeTab = 'new-chat';
    } else {
      this.activeTab = 'askpdf';
    }
    this.selectedValueForWork = this.sortOption.wordOptionsForOliver[0].value;
    this.sortBy(this.selectedValueForWork);
    this.messages = [];
    this.showOpenHistory = false;
    this.openShareOption = false;
    this.showEmailModalPopup = false;
    this.showView = false;
    this.selectedAssets = [];
    this.selectedFolders = [];
    this.pdfFiles = [];
    this.isReUpload = false;
    this.isfileProcessed = false;
    this.threadId = '';
    this.vectorStoreId = 0;
    this.chatHistoryId = 0;
  }

  showOliverIcon() {
    if (this.threadId != undefined && this.threadId != 0 && this.vectorStoreId != undefined && this.vectorStoreId != 0 && this.chatHistoryId != undefined && this.chatHistoryId != 0 && this.isSaveHistoryPopUpVisible && this.activeTab != 'paraphraser') {
      this.saveChatHistoryTitle(this.chatHistoryId);
      this.showIcon = true;
    } else {
      this.showIcon = true;
    }
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
    if (this.chatHistoryId != undefined && this.chatHistoryId > 0 && this.isSaveHistoryPopUpVisible && this.activeTab != 'paraphraser') {
      this.saveChatHistoryTitle(this.chatHistoryId);
    } else {
      this.messages = [];
    }
    this.isTextLoading = false;
    this.chatGptGeneratedText = "";
    this.isCopyButtonDisplayed = false;
    this.selectedValueForWork = this.sortOption.wordOptionsForOliver[0].value;
    this.sortBy(this.selectedValueForWork);
    this.showOpenHistory = false;
    this.openShareOption = false;
    this.showEmailModalPopup = false;
    this.threadId = '';
    this.vectorStoreId = 0;
    this.chatHistoryId = 0;
    this.selectedAssets = [];
    this.selectedFolders = [];
    this.isSaveHistoryPopUpVisible = true;
    this.activeTab = tab;
    if (tab == 'history') {
      this.showChatHistories();
    }
  }

  showSweetAlert(tab:string,threadId:any,vectorStoreId:any,chatHistoryId:any,isClosingModelPopup:boolean) {
    let self = this;
    swal({
      title: 'Do you want to save the History?',
      text: 'If not the history will be deleted permanently',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#54a7e9',
      cancelButtonColor: '#999',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then(function () {
      self.saveChatHistoryTitle(chatHistoryId);
      // self.referenceService.showSweetAlertSuccessMessage('Chat saved successfully.');
      if (isClosingModelPopup) {
        self.showIcon = true;
      }
    }, function (dismiss: any) {
      self.deleteChatHistory(threadId,vectorStoreId,chatHistoryId,isClosingModelPopup);
    })
    self.activeTab = tab;
  }

  saveChatHistoryTitle(chatHistoryId:any) {
    this.generateChatGPTText(chatHistoryId);
  }

  deleteChatHistory(threadId:any,vectorStoreId:any,chatHistoryId:any,isClosingModelPopup:boolean) {
    this.referenceService.showSweetAlertProcessingLoader("Loading");
    this.chatGptSettingsService.deleteChatHistory(chatHistoryId,threadId,vectorStoreId).subscribe(
      response => {
        swal.close();
        if (isClosingModelPopup) {
          this.showIcon = true;
        }
      }, error => {
        swal.close();
        if (isClosingModelPopup) {
          this.showIcon = true;
        }
      }, () => {
        if (this.activeTab == 'history') {
          this.showChatHistories();
        }
      }
    )
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
    this.emitterData(event);
  }

  private emitterData(event: any) {
    this.openShareOption = false;
    this.showOpenHistory = true;
    if (event) {
      this.referenceService.showSweetAlertSuccessMessage(event);
    }
     this.openShareOption = false;
     this.showTemplate = false;
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
      this.AskAiTogetData();
    }
  }

  openAssetsPage() {
    this.showView = true;
    if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
      this.vanityUrlFilter = true;
    }
    this.isPartnerLoggedIn = this.authenticationService.module.damAccessAsPartner && this.vanityUrlFilter;
  }


  getSelectedAssets(event: any) {
    this.selectedAssets = event;
  }

  submitSelectedAssetsToOliver() {
    this.assetLoader = true;
    this.showOpenHistory = false;
    if (this.selectedFolders.length == 0) {
      this.getPdfByAssetPaths(this.selectedAssets);
    } else {
      this.getAssetPathsByCategoryIds();
    }
    this.showView = false;
  }

  getPdfByAssetPaths(assetsPath: any[]) {
    const oldAssets = [];
    const requests = [];
    const emptyBlob = new Blob([], { type: 'application/pdf' });
    assetsPath.forEach(path => {
      if (path.openAIFileId == undefined || path.openAIFileId == null || path.openAIFileId == '' || path.openAIFileId == ' ') {
        let url = "";
        if (path.proxyUrlForOliver != undefined || path.proxyUrlForOliver != null) {
          url = path.proxyUrlForOliver + path.assetPath + '&access_token=' + encodeURIComponent(this.authenticationService.access_token);
        } else {
          url = path.assetPath + '&access_token=' + encodeURIComponent(this.authenticationService.access_token);
        }
        const request = this.http.get(url, { responseType: 'blob' });
        requests.push(request);
      } else {
        oldAssets.push(path);
      }
    });

    forkJoin(requests).subscribe({
      next: (responses: Blob[]) => {
        this.pdfFiles = responses.map((blob, index) => ({
          file: blob,
          assetName: assetsPath[index].assetName,
          assetId: this.isPartnerLoggedIn
            ? assetsPath[index].damId
            : assetsPath[index].id
        }));

        this.handleOldAssets(oldAssets, emptyBlob);
      },
      error: (err) => {
        this.assetLoader = false;
        console.error('Failed to load all PDFs', err);
      }
    });
    if (requests == undefined || requests.length == 0) {
      this.handleOldAssets(oldAssets, emptyBlob);
    }
  }

  private handleOldAssets(oldAssets: any[], emptyBlob: Blob) {
    if (oldAssets.length > 0) {
      let uploadedAssets = oldAssets.map((path) => ({
        file: emptyBlob,
        assetName: path.assetName,
        assetId: this.isPartnerLoggedIn
          ? path.damId
          : path.id
      }));
      uploadedAssets.forEach((uploadedAsset) => {
        this.pdfFiles.push(uploadedAsset);
      })
    }
    this.getUploadedFileIds();
  }


  getUploadedFileIds() {
    this.chatGptIntegrationSettingsDto.isFromChatGptModal = true;
    // this.chatGptIntegrationSettingsDto.uploadedAssetIds = this.uploadedAssetIds;
    this.chatGptIntegrationSettingsDto.threadId = this.threadId;
    this.chatGptIntegrationSettingsDto.vectorStoreId = this.vectorStoreId;
    this.chatGptIntegrationSettingsDto.chatHistoryId = this.chatHistoryId;
    if (this.activeTab == 'askpdf') {
      this.chatGptIntegrationSettingsDto.agentType = "INSIGHTAGENT";
    } else if (this.activeTab == 'new-chat') {
      this.chatGptIntegrationSettingsDto.agentType = "BRAINSTORMAGENT";
    } else if (this.activeTab === 'writing') {
      this.chatGptIntegrationSettingsDto.agentType = "SPARKWRITERAGENT";
    }
    this.chatGptSettingsService.onUploadFiles(this.pdfFiles, this.chatGptIntegrationSettingsDto).subscribe(
      (response: any) => {
        let data = response.data;
        this.threadId = data.threadId;
        this.vectorStoreId = data.vectorStoreId;
        this.chatHistoryId = data.chatHistoryId;
        // this.uploadedAssetIds = response.map.uploadedAssestIds;
        this.assetLoader = false;
        let self = this
        if (!self.isReUpload) {
          self.isfileProcessed = true;
        } else if (self.isReUpload) {
          setTimeout(function () {
            self.scrollToBottom();
          }, 1000);
          self.showOpenHistory = true;
        }
      },
      (error: string) => {
        this.assetLoader = false;
        console.log('API Error:', error);
      }
    );
  }

  scrollToBottom() {
    if ($('.main-container').length) {
      $('.main-container').animate({
        scrollTop: $('.main-container')[0].scrollHeight
      }, 500);
    }
  }

  AskAiTogetData() {
    this.showOpenHistory = true;
    this.isfileProcessed = false;
    this.isTextLoading = true;
    var self = this;
    self.scrollToBottom();
    self.messages.push({ role: 'user', content: self.inputText });
    this.chatGptIntegrationSettingsDto.prompt = self.inputText;
    self.chatGptIntegrationSettingsDto.threadId = self.threadId;
    if (this.activeTab == 'askpdf') {
      this.chatGptIntegrationSettingsDto.agentType = this.INSIGHTAGENT;
    } else if (this.activeTab == 'new-chat') {
      this.chatGptIntegrationSettingsDto.agentType = this.BRAINSTORMAGENT;
    } else if (this.activeTab === 'writing') {
      this.chatGptIntegrationSettingsDto.agentType = this.SPARKWRITERAGENT;
    } else if (this.activeTab === 'paraphraser') {
      this.chatGptIntegrationSettingsDto.agentType = this.PARAPHRASERAGENT;
    }
    self.chatGptIntegrationSettingsDto.chatHistoryId = self.chatHistoryId;
    self.chatGptIntegrationSettingsDto.vectorStoreId = self.vectorStoreId;
    self.chatGptIntegrationSettingsDto.isFromChatGptModal = true;
    if (this.activeTab != 'paraphraser') {
      self.inputText = '';
    }
    self.isValidInputText = false;
    this.chatGptSettingsService.generateAssistantTextByAssistant(this.chatGptIntegrationSettingsDto).subscribe(
      function (response) {
        self.isTextLoading = false;
        console.log('API Response:', response);
        var content = response.data;
        if (content) {
          self.chatGptGeneratedText = self.referenceService.getTrimmedData(content.message);
          self.messages.push({ role: 'assistant', content: self.chatGptGeneratedText });
          self.threadId = content.threadId;
          self.vectorStoreId = content.vectorStoreId;
          self.chatHistoryId = content.chatHistoryId;
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

  closeManageAssets() {
    this.showView = false;
    if (!this.isReUpload && !this.isfileProcessed) {
      this.selectedAssets = [];
      this.selectedFolders = [];
    }
  }

  reUploadFiles() {
    this.openAssetsPage();
    this.isReUpload = true;
  }

  setInputText(text: string) {
    this.inputText = text;
    this.isValidInputText = true;
  }

  handleFolders(event) {
    this.selectedFolders = event;
  }

  getAssetPathsByCategoryIds() {
    const selectedFolderIds = this.selectedFolders.map(folder => folder.id);
    this.chatGptIntegrationSettingsDto.categoryIds = selectedFolderIds;
    this.chatGptIntegrationSettingsDto.partnerInsightAgent = this.isPartnerLoggedIn;
    this.chatGptSettingsService.getAssetDetailsByCategoryIds(this.chatGptIntegrationSettingsDto).subscribe(
      (response: any) => {
        if (response.statusCode == 200) {
          let data = response.data;
          this.getPdfByAssetPaths(data);
        }
      },
      (error) => {
        console.error('API Error:', error);
      }
    );
  }

  fetchHistories(chatHistoryPagination) {
    this.chatGptSettingsService.fetchHistories(chatHistoryPagination).subscribe(
      (response) => {
        const data = response.data;
        if (response.statusCode == XAMPLIFY_CONSTANTS.HTTP_OK) {
          chatHistoryPagination.totalRecords = data.totalRecords;
          this.chatHistories = [...this.chatHistories,...data.list];
        }
      }, error => {

      }
    )
  }

  showHistory(history:any) {
    let tab = this.getTabName(history.oliverChatHistoryType);
    this.setActiveTab(tab);
    this.threadId = history.threadId;
    this.vectorStoreId = history.vectorStoreId;
    this.chatHistoryId = history.chatHistoryId;
    this.showOpenHistory = true;
    this.isSaveHistoryPopUpVisible = false;
    this.getChatHistory();
  }

  getTabName(tab): string {
    switch (tab) {
      case this.BRAINSTORMAGENT:
        return "new-chat";
      case this.INSIGHTAGENT:
        return "askpdf";
      case this.SPARKWRITERAGENT:
        return "writing";
      case this.PARAPHRASERAGENT:
        return "paraphraser";
    }
  }

  getChatHistory() {
    this.chatGptSettingsService.getChatHistoryByThreadId(this.threadId).subscribe(
      (response: any) => {
        if (response.statusCode == 200) {
          let messages = response.data;
          messages.forEach((message: any) => {
            if (message.role === 'assistant') {
              this.messages.push({ role: 'assistant', content: message.content });
            }
            if (message.role === 'user') {
              this.messages.push({ role: 'user', content: message.content });
            }
          });
          setTimeout(() => {
            if ($('.scrollable-card').length) {
              $('.scrollable-card').animate({
                scrollTop: $('.scrollable-card')[0].scrollHeight
              }, 500);
            }
          }, 500);

        } else {
          console.log('API Error:', response.errorMessage);
        }
      },
      (error: string) => {
        console.log('API Error:', error);
      }
    );
  }

  openEdit(history:any,index:any) {
    if (this.index != undefined && this.index > 0 && this.index != index) {
      this.chatHistories[this.index].title = this.previousTitle;
      this.chatHistories[this.index].showInputField = false;
      this.index = index;
      this.previousTitle = history.title;
      history.showInputField = true;
    } else {
      this.index = index;
      this.previousTitle = history.title;
      history.showInputField = true;
    }
  }

  closeEdit(history:any,index:any) {
    history.title = this.previousTitle;
    history.showInputField = false;
  }

  updateTitle(history:any,index:any) {
    if (this.referenceService.isValidString(history.title)) {
      this.previousTitle = history.title;
      this.referenceService.showSweetAlertProcessingLoader("Updating...");
      this.chatGptSettingsService.updateHistoryTitle(history.title,history.chatHistoryId).subscribe(
        (response) => {
          swal.close();
          if (response.statusCode == XAMPLIFY_CONSTANTS.HTTP_OK) {
            history.showInputField = false;
            this.referenceService.showSweetAlertSuccessMessage("Updated successfully.");
          } else {
            this.referenceService.showSweetAlertFailureMessage("Updation failed.");
          }
        }, error => {
          swal.close();
          this.referenceService.showSweetAlertFailureMessage("Updation failed.");
        }
      )
    }
    
  }

  deleteHistory(history:any,index:any) {
    let self = this;
    swal({
      title: 'Do you want to delete the History?',
      text: 'Once deleted, the history cannot be recovered.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#54a7e9',
      cancelButtonColor: '#999',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then(function () {
      self.referenceService.showSweetAlertProcessingLoader("Loading...");
      self.chatGptSettingsService.deleteChatHistory(history.chatHistoryId,history.threadId,history.vectorStoreId).subscribe(
        response => {
          self.index = 0;
          self.chatHistories.splice(index, 1);
          swal.close();
        }, error => {
          swal.close();
        }
      )
    }, function (dismiss: any) {
    })
  }

  searchHistoryOnKeyPress(keyCode:any) {
    if (keyCode === 13 && this.chatHistorySortOption.searchKey != undefined && this.chatHistorySortOption.searchKey.length > 0) {
      this.searchChatHistory();
    }
  }

  
  showDefaultTemplates(): void {
    let self = this;
    this.chatGptSettingsService.listDefaultTemplates(this.authenticationService.getUserId()).subscribe(
        (response: any) => {
            var templates = [];
            if (response && response.data && response.data.emailTemplates) {
                templates = response.data.emailTemplates;
            }
            this.emailTemplateService.isEditingDefaultTemplate = false;
            this.emailTemplateService.isNewTemplate = true;
            if (templates.length > 0) {
                this.emailTemplateService.emailTemplate = templates[0]; 
            }
            this.selectedTemplateList = templates;
        },
        (error: any) => {
            console.error("Error in showDefaultTemplates():", error);
        }
    );
}
  openDesignTemplate(markdown: any) {
  const text = markdown && markdown.innerHTML ? markdown.innerHTML : '';
  this.showTemplate = true;
  this.chatGptIntegrationSettingsDto.prompt = text;

  this.chatGptSettingsService.insertTemplateData(this.chatGptIntegrationSettingsDto).subscribe(
    (response: any) => {
      if (!this.emailTemplateService.emailTemplate) {
        this.emailTemplateService.emailTemplate = new EmailTemplate();
        alert("Template created successfully.");
      }
      this.emailTemplateService.emailTemplate.jsonBody = JSON.stringify(response.data);
      this.showTemplate = true;
    },
    (error: string) => {
      this.showTemplate = false;
      console.log('API Error:', error);
    }
  );
}

  closeDesignTemplate(event: any) {
    this.emitterData(event);
    this.emailTemplateService.emailTemplate = new EmailTemplate();
     this.emailTemplateService.isNewTemplate = false;
  }

  showChatHistories() {
    this.resetChatHistoryPagination();
    this.fetchHistories(this.chatHistoryPagination);
  }

  resetChatHistoryPagination() {
    this.chatHistoryPagination.maxResults = 12;
    this.chatHistoryPagination = new Pagination;
    this.chatHistories = [];
  }

  setChatHistoryPage() {
    this.chatHistoryPagination.pageIndex = this.chatHistoryPagination.pageIndex + 1;
    this.fetchHistories(this.chatHistoryPagination);
  }

  getAllFilteredChatHistoryResults() {
    this.chatHistoryPagination.pageIndex = 1;
    this.chatHistoryPagination.searchKey = this.chatHistorySortOption.searchKey;
    this.fetchHistories(this.chatHistoryPagination);
  }

  searchChatHistory() {
    this.chatHistories = [];
    this.getAllFilteredChatHistoryResults();
  }
  
}
