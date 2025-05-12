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
  constructor(public authenticationService: AuthenticationService, private chatGptSettingsService: ChatGptSettingsService, private referenceService: ReferenceService,private http: HttpClient,private route: ActivatedRoute,
    private router:Router, private cdr: ChangeDetectorRef,private sanitizer: DomSanitizer,private emailTemplateService: EmailTemplateService) { }

  ngOnInit() {
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
      this.getThreadId(this.chatGptIntegrationSettingsDto);
    } else if (this.selectedContact != undefined && this.chatGptSettingDTO != undefined) {
      this.isFromContactJourney = true;
      if (this.chatGptSettingDTO.threadId != undefined) {
        this.threadId = this.chatGptSettingDTO.threadId;
      }
      if (this.threadId != undefined && this.threadId != '') {
        this.getChatHistory();
      }
      this.analyzeCallRecordings();
    } else {
      if (this.asset != undefined && this.asset != null) {
        this.isOliverAiFromdam = true;
        this.chatGptIntegrationSettingsDto.vendorDam = true;
        this.chatGptIntegrationSettingsDto.id = this.asset.id;
        this.getThreadId(this.chatGptIntegrationSettingsDto);
      }
      if (this.categoryId != undefined && this.categoryId != null && this.categoryId > 0) {
        this.chatGptIntegrationSettingsDto.folderDam = true;
        this.isFromFolderView = true;
        this.isPartnerFolderView = this.router.url.indexOf("/shared/view/fg/") > -1;
        this.chatGptIntegrationSettingsDto.id = this.categoryId;
        this.getThreadId(this.chatGptIntegrationSettingsDto);
      }
    }
  }

  getThreadId(chatGptIntegrationSettingsDto: any) {
    this.isPdfUploading = true;
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
        this.getSharedAssetPath();
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
          this.getPdfByAssetPath();
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
    this.chatGptSettingsService.generateAssistantTextByAssistant(this.chatGptIntegrationSettingsDto).subscribe(
      function (response) {
        console.log('API Response:', response);
        self.isLoading = false;
        var content = response.data;
        var reply = 'No response received from Oliver.';

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
        self.isLoading = false;
        console.log('API Error:', error);
        self.messages.push({ role: 'assistant', content: self.properties.serverErrorMessage });
      }
    );
  }

  closeAi() {
    if (!this.isFromFolderView) {
      if (this.asset != undefined && this.asset != null) {
        this.isOliverAiFromdam = false;
        this.notifyParent.emit();
      } else if (this.isFromContactJourney) {
        this.notifyParent.emit(this.chatGptSettingDTO);
      } else {
        if (this.router.url.includes('/shared/view/g')) {
          this.referenceService.goToRouter('/home/dam/shared/g');
        } else if( this.router.url.includes('/shared/view')) {
          this.referenceService.goToRouter('/home/dam/shared/l');
        } else {
          this.referenceService.goToRouter('/home/dam/sharedp/view/' + this.assetId + '/l');
        }
      }
    } else if (this.isFromFolderView) {
      if (this.router.url.includes('/shared/view/fg')) {
        this.referenceService.goToRouter('/home/dam/shared/fg');
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
            this.getPdfByAssetPath();
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
    this.chatGptSettingsService.getChatHistoryByThreadId(this.threadId).subscribe(
      (response: any) => {
        this.isPdfUploading = false;
        this.openHistory = true;
        this.isLoading = false;
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
    this.chatGptSettingsService.getAssetDetailsByCategoryId(categoryId,this.isPartnerFolderView).subscribe(
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
            this.getPdfByAssetPaths(data);
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
  openDesignTemplate(markdown: any) {
    let text = markdown && markdown.innerHTML ? markdown.innerHTML : '';
    this.chatGptIntegrationSettingsDto.prompt = text;
    this.chatGptSettingsService.insertTemplateData(this.chatGptIntegrationSettingsDto).subscribe(
        (response: any) => {
          if (!this.emailTemplateService.emailTemplate) {
            this.emailTemplateService.emailTemplate = new EmailTemplate();
            alert("Template created successfully.");
            this.showTemplate = false;
          }

          this.emailTemplateService.emailTemplate.jsonBody = JSON.stringify(response.data);
          this.showTemplate = true;
        },
        (error: string) => {
          console.log('API Error:', error);
          this.showTemplate = false;

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
 
  closeDesignTemplate(event: any) {
    this.emitterData(event);
  }
  private emitterData(event: any) {
    this.openShareOption = false;
    if (event) {
      this.referenceService.showSweetAlertSuccessMessage(event);
      this.emailTemplateService.emailTemplate = new EmailTemplate();
    }
    this.openShareOption = false;
    this.showTemplate = false;
    this.emailTemplateService.emailTemplate.jsonBody = "";
  }
  private checkDamAccess() {
    if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
      this.vanityUrlFilter = true;
      this.isPartnerLoggedIn = this.authenticationService.module.damAccessAsPartner && this.vanityUrlFilter;
    }
  }
}
