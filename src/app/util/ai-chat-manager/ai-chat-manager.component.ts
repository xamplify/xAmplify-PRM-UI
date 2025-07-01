import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomResponse } from 'app/common/models/custom-response';
import { XAMPLIFY_CONSTANTS } from 'app/constants/xamplify-default.constants';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { AssetDetailsViewDto } from 'app/dam/models/asset-details-view-dto';
import { ChatGptSettingsService } from 'app/dashboard/chat-gpt-settings.service';
import { ChatGptIntegrationSettingsDto } from 'app/dashboard/models/chat-gpt-integration-settings-dto';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { EmailTemplate } from 'app/email-template/models/email-template';
import { EmailTemplateService } from 'app/email-template/services/email-template.service';
import { Pagination } from 'app/core/models/pagination';
import { PagerService } from 'app/core/services/pager.service';
import { LandingPageService } from 'app/landing-pages/services/landing-page.service';
import { OliverPromptSuggestionDTO } from 'app/common/models/oliver-prompt-suggestion-dto';
import { ExecutiveReport } from 'app/common/models/oliver-report-dto';
import { Observable, Subscription } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-ai-chat-manager',
  templateUrl: './ai-chat-manager.component.html',
  styleUrls: ['./ai-chat-manager.component.css']
})
export class AiChatManagerComponent implements OnInit {
  @Input() asset: any;
  @Input() chatGptSettingDTO: any;
  @Input() selectedContact: any;
  @Input() callActivity: any;
  @Input() isFromManageContact: boolean;
  openHistory: boolean;
  messages: any[] = [];
  isValidInputText: boolean;
  inputText: string = "";
  trimmedText: string = "";
  chatGptGeneratedText: string = "";
  properties: any;
  chatGptIntegrationSettingsDto : ChatGptIntegrationSettingsDto = new ChatGptIntegrationSettingsDto();
  @Output() notifyParent: EventEmitter<any> = new EventEmitter();
  uploadedFileId: any;
  isLoading: boolean = false;
  assetDetailsViewDtoOfPartner: AssetDetailsViewDto = new AssetDetailsViewDto();
  loading: boolean;
  assetId = 0;
  pdfDoc: any;
  pdfFile: Blob;
  isPdfUploading: boolean =false;
  actionType: string;
  showEmailModalPopup: boolean;
  openShareOption: boolean = false;
  ngxLoading: boolean = false;
  UploadedFile: boolean = false;
  assetType: string ="";
  isCollapsed: boolean = false;
  copiedText: string = "";
  emailBody: any;
  subjectText: string;
  socialContent: string;
  isSpeakingText: boolean;
  speakingIndex: number;
  threadId: any = "";
  vectorStoreId: any = "";
  isOliverAiFromdam: boolean;
  isEmailCopied: boolean;
  showPreview: boolean;
  assetUrl: SafeResourceUrl;
  zoomLevel = 50;
  baseWidth: number = 800;
  baseHeight: number = 1000;
  loadPreview :boolean = false
  pdfFiles: any[] = [];
  categoryId: any;
  isPartnerFolderView :boolean = false;
  isFromFolderView:boolean = false;
  folderName: any;
  folderCreatedOn: Date;
  folderCreatedBy: any;
  folderFrom: any;
  folderAssetCount: any;
  isFromContactJourney: boolean = false;
  chatHistoryId: any;
  copiedIndex: number;
  socialShareOption: boolean;
  isBeeTemplateComponentCalled: boolean;
  beeContainerInput: { module: string; jsonBody: string; };
  selectedTemplateList: any[] = [];
  isPartnerView: boolean;
  selectedEmailTemplateRow = 0;
  selectTemplate: boolean;
  showTemplate: boolean;
  vanityUrlFilter: boolean;
  isPartnerLoggedIn: any;
  openAssetPage: boolean;
  emittdata: any;
  vendorCompanyProfileName: string;
  showPage: boolean;
  pagination: Pagination = new Pagination();

  searchTerm: string = '';
  showPromptBoxAbove: boolean = false;
  showInsightPromptBoxAbove:boolean = false;
  oliverPromptSuggestionDTOs: OliverPromptSuggestionDTO[] = [];
  suggestedPromptDTOs: OliverPromptSuggestionDTO[] = [];
  selectedPromptId: number;
  statusMessage: string = '';
  private loaderMessages: string[] = ['Analyzing', 'Thinking', 'Processing', 'Finalizing', 'Almost there'];
  private messageIndex: number = 0;
  private intervalSub: Subscription;

