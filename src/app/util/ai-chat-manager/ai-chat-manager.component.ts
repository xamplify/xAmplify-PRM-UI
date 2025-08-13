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
import { GroupOliverReportDTO } from 'app/common/models/group-oliver-report-dto';
// import { CampaignEngagementAndAssetUtilization,Conclusion, CampaignEngagementSubSection, CSuiteRecommendationItem, DealInteractionsAndRevenueImpact, DealIRISubSection, FooterMetadata, GroupOliverReportDTO, KPIItem, LeadFunnelSubSection, LeadLifecycleAndQualificationFunnel, OverviewSection, PartnerPerformanceItem, PartnerRevenueItem, PlaybookAssetUsageItem, PlaybookRankedAssetItem } from 'app/common/models/group-oliver-report-dto';
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
  @Input() isFromManagePartner: boolean;
  @Input() isFromOnboardSection: boolean = false;
  @Input() isFromGroupOfPartners: boolean = false;
  @Input() isFromManageCampaign: boolean = false;
  @Input() isFromManageLead: boolean = false;
  @Input() selectedCampaign: any;
  @Input() selectedLearningTrack: any;
  @Input() isFromManagePlaybooks: boolean = false;
  @Input() selectedLead: any;
  
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
  pptLoader: boolean = false;
  activeTab: string = '';
  pptData: string;
  showPptDesignPicker: boolean = false;
  designAccess: boolean;

  constructor(public authenticationService: AuthenticationService, private chatGptSettingsService: ChatGptSettingsService, public referenceService: ReferenceService,private http: HttpClient,private route: ActivatedRoute,
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
    } else if (this.selectedContact != undefined && this.chatGptSettingDTO != undefined && this.callActivity == undefined && !this.isFromManageContact && !this.isFromManagePartner) {
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
    } else if (this.isFromManagePartner) {
      this.chatGptIntegrationSettingsDto.contactId = this.selectedContact.id;
      this.chatGptIntegrationSettingsDto.userListId = this.selectedContact.userListId;
    } else if (this.isFromManageCampaign) {
      this.chatGptIntegrationSettingsDto.campaignId = this.selectedCampaign.campaignId;
    } else if (this.isFromManagePlaybooks) {
      this.chatGptIntegrationSettingsDto.learningTrackId = this.selectedLearningTrack.id;
    } else if (this.isFromManageLead) {
      this.chatGptIntegrationSettingsDto.leadId = this.selectedLead.id;
    }else {
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
    this.checkDesignAccess();
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
    if (this.isFromGroupOfPartners) {
      this.inputText += 's';
    }
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
    this.chatGptIntegrationSettingsDto.fromGroupOfPartners = this.isFromGroupOfPartners;
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
              if (self.isFromGroupOfPartners) {
                message = self.parseGroupOliverReport(cleanJsonStr);
              } else {
                message = self.parseOliverReport(cleanJsonStr);
              }
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
      } else if (this.isFromContactJourney || this.isFromManageContact || this.isFromManagePartner) {
        this.selectedContact = undefined;
        this.callActivity = undefined;
        this.notifyParent.emit(this.chatGptSettingDTO);
      } else if (this.isFromManageCampaign) {
        this.selectedCampaign = undefined;
        this.notifyParent.emit(this.chatGptSettingDTO);
      } else if (this.isFromManagePlaybooks) {
        this.selectedLearningTrack = undefined;
        this.notifyParent.emit(this.chatGptSettingDTO);
      }else if (this.isFromManageLead) {
        this.selectedLead = undefined;
        this.notifyParent.emit();
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
    this.openHistory = false;
    this.openShareOption = false;
    this.loading = false;
    this.ngxLoading = false;
    this.UploadedFile = false;
    this.activeTab = '';
    this.showEmailModalPopup = false;
    if (this.uploadedFileId != undefined) {
      this.deleteUploadedFile();
    }
    if (this.isFromManageContact || this.isFromManagePartner || this.isFromManageCampaign || this.isFromManageLead || this.isFromManagePlaybooks) {
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
    if(this.asset != undefined && this.asset != null && this.asset.id > 0 && this.asset.videoId != undefined && this.asset.videoId != null && this.asset.videoId != '') {
      this.chatGptIntegrationSettingsDto.videoId = this.asset.videoId;
    }
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
            this.chatGptIntegrationSettingsDto.campaignAssistantId = data.campaignAssistantId;
            this.chatGptIntegrationSettingsDto.playbookAssistantId = data.playbookAssistantId;
            this.chatGptIntegrationSettingsDto.leadAssistantId = data.leadAssistantId;
            this.chatGptIntegrationSettingsDto.partnerGroupAssistantId = data.partnerGroupAssistantId;
          }
        }
      }, error => {
        console.log('Error in fetchOliverActiveIntegration() ', error);
    }, () => {
      if ((this.assetId > 0) || (this.callActivity != undefined) || (this.asset != undefined && this.asset != null) || (this.categoryId != undefined && this.categoryId != null && this.categoryId > 0)) {
        this.getThreadId(this.chatGptIntegrationSettingsDto);
      }
      if ((this.chatGptSettingDTO != undefined && this.chatGptSettingDTO.threadId != undefined && this.selectedContact != undefined && this.callActivity == undefined) && !this.isFromManageContact && !this.isFromManagePartner) {
        this.getChatHistory();
      }
      if (this.isFromManageContact) {
        this.uploadContactDetails();
      }
       if (this.isFromManagePartner) {
        this.uploadPartnerDetails();
      }
       if (this.isFromManageCampaign) {
        this.uploadCampaignDetails();
      } 

      if (this.isFromManagePlaybooks) {
        this.uploadPlaybookDetails();
      }
       if (this.isFromManageLead) {
        this.uploadLeadDetails();
      }
    });
  }

  uploadPlaybookDetails() {
    this.ngxLoading = true;
    this.chatGptIntegrationSettingsDto.agentType = "PLAYBOOKAGENT";
    this.activeTab = 'playbookagent';
    this.chatGptIntegrationSettingsDto.vendorCompanyProfileName = this.vendorCompanyProfileName;
    this.chatGptIntegrationSettingsDto.learningTrackId = this.selectedLearningTrack.id;
    this.chatGptIntegrationSettingsDto.partnerLoggedIn = this.isPartnerView;
    this.chatGptSettingsService.uploadPlaybookDetails(this.chatGptIntegrationSettingsDto).subscribe(
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

  uploadPartnerDetails() {
    this.ngxLoading = true;
    if (this.isFromGroupOfPartners) {
      this.chatGptIntegrationSettingsDto.agentType = "PARTNERGROUPAGENT";
      this.activeTab = 'partnergroupagent';
    } else {
      this.chatGptIntegrationSettingsDto.agentType = "PARTNERAGENT";
      this.activeTab = 'partneragent';
    }
    this.chatGptIntegrationSettingsDto.vendorCompanyProfileName = this.vendorCompanyProfileName;
    this.chatGptSettingsService.uploadPartnerDetails(this.chatGptIntegrationSettingsDto).subscribe(
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

  uploadCampaignDetails() {
    this.ngxLoading = true;
    this.chatGptIntegrationSettingsDto.agentType = "CAMPAIGNAGENT";
    this.activeTab = 'campaignagent';
    this.chatGptIntegrationSettingsDto.vendorCompanyProfileName = this.vendorCompanyProfileName;
    this.chatGptSettingsService.uploadCampaignDetails(this.chatGptIntegrationSettingsDto).subscribe(
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
    this.activeTab = 'contactagent';
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

      deal_interactions_and_revenue_impact: undefined,

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







parseGroupOliverReport(jsonStr: string): GroupOliverReportDTO {
  const j: any = JSON.parse(jsonStr);

 const dealIRIRaw = j && j.deal_interactions_and_revenue_impact
  ? j.deal_interactions_and_revenue_impact
  : {};

  
  

  const topPartnersRaw = dealIRIRaw.top_partners_by_deal_value || {};
  const keyInsightsRaw  = dealIRIRaw.key_insights || {};

  const pipelineItems = topPartnersRaw.items ? topPartnersRaw.items : [];


  const dealPipelinePrograssion = {
      title: topPartnersRaw.title ? topPartnersRaw.title : '',
      categories: pipelineItems.map((item: any) => item.name ? item.name : ''),
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
    };

  const deal_interactions_and_revenue_impact = {
    title:       dealIRIRaw.title       ? dealIRIRaw.title       : '',
    description: dealIRIRaw.description ? dealIRIRaw.description : '',

    top_partners_by_deal_value: dealPipelinePrograssion,

    key_insights: {
      title:       keyInsightsRaw.title       ? keyInsightsRaw.title       : '',
      description: keyInsightsRaw.description ? keyInsightsRaw.description : '',
      items:       keyInsightsRaw.items       ? keyInsightsRaw.items       : []
    },

  };

  /* ---------- Lead Lifecycle & Qualification Funnel ---------- */
  const leadLFRaw = j && j.lead_lifecycle_and_qualification_funnel
    ? j.lead_lifecycle_and_qualification_funnel
    : {};

  const leadProgressRaw  = leadLFRaw.lead_progression_funnel || {};
  const funnelAnalysisRaw = leadLFRaw.funnel_analysis || {};

  const lead_lifecycle_and_qualification_funnel = {
    title:       leadLFRaw.title       ? leadLFRaw.title       : '',
    description: leadLFRaw.description ? leadLFRaw.description : '',

    lead_progression_funnel: {
      title:       leadProgressRaw.title       ? leadProgressRaw.title       : '',
      description: leadProgressRaw.description ? leadProgressRaw.description : '',
      items:       leadProgressRaw.items       ? leadProgressRaw.items       : []
    },

    funnel_analysis: {
      title:       funnelAnalysisRaw.title       ? funnelAnalysisRaw.title       : '',
      description: funnelAnalysisRaw.description ? funnelAnalysisRaw.description : '',
      items:       funnelAnalysisRaw.items       ? funnelAnalysisRaw.items       : []
    }
  };

  /* ---------- Campaign Engagement & Asset Utilization ---------- */
  const campEAItems = j.campaign_engagement_and_asset_utilization && j.campaign_engagement_and_asset_utilization.items
    ? j.campaign_engagement_and_asset_utilization.items
    : [];

  const campaign_engagement_and_asset_utilization = {
    title: j.campaign_engagement_and_asset_utilization && j.campaign_engagement_and_asset_utilization.title
      ? j.campaign_engagement_and_asset_utilization.title
      : '',
    description: j.campaign_engagement_and_asset_utilization && j.campaign_engagement_and_asset_utilization.description
      ? j.campaign_engagement_and_asset_utilization.description
      : '',
    items: campEAItems
  };

  /* ---------- Playbook blocks ---------- */
  const playbook_engagement_and_asset_utilization = {
    title: j.playbook_engagement_and_asset_utilization && j.playbook_engagement_and_asset_utilization.title
      ? j.playbook_engagement_and_asset_utilization.title
      : '',
    description: j.playbook_engagement_and_asset_utilization && j.playbook_engagement_and_asset_utilization.description
      ? j.playbook_engagement_and_asset_utilization.description
      : '',
    items: j.playbook_engagement_and_asset_utilization && j.playbook_engagement_and_asset_utilization.items
      ? j.playbook_engagement_and_asset_utilization.items
      : []
  };

  const playbook_engagement_kpis = {
    title: j.playbook_engagement_kpis && j.playbook_engagement_kpis.title
      ? j.playbook_engagement_kpis.title
      : '',
    description: j.playbook_engagement_kpis && j.playbook_engagement_kpis.description
      ? j.playbook_engagement_kpis.description
      : '',
    items: j.playbook_engagement_kpis && j.playbook_engagement_kpis.items
      ? j.playbook_engagement_kpis.items
      : []
  };

  const top_performing_playbook_assets = {
    title: j.top_performing_playbook_assets && j.top_performing_playbook_assets.title
      ? j.top_performing_playbook_assets.title
      : '',
    description: j.top_performing_playbook_assets && j.top_performing_playbook_assets.description
      ? j.top_performing_playbook_assets.description
      : '',
    items: j.top_performing_playbook_assets && j.top_performing_playbook_assets.items
      ? j.top_performing_playbook_assets.items
      : []
  };

  /* ---------- Partner analytics & performance ---------- */
  const partner_analytics_strategic_revenue_drivers = {
    title: j.partner_analytics_strategic_revenue_drivers && j.partner_analytics_strategic_revenue_drivers.title
      ? j.partner_analytics_strategic_revenue_drivers.title
      : '',
    description: j.partner_analytics_strategic_revenue_drivers && j.partner_analytics_strategic_revenue_drivers.description
      ? j.partner_analytics_strategic_revenue_drivers.description
      : '',
    items: j.partner_analytics_strategic_revenue_drivers && j.partner_analytics_strategic_revenue_drivers.items
      ? j.partner_analytics_strategic_revenue_drivers.items
      : []
  };

  const partnership_performance_review = {
    title: j.partnership_performance_review && j.partnership_performance_review.title
      ? j.partnership_performance_review.title
      : '',
    description: j.partnership_performance_review && j.partnership_performance_review.description
      ? j.partnership_performance_review.description
      : '',
    items: j.partnership_performance_review && j.partnership_performance_review.items
      ? j.partnership_performance_review.items
      : []
  };

  const partnership_performance_summary_kpis = {
    title: j.partnership_performance_summary_kpis && j.partnership_performance_summary_kpis.title
      ? j.partnership_performance_summary_kpis.title
      : '',
    description: j.partnership_performance_summary_kpis && j.partnership_performance_summary_kpis.description
      ? j.partnership_performance_summary_kpis.description
      : '',
    items: j.partnership_performance_summary_kpis && j.partnership_performance_summary_kpis.items
      ? j.partnership_performance_summary_kpis.items
      : []
  };

  /* ---------- C-Suite ---------- */
  const c_suite_strategic_recommendations = {
    title: j.c_suite_strategic_recommendations && j.c_suite_strategic_recommendations.title
      ? j.c_suite_strategic_recommendations.title
      : '',
    description: j.c_suite_strategic_recommendations && j.c_suite_strategic_recommendations.description
      ? j.c_suite_strategic_recommendations.description
      : '',
    items: j.c_suite_strategic_recommendations && j.c_suite_strategic_recommendations.items
      ? j.c_suite_strategic_recommendations.items
      : []
  };

  /* ---------- Footer & Conclusion ---------- */
  const footer_metadata = {
    strategic_contact: j.footer_metadata && j.footer_metadata.strategic_contact ? j.footer_metadata.strategic_contact : [],
    report_details:    j.footer_metadata && j.footer_metadata.report_details    ? j.footer_metadata.report_details    : [],
    data_sources:      j.footer_metadata && j.footer_metadata.data_sources      ? j.footer_metadata.data_sources      : []
  };

  const conclusion = {
    title:       j.conclusion && j.conclusion.title       ? j.conclusion.title       : '',
    description: j.conclusion && j.conclusion.description ? j.conclusion.description : '',
    items:       j.conclusion && j.conclusion.items       ? j.conclusion.items       : []
  };

  /* ---------- KPI & Summary ---------- */
  const kpi_overview = {
    title:       j.kpi_overview && j.kpi_overview.title ? j.kpi_overview.title : '',
    description: j.kpi_overview && j.kpi_overview.description ? j.kpi_overview.description : '',
    items:       j.kpi_overview && j.kpi_overview.items ? j.kpi_overview.items : []
  };

  const summary_overview = {
    title:       j.summary_overview && j.summary_overview.title ? j.summary_overview.title : '',
    description: j.summary_overview && j.summary_overview.description ? j.summary_overview.description : '',
    items:       j.summary_overview && j.summary_overview.items ? j.summary_overview.items : []
  };










  /* ---------- Build DTO ---------- */
  const dto: GroupOliverReportDTO = {
    report_title: j && j.report_title ? j.report_title : '',
    subtitle: j && j.subtitle ? j.subtitle : '',
    date_range: j && j.date_range ? j.date_range : '',
    report_owner: j && j.report_owner ? j.report_owner : '',
    report_recipient: j && j.report_recipient ? j.report_recipient : '',
    report_main_title: j && j.report_main_title ? j.report_main_title : '',
    report_sub_heading: j && j.report_sub_heading ? j.report_sub_heading : '',

    kpi_overview: kpi_overview,
    summary_overview: summary_overview,

    // description:                   string;
    //   top_partners_by_deal_value:    OverviewSection<DealPartnerItem>;
    //   key_insights:                  OverviewSection<KPIItem>;
    //   title: string;
    //   categories: string[];
    //   revenue: string;
    //   series: { name: string; data: string[] }[];
    //   categoriesString: string;
    //   seriesString: string;
    lead_lifecycle_and_qualification_funnel: lead_lifecycle_and_qualification_funnel,
    campaign_engagement_and_asset_utilization: campaign_engagement_and_asset_utilization,

    playbook_engagement_and_asset_utilization: playbook_engagement_and_asset_utilization,
    playbook_engagement_kpis: playbook_engagement_kpis,
    top_performing_playbook_assets: top_performing_playbook_assets,

    partner_analytics_strategic_revenue_drivers: partner_analytics_strategic_revenue_drivers,
    partnership_performance_review: partnership_performance_review,
    partnership_performance_summary_kpis: partnership_performance_summary_kpis,

    c_suite_strategic_recommendations: c_suite_strategic_recommendations,

    footer_metadata: footer_metadata,
    conclusion: conclusion,
    deal_interactions_and_revenue_impact: deal_interactions_and_revenue_impact // <-- Add this property to the GroupOliverReportDTO interface/type
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

  openPptDesignPicker(el: HTMLElement): void {
    this.pptData = (el.textContent || '').trim();
    if (this.pptData.trim().length > 0) {
      this.showPptDesignPicker = true;
    }
  }

  emitSelectedTemplate(event: any) {
    if (event) {
      this.resetValues();
    } else {
      this.resetValues();
    }
  }
  resetValues() {
    this.pptData = '';
    this.showPptDesignPicker = false;
  }

  /** XNFR-1079  **/
  downloadDocxFile(el: HTMLElement) {
    this.referenceService.docxLoader = true;
    let text = el && el.innerHTML ? el.innerHTML : '';
    const dto = new ChatGptIntegrationSettingsDto();
    dto.prompt = text;
    this.chatGptSettingsService.downloadWordFile(dto);
  }

  private checkDesignAccess() {
    this.designAccess = (!this.isPartnerLoggedIn && this.authenticationService.module.design && !this.authenticationService.module.isPrmCompany) ||
      (this.authenticationService.module.damAccess) || (this.authenticationService.module.hasLandingPageAccess && !this.authenticationService.module.isPrmCompany);
  }

  uploadLeadDetails() {
    this.ngxLoading = true;
    this.chatGptIntegrationSettingsDto.agentType = "LEADAGENT";
    this.activeTab = 'leadagent';
    this.chatGptIntegrationSettingsDto.vendorCompanyProfileName = this.vendorCompanyProfileName;
    this.chatGptSettingsService.uploadLeadDetails(this.chatGptIntegrationSettingsDto).subscribe(
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

}
