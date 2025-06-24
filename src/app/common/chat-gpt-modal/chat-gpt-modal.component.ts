import { Component, Input, OnInit, EventEmitter, Output, ViewChild} from '@angular/core';
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
import { LandingPageService } from 'app/landing-pages/services/landing-page.service';
import { OliverAgentAccessDTO } from '../models/oliver-agent-access-dto';
import { ChatGptIntegrationSettingsComponent } from 'app/dashboard/chat-gpt-integration-settings/chat-gpt-integration-settings.component';
import { OliverPromptSuggestionDTO } from '../models/oliver-prompt-suggestion-dto';
import { ExecutiveReport } from '../models/oliver-report-dto';

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

  @ViewChild (ChatGptIntegrationSettingsComponent) chatGptIntegrationSettingsChildComponent: ChatGptIntegrationSettingsComponent;

  inputText = "";
  isValidInputText = false;
  chatGptGeneratedText : any;
  isTextLoading = false;
  isCopyButtonDisplayed = false;
  customResponse: CustomResponse = new CustomResponse();
  showIcon: boolean = true;
  activeTab: string = 'globalchat';
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
  private readonly GLOBALCHAT = "GLOBALCHAT";
  private readonly CONTACTAGENT = "CONTACTAGENT";
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
  vendorCompanyProfileName: string;

  loggedInUserId: number = 0;
  showAskOliver: boolean = true;
  showOliverInsights: boolean = false;
  showBrainstormWithOliver: boolean = false;
  showOliverSparkWriter: boolean = false;
  showOliverParaphraser: boolean = false;
  oliverAgentAccessDTO = new OliverAgentAccessDTO(); 
  agentAccessUpdateButtonName: string = 'Update';
  disableAgentAccessUpdateButton: boolean = false;
  selectTemplate: boolean;
  templateLoader: boolean;
  isAgentSubmenuOpen: boolean;
  isSidebarVisible: boolean = true;
  isFromOliverSettingsModalPopup: boolean = true;
  callChatGptIntegrationSettingsComponent: boolean = false;
   openAssetPage: boolean = false;
  emittdata: any;
  accessToken: any;
  assistantId: any;
  agentAssistantId: any;
  integrationType: any;
  uploadedAssets: any;
  isReUploadFromPreview: boolean = false;
  showPage: boolean;
  pagination: Pagination = new Pagination();
  stopClickEvent: boolean;
  copiedIndexes: number[] = [];
  showButtons = false;

  showPrompts: boolean = false;
  suggestedPrompts: string[] = [];  

  showReport: boolean= false;
  oliverPromptSuggestionDTOs: OliverPromptSuggestionDTO[] = [];
  filteredPrompts: string[] = [];          
  searchTerm: string = '';                 
  showPromptsDown: boolean  = false;
  showGlobalPromptsDown: boolean;
  showGlobalPrompts: boolean;
  showInsightsPromptsDown: boolean = false;
  showInsightsPrompts: boolean = false;
  isReportInHistory: boolean;

  constructor(public authenticationService: AuthenticationService, private chatGptSettingsService: ChatGptSettingsService,
    private referenceService: ReferenceService, public properties: Properties, public sortOption: SortOption, public router: Router, private cdr: ChangeDetectorRef, private http: HttpClient,
    private emailTemplateService: EmailTemplateService, public pagerService: PagerService,private landingPageService: LandingPageService) {
  }

  ngOnInit() {
    this.selectedValueForWork = this.sortOption.wordOptionsForOliver[0].value;
    this.sortBy(this.selectedValueForWork);
  }



  validateInputText() {
    let trimmedText = this.referenceService.getTrimmedData(this.inputText);
    this.isValidInputText = trimmedText != undefined && trimmedText.length > 0;
     if (this.activeTab == 'askpdf' || this.activeTab == 'globalchat' ) { 
      this.searchPrompts();
    }
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
    this.emailTemplateService.emailTemplate = new EmailTemplate();
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
      this.activeTab = 'globalchat';
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
    this.checkDamAccess();
    this.isPartnerLoggedIn = this.authenticationService.module.damAccessAsPartner && this.vanityUrlFilter;
    if (this.authenticationService.vanityURLEnabled) {
      this.getOliverAgentAccessSettingsForVanityLogin();
    } else {
      this.getOliverAgentAccessSettings();
    }
    this.fetchOliverActiveIntegration();
    this.chatHistorySortOption.searchKey = '';
    this.isfileProcessed = false;
    this.isReUpload = false;
    this.isReUploadFromPreview = false;
    this.isCopyButtonDisplayed = false;
    this.showPrompts = false;
    this.showPromptsDown = false;
    this.getSuggestedPromptsForGlobalSearch();
  }

  private checkDamAccess() {
    if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
      this.vanityUrlFilter = true;
      this.vendorCompanyProfileName = this.authenticationService.companyProfileName;
      this.isPartnerLoggedIn = this.authenticationService.module.damAccessAsPartner && this.vanityUrlFilter;
    }
  }

  showOliverIcon() {
    if (this.threadId != undefined && this.threadId != 0 && this.vectorStoreId != undefined && this.vectorStoreId != 0 && this.chatHistoryId != undefined && this.chatHistoryId != 0 && this.isSaveHistoryPopUpVisible && this.activeTab != 'paraphraser') {
      this.saveChatHistoryTitle(this.chatHistoryId);
      this.showIcon = true;
    } else {
      this.showIcon = true;
    }
    this.resetOliverAgentSettings();
  }

  sortBy(selectedValue: string) {
    this.selectedValueForWork = selectedValue;
    this.sortOption.selectWordDropDownForOliver = this.sortOption.wordOptionsForOliver.find(
      option => option.value === selectedValue
    );
  }

  setActiveTab(tab: string) {
    this.searchTerm = "";
    this.showPromptsDown = false;
    this.showPrompts = false;
    this.showInsightsPromptsDown = false;
    this.showInsightsPrompts = false;
    this.showGlobalPromptsDown = false;
    this.showGlobalPrompts = false;
    this.filteredPrompts = this.suggestedPrompts;
    this.filteredPrompts = [...this.suggestedPrompts];
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

    if (this.activeTab == 'settings') {
      this.callChatGptIntegrationSettingsComponent = true;
      this.chatGptIntegrationSettingsChildComponent.getSettings();
    } else {
      this.callChatGptIntegrationSettingsComponent = false;
    }
    this.chatHistorySortOption.searchKey = '';
    this.isfileProcessed = false;
    this.isReUpload = false;
    this.isReUploadFromPreview = false;
    this.copiedIndexes = [];
    if (tab == 'globalchat') {
      this.getSuggestedPromptsForGlobalSearch();
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
      // self.deleteChatHistory(threadId,vectorStoreId,chatHistoryId,isClosingModelPopup);
    })
    self.activeTab = tab;
  }

  saveChatHistoryTitle(chatHistoryId:any) {
    this.generateChatGPTText(chatHistoryId);
  }

  deleteChatHistory(threadId:any,vectorStoreId:any,chatHistoryId:any,isClosingModelPopup:boolean) {
    this.referenceService.showSweetAlertProcessingLoader("Loading");
    this.chatGptSettingsService.deleteChatHistory(chatHistoryId,threadId,vectorStoreId,"GLOBALCHAT").subscribe(
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
  parseHTMLBody(emailContent: string) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = emailContent;
    let plainText = tempDiv.innerHTML;
    let subject = "";
    let body = "";
    let subjectStartIndex = -1;
    let closingTag = "";

    if (plainText.indexOf("<p>Subject:") !== -1) {
      subjectStartIndex = plainText.indexOf("<p>Subject:");
      closingTag = "</p>";
    } else if (plainText.indexOf("<p><strong>Subject:</strong>") !== -1) {
      subjectStartIndex = plainText.indexOf("<p><strong>Subject:</strong>");
      closingTag = "</p>";
    } else if (plainText.indexOf("<strong>Subject:") !== -1) {
      subjectStartIndex = plainText.indexOf("<strong>Subject:");
      closingTag = "</strong>";
    }

    if (subjectStartIndex !== -1) {
      let subjectEndIndex = plainText.indexOf(closingTag, subjectStartIndex);
      if (subjectEndIndex !== -1) {
        const subjectRaw = plainText.substring(subjectStartIndex, subjectEndIndex + closingTag.length);
        this.subjectText = subjectRaw.replace(/<[^>]*>/g, '').replace("Subject:", "").trim();
      }
      this.emailBody = plainText.substring(subjectEndIndex + closingTag.length).trim();
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
      this.emailTemplateService.emailTemplate = new EmailTemplate();
    }
    this.chatGptIntegrationSettingsDto.prompt = '';
    this.chatGptIntegrationSettingsDto.designPdf = false;
    this.chatGptIntegrationSettingsDto.templateId = 0;
    this.emailTemplateService.emailTemplate.jsonBody = "";
    this.openShareOption = false;
    this.openAssetPage = false;
    this.showTemplate = false;
    this.landingPageService.jsonBody = "";
    this.landingPageService.id = 0;
    this.showPage = false;
    this.selectTemplate = false;
    this.resetPageData();
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
    if (keyCode === 13 && this.inputText != undefined && this.inputText.length > 0 && !this.isTextLoading)  {
      this.AskAiTogetData();
    }
  }

  openAssetsPage() {
    if (this.isReUpload && (this.uploadedAssets != undefined && this.uploadedAssets.length == 0)) {
      this.uploadedAssets = this.selectedAssets;
    }
    this.showView = true;
  }


  getSelectedAssets(event: any) {
    if (!this.isReUpload) {
      this.selectedAssets = event;
    } else {
      this.uploadedAssets = event;
    }
  }
  

  submitSelectedAssetsToOliver() {
    this.assetLoader = true;
    this.showOpenHistory = false;
    if (this.selectedFolders.length == 0) {
      if (this.isReUpload) {
        this.selectedAssets = this.uploadedAssets;
      }
      this.pdfFiles = this.selectedAssets;
      // this.getPdfByAssetPaths(this.selectedAssets);
      this.getUploadedFileIds();
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
    this.filteredPrompts = [];
    this.suggestedPrompts = [];
    this.chatGptIntegrationSettingsDto.loggedInUserId = this.loggedInUserId;
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
        } else if (self.isReUploadFromPreview) {
          self.isfileProcessed = true;
        } else if (self.isReUpload) {
          setTimeout(function () {
            self.scrollToBottom();
          }, 1000);
          self.showOpenHistory = true;
        }
        this.oliverPromptSuggestionDTOs = data.suggestedPrompts || [];
        this.suggestedPrompts = data.suggestedPrompts.map((item: { promptMessage: any; }) => item.promptMessage);
        this.filteredPrompts = [...this.suggestedPrompts];
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

  showMEEEEE: boolean = false;

  AskAiTogetData() {
  
    this.showMEEEEE = true;
    this.searchTerm = "";
    this.showPromptsDown = false;
    this.showPrompts = false;
    this.showInsightsPromptsDown = false;
    this.showInsightsPrompts = false;
    this.showGlobalPromptsDown = false;
    this.showGlobalPrompts = false;
    this.filteredPrompts = this.suggestedPrompts;
    this.filteredPrompts = [...this.suggestedPrompts];
    this.showOpenHistory = true;
    this.isfileProcessed = false;
    this.isTextLoading = true;
    this.isCopyButtonDisplayed = false;
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
    } else if (this.activeTab == 'globalchat') {
      this.chatGptIntegrationSettingsDto.agentType = this.GLOBALCHAT;
    } else if (this.activeTab == 'contactagent') {
      this.chatGptIntegrationSettingsDto.agentType = this.CONTACTAGENT;
    }
    self.chatGptIntegrationSettingsDto.chatHistoryId = self.chatHistoryId;
    self.chatGptIntegrationSettingsDto.vectorStoreId = self.vectorStoreId;
    self.chatGptIntegrationSettingsDto.isFromChatGptModal = true;
    self.chatGptIntegrationSettingsDto.partnerLoggedIn = this.isPartnerLoggedIn;
    self.chatGptIntegrationSettingsDto.vendorCompanyProfileName = this.vendorCompanyProfileName;
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

          let message = self.chatGptGeneratedText = self.referenceService.getTrimmedData(content.message);
          let isReport = response.data.isReport;
          if (isReport == 'true') {
            try {
              const cleanJsonStr = self.extractJsonString(message);
              message = self.parseOliverReport(cleanJsonStr);
            } catch (error) {
              isReport = 'false';
              message = self.chatGptGeneratedText;
            }
          }

          self.messages.push({ role: 'assistant', content: message,  isReport: isReport});
          self.threadId = content.threadId;
          self.vectorStoreId = content.vectorStoreId;
          self.chatHistoryId = content.chatHistoryId;
          self.isCopyButtonDisplayed = self.chatGptGeneratedText.length > 0;
          
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
      this.isfileProcessed = false;
    }
  }

  reUploadFiles() {
    this.isReUpload = true;
    this.isReUploadFromPreview = false;
    this.openAssetsPage();
  }

  setInputText(text: string) {
    this.inputText = text;
    this.isValidInputText = true;
  }

  handleFolders(event: any[]) {
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
          // this.getPdfByAssetPaths(data);
          this.pdfFiles = data;
          this.getUploadedFileIds();
        }
      },
      (error) => {
        console.error('API Error:', error);
      }
    );
  }

  fetchHistories(chatHistoryPagination: Pagination) {
    this.stopClickEvent = true;
    chatHistoryPagination.vendorCompanyProfileName = this.vendorCompanyProfileName;
    this.chatGptSettingsService.fetchHistories(chatHistoryPagination, this.isPartnerLoggedIn, this.chatGptIntegrationSettingsDto.oliverIntegrationType).subscribe(
      (response) => {
        const data = response.data;
        if (response.statusCode == XAMPLIFY_CONSTANTS.HTTP_OK) {
          chatHistoryPagination.totalRecords = data.totalRecords;
          this.chatHistories = [...this.chatHistories,...data.list];
        }
        this.stopClickEvent = false;
      }, error => {
        this.stopClickEvent = false;
      }
    )
  }

  showHistory(history: any) {
    let tab = this.getTabName(history.oliverChatHistoryType);
    this.setActiveTab(tab);
    this.threadId = history.threadId;
    this.vectorStoreId = history.vectorStoreId;
    this.chatHistoryId = history.chatHistoryId;
    this.showOpenHistory = true;
    this.isSaveHistoryPopUpVisible = false;
    if ((history.oliverChatHistoryType == this.INSIGHTAGENT && this.authenticationService.oliverInsightsEnabled && this.showOliverInsights)
      || (history.oliverChatHistoryType == this.BRAINSTORMAGENT && this.authenticationService.brainstormWithOliverEnabled && this.showBrainstormWithOliver)
      || (history.oliverChatHistoryType == this.SPARKWRITERAGENT && this.authenticationService.oliverSparkWriterEnabled && this.showOliverSparkWriter)
      || (history.oliverChatHistoryType == this.CONTACTAGENT)) {
      this.isAgentSubmenuOpen = true;
    }
    this.getChatHistory(history.oliverChatHistoryType);
  }

  getTabName(tab: any): string {
    switch (tab) {
      case this.BRAINSTORMAGENT:
        return "new-chat";
      case this.INSIGHTAGENT:
        return "askpdf";
      case this.SPARKWRITERAGENT:
        return "writing";
      case this.PARAPHRASERAGENT:
        return "paraphraser";
      case this.GLOBALCHAT:
        return "globalchat";
      case this.CONTACTAGENT:
        return "contactagent";
    }
  }

  getChatHistory(oliverChatHistoryType:any) {
    let oliverIntegrationType = this.chatGptIntegrationSettingsDto.oliverIntegrationType;
    if (oliverChatHistoryType == this.BRAINSTORMAGENT || oliverChatHistoryType == this.PARAPHRASERAGENT ||  oliverChatHistoryType == this.SPARKWRITERAGENT) {
      oliverIntegrationType = "openai";
    }
    this.chatGptSettingsService.getChatHistoryByThreadId(this.threadId, oliverIntegrationType, this.chatGptIntegrationSettingsDto.accessToken).subscribe(
      (response: any) => {
        if (response.statusCode == 200) {
          let messages = response.data;
          let isReport = 'false';
          messages.forEach((message: any) => {

            if (message.role === 'assistant') {
              if (isReport == 'true') {
                let reponseJson = this.extractJsonString(message.content);
                message.content = this.parseOliverReport(reponseJson);
              }
              this.messages.push({ role: 'assistant', content: message.content, isReport: isReport });
            }
            if (message.role === 'user') {
              this.messages.push({ role: 'user', content: message.content });
              if (this.checkKeywords(message.content)) {
                isReport = 'true';
              } else {
                isReport = 'false';
              }
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

  checkKeywords(prompt: string) {
    const keywords = ['executive summary', 'QBR'];
    return keywords.some(keyword => prompt.toLowerCase().includes(keyword.toLowerCase()));
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
      self.chatGptSettingsService.deleteChatHistory(history.chatHistoryId,history.threadId,history.vectorStoreId, history.oliverChatHistoryType).subscribe(
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
    if (keyCode === 13 && this.chatHistorySortOption.searchKey != undefined && this.chatHistorySortOption.searchKey.length > 0 && !this.stopClickEvent) {
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
    // const text = markdown && markdown.innerHTML ? markdown.innerHTML : '';
    // this.chatGptIntegrationSettingsDto.prompt = text;
    this.chatGptSettingsService.insertTemplateData(this.chatGptIntegrationSettingsDto).subscribe(
      (response: any) => {
        if (!this.emailTemplateService.emailTemplate) {
          this.emailTemplateService.emailTemplate = new EmailTemplate();
          this.showTemplate = false;
          this.selectTemplate = true;
          this.templateLoader = false;
        }
        if (this.chatGptIntegrationSettingsDto.designPdf) {
          this.emittdata = JSON.stringify(response.data);
          this.openAssetPage = true;
        } else if (this.chatGptIntegrationSettingsDto.designPage) {
          this.showPage = true;
          this.landingPageService.jsonBody = JSON.stringify(response.data);
        } else {
          this.emailTemplateService.emailTemplate.jsonBody = JSON.stringify(response.data);
          this.showTemplate = true;
        }
        this.selectTemplate = false;
        this.templateLoader = false;
      },
      (error: string) => {
        this.showTemplate = false;
        this.emailTemplateService.emailTemplate.jsonBody = "";
        console.log('API Error:', error);
      }
    );
  }


  
closeDesignTemplate(event: any) {
    this.emitterData(event);
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

  /** XNFR-982 start **/
  updateCheckBox(event: any, agentType: string) {
    const isChecked = event.target.checked;
    if (agentType === this.INSIGHTAGENT) {
      this.oliverAgentAccessDTO.showOliverInsights = isChecked;
    } else if (agentType === this.BRAINSTORMAGENT) {
      this.oliverAgentAccessDTO.showBrainstormWithOliver = isChecked;
    } else if (agentType === this.SPARKWRITERAGENT) {
      this.oliverAgentAccessDTO.showOliverSparkWriter = isChecked;
    } else if (agentType === this.PARAPHRASERAGENT) {
      this.oliverAgentAccessDTO.showOliverParaphraser = isChecked;
    }
  }

  updateOliverAgentAccessSettings() {
    this.agentAccessUpdateButtonName = 'Updating...';
    this.disableAgentAccessUpdateButton = true;
    this.chatGptSettingsService.updateOliverAgentConfigurationSettings(this.oliverAgentAccessDTO).subscribe(
      (response: any) => {
        if (response.statusCode == 200) {
          let data = response.data;
        }
      },
      (error) => {
        this.agentAccessUpdateButtonName = 'Update';
        this.disableAgentAccessUpdateButton = false;
        this.getOliverAgentAccessSettings();
      }, () => {
        this.agentAccessUpdateButtonName = 'Update';
        this.disableAgentAccessUpdateButton = false;
        this.getOliverAgentAccessSettings();
      }
    );
  }

  getOliverAgentAccessSettings() {
    this.chatGptSettingsService.getOliverAgentConfigurationSettings().subscribe(
      result => {
        if (result.data && result.statusCode == 200) {
          let data = result.data;
          this.showOliverInsights = data.showOliverInsights;
          this.showBrainstormWithOliver = data.showBrainstormWithOliver;
          this.showOliverSparkWriter = data.showOliverSparkWriter;
          this.showOliverParaphraser = data.showOliverParaphraser;
          this.oliverAgentAccessDTO.showOliverInsights = this.showOliverInsights;
          this.oliverAgentAccessDTO.showBrainstormWithOliver = this.showBrainstormWithOliver;
          this.oliverAgentAccessDTO.showOliverSparkWriter = this.showOliverSparkWriter;
          this.oliverAgentAccessDTO.showOliverParaphraser = this.showOliverParaphraser;
        }
      }, error => {
        console.log('Error in getOliverAgentAccessSettings() ', error);
      });
  }

   getOliverAgentAccessSettingsForVanityLogin() {
    this.chatGptSettingsService.getOliverAgentConfigurationSettingsForVanityLogin().subscribe(
      result => {
        if (result.data && result.statusCode == 200) {
          let data = result.data;
          this.showOliverInsights = data.showOliverInsights;
          this.showBrainstormWithOliver = data.showBrainstormWithOliver;
          this.showOliverSparkWriter = data.showOliverSparkWriter;
          this.showOliverParaphraser = data.showOliverParaphraser;
          this.oliverAgentAccessDTO.showOliverInsights = this.showOliverInsights;
          this.oliverAgentAccessDTO.showBrainstormWithOliver = this.showBrainstormWithOliver;
          this.oliverAgentAccessDTO.showOliverSparkWriter = this.showOliverSparkWriter;
          this.oliverAgentAccessDTO.showOliverParaphraser = this.showOliverParaphraser;
        }
      }, error => {
        console.log('Error in getOliverAgentConfigurationSettingsForVanityLogin() ', error);
      });
  }

  resetOliverAgentSettings() {
    this.showOliverInsights = this.oliverAgentAccessDTO.showOliverInsights;
    this.showBrainstormWithOliver = this.oliverAgentAccessDTO.showBrainstormWithOliver;
    this.showOliverSparkWriter = this.oliverAgentAccessDTO.showOliverSparkWriter;
    this.showOliverParaphraser = this.oliverAgentAccessDTO.showOliverParaphraser;
  }
    /** XNFR-982 end **/

  closeSelectionTemplate(event: any) {
    if (event) {
       const selectedTemplate = event.selectedTemplate;
       const isConfirmed = event.isConfirmed;
       this.chatGptIntegrationSettingsDto.addBrandColors = isConfirmed;
      // this.emailTemplateService.emailTemplate.jsonBody = "";
      if (this.chatGptIntegrationSettingsDto.designPage) {
        this.landingPageService.id = selectedTemplate.id;
      } else {
        this.emailTemplateService.emailTemplate = selectedTemplate;
      }
      this.chatGptIntegrationSettingsDto.templateId = selectedTemplate.id;
      this.openDesignTemplate(selectedTemplate);
      this.templateLoader = true;
    } else {
      this.resetPageData();
      this.selectTemplate = false;
    }
  } 
   
  openSelectionTemplate(markdown: any) {
    let text = markdown && markdown.innerHTML ? markdown.innerHTML : '';
    this.chatGptIntegrationSettingsDto.prompt = text;
    this.selectTemplate = true;
  }

  toggleAgentSubmenu(): void {
    this.isAgentSubmenuOpen = !this.isAgentSubmenuOpen;
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  onOliverFlagsUpdate(flags: {
    showOliverInsights: boolean; showBrainstormWithOliver: boolean; showOliverSparkWriter: boolean;
    showOliverParaphraser: boolean;
  }) {
    this.showOliverInsights = flags.showOliverInsights;
    this.showBrainstormWithOliver = flags.showBrainstormWithOliver;
    this.showOliverSparkWriter = flags.showOliverSparkWriter;
    this.showOliverParaphraser = flags.showOliverParaphraser;
  }

  createAsset(markdown: any) {
    let text = markdown && markdown.innerHTML ? markdown.innerHTML : '';
    this.chatGptIntegrationSettingsDto.prompt = text;
    this.chatGptIntegrationSettingsDto.designPdf = true;
    const templateId = this.selectedTemplateList.find(t => t.name === 'Basic Blank Template-co default').id;
    this.chatGptIntegrationSettingsDto.templateId = templateId;
    this.openDesignTemplate(this.chatGptIntegrationSettingsDto);
  }

  fetchOliverActiveIntegration() {
    this.chatGptIntegrationSettingsDto.partnerLoggedIn = this.isPartnerLoggedIn;
    this.chatGptIntegrationSettingsDto.vendorCompanyProfileName = this.vendorCompanyProfileName;
    this.chatGptSettingsService.fetchOliverActiveIntegration(this.chatGptIntegrationSettingsDto).subscribe(
      (response: any) => {
        if (response.statusCode == 200) {
          let data = response.data;
          if (data != null && data != undefined) {
            this.chatGptIntegrationSettingsDto.accessToken = data.accessToken;
            this.chatGptIntegrationSettingsDto.assistantId = data.assistantId;
            this.chatGptIntegrationSettingsDto.agentAssistantId = data.agentAssistantId;
            this.chatGptIntegrationSettingsDto.oliverIntegrationType = data.type;
            this.chatGptIntegrationSettingsDto.contactAssistantId = data.contactAssistantId;
          }
        }
      }, error => {
        console.log('Error in fetchOliverActiveIntegration() ', error);
      });
  }

  uploadFilesFromPreview() {
    this.isReUpload = true;
    this.isReUploadFromPreview = true;
    this.openAssetsPage();
  }

  /** XNFR-1002 start **/
  desginPage(markdown: any) {
    let text = markdown && markdown.innerHTML ? markdown.innerHTML : '';
    this.chatGptIntegrationSettingsDto.prompt = text;
    this.pagination.source = "OLIVER_DEFAULT_PAGE";
    this.listLandingPages(this.pagination);
    this.chatGptIntegrationSettingsDto.designPage = true;
  }

  listLandingPages(pagination: Pagination) {
    this.referenceService.goToTop();
    this.landingPageService.listDefault(pagination).subscribe(
      (response: any) => {
        if (response.access) {
          let data = response.data;
          if (response.statusCode == 200) {
            pagination.totalRecords = data.totalRecords;
            pagination = this.pagerService.getPagedItems(pagination, data.landingPages);
            this.selectedTemplateList = pagination.pagedItems;
            this.selectTemplate = true;
          }
        } else {
          this.authenticationService.forceToLogout();
        }

      },
      (error: any) => {
        console.error("Error in listLandingPages():", error);});
  }

  /** XNFR-1002 End **/
  
  copyToClipBoard(inputValue: HTMLElement) {
    const title = inputValue.getAttribute('value') || '';
    const textarea = document.createElement('textarea');
    textarea.value = title;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  copyResponse(inputValue: HTMLElement, index:any) {
    this.copiedIndexes[index] = 1;
    this.copyToClipBoard(inputValue);

    setTimeout(() => {
      this.copiedIndexes[index] = 0;
    }, 2000)
  }

  isCopied(index: number): boolean {
    return !!this.copiedIndexes[index];
  }

  clearSeachKey() {
    this.chatHistorySortOption.searchKey = '';
    this.searchChatHistory();
  }

showSweetAlertForBrandColors(tab:string,threadId:any,vectorStoreId:any,chatHistoryId:any,isClosingModelPopup:boolean) {
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
      if (isClosingModelPopup) {
        self.showIcon = true;
      }
    }, function (dismiss: any) {
    })
    self.activeTab = tab;
  }

  resetPageData() {
    if (this.chatGptIntegrationSettingsDto.designPage) {
      this.selectedTemplateList = [];
      this.landingPageService.jsonBody = "";
      this.showDefaultTemplates();
      this.chatGptIntegrationSettingsDto.designPage = false;
    }
  }

  searchPromptsBasic() {
    const term = this.searchTerm.trim().toLowerCase();
    if (term === '') {
      this.filteredPrompts = this.suggestedPrompts
        .slice().sort(() => Math.random() - 0.5).slice(0, 15);
    } else {
      const term = this.searchTerm.split(/\s+/);
      this.filteredPrompts = this.suggestedPrompts.filter(prompt => {
        const lowerPrompt = prompt.toLowerCase();
        return term.every((word: string) => lowerPrompt.includes(word));
      });
    }
  }

  searchPrompts(): void {
  const isAskPdf = this.activeTab === 'askpdf';
  const isGlobalChat = this.activeTab === 'globalchat';
  const term = (isAskPdf || isGlobalChat ? this.inputText : this.searchTerm || '').trim().toLowerCase();

  if (!term) {
    this.filteredPrompts = [...this.suggestedPrompts];
  } else {
    const searchWords = term.split(/\s+/);
    this.filteredPrompts = this.suggestedPrompts.filter(prompt => {
      const lowerPrompt = prompt.toLowerCase();
      return searchWords.every(word => lowerPrompt.includes(word));
    });
  }

  const hasMatches = term && this.filteredPrompts.length > 0;

  if (isAskPdf && hasMatches) {
    this.showInsightsPromptsDown = this.showOpenHistory;
    this.showInsightsPrompts = !this.showOpenHistory;
  } else if (isGlobalChat && hasMatches) {
    this.showGlobalPromptsDown = this.showOpenHistory;
    this.showGlobalPrompts = !this.showOpenHistory;
  } else {
    this.showPromptsDown = false;
    this.showPrompts = false;
    this.showInsightsPromptsDown = false;
    this.showInsightsPrompts = false;
    this.showGlobalPromptsDown = false;
    this.showGlobalPrompts = false;
    this.filteredPrompts = [...this.suggestedPrompts];
  }
  }

  getSuggestedPromptsForGlobalSearch() {
    this.customResponse = new CustomResponse();
    this.filteredPrompts = [];
    this.suggestedPrompts = [];
    let companyProfileName = '';
    if (this.authenticationService.companyProfileName !== undefined && 
      this.authenticationService.companyProfileName !== '') {
      companyProfileName = this.authenticationService.companyProfileName;
    }
    this.chatGptSettingsService.getSuggestedPromptsForGlobalSearch(companyProfileName).subscribe(
      response => {
        let statusCode = response.statusCode;
        let data = response.data;
        if (statusCode === 200) {
          this.oliverPromptSuggestionDTOs = data || [];
          this.suggestedPrompts = this.oliverPromptSuggestionDTOs.map(item => item.promptMessage);
          this.filteredPrompts = [...this.suggestedPrompts];
        } else if (statusCode === 400) {
         
        } else {
          
        }
      }, error => {
         
      }, () => {
       
      });
  }

  openPrompts() {
    this.showInsightsPromptsDown = false;
    this.showInsightsPrompts = false;
    this.searchTerm = "";
    this.showPrompts = !this.showPrompts;
    this.showGlobalPromptsDown = false;
    this.showGlobalPrompts = false;
    this.filteredPrompts = this.suggestedPrompts
    .slice().sort(() => Math.random() - 0.5).slice(0, 15);
  }

  openPromptsDown() {
    this.showInsightsPromptsDown = false;
    this.showInsightsPrompts = false;
    this.searchTerm = "";
    this.showPromptsDown = !this.showPromptsDown;
    this.showGlobalPromptsDown = false;
    this.showGlobalPrompts = false;
    this.filteredPrompts = this.suggestedPrompts
    .slice().sort(() => Math.random() - 0.5).slice(0, 15);
  }

  extractJsonString(raw: string): string {
    const firstBrace = raw.indexOf('{');
    const lastBrace = raw.lastIndexOf('}');
    if (firstBrace === -1 || lastBrace === -1 || firstBrace > lastBrace) {
      throw new Error('No valid JSON object found in input');
    }
    return raw.substring(firstBrace, lastBrace + 1);
  }

  parseOliverReport(jsonStr: string): ExecutiveReport {
    const jsonObject = JSON.parse(jsonStr);
    const dto: ExecutiveReport = {
      meta: {
        report_title: jsonObject.meta ? jsonObject.meta.report_title : '',
        subtitle: jsonObject.meta ? jsonObject.meta.subtitle : '',
        date_range: jsonObject.meta ? jsonObject.meta.date_range : '',
        report_owner: jsonObject.meta ? jsonObject.meta.report_owner : '',
        report_recipient: jsonObject.meta ? jsonObject.meta.report_recipient : ''
      },
      kpi_overview: {
        total_pipeline_value: jsonObject.kpi_overview ? jsonObject.kpi_overview.total_pipeline_value : '',
        number_of_leads_generated: jsonObject.kpi_overview ? jsonObject.kpi_overview.number_of_leads_generated : '',
        number_of_campaigns_launched: jsonObject.kpi_overview ? jsonObject.kpi_overview.number_of_campaigns_launched : '',
        number_of_deals_logged: jsonObject.kpi_overview ? jsonObject.kpi_overview.number_of_deals_logged : '',
        total_deal_value: jsonObject.kpi_overview ? jsonObject.kpi_overview.total_deal_value : ''
      },
      executive_summary_table: jsonObject.executive_summary_table ? jsonObject.executive_summary_table : [],
      // performance_indicators: jsonObject.key_takeaways || [],
      performance_indicators: {
        campaign_engagement_rate: jsonObject.performance_indicators ? jsonObject.performance_indicators.campaign_engagement_rate : '',
        lead_conversion_rate: jsonObject.performance_indicators ? jsonObject.performance_indicators.lead_conversion_rate : '',
        average_deal_value: jsonObject.performance_indicators ? jsonObject.performance_indicators.average_deal_value : '',
        video_campaign_performance: jsonObject.performance_indicators ? jsonObject.performance_indicators.video_campaign_performance : '',
        page_campaign_performance: jsonObject.performance_indicators ? jsonObject.performance_indicators.page_campaign_performance : '',
        overall_pipeline_health: jsonObject.performance_indicators ? jsonObject.performance_indicators.overall_pipeline_health : ''
      },
      // campaign_performance_analysis: jsonObject.strategic_recommendations || [],
      campaign_performance_analysis: {
        top_performing_campaign_type: jsonObject.campaign_performance_analysis ? jsonObject.campaign_performance_analysis.campaign_engagement_rate : '',
        engagement_state: {
          connected: jsonObject.campaign_performance_analysis ? jsonObject.campaign_performance_analysis.engagement_state ? jsonObject.campaign_performance_analysis.engagement_state.connected : '' : '',
          idle: jsonObject.campaign_performance_analysis ? jsonObject.campaign_performance_analysis.engagement_state ? jsonObject.campaign_performance_analysis.engagement_state.idle : '' : '',
          other: jsonObject.campaign_performance_analysis ? jsonObject.campaign_performance_analysis.engagement_state ? jsonObject.campaign_performance_analysis.engagement_state.other : '' : ''
        },
        notes: jsonObject.campaign_performance_analysis ? jsonObject.campaign_performance_analysis.notes : ''
      },
      lead_progression_funnel: {
        stages: jsonObject.lead_progression_funnel ? jsonObject.lead_progression_funnel.stages : [],
        notes: jsonObject.lead_progression_funnel ? jsonObject.lead_progression_funnel.notes : ''
      },
      pipeline_progression: {
        deal_stages: jsonObject.pipeline_progression ? jsonObject.pipeline_progression.deal_stages : [],
        highest_deal_value: jsonObject.pipeline_progression ? jsonObject.pipeline_progression.highest_deal_value : '',
        average_deal_value: jsonObject.pipeline_progression ? jsonObject.pipeline_progression.average_deal_value : '',
        notes: jsonObject.pipeline_progression ? jsonObject.pipeline_progression.notes : ''
      },
      contact_journey_timeline: jsonObject.contact_journey_timeline ? jsonObject.contact_journey_timeline : [],
      strategic_insights: jsonObject.strategic_insights ? jsonObject.strategic_insights : [],
      recommended_next_steps: jsonObject.strategic_insights ? jsonObject.recommended_next_steps : [],
      executive_bottom_line: jsonObject.strategic_insights ? jsonObject.executive_bottom_line : ''
    };
    return dto;
  }

}