  constructor(public authenticationService: AuthenticationService, private chatGptSettingsService: ChatGptSettingsService, private referenceService: ReferenceService,private http: HttpClient,private route: ActivatedRoute,
    private router:Router, private cdr: ChangeDetectorRef,private sanitizer: DomSanitizer,private emailTemplateService: EmailTemplateService,
  private landingPageService: LandingPageService,public pagerService:PagerService) { }

  ngOnInit() {
    if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
      this.vendorCompanyProfileName = this.authenticationService.companyProfileName;
      this.vanityUrlFilter = true;
    }
    this.isPartnerLoggedIn = this.authenticationService.module.damAccessAsPartner && this.vanityUrlFilter;
    this.fetchOliverActiveIntegration();
    this.checkSocialAcess();
    this.checkDamAccess();
    this.isFromFolderView = false;
    this.assetId = parseInt(this.route.snapshot.params['assetId']);
    this.categoryId = parseInt(this.route.snapshot.params['categoryId']);
    this.showDefaultTemplates();
    this.referenceService.asset = '';
    this.isPartnerView = this.router.url.indexOf("/sharedp/view/") > -1 || this.router.url.indexOf("/shared/view/") > -1;
    if (this.assetId > 0) {
      this.isOliverAiFromdam = false;
      this.chatGptIntegrationSettingsDto.partnerDam = true;
      this.chatGptIntegrationSettingsDto.id = this.assetId;
      // this.getThreadId(this.chatGptIntegrationSettingsDto);
    } else if (this.selectedContact != undefined && this.chatGptSettingDTO != undefined && this.callActivity == undefined && !this.isFromManageContact) {
      this.isFromContactJourney = true;
      if (this.chatGptSettingDTO.threadId != undefined) {
        this.threadId = this.chatGptSettingDTO.threadId;
      }
      // if (this.threadId != undefined && this.threadId != '') {
      //   this.getChatHistory();
      // }
      this.analyzeCallRecordings();
    } else if (this.callActivity != undefined) {
      this.isFromContactJourney = true;
      this.chatGptIntegrationSettingsDto.callId = this.callActivity.id;
      this.chatGptIntegrationSettingsDto.isFromContactJourney = true;
      this.chatGptIntegrationSettingsDto.contactId = this.callActivity.contactId;
      this.chatGptIntegrationSettingsDto.userListId = this.callActivity.userListId;
      // this.getThreadId(this.chatGptIntegrationSettingsDto);
      this.referenceService.goToTop();
    } else if (this.isFromManageContact) {
      this.chatGptIntegrationSettingsDto.contactId = this.selectedContact.id;
      this.chatGptIntegrationSettingsDto.userListId = this.selectedContact.userListId;
    } else {
      if (this.asset != undefined && this.asset != null) {
        this.isOliverAiFromdam = true;
        this.chatGptIntegrationSettingsDto.vendorDam = true;
        this.chatGptIntegrationSettingsDto.id = this.asset.id;
        // this.getThreadId(this.chatGptIntegrationSettingsDto);
      } else if (this.categoryId != undefined && this.categoryId != null && this.categoryId > 0) {
        this.chatGptIntegrationSettingsDto.folderDam = true;
        this.isFromFolderView = true;
        this.isPartnerFolderView = this.router.url.indexOf("/shared/view/fg/") > -1;
        this.chatGptIntegrationSettingsDto.id = this.categoryId;
        // this.getThreadId(this.chatGptIntegrationSettingsDto);
      }
    }
    
