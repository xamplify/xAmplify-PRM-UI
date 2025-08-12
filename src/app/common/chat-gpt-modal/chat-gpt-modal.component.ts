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
import { Observable, Subscription } from 'rxjs';

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
  private readonly PARTNERAGENT = "PARTNERAGENT";
  private readonly CAMPAIGNAGENT = "CAMPAIGNAGENT";
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
  showOliverContactAgent: boolean = false;
  showOliverPartnerAgent: boolean = false;
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

  /** XNFR-1009 **/
  showPromptBoxAbove: boolean = false;
  suggestedPromptDTOs: OliverPromptSuggestionDTO[] = [];
  showPromptBoxBelow: boolean  = false;
  showGlobalPromptBoxBelow: boolean;
  showGlobalPromptBoxAbove: boolean;
  showInsightPromptBoxBelow: boolean = false;
  showInsightPromptBoxAbove: boolean = false;
  
  selectedPromptId: number;
  historyLoader: boolean = false;
  statusMessage: string = '';
  private loaderMessages: string[] = ['Analyzing', 'Thinking', 'Processing', 'Finalizing', 'Almost there'];
  private messageIndex: number = 0;
  private intervalSub: Subscription;
  socialShareOption: boolean = false;
  designAccess: boolean = false;
  uploadedFolders: any[];
  showPptDesignPicker: boolean = false;
  pptData: string;
  isResponseInProgress: boolean;
  showOliverCampaignAgent: any;
  intentMessages: any[] = [];

  constructor(public authenticationService: AuthenticationService, private chatGptSettingsService: ChatGptSettingsService,
    private referenceService: ReferenceService, public properties: Properties, public sortOption: SortOption, public router: Router, private cdr: ChangeDetectorRef, private http: HttpClient,
    private emailTemplateService: EmailTemplateService, public pagerService: PagerService,private landingPageService: LandingPageService) {
  }

  ngOnInit() {
    this.selectedValueForWork = this.sortOption.wordOptionsForOliver[0].value;
    this.sortBy(this.selectedValueForWork);
    this.checkSocialAcess();
  }

  validateInputText() {
    let trimmedText = this.referenceService.getTrimmedData(this.inputText);
    this.isValidInputText = trimmedText != undefined && trimmedText.length > 0;
     if (this.activeTab == 'askpdf' || this.activeTab == 'globalchat' ) { 
      this.searchPromptsOnKeyPress();
    }
  }

  ngOnDestroy() {
    this.showIcon = true;
    this.isWelcomePageUrl = false;
    this.selectedAssets = [];
    this.selectedFolders = [];
    this.designAccess = false;
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
    let messagesContent: any = [];
    messagesContent = this.messages.filter(function (message) {
      return message.isReport == 'false';
    });
    this.chatGptIntegrationSettingsDto.contents = messagesContent;
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
          this.chatGptGeneratedText = response.message;
          this.messages.push({ role: 'assistant', content: response.message });
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
    if (this.messages.length == 0 && this.activeTab == 'askpdf') {
      this.deleteChatHistory(this.threadId, this.vectorStoreId, this.chatHistoryId, false);
    }
    this.checkSocialAcess();
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
    this.intentMessages = [];
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
    this.resetAllPromptBoxes();
    this.getSuggestedPromptsForGlobalSearch();
    this.autoResizeTextArea(event);
    this.designAccess = false;
    this.checkDesignAccess();
    this.pptData = '';
    this.showPptDesignPicker = false;
    this.chatGptIntegrationSettingsDto.isGlobalSearchDone = false;
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
    if (this.messages.length > 0 && this.chatHistoryId != undefined && this.chatHistoryId > 0 && this.isSaveHistoryPopUpVisible && this.activeTab != 'paraphraser') {
      this.saveChatHistoryTitle(this.chatHistoryId);
    } else if(this.messages.length == 0 && this.activeTab == 'askpdf') {
      this.deleteChatHistory(this.threadId, this.vectorStoreId, this.chatHistoryId, false);
    }
    this.messages = [];
    this.intentMessages = [];
    this.searchTerm = "";
    this.showPromptBoxBelow = false;
    this.showPromptBoxAbove = false;
    this.showInsightPromptBoxBelow = false;
    this.showInsightPromptBoxAbove = false;
    this.showGlobalPromptBoxBelow = false;
    this.showGlobalPromptBoxAbove = false;
    this.isValidInputText = false;
    this.inputText = "";
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
    if (this.isTextLoading) {
      this.isResponseInProgress = true;
    } else {
      this.isResponseInProgress = false;
    }
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
    this.autoResizeTextArea(event);
    this.designAccess = false;
    this.checkDesignAccess();
    this.pptData = '';
    this.showPptDesignPicker = false;
    this.isTextLoading = false;
    this.chatGptIntegrationSettingsDto.isGlobalSearchDone = false;
    // this.isTextLoading = false;
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
    this.chatGptSettingsService.deleteChatHistory(chatHistoryId,threadId,vectorStoreId,"INSIGHTAGENT").subscribe(
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

   searchDataOnKeyPress(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    if (this.inputText && this.inputText.length > 0 && !this.isTextLoading) {
      this.AskAiTogetData();
      event.preventDefault();
    }
  }
}

  openAssetsPage() {
    if (this.isReUpload && this.selectedAssets.length > 0 &&
      (!this.uploadedAssets || this.uploadedAssets.length == 0)) {
      this.uploadedAssets = this.selectedAssets;
    }
    if (this.isReUpload && this.selectedFolders.length > 0 &&
      (!this.uploadedFolders || this.uploadedFolders.length == 0)) {
      this.uploadedFolders = this.selectedFolders;
    }
    this.showView = true;
  }


  getSelectedAssets(event: any) {
    if (!this.isReUpload) {
      this.selectedAssets = event;
    } else {
      this.uploadedAssets = event;
    }

    if (this.isReUpload && (this.uploadedFolders && this.uploadedFolders.length > 0)) {
      this.uploadedAssets = [];
    }
  }
  

  submitSelectedAssetsToOliver() {
    this.assetLoader = true;
    this.showOpenHistory = false;
    if (this.isReUpload && (!this.uploadedFolders || this.uploadedFolders.length == 0)) {
      this.selectedFolders = [];
    }
    if (this.selectedFolders.length === 0 && (!this.uploadedFolders || this.uploadedFolders.length === 0)) {
      if (this.isReUpload && this.uploadedAssets != undefined && this.uploadedAssets.length > 0) {
        this.selectedAssets = this.uploadedAssets;
        this.selectedFolders = [];
        this.uploadedFolders = [];
      }
      this.pdfFiles = this.selectedAssets;
      this.getUploadedFileIds();
    } else {
      if (this.isReUpload && this.uploadedFolders != undefined && this.uploadedFolders.length > 0) {
        this.selectedFolders = this.uploadedFolders;
        this.selectedAssets = [];
        this.uploadedAssets = [];
      }
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
    this.oliverPromptSuggestionDTOs = [];
    this.suggestedPromptDTOs = [];
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
        this.suggestedPromptDTOs = [...this.oliverPromptSuggestionDTOs];
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
    this.resetAllPromptBoxes();
    this.showOpenHistory = true;
    this.isfileProcessed = false;
    this.isTextLoading = true;
    this.isCopyButtonDisplayed = false;
    this.chatGptIntegrationSettingsDto.promptId = this.selectedPromptId;
    var self = this;
    self.scrollToBottom();
    self.messages.push({ role: 'user', content: self.inputText });
    self.intentMessages.push({ role: 'user', content: self.inputText });
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
    }else if (this.activeTab == 'partneragent') {
      this.chatGptIntegrationSettingsDto.agentType = this.PARTNERAGENT;
    } else if (this.activeTab == 'campaignagent') {
      this.chatGptIntegrationSettingsDto.agentType = this.CAMPAIGNAGENT;
    }
    self.chatGptIntegrationSettingsDto.chatHistoryId = self.chatHistoryId;
    self.chatGptIntegrationSettingsDto.vectorStoreId = self.vectorStoreId;
    self.chatGptIntegrationSettingsDto.isFromChatGptModal = true;
    self.chatGptIntegrationSettingsDto.partnerLoggedIn = this.isPartnerLoggedIn;
    self.chatGptIntegrationSettingsDto.vendorCompanyProfileName = this.vendorCompanyProfileName;
    self.chatGptIntegrationSettingsDto.isContact = this.authenticationService.module.isContact;
    self.chatGptIntegrationSettingsDto.contents = self.intentMessages;
    if (this.activeTab != 'paraphraser') {
      self.inputText = '';
      this.removeStyleForTextArea();
    }
    self.isValidInputText = false;
    self.startStatusRotation();
    this.chatGptSettingsService.generateAssistantTextByAssistant(this.chatGptIntegrationSettingsDto).subscribe(
      function (response) {
        let statusCode = response.statusCode;
        // swal.close();
        if (statusCode === 200) {
          self.isTextLoading = false;
          let isReport = response.data.isReport;
          self.chatGptIntegrationSettingsDto.isGlobalSearchDone = response.data.isGlobalSearchDone;
          console.log('API Response:', response);
          var content = response.data;
          if (content) {
            let message = self.chatGptGeneratedText = self.referenceService.getTrimmedData(content.message);
            self.intentMessages.push({ role: 'assistant', content: message, isReport: isReport });
            if (isReport == 'true') {
              try {
                const cleanJsonStr = self.extractJsonString(message);
                message = self.parseOliverReport(cleanJsonStr);
              } catch (error) {
                isReport = 'false';
                message = self.chatGptGeneratedText;
              }
            }

            self.messages.push({ role: 'assistant', content: message, isReport: isReport });
            self.threadId = content.threadId;
            self.vectorStoreId = content.vectorStoreId;
            self.chatHistoryId = content.chatHistoryId;
            self.isCopyButtonDisplayed = self.chatGptGeneratedText.length > 0;

          } else {
            self.messages.push({ role: 'assistant', content: 'An unexpected issue occurred. Please try again shortly', isReport: 'false' });
            self.intentMessages.push({ role: 'assistant', content: 'An unexpected issue occurred. Please try again shortly', isReport: 'false' });
          }
          this.trimmedText = '';
          if (!(self.inputText != undefined && self.inputText.length > 0)) {
            self.autoResizeTextArea(event);
          }
          self.selectedPromptId = null;
        } else if (statusCode === 400) {
          var content = response.data;
          self.isTextLoading = false;
          self.threadId = content.threadId;
          self.vectorStoreId = content.vectorStoreId;
          self.chatHistoryId = content.chatHistoryId;
          self.messages.push({ role: 'assistant', content: 'An unexpected issue occurred. Please try again shortly', isReport: 'false' });
          self.intentMessages.push({ role: 'assistant', content: 'An unexpected issue occurred. Please try again shortly', isReport: 'false' });
        }
        self.stopStatusRotation();
        if (self.isResponseInProgress) {
          self.showOpenHistory = false;
          self.isCopyButtonDisplayed = false;
          self.messages = [];
          self.intentMessages = [];
          self.intentMessages = [];
          self.chatGptGeneratedText = '';
          self.isTextLoading = false;
          self.isValidInputText = false;
          self.inputText = '';
          self.isResponseInProgress = false;
        }
        console.log(self.messages);
      },
      function (error) {
        console.log('API Error:', error);
        self.isTextLoading = false;
        self.messages.push({ role: 'assistant', content: self.properties.serverErrorMessage, isReport: 'false' });
        self.intentMessages.push({ role: 'assistant', content: self.properties.serverErrorMessage, isReport: 'false' });
        self.selectedPromptId = null;
        self.stopStatusRotation();
      }
    );
  }

  private removeStyleForTextArea() {
    const textarea = document.getElementById('askMeTextarea') as HTMLTextAreaElement | null;
    const textarea1 = document.getElementById('askMeTextarea1') as HTMLTextAreaElement | null;
    const textarea2 = document.getElementById('askMeTextarea2') as HTMLTextAreaElement | null;
    const textarea3 = document.getElementById('askMeTextarea3') as HTMLTextAreaElement | null;
    const textarea4 = document.getElementById('askMeTextarea4') as HTMLTextAreaElement | null;
     const textarea5 = document.getElementById('askMeTextarea5') as HTMLTextAreaElement | null;
     const textarea6 = document.getElementById('askMeTextarea6') as HTMLTextAreaElement | null;
    if (textarea) {
      textarea.removeAttribute('style');
    }
    if (textarea1) {
      textarea1.removeAttribute('style');
    }
    if (textarea2) {
      textarea2.removeAttribute('style');
    }
    if (textarea3) {
      textarea3.removeAttribute('style');
    }
    if (textarea4) {
      textarea4.removeAttribute('style');
    }
    if (textarea5) {
      textarea5.removeAttribute('style');
    }
    if (textarea6) {
      textarea6.removeAttribute('style');
    }
    let textArea = textarea || textarea1 || textarea2 || textarea3 || textarea4 ||textarea5 || textarea6;
    if (textArea) {
        const chat = document.querySelector('.newChatlabel') as HTMLElement;
        const box = textArea.closest('.oliver_input') as HTMLElement;
        if (chat && box) {
          chat.removeAttribute('style');
          
      }
    }
  }

  onKeyPressForAsekOliver(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    if (this.inputText && this.inputText.length > 0) {
      this.AskAiTogetData();
      event.preventDefault(); 
    }
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
    if (!this.isReUpload) {
      this.selectedFolders = event;
    } else {
      this.uploadedFolders = event;
    }
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
    this.historyLoader = true;
    chatHistoryPagination.vendorCompanyProfileName = this.vendorCompanyProfileName;
    this.chatGptSettingsService.fetchHistories(chatHistoryPagination, this.isPartnerLoggedIn, this.chatGptIntegrationSettingsDto.oliverIntegrationType).subscribe(
      (response) => {
        this.historyLoader = false;
        const data = response.data;
        if (response.statusCode == XAMPLIFY_CONSTANTS.HTTP_OK) {
          chatHistoryPagination.totalRecords = data.totalRecords;
          this.chatHistories = [...this.chatHistories,...data.list];
        }
        this.stopClickEvent = false;
      }, error => {
        this.historyLoader = false;
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
    this.chatGptIntegrationSettingsDto.isGlobalSearchDone = history.isGlobalSearchDone;
    if ((history.oliverChatHistoryType == this.INSIGHTAGENT && this.authenticationService.oliverInsightsEnabled && this.showOliverInsights)
      || (history.oliverChatHistoryType == this.BRAINSTORMAGENT && this.authenticationService.brainstormWithOliverEnabled && this.showBrainstormWithOliver)
      || (history.oliverChatHistoryType == this.SPARKWRITERAGENT && this.authenticationService.oliverSparkWriterEnabled && this.showOliverSparkWriter)
      || (history.oliverChatHistoryType == this.CONTACTAGENT) || (history.oliverChatHistoryType == this.PARTNERAGENT) || (history.oliverChatHistoryType == this.CAMPAIGNAGENT)) {
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
      case this.PARTNERAGENT:
        return "partneragent";
      case this.CAMPAIGNAGENT:
        return "campaignagent";
    }
  }

  getChatHistory(oliverChatHistoryType: any) {
    let oliverIntegrationType = this.chatGptIntegrationSettingsDto.oliverIntegrationType;
    if (oliverChatHistoryType == this.BRAINSTORMAGENT || oliverChatHistoryType == this.PARAPHRASERAGENT || oliverChatHistoryType == this.SPARKWRITERAGENT) {
      oliverIntegrationType = "openai";
    }
    this.chatGptSettingsService.getChatHistoryByThreadId(this.threadId, oliverIntegrationType, this.chatGptIntegrationSettingsDto.accessToken).subscribe(
      (response: any) => {
        if (response.statusCode == 200) {
          let messages = response.data;
          let isReport = 'false';
          messages.forEach((message: any) => {

            if (message.role === 'assistant') {
              this.intentMessages.push({ role: 'assistant', content: message.content, isReport: isReport });
              if (isReport == 'true') {
                let reponseJson = this.extractJsonString(message.content);
                message.content = this.parseOliverReport(reponseJson);
              }
              this.messages.push({ role: 'assistant', content: message.content, isReport: isReport });
            }
            if (message.role === 'user') {
              this.messages.push({ role: 'user', content: message.content });
              if ((this.activeTab == 'contactagent' || this.activeTab == 'partneragent' || this.activeTab == 'campaignagent' || this.activeTab == 'globalchat') && this.checkKeywords(message.content)) {
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
    } else if (agentType === this.CONTACTAGENT) {
      this.oliverAgentAccessDTO.showOliverContactAgent = isChecked;
    } else if (agentType === this.PARTNERAGENT) {
      this.oliverAgentAccessDTO.showOliverPartnerAgent = isChecked;
    } else if (agentType === this.CAMPAIGNAGENT) {
      this.oliverAgentAccessDTO.showOliverCampaignAgent = isChecked;
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
          this.showOliverContactAgent = data.showOliverContactAgent;
          this.showOliverPartnerAgent = data.showOliverPartnerAgent;
           this.showOliverCampaignAgent = data.showOliverCampaignAgent;
          
          this.oliverAgentAccessDTO.showOliverInsights = this.showOliverInsights;
          this.oliverAgentAccessDTO.showBrainstormWithOliver = this.showBrainstormWithOliver;
          this.oliverAgentAccessDTO.showOliverSparkWriter = this.showOliverSparkWriter;
          this.oliverAgentAccessDTO.showOliverParaphraser = this.showOliverParaphraser;
          this.oliverAgentAccessDTO.showOliverContactAgent = this.showOliverContactAgent;
          this.oliverAgentAccessDTO.showOliverPartnerAgent = this.showOliverPartnerAgent;
           this.oliverAgentAccessDTO.showOliverCampaignAgent = this.showOliverCampaignAgent;
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
          this.showOliverContactAgent = data.showOliverContactAgent;
          this.showOliverPartnerAgent = data.showOliverPartnerAgent;
          this.showOliverCampaignAgent = data.showOliverCampaignAgent;
          this.oliverAgentAccessDTO.showOliverInsights = this.showOliverInsights;
          this.oliverAgentAccessDTO.showBrainstormWithOliver = this.showBrainstormWithOliver;
          this.oliverAgentAccessDTO.showOliverSparkWriter = this.showOliverSparkWriter;
          this.oliverAgentAccessDTO.showOliverParaphraser = this.showOliverParaphraser;
          this.oliverAgentAccessDTO.showOliverContactAgent = this.showOliverContactAgent;
          this.oliverAgentAccessDTO.showOliverPartnerAgent = this.showOliverPartnerAgent;
          this.oliverAgentAccessDTO.showOliverCampaignAgent = this.showOliverCampaignAgent;
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
    this.showOliverContactAgent = this.oliverAgentAccessDTO.showOliverContactAgent;
    this.showOliverPartnerAgent = this.oliverAgentAccessDTO.showOliverPartnerAgent;
    this.showOliverCampaignAgent = this.oliverAgentAccessDTO.showOliverCampaignAgent;
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
    showOliverParaphraser: boolean, showOliverContactAgent: boolean, showOliverPartnerAgent: boolean, showOliverCampaignAgent: boolean;
  }) {
    this.showOliverInsights = flags.showOliverInsights;
    this.showBrainstormWithOliver = flags.showBrainstormWithOliver;
    this.showOliverSparkWriter = flags.showOliverSparkWriter;
    this.showOliverParaphraser = flags.showOliverParaphraser;
    this.showOliverContactAgent = flags.showOliverContactAgent;
    this.showOliverPartnerAgent = flags.showOliverPartnerAgent;
    this.showOliverCampaignAgent = flags.showOliverCampaignAgent;
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
            this.chatGptIntegrationSettingsDto.partnerAssistantId = data.partnerAssistantId;
            this.chatGptIntegrationSettingsDto.globalChatAssistantId = data.globalChatAssistantId;
            this.chatGptIntegrationSettingsDto.campaignAssistantId = data.campaignAssistantId;
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

  /** XNFR-1009 start **/
  searchPrompts() {
    const term = this.searchTerm.trim().toLowerCase();
    if (term === '') {
      this.oliverPromptSuggestionDTOs = this.suggestedPromptDTOs.slice(0, 15);
    } else {
      const searchWords = term.split(/\s+/);
      this.oliverPromptSuggestionDTOs = this.suggestedPromptDTOs.filter(dto => {
        const lowerPrompt = dto.promptMessage.toLowerCase();
        return searchWords.every(word => lowerPrompt.includes(word));
      });
    }
  }

  searchPromptsOnKeyPress(): void {
    const isAskPdf = this.activeTab === 'askpdf';
    const isGlobalChat = this.activeTab === 'globalchat';
    const term = (isAskPdf || isGlobalChat ? this.inputText : this.searchTerm || '').trim().toLowerCase();
    if (!term) {
      this.oliverPromptSuggestionDTOs = [...this.suggestedPromptDTOs];
    } else {
      const searchWords = term.split(/\s+/);
      this.oliverPromptSuggestionDTOs = this.suggestedPromptDTOs.filter(prompt => {
        const lowerPrompt = prompt.promptMessage.toLowerCase();
        return searchWords.every(word => lowerPrompt.includes(word));
      });
    }
    const hasMatches = term && this.oliverPromptSuggestionDTOs.length > 0;
    if (isAskPdf && hasMatches) {
      this.showInsightPromptBoxBelow = this.showOpenHistory;
      this.showInsightPromptBoxAbove = !this.showOpenHistory;
    } else if (isGlobalChat && hasMatches) {
      this.showGlobalPromptBoxBelow = this.showOpenHistory;
      this.showGlobalPromptBoxAbove = !this.showOpenHistory;
    } else {
      this.resetAllPromptBoxes();
      this.oliverPromptSuggestionDTOs = [...this.suggestedPromptDTOs];
    }
  }

  getSuggestedPromptsForGlobalSearch() {
    this.oliverPromptSuggestionDTOs = [];
    this.suggestedPromptDTOs = [];
    this.customResponse = new CustomResponse();
    const companyProfileName = this.authenticationService.companyProfileName.trim() || '';
    this.chatGptSettingsService.getSuggestedPromptsForGlobalSearch(companyProfileName).subscribe(
      response => {
        let statusCode = response.statusCode;
        let data = response.data;
        if (statusCode === 200) {
          this.oliverPromptSuggestionDTOs = data || [];
          this.suggestedPromptDTOs = [...this.oliverPromptSuggestionDTOs];
        }
      }, error => {

      }, () => {

      });
  }

  setSuggestedInputText(text: string, promptId: number): void {
    this.inputText = text;
    this.selectedPromptId = promptId;
    this.isValidInputText = true;
    this.searchTerm = "";
    this.autoResizeTextArea(event);
    this.resetAllPromptBoxes();
  }

 openPrompts() {
    this.showInsightPromptBoxBelow = false;
    this.showInsightPromptBoxAbove = false;
    this.searchTerm = "";
    this.showPromptBoxAbove = !this.showPromptBoxAbove;
    this.showGlobalPromptBoxBelow = false;
    this.showGlobalPromptBoxAbove = false;
    this.oliverPromptSuggestionDTOs = this.suggestedPromptDTOs.slice(0, 15);
  }

  openPromptsDown() {
    this.showInsightPromptBoxBelow = false;
    this.showInsightPromptBoxAbove = false;
    this.searchTerm = "";
    this.showPromptBoxBelow = !this.showPromptBoxBelow;
    this.showGlobalPromptBoxBelow = false;
    this.showGlobalPromptBoxAbove = false;
    this.oliverPromptSuggestionDTOs = this.suggestedPromptDTOs.slice(0, 15);
  }

  resetAllPromptBoxes(): void {
    this.showInsightPromptBoxAbove = false;
    this.showInsightPromptBoxBelow = false;
    this.showPromptBoxAbove = false;
    this.showPromptBoxBelow = false;
    this.showGlobalPromptBoxAbove = false;
    this.showGlobalPromptBoxBelow = false;
  }
  /** XNFR-1009 end **/

  extractJsonString(raw: string): string {
    const firstBrace = raw.indexOf('{');
    const lastBrace = raw.lastIndexOf('}');
    if (firstBrace === -1 || lastBrace === -1 || firstBrace > lastBrace) {
      throw new Error('No valid JSON object found in input');
    }
    return raw.substring(firstBrace, lastBrace + 1);
  }

  parseOliverReport(jsonStr: string): ExecutiveReport {
    const j = JSON.parse(jsonStr);

    const pipelineItems = j.pipeline_progression && j.pipeline_progression.items ? j.pipeline_progression.items : [];

    const playBookEngagementItems = j.playbook_content_engagement_overview && j.playbook_content_engagement_overview.items ? j.playbook_content_engagement_overview.items : [];

    const trackEngagementItems = j.track_content_engagement_by_team && j.track_content_engagement_by_team.items ? j.track_content_engagement_by_team.items : [];

    const leadProgressionFunnelData = j.lead_progression_funnel ? j.lead_progression_funnel : {};

    const assetsEngagementItems = j.asset_engagement_overview && j.asset_engagement_overview.items ? j.asset_engagement_overview.items : [];

    const deliveryStatusOverviewItems = j.delivery_status_overview && j.delivery_status_overview.items ? j.delivery_status_overview.items : [];

     const topPerformingRecipientsItems = j.top_performing_recipients && j.top_performing_recipients.chart_data ? j.top_performing_recipients.chart_data : [];

    const campaignFunnelData = j.campaign_funnel_analysis ? j.campaign_funnel_analysis : {};

     const leadProgressionTimelineItems = j.lead_progression_timeline && j.lead_progression_timeline.items ? j.lead_progression_timeline.items : [];

    const dealPipelinePrograssion = {
      title: j.pipeline_progression && j.pipeline_progression.title ? j.pipeline_progression.title : '',
      categories: pipelineItems.map((item: any) => item.name ? item.name : ''), // dynamic months
      revenue: 'Revenue (in $1000)',
      series: pipelineItems.map((item: any) => {
        const numericValue = item.value
          ? item.value
          : 0;

        return {
          name: item.name ? item.name : '',
          data: [numericValue]
        };
      }),
      categoriesString: '',
      seriesString: '',
      average_deal_value: j.pipeline_progression && j.pipeline_progression.average_deal_value ? j.pipeline_progression.average_deal_value : '0',
      highest_deal_value: j.pipeline_progression && j.pipeline_progression.highest_deal_value ? j.pipeline_progression.highest_deal_value : '0'
    };

    const campaignItems = j.campaign_performance_analysis && j.campaign_performance_analysis.items ? j.campaign_performance_analysis.items : [];

    const campaignPerformanceAnalysis = {
      title: j.campaign_performance_analysis && j.campaign_performance_analysis.title ? j.campaign_performance_analysis.title : '',
      series: [{
        name: 'Count',
        colorByPoint: true,
        data: campaignItems.map((item: any) => ({
          name: item.name ? item.name : '',
          y: typeof item.value == 'string'
            ? Number(item.value.replace(/[^0-9.-]+/g, ''))
            : item.value ? item.value : 0
        }))
      }],
      seriesString: '',
    };

    const trackContentEngagement = {
      title: j.track_content_engagement_by_team && j.track_content_engagement_by_team.title
        ? j.track_content_engagement_by_team.title
        : '',
      categories: trackEngagementItems.map((item: any) => item.email ? item.email : ''),
      series: [
        {
          name: 'Views',
          data: trackEngagementItems.map((item: any) =>
            item && item.tracks_viewed !== undefined ? item.tracks_viewed : 0
          ),
        },
        {
          name: 'Downloads',
          data: trackEngagementItems.map((item: any) =>
            item && item.tracks_downloaded !== undefined ? item.tracks_downloaded : 0
          ),
        }
      ],
      categoriesString: '',
      seriesString: '',
      description: j.track_content_engagement_by_team && j.track_content_engagement_by_team.description
        ? j.track_content_engagement_by_team.description
        : '',
    };

    const playbookContentEngagementOverview = {
      title: j.playbook_content_engagement_overview && j.playbook_content_engagement_overview.title
        ? j.playbook_content_engagement_overview.title
        : '',
      categories: playBookEngagementItems.map((item: any) =>
        item && item.name ? item.name : ''
      ),
      series: [
        {
          name: 'Views',
          data: playBookEngagementItems.map((item: any) =>
            item && item.view_count !== undefined ? item.view_count : 0
          ),
        },
        {
          name: 'Completed',
          data: playBookEngagementItems.map((item: any) =>
            item && item.completion_count !== undefined ? item.completion_count : 0
          ),
        }
      ],
      categoriesString: '',
      seriesString: '',
      description: j.playbook_content_engagement_overview && j.playbook_content_engagement_overview.description
        ? j.playbook_content_engagement_overview.description
        : '',
    };

    const assetEngagementOverview = {
      title: j.asset_engagement_overview && j.asset_engagement_overview.title
        ? j.asset_engagement_overview.title
        : '',
      categories: assetsEngagementItems.map((item: any) =>
        item && item.email ? item.email : ''
      ),
      series: [
        {
          name: 'Views',
          data: assetsEngagementItems.map((item: any) =>
            item && item.asset_views !== undefined ? item.asset_views : 0
          ),
        },
        {
          name: 'Downloaded',
          data: assetsEngagementItems.map((item: any) =>
            item && item.asset_downloads !== undefined ? item.asset_downloads : 0
          ),
        }
      ],
      categoriesString: '',
      seriesString: '',
      description: j.asset_engagement_overview && j.asset_engagement_overview.description
        ? j.asset_engagement_overview.description
        : '',
      mostOpenedAsset: j.asset_engagement_overview && j.asset_engagement_overview.most_opened_asset
        ? j.asset_engagement_overview.most_opened_asset
        : 0,
      openCountForMostViewedAsset: j.asset_engagement_overview && j.asset_engagement_overview.total_opens_for_most_opened_asset
        ? j.asset_engagement_overview.total_opens_for_most_opened_asset
        : 0,
      totalAssetsOpenCount: j.asset_engagement_overview && j.asset_engagement_overview.assets_opened_count
        ? j.asset_engagement_overview.assets_opened_count
        : 0,
      avgEngagementRate: j.asset_engagement_overview && j.asset_engagement_overview.avg_engagement_rate
        ? j.asset_engagement_overview.avg_engagement_rate
        : 0,
    };

    const deliveryStatusOverview = {
      title: j.delivery_status_overview && j.delivery_status_overview.title
        ? j.delivery_status_overview.title
        : '',
      categories: deliveryStatusOverviewItems.map((item: any) => item.name ? item.name : ''), // dynamic months
      series: deliveryStatusOverviewItems.map((item: any) => {
        const numericValue = item.value
          ? item.value
          : 0;

        return {
          name: item.name ? item.name : '',
          data: [numericValue]
        };
      }),
      categoriesString: '',
      seriesString: '',
      totalSent: j.delivery_status_overview && j.delivery_status_overview.total_sent
        ? j.delivery_status_overview.total_sent
        : '',
      deliveryRate: j.delivery_status_overview && j.delivery_status_overview.delivery_rate
        ? j.delivery_status_overview.delivery_rate
        : 0,
    };

    const topPerformingRecipients = {
      title: j.top_performing_recipients && j.top_performing_recipients.title
        ? j.top_performing_recipients.title
        : '',
      categories: topPerformingRecipientsItems.map((item: any) => item.name ? item.name : ''), // dynamic months
      series: topPerformingRecipientsItems.map((item: any) => {
        const numericValue = item.value
          ? item.value
          : 0;

        return {
          name: item.name ? item.name : '',
          data: [numericValue]
        };
      }),
      categoriesString: '',
      seriesString: '',
       items: j && j.top_performing_recipients && j.top_performing_recipients.items ? j.top_performing_recipients.items : [],
    };

    const leadProgressionTimeline = {
      title: j.lead_progression_timeline && j.lead_progression_timeline.title
        ? j.lead_progression_timeline.title
        : '',
      categoriesXaxis: leadProgressionTimelineItems.map((item: any) => item.stage ? item.stage : ''),
      categoriesYAxis: leadProgressionTimelineItems.map((item: any) => item.start_date ? item.start_date : ''),
      series: leadProgressionTimelineItems.map((item: any) => item.order ? item.order : 0),
      categoriesXaxisString: '',
      categoriesYAxisString: '',
      seriesString: '',
    };



    const dto: ExecutiveReport = {
      /* ---------- top-level meta ---------- */
      report_title: j && j.report_title ? j.report_title : '',
      subtitle: j && j.subtitle ? j.subtitle : '',
      date_range: j && j.date_range ? j.date_range : '',
      report_owner: j && j.report_owner ? j.report_owner : '',
      report_recipient: j && j.report_recipient ? j.report_recipient : '',
      campaign_name : j && j.campaign_name ? j.campaign_name : '',
      campaign_organized : j && j.campaign_organized ? j.campaign_organized : '',
      campaign_launch_date : j && j.campaign_launch_date ? j.campaign_launch_date : '',
      campaign_type : j && j.campaign_type ? j.campaign_type : '',
      total_recipients : j && j.total_recipients ? j.total_recipients : 0,
      email_sent : j && j.email_sent ? j.email_sent : 0,
      click_through_rate : j && j.click_through_rate ? j.click_through_rate : 0,
      deliverability_rate : j && j.deliverability_rate ? j.deliverability_rate : 0,

      lead_full_name : j && j.lead_full_name ? j.lead_full_name : '',
      lead_email_id : j && j.lead_email_id ? j.lead_email_id : '',
      lead_company : j && j.lead_company ? j.lead_company : '',
      lead_created_on : j && j.lead_created_on ? j.lead_created_on : '',
      stage : j && j.stage ? j.stage : '',
      pipeline : j && j.pipeline ? j.pipeline : '',

      owner_details: {
        owner_full_name: j && j.owner_full_name ? j.owner_full_name : '',
        owner_country: j && j.owner_country ? j.owner_country : '',
        owner_city: j && j.owner_city ? j.owner_city : '',
        owner_address: j && j.owner_address ? j.owner_address : '',
        owner_contact_company: j && j.owner_contact_company ? j.owner_contact_company : '',
        owner_job_title: j && j.owner_job_title ? j.owner_job_title : '',
        owner_email_id: j && j.owner_email_id ? j.owner_email_id : '',
        owner_mobile_number: j && j.owner_mobile_number ? j.owner_mobile_number : '',
        owner_state: j && j.owner_state ? j.owner_state : '',
        owner_zip: j && j.owner_zip ? j.owner_zip : '',
        owner_vertical: j && j.owner_vertical ? j.owner_vertical : '',
        owner_region: j && j.owner_region ? j.owner_region : '',
        owner_company_domain: j && j.owner_company_domain ? j.owner_company_domain : '',
        owner_website: j && j.owner_website ? j.owner_website : '',
        owner_country_code: j && j.owner_country_code ? j.owner_country_code : ''
      },

      /* ---------- KPI overview ---------- */
      kpi_overview: {
        title: j && j.kpi_overview && j.kpi_overview.title ? j.kpi_overview.title : '',
        description: j && j.kpi_overview && j.kpi_overview.description ? j.kpi_overview.description : '',
        items: j && j.kpi_overview && j.kpi_overview.items ? j.kpi_overview.items : []
      },

      /* ---------- summary overview ---------- */
      summary_overview: {
        title: j && j.summary_overview && j.summary_overview.title ? j.summary_overview.title : '',
        description: j && j.summary_overview && j.summary_overview.description ? j.summary_overview.description : '',
        items: j && j.summary_overview && j.summary_overview.items ? j.summary_overview.items : []
      },

      /* ---------- performance indicators ---------- */
      performance_indicators: {
        title: j && j.performance_indicators && j.performance_indicators.title ? j.performance_indicators.title : '',
        description: j && j.performance_indicators && j.performance_indicators.description ? j.performance_indicators.description : '',
        items: j && j.performance_indicators && j.performance_indicators.items ? j.performance_indicators.items : []
      },

      /* ---------- campaign performance analysis ---------- */
      campaign_performance_analysis: {
        top_performing_campaign_type:
          j && j.campaign_performance_analysis && j.campaign_performance_analysis.top_performing_campaign_type
            ? j.campaign_performance_analysis.top_performing_campaign_type
            : '',
        campaign_engagement_state: {
          connected:
            j && j.campaign_performance_analysis &&
              j.campaign_performance_analysis.campaign_engagement_state &&
              j.campaign_performance_analysis.campaign_engagement_state.connected
              ? j.campaign_performance_analysis.campaign_engagement_state.connected
              : 0,
          idle:
            j && j.campaign_performance_analysis &&
              j.campaign_performance_analysis.campaign_engagement_state &&
              j.campaign_performance_analysis.campaign_engagement_state.idle
              ? j.campaign_performance_analysis.campaign_engagement_state.idle
              : 0,
          other:
            j && j.campaign_performance_analysis &&
              j.campaign_performance_analysis.campaign_engagement_state &&
              j.campaign_performance_analysis.campaign_engagement_state.other
              ? j.campaign_performance_analysis.campaign_engagement_state.other
              : 0
        },
        notes:
          j && j.campaign_performance_analysis && j.campaign_performance_analysis.notes
            ? j.campaign_performance_analysis.notes
            : ''
      },

      /* ---------- lead-progression funnel ---------- */
      lead_progression_funnel: leadProgressionFunnelData,

      /* ---------- pipeline progression ---------- */
      pipeline_progression: {
        deal_stages:
          j && j.pipeline_progression && j.pipeline_progression.deal_stages
            ? j.pipeline_progression.deal_stages
            : {},
        highest_deal_value:
          j && j.pipeline_progression && j.pipeline_progression.highest_deal_value
            ? j.pipeline_progression.highest_deal_value
            : '',
        average_deal_value:
          j && j.pipeline_progression && j.pipeline_progression.average_deal_value
            ? j.pipeline_progression.average_deal_value
            : '',
        notes:
          j && j.pipeline_progression && j.pipeline_progression.notes
            ? j.pipeline_progression.notes
            : ''
      },

      
      /* ---------- contact-journey timeline ---------- */
      contact_journey_timeline: {
        title:
          j && j.contact_journey_timeline && j.contact_journey_timeline.title
            ? j.contact_journey_timeline.title
            : '',
        description:
          j && j.contact_journey_timeline && j.contact_journey_timeline.description
            ? j.contact_journey_timeline.description
            : '',
        items:
          j && j.contact_journey_timeline && j.contact_journey_timeline.items
            ? j.contact_journey_timeline.items
            : []
      },


      /* ---------- strategic insights ---------- */
      strategic_insights: {
        title:
          j && j.strategic_insights && j.strategic_insights.title
            ? j.strategic_insights.title
            : '',
        description:
          j && j.strategic_insights && j.strategic_insights.description
            ? j.strategic_insights.description
            : '',
        items:
          j && j.strategic_insights && j.strategic_insights.items
            ? j.strategic_insights.items
            : []
      },

      /* ---------- recommended next steps ---------- */
      recommended_next_steps: {
        title:
          j && j.recommended_next_steps && j.recommended_next_steps.title
            ? j.recommended_next_steps.title
            : '',
        description:
          j && j.recommended_next_steps && j.recommended_next_steps.description
            ? j.recommended_next_steps.description
            : '',
        items:
          j && j.recommended_next_steps && j.recommended_next_steps.items
            ? j.recommended_next_steps.items
            : []
      },

      /* ---------- conclusion ---------- */
      conclusion: {
        title: j && j.conclusion && j.conclusion.title ? j.conclusion.title : '',
        description: j && j.conclusion && j.conclusion.description ? j.conclusion.description : ''
      },

      dealPipelinePrograssion: dealPipelinePrograssion,

      campaignPerformanceAnalysis: campaignPerformanceAnalysis,
      trackContentEngagement : trackContentEngagement,
      trackEngagementAnalysis: {
        title:
          j && j.track_engagement_analysis && j.track_engagement_analysis.title
            ? j.track_engagement_analysis.title
            : '',
        description:
          j && j.track_engagement_analysis && j.track_engagement_analysis.description
            ? j.track_engagement_analysis.description
            : '',
        items:
          j && j.track_engagement_analysis && j.track_engagement_analysis.items
            ? j.track_engagement_analysis.items
            : []
      },
      playbookContentEngagementOverview : playbookContentEngagementOverview,
      assetEngagementOverview :assetEngagementOverview,
      campaign_funnel_analysis : campaignFunnelData,
      deliveryStatusOverview : deliveryStatusOverview,
      detailedRecipientAnalysis: {
        title: j && j.detailed_recipient_analysis && j.detailed_recipient_analysis.title ? j.detailed_recipient_analysis.title : '',
        description: j && j.detailed_recipient_analysis && j.detailed_recipient_analysis.description ? j.detailed_recipient_analysis.description : '',
        items: j && j.detailed_recipient_analysis && j.detailed_recipient_analysis.items ? j.detailed_recipient_analysis.items : []
      },
      topPerformingRecipients : topPerformingRecipients,
      leadProgressionTimeline: leadProgressionTimeline,
      statusChangeTimeline: {
        title: j && j.status_change_timeline && j.status_change_timeline.title ? j.status_change_timeline.title : '',
        items: j && j.status_change_timeline && j.status_change_timeline.items ? j.status_change_timeline.items : []
      },
    };

    return dto;
  }
  
  startStatusRotation() {
    this.statusMessage = this.loaderMessages[0];
    this.messageIndex = 1;
    let intervalTime = 5000;

    if (this.intervalSub) this.intervalSub.unsubscribe();

    this.intervalSub = Observable.interval(intervalTime).subscribe(() => {
      this.statusMessage = this.loaderMessages[this.messageIndex % this.loaderMessages.length];
      this.messageIndex++;
      intervalTime += intervalTime;
      if (this.messageIndex == (this.loaderMessages.length - 1)) {
        this.stopStatusRotation();
      }
    });
  }

  stopStatusRotation() {
    if (this.intervalSub) this.intervalSub.unsubscribe();
  }
  
 autoResizeTextArea(evt: any, maxRows = 6): void {
    let textarea: HTMLTextAreaElement | null = null;
    if (evt && evt.target && evt.target instanceof HTMLTextAreaElement) {
      textarea = evt.target;
    }
    else if (evt instanceof HTMLTextAreaElement) {
      textarea = evt;
    }
    if (!textarea) {
      const nodes = document.querySelectorAll('.oliver_input textarea');
      for (let i = 0; i < nodes.length; i++) {
        const el = nodes[i] as HTMLTextAreaElement;
        el.style.removeProperty('height');
        el.style.overflowY = 'hidden';
      }
      const chatBox = document.querySelector('.newChatlabel') as HTMLElement;
      if (chatBox) { chatBox.style.removeProperty('max-height'); }
      return;
    }
    textarea.style.height = 'auto';
    const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight) || 24;
    const maxHeight = lineHeight * maxRows;

    if (!textarea.value.trim()) {
      textarea.style.height = `${lineHeight}px`;
      textarea.style.overflowY = 'hidden';
    } else if (textarea.scrollHeight <= maxHeight) {
      textarea.style.height = `${textarea.scrollHeight}px`;
      textarea.style.overflowY = 'hidden';
    }
    else {
      const oneLineH = lineHeight;                             // exact 1-line height
      const wantedH = Math.min(textarea.scrollHeight, maxHeight);
      textarea.style.height = (wantedH < oneLineH ? oneLineH : wantedH) + 'px';
      textarea.style.overflowY = wantedH >= maxHeight ? 'auto' : 'hidden';
    }
    this.removeHeightofTextarea(textarea);

  }


  private removeHeightofTextarea(textarea: HTMLTextAreaElement) {
    requestAnimationFrame(() => {
      const chat = document.querySelector('.newChatlabel') as HTMLElement;
      const box = textarea.closest('.oliver_input') as HTMLElement;
      if (chat && box ) {
        chat.style.maxHeight = `calc(100vh - ${box.offsetHeight + 80}px)`;
      }
    });
  }

    checkSocialAcess() {
    this.socialShareOption=(this.referenceService.hasAllAccess()
      || this.authenticationService.module.hasSocialStatusRole
      || this.authenticationService.module.isOrgAdmin
      || this.authenticationService.module.isVendor
      || this.authenticationService.module.isPrm
      || this.authenticationService.module.isVendorTier
      || this.authenticationService.module.isCompanyPartner) && this.authenticationService.user.hasCompany && (this.authenticationService.module.socialShareOptionEnabled || (this.authenticationService.module.socialShareOptionEnabledAsPartner && (this.authenticationService.isCompanyPartner || this.authenticationService.isPartnerTeamMember)))
  }

   private checkDesignAccess() {
    this.designAccess = (!this.isPartnerLoggedIn && this.authenticationService.module.design && !this.authenticationService.module.isPrmCompany) ||
      (this.authenticationService.module.damAccess) || (this.authenticationService.module.hasLandingPageAccess && !this.authenticationService.module.isPrmCompany);
  }



  openPptDesignPicker(el: HTMLElement): void {
    this.pptData = (el.textContent || '').trim();
    if (this.pptData.trim().length > 0) {
      this.showPptDesignPicker = true;
    }
  }

  emitSelectedTemplate(event: any) {
    if (event) {
      this.showPptDesignPicker = false;
      this.pptData = '';
    } else {
      this.resetValues();
    }
  }

  downloadDocxFile(el: HTMLElement) {
    this.referenceService.docxLoader = true;
    let text = el && el.innerHTML ? el.innerHTML : '';
    const dto = new ChatGptIntegrationSettingsDto();
    dto.prompt = text;
    this.chatGptSettingsService.downloadWordFile(dto);
  }


}