    /** XNFR-1009 **/
    this.suggestedPromptDTOs = [];
    this.oliverPromptSuggestionDTOs = [];
    if (this.categoryId != undefined && this.categoryId != null && this.categoryId > 0) {
        this.getSuggestedpromptsForFolderView(this.categoryId);
    } else if (this.authenticationService.companyProfileName !== undefined &&
      this.authenticationService.companyProfileName !== '') {
        if (this.assetId && this.isPartnerView) {
          this.getRandomOliverSuggestedPromptsByDamId(this.assetId);
        } else if (this.asset != null && this.asset != undefined && this.asset.id) {
          this.getRandomOliverSuggestedPromptsByDamId(this.asset.id);
        }
    } else if (this.asset != null && this.asset != undefined && this.asset.id) {
      this.getRandomOliverSuggestedPromptsByDamId(this.asset.id);
    }
  }

  getThreadId(chatGptIntegrationSettingsDto: any) {
    if (!this.isFromContactJourney) {
      this.isPdfUploading = true;
    }
    this.chatGptSettingsService.getThreadIdByDamId(chatGptIntegrationSettingsDto).subscribe(
      (response: any) => {
        this.loading = false;
        if (response.statusCode == 200) {
          let self = this;
          let data = response.data;
          self.threadId = data.threadId;
          self.vectorStoreId = data.vectorStoreId;
          self.chatHistoryId = data.chatHistoryId;
        }
        if (this.isFromContactJourney && !(this.chatHistoryId != undefined && this.chatHistoryId > 0)) {
          this.analyzeCallRecording();
        } else {
          this.getSharedAssetPath();
        }
      },
      (error) => {
        this.loading = false;
        console.error('API Error:', error);
      }, () => {
        if (this.threadId != undefined && this.threadId != '') {
          this.getChatHistory();
        }
      }
    );
  }

  private getSharedAssetPath() {
    if (this.assetId > 0) {
      this.chatGptIntegrationSettingsDto.partnerDam = true;
      this.getSharedAssetDetailsById(this.assetId);
    } else {
      if (this.asset != undefined && this.asset != null) {
        const timeString = this.asset.publishedTimeInUTCString || this.asset.createdDateInUTCString;
        this.assetDetailsViewDtoOfPartner.displayTime = timeString ? new Date(timeString) : null; 
        this.assetDetailsViewDtoOfPartner.assetName = this.asset.assetName;
        this.assetDetailsViewDtoOfPartner.categoryName = this.asset.categoryName;
        this.assetDetailsViewDtoOfPartner.vendorCompanyName = this.asset.companyName;
        this.assetDetailsViewDtoOfPartner.displayName = this.asset.displayName;
        this.assetType = this.asset.assetType;
        this.assetDetailsViewDtoOfPartner.assetType = this.asset.assetType;
        this.assetDetailsViewDtoOfPartner.sharedAssetPath = this.asset.proxyUrlForOliver + this.asset.assetPath;
        this.assetDetailsViewDtoOfPartner.assetPath = this.asset.assetPath;
        if (!(this.vectorStoreId != undefined && this.vectorStoreId != '')) {
          this.getUploadedFileId();
        }
        this.framePerviewPath();
      }

      if (this.categoryId != undefined && this.categoryId != null && this.categoryId > 0) {
        this.getSharedAssetsDetailsByFolderId(this.categoryId);
      }

    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['asset'] && changes['asset'].currentValue) {
      this.asset = changes['asset'].currentValue;
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
    if (this.uploadedFileId != undefined) {
      this.deleteUploadedFile();
    }
    if(this.asset != undefined && this.asset != null){
      this.notifyParent.emit();
      }
  }
  
  validateInputText() {
    this.trimmedText = this.referenceService.getTrimmedData(this.inputText);
    this.isValidInputText = this.trimmedText != undefined && this.trimmedText.length > 0;
    this.searchPrompts();
  }

  searchDataOnKeyPress(keyCode: any) {
    if (keyCode === 13 && !(this.isLoading || this.isPdfUploading)) {
      this.openHistory = true;
      this.AskAiTogetData();
    }
  }

  AskAiTogetData() {
    this.openHistory = true;
    this.isLoading = true;
    this.showPromptBoxAbove = false;
    this.showInsightPromptBoxAbove = false;
    this.chatGptIntegrationSettingsDto.promptId = this.selectedPromptId;
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
    self.chatGptIntegrationSettingsDto.threadId = self.threadId;
    this.chatGptIntegrationSettingsDto.chatHistoryId = this.chatHistoryId;
    self.startStatusRotation();
    this.chatGptSettingsService.generateAssistantTextByAssistant(this.chatGptIntegrationSettingsDto).subscribe(
      function (response) {
        console.log('API Response:', response);
        self.isLoading = false;
        self.stopStatusRotation();
        var content = response.data;
        var reply = 'No response received from Oliver.';
        let isReport = response.data.isReport;
        if (content) {
          self.chatGptGeneratedText = self.referenceService.getTrimmedData(content.message);

          let message = self.chatGptGeneratedText = self.referenceService.getTrimmedData(content.message);
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
        } else {
          self.messages.push({ role: 'assistant', content: 'Invalid response from Oliver.', isReport: isReport });
        }
        this.trimmedText = '';
        this.selectedPromptId = null;
      },
      function (error) {
        this.selectedPromptId = null;
        self.isLoading = false;
        console.log('API Error:', error);
        self.messages.push({ role: 'assistant', content: self.properties.serverErrorMessage, isReport: 'false' });
        self.stopStatusRotation();
      }
    );
  }

  closeAi() {
    if (!this.isFromFolderView) {
      if (this.asset != undefined && this.asset != null) {
        this.isOliverAiFromdam = false;
        this.notifyParent.emit();
      } else if (this.isFromContactJourney || this.isFromManageContact) {
        this.selectedContact = undefined;
        this.callActivity = undefined;
        this.notifyParent.emit(this.chatGptSettingDTO);
      } else {
        if (this.router.url.includes('/shared/view/g')) {
          this.referenceService.goToRouter('/home/dam/shared/g');
        } else if (this.router.url.includes('/shared/view')) {
          this.referenceService.goToRouter('/home/dam/shared/l');
        } else {
          this.referenceService.goToRouter('/home/dam/sharedp/view/' + this.assetId + '/l');
        }
      }
    } else if (this.isFromFolderView) {
      if (this.router.url.includes('/shared/view/fg')) {
        this.referenceService.goToRouter('/home/dam/shared/fg');
      } else if (this.router.url.includes('/askAi/view/fl')) {
        this.referenceService.goToRouter('/home/dam/manage/fl');
      } else if (this.router.url.includes('/shared/view/fl')) {
        this.referenceService.goToRouter('/home/dam/shared/fl');
      } else {
        this.referenceService.goToRouter('/home/dam/manage/fg');
      }
    }
    this.referenceService.OliverViewType = '';
  }

  copyAiText(element: HTMLElement, index: number) {
    this.copyToClipboard(element, index);
  }

  copyToClipboard(element: any, index: number) {
    this.isEmailCopied = true;
    this.copiedText = element.innerText || element.textContent;
    const textarea = document.createElement('textarea');
    textarea.value = this.copiedText;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    this.copiedIndex = index;
    setTimeout(() => {
      this.isEmailCopied = false;
      this.copiedIndex = null;
    }, 2000);
  }


  onFileSelected(event: any) {
    this.UploadedFile =true;
    if (this.uploadedFileId != undefined) {
      this.deleteUploadedFile();
    }
    const file: File = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.pdfFile = file;
      console.log('PDF selected:', file.name);
      this.assetDetailsViewDtoOfPartner.assetName = file.name.replace(/\.pdf/i, '');
      this.assetDetailsViewDtoOfPartner.displayTime = new Date();
      this.getUploadedFileId();
    } else {
      alert('Please upload a valid PDF file.');
    }
  }

  getUploadedFileId() {
    this.isPdfUploading = true;
    this.chatGptSettingsService.onUpload(this.pdfFile, this.chatGptIntegrationSettingsDto, this.assetDetailsViewDtoOfPartner.assetName).subscribe(
      (response: any) => {
        this.isPdfUploading = false;
        let data = response.data;
        this.uploadedFileId = data.fileId;
        this.threadId = data.threadId;
        console.log(this.uploadedFileId);
        this.isLoading = false;
      },
      (error: string) => {
        this.isPdfUploading = false;
        this.isLoading = false;
        console.log('API Error:', error);;
      }
    );
  }

  getSharedAssetDetailsById(id: number) {
    this.loading = true;
    this.isPdfUploading = true;
    this.chatGptSettingsService.getSharedAssetDetailsById(id).subscribe(
      (response: any) => {
        this.loading = false;
        if (response.statusCode == 200) {
          let self = this;
          self.assetDetailsViewDtoOfPartner = response.data;
          self.assetDetailsViewDtoOfPartner.displayTime = new Date(response.data.publishedTime);
          self.assetType = self.assetDetailsViewDtoOfPartner.assetType;
          self.framePerviewPath();
          if (!(self.vectorStoreId != undefined && self.vectorStoreId != '')) {
            this.getUploadedFileId();
          }
        }
      },
      (error) => {
        this.loading = false;
        console.error('API Error:', error);
      }
    );
  }

  
  private framePerviewPath() {
    this.loadPreview = false;
    setTimeout(() => {
      const timestamp = new Date().getTime();
      const dynamicUrl = encodeURIComponent(`${this.assetDetailsViewDtoOfPartner.assetPath}?v=${timestamp}`);
      this.assetUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://docs.google.com/gview?url=${dynamicUrl}&embedded=true`
      );
      this.loadPreview = true;
    }, 50); 
  }

  private getChatHistory() {
    this.chatGptSettingsService.getChatHistoryByThreadId(this.threadId, this.chatGptIntegrationSettingsDto.oliverIntegrationType, this.chatGptIntegrationSettingsDto.accessToken).subscribe(
      (response: any) => {
        this.isPdfUploading = false;
        this.openHistory = true;
        this.isLoading = false;
        if (response.statusCode == 200) {
          let isReport = 'false';
          let messages = response.data;
          messages.forEach((message: any) => {
            if (message.role === 'assistant') {
              this.messages.push({ role: 'assistant', content: message.content, isReport: isReport });
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
        this.isPdfUploading = false;
        console.log('API Error:', error);
      }
    );
  }

  errorHandler(event: any) {
    event.target.src = 'assets/images/icon-user-default.png';
  }

  deleteUploadedFile() {
    // this.chatGptSettingsService.deleteUploadedFileInOpenAI(this.uploadedFileId).subscribe(
    //   (response: any) => {
    //   },
    //   (error: string) => {
    //     console.log('API Error:', error);
    //   }
    // );
  }
  
  getPdfByAssetPath() {
  this.ngxLoading=true;
    this.http.get(this.assetDetailsViewDtoOfPartner.sharedAssetPath + '&access_token=' + encodeURIComponent(this.authenticationService.access_token), { responseType: 'blob' })
      .subscribe(async response => {
        this.pdfFile = response;
        this.getUploadedFileId();
        this.ngxLoading=false;
      });
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

  closeSocialShare(event:any){
    this.openShareOption = false;
    this.openHistory = true;
    if (event) {
    this.referenceService.showSweetAlertSuccessMessage(event);
    }
  }
  ngOnDestroy() {
    this.openHistory=false;
    this.openShareOption = false;
    this.loading = false;
    this.ngxLoading  = false;
    this.UploadedFile = false;
    this.showEmailModalPopup = false;
    if (this.uploadedFileId != undefined) {
      this.deleteUploadedFile();
    }
    if (this.isFromManageContact) {
      this.saveChatHistoryTitle(this.chatHistoryId);
    }
  }

  toggleAction(){
    this.isCollapsed = !this.isCollapsed;
  }

  parseHTMLBody(emailContent: string): void {
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
    } else if (plainText.indexOf("<strong>Subject:") !== -1) {
      subjectStartIndex = plainText.indexOf("<strong>Subject:");
      closingTag = "</strong>";
    }
    if (subjectStartIndex !== -1) {
      let subjectEndIndex = plainText.indexOf(closingTag, subjectStartIndex);
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
  showAssetPreview(){
    this.showPreview = true;
    this.framePerviewPath();
  }
  closePreview(){
    this.showPreview = false;
    this.zoomLevel = 50;
  }
  get scaledWidth(): string {
    return (this.baseWidth * (this.zoomLevel / 100)) + 'px';
  }
  
  get scaledHeight(): string {
    return (this.baseHeight * (this.zoomLevel / 100)) + 'px';
  }

 getSharedAssetsDetailsByFolderId(categoryId: number) {
    this.loading = true;
    this.isPdfUploading = true;
    this.chatGptSettingsService.getAssetDetailsByCategoryId(categoryId, this.isPartnerFolderView, this.chatGptIntegrationSettingsDto.oliverIntegrationType).subscribe(
      (response: any) => {
        this.loading = false;
        if (response.statusCode == 200) {
          let data = response.data;
          this.folderName = data[0].name;
          this.folderCreatedOn = new Date(data[0].createdTimeInUTC);
          this.folderCreatedBy = data[0].createdBy;
          this.folderFrom = data[0].companyName;
          this.folderAssetCount = data[0].count;
          // if (!(this.vectorStoreId != undefined && this.vectorStoreId != '')) {
          // this.getPdfByAssetPaths(data);
          this.pdfFiles = data;
          this.getUploadedFileIds();
          // }
        }
      },
      (error) => {
        this.loading = false;
        console.error('API Error:', error);
      }
    );
  }

  getPdfByAssetPaths(assetsPath: any[]) {
    this.ngxLoading = true;
    const requests = assetsPath.map(path =>
      this.http.get(path.sharedAssetPath + '&access_token=' + encodeURIComponent(this.authenticationService.access_token), {
        responseType: 'blob'
      })
    );
    forkJoin(requests).subscribe({
      next: (responses: Blob[]) => {
        this.pdfFiles = responses.map((blob, index) => ({
          file: blob,
          assetName: assetsPath[index].assetName,
          assetId: assetsPath[index].id
        }));

        this.ngxLoading = false;
        this.getUploadedFileIds();
      },
      error: (err) => {
        console.error('Failed to load all PDFs', err);
        this.ngxLoading = false;
      }
    });
  }

  getUploadedFileIds() {
    this.isPdfUploading = true;
    this.chatGptIntegrationSettingsDto.threadId = this.threadId;
    this.chatGptIntegrationSettingsDto.chatHistoryId = this.chatHistoryId;
    this.chatGptIntegrationSettingsDto.vectorStoreId = this.vectorStoreId;
    this.chatGptSettingsService.onUploadFiles(this.pdfFiles, this.chatGptIntegrationSettingsDto).subscribe(
      (response: any) => {
        this.isPdfUploading = false;
        let data = response.data;
        this.threadId = data.threadId;
        this.isLoading = false;
      },
      (error: string) => {
        this.isPdfUploading = false;
        this.isLoading = false;
        console.log('API Error:', error);
      }
    );
  }

  analyzeCallRecordings() {
    this.ngxLoading = true;
    this.chatGptSettingsService.analyzeCallRecordings(this.chatGptSettingDTO).subscribe(
      response => {
        if (response.statusCode == XAMPLIFY_CONSTANTS.HTTP_OK) {
          let data = response.data;
          this.chatGptSettingDTO.threadId = data.threadId;
          this.chatGptSettingDTO.vectorStoreId = data.vectorStoreId;
          this.chatGptSettingDTO.totalRecords = data.totalRecords;
          this.chatGptSettingDTO.chatHistoryId = data.chatHistoryId;
          this.chatHistoryId = data.chatHistoryId;
          this.threadId = data.threadId;
        }
        this.ngxLoading = false;
      }, error => {
        this.ngxLoading = false;
      }
    )
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

  analyzeCallRecording() {
    this.ngxLoading = true;
    this.chatGptIntegrationSettingsDto.contactId = this.callActivity.contactId;
    this.chatGptIntegrationSettingsDto.userListId = this.callActivity.userListId;
    this.chatGptSettingsService.analyzeCallRecording(this.chatGptIntegrationSettingsDto).subscribe(
      (response) => {
        if (response.statusCode == XAMPLIFY_CONSTANTS.HTTP_OK) {
          let data = response.data;
          this.chatGptIntegrationSettingsDto.threadId = data.threadId;
          this.chatGptIntegrationSettingsDto.vectorStoreId = data.vectorStoreId;
          this.threadId = data.threadId;
          this.chatHistoryId = data.chatHistoryId;
        }
        this.ngxLoading = false;
      }, error => {
        this.ngxLoading = false;
      }
    )
  }

  openDesignTemplate(event: any) {
    // let text = markdown && markdown.innerHTML ? markdown.innerHTML : '';
    // this.chatGptIntegrationSettingsDto.prompt = text;
    this.chatGptSettingsService.insertTemplateData(this.chatGptIntegrationSettingsDto).subscribe(
      (response: any) => {
        if (!this.emailTemplateService.emailTemplate) {
          this.emailTemplateService.emailTemplate = new EmailTemplate();
          this.showTemplate = false;
          this.selectTemplate = true;
          this.ngxLoading = false;
        }
        if (this.chatGptIntegrationSettingsDto.designPdf) {
          this.emittdata = JSON.stringify(response.data);
          this.openAssetPage = true;
        } else if(this.chatGptIntegrationSettingsDto.designPage){
          this.showPage = true;
          this.landingPageService.jsonBody = JSON.stringify(response.data);
        }else {
          this.emailTemplateService.emailTemplate.jsonBody = JSON.stringify(response.data);
          this.showTemplate = true;
        }
        this.selectTemplate = false;
        this.ngxLoading = false;
      },
      (error: string) => {
        console.log('API Error:', error);
        this.showTemplate = false;
        this.ngxLoading = false;

      }
    );
  }

  addRowsToJson(jsonBody: any) {
    throw new Error('Method not implemented.');
  }
  
  closeBee(){
    this.isBeeTemplateComponentCalled = false;
  }

  showDefaultTemplates(): void {
    this.chatGptSettingsService.listDefaultTemplates(this.authenticationService.getUserId()).subscribe(
        (response: any) => {
            var templates = [];
            if (response && response.data && response.data.emailTemplates) {
                templates = response.data.emailTemplates;
            }
            this.emailTemplateService.isEditingDefaultTemplate = false;
            this.emailTemplateService.isNewTemplate = true;
            // if (templates.length > 0) {
            //     this.emailTemplateService.emailTemplate = templates[0]; 
            // }
            this.selectedTemplateList = templates;
        },
        (error: any) => {
            console.error("Error in showDefaultTemplates():", error);
        }
    );
}
 
  closeDesignTemplate(event: any) {
    this.emitterData(event);
  }
  private emitterData(event: any) {
    this.openShareOption = false;
    if (event) {
      this.referenceService.showSweetAlertSuccessMessage(event);
      this.emailTemplateService.emailTemplate = new EmailTemplate();
    }
    this.chatGptIntegrationSettingsDto.prompt = '';
    this.chatGptIntegrationSettingsDto.designPdf = false;
    this.chatGptIntegrationSettingsDto.templateId = 0;
    this.openShareOption = false;
    this.showTemplate = false;
    this.openAssetPage = false;
    this.emailTemplateService.emailTemplate.jsonBody = "";
    this.landingPageService.jsonBody = "";
    this.landingPageService.id = 0;
    this.showPage = false;
    this.selectTemplate = false;
    this.resetPageData();
  }
  private checkDamAccess() {
    if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
      this.vanityUrlFilter = true;
      this.isPartnerLoggedIn = this.authenticationService.module.damAccessAsPartner && this.vanityUrlFilter;
    }
  }
  openSelectionTemplate(markdown: any) {
    let text = markdown && markdown.innerHTML ? markdown.innerHTML : '';
    this.chatGptIntegrationSettingsDto.prompt = text;
    this.selectTemplate = true;
  }
  // closeSelectionTemplate() {
  //   this.selectTemplate = false;
  // }
  saveSelectedTemplate(template: any) {
    this.openDesignTemplate(template);
  }
  selectEmailTemplate(emailTemplate: any) {
    this.selectedEmailTemplateRow = emailTemplate.id;
    this.chatGptIntegrationSettingsDto.templateId = emailTemplate.id;
    this.emailTemplateService.emailTemplate = emailTemplate;
  }

  closeSelectionTemplate(event: any) {
    if (event) {
      // this.emailTemplateService.emailTemplate.jsonBody = "";
       const selectedTemplate = event.selectedTemplate;
       const isConfirmed = event.isConfirmed;
       this.chatGptIntegrationSettingsDto.addBrandColors = isConfirmed;
      if(this.chatGptIntegrationSettingsDto.designPage){
        this.landingPageService.id = selectedTemplate.id;
      }else{
           this.emailTemplateService.emailTemplate = selectedTemplate;
      }
      this.chatGptIntegrationSettingsDto.templateId = selectedTemplate.id;
       this.ngxLoading = true;
      this.openDesignTemplate(selectedTemplate);
    } else{
      this.resetPageData();
      this.selectTemplate = false;
    }
  }

  readBeeTemplateData(event :any) {
    this.emittdata = event;
      this.isBeeTemplateComponentCalled = false;
      this.openAssetPage = true;
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
    }, () => {
      if ((this.assetId > 0) || (this.callActivity != undefined) || (this.asset != undefined && this.asset != null) || (this.categoryId != undefined && this.categoryId != null && this.categoryId > 0)) {
        this.getThreadId(this.chatGptIntegrationSettingsDto);
      }
      if ((this.chatGptSettingDTO != undefined && this.chatGptSettingDTO.threadId != undefined && this.selectedContact != undefined && this.callActivity == undefined) && !this.isFromManageContact) {
        this.getChatHistory();
      }
      if (this.isFromManageContact) {
        this.uploadContactDetails();
      }
    });
  }

  getFileIcon(): string {
    const docTypes = ['doc', 'docx', 'csv', 'xlsx', 'ppt', 'pptx'];
    const imageTypes = ['jpg', 'png', 'jfif', 'ico'];

    if (this.assetType === 'pdf') {
      return 'assets/images/pdficonAi.svg';
    } else if (docTypes.includes(this.assetType)) {
      return 'assets/images/aidocslogo.svg';
    } else if (imageTypes.includes(this.assetType)) {
      return 'assets/images/oliverImagelogo.svg';
    } else {
      return 'assets/images/aidocslogo.svg';
    }
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
        console.error("Error in listLandingPages():", error);
      });
  }
  /** XNFR-1002 End **/

  resetPageData() {
    if (this.chatGptIntegrationSettingsDto.designPage) {
      this.selectedTemplateList = [];
      this.landingPageService.jsonBody = "";
      this.showDefaultTemplates();
      this.chatGptIntegrationSettingsDto.designPage = false;
    }
  }

  /** XNFR-1009 start **/
  getRandomOliverSuggestedPromptsByDamId(assetId: any) {
    this.suggestedPromptDTOs = [];
    this.oliverPromptSuggestionDTOs = [];
    if (assetId) {
      this.isPdfUploading = true;
      this.chatGptSettingsService.getRandomOliverSuggestedPromptsByDamId(assetId, this.vendorCompanyProfileName, this.isPartnerView).subscribe(
        response => {
          let statusCode = response.statusCode;
          let data = response.data;
          if (statusCode === 200) {
            this.oliverPromptSuggestionDTOs = data || [];
            this.suggestedPromptDTOs = [...this.oliverPromptSuggestionDTOs];
          }
          this.isPdfUploading = false;
        }, error => {
          this.isPdfUploading = false;
        }, () => {

        });
    }
  }

  searchPrompts() {
    const term = this.inputText || ''.trim().toLowerCase();
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
    if (hasMatches) {
      this.showInsightPromptBoxAbove = true;
    } else {
      this.showInsightPromptBoxAbove = false;
      this.showPromptBoxAbove = false;
      this.oliverPromptSuggestionDTOs = [...this.suggestedPromptDTOs];
    }
  }

  openPrompts() {
    this.searchTerm = "";
    this.showPromptBoxAbove = !this.showPromptBoxAbove;
    this.showInsightPromptBoxAbove = false;
    this.oliverPromptSuggestionDTOs = [...this.suggestedPromptDTOs];
  }

  setSuggestedInputText(text: string, promptId: number) {
    this.inputText = text;
    this.selectedPromptId = promptId;
    this.isValidInputText = true;
    this.showPromptBoxAbove = false;
    this.showInsightPromptBoxAbove = false;
    this.validateInputText();
  }
  /** XNFR-1009 end **/

  uploadContactDetails() {
    this.ngxLoading = true;
    this.chatGptIntegrationSettingsDto.agentType = "CONTACTAGENT";
    this.chatGptIntegrationSettingsDto.vendorCompanyProfileName = this.vendorCompanyProfileName;
    this.chatGptSettingsService.uploadContactDetails(this.chatGptIntegrationSettingsDto).subscribe(
      (response) => {
        if (response.statusCode == XAMPLIFY_CONSTANTS.HTTP_OK) {
          let data = response.data;
          this.chatGptIntegrationSettingsDto.threadId = data.threadId;
          this.chatGptIntegrationSettingsDto.vectorStoreId = data.vectorStoreId;
          this.chatGptIntegrationSettingsDto.chatHistoryId = data.chatHistoryId;
          this.threadId = data.threadId;
          this.chatHistoryId = data.chatHistoryId;
        }
        this.ngxLoading = false;
      }, error => {
        this.ngxLoading = false;
      }
    )
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
    const j = JSON.parse(jsonStr);

    const pipelineItems = j.pipeline_progression.items ? j.pipeline_progression.items : [];

    const leadProgressionFunnelData = j.lead_progression_funnel ? j.lead_progression_funnel : {};

    const dealPipelinePrograssion = {
      title: j.pipeline_progression.title ? j.pipeline_progression.title : '',
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
      average_deal_value: j.pipeline_progression.average_deal_value ? j.pipeline_progression.average_deal_value : '0',
      highest_deal_value: j.pipeline_progression.highest_deal_value ? j.pipeline_progression.highest_deal_value : '0'
    };

    const campaignItems = j.campaign_performance_analysis.items ? j.campaign_performance_analysis.items : [];

    const campaignPerformanceAnalysis = {
      title: j.campaign_performance_analysis.title ? j.campaign_performance_analysis.title : '',
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

    const dto: ExecutiveReport = {
      /* ---------- top-level meta ---------- */
      report_title: j && j.report_title ? j.report_title : '',
      subtitle: j && j.subtitle ? j.subtitle : '',
      date_range: j && j.date_range ? j.date_range : '',
      report_owner: j && j.report_owner ? j.report_owner : '',
      report_recipient: j && j.report_recipient ? j.report_recipient : '',

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

      campaignPerformanceAnalysis: campaignPerformanceAnalysis
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

  saveChatHistoryTitle(chatHistoryId: any) {
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
        if (statusCode === 200) {
          let chatGptGeneratedText = data['apiResponse']['choices'][0]['message']['content'];
        } else if (statusCode === 400) {
          this.chatGptGeneratedText = response.message;
          this.messages.push({ role: 'assistant', content: response.message });
        }
      }, error => {

      });
  }

  getSuggestedpromptsForFolderView(categoryId: number) {
    this.suggestedPromptDTOs = [];
    this.oliverPromptSuggestionDTOs = [];
    this.isPdfUploading = true;
    this.chatGptSettingsService.getSuggestedpromptsForFolderView(categoryId, this.isPartnerView).subscribe(
      response => {
        let statusCode = response.statusCode;
        let data = response.data;
        if (statusCode === 200) {
          this.oliverPromptSuggestionDTOs = data || [];
          this.suggestedPromptDTOs = [...this.oliverPromptSuggestionDTOs];
        }
        this.isPdfUploading = false;
      }, error => {
        this.isPdfUploading = false;
      }, () => {
        
      });
  }
  
}
