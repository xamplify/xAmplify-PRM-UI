import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, Renderer2, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomResponse } from 'app/common/models/custom-response';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { AssetDetailsViewDto } from 'app/dam/models/asset-details-view-dto';
import { ChatGptSettingsService } from 'app/dashboard/chat-gpt-settings.service';
import { ChatGptIntegrationSettingsDto } from 'app/dashboard/models/chat-gpt-integration-settings-dto';
declare var $: any;

@Component({
  selector: 'app-ai-chat-manager',
  templateUrl: './ai-chat-manager.component.html',
  styleUrls: ['./ai-chat-manager.component.css']
})
export class AiChatManagerComponent implements OnInit {
  @Input() asset: any;
  openHistory: boolean;
  messages: any[] = [];
  isValidInputText: boolean;
  inputText: string = "";
  trimmedText: string = "";
  chatGptGeneratedText: string = "";
  properties: any;
  chatGptIntegrationSettingsDto = new ChatGptIntegrationSettingsDto();
  @Output() notifyParent: EventEmitter<any> = new EventEmitter();
  // @Input() pdfFile: Blob;
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
  isOliverAiFromdam: boolean;
  isEmailCopied: boolean;
  constructor(public authenticationService: AuthenticationService, private chatGptSettingsService: ChatGptSettingsService, private referenceService: ReferenceService,private http: HttpClient,private route: ActivatedRoute,
    private router:Router, private cdr: ChangeDetectorRef) { }

    ngOnInit() {
      this.assetId = parseInt(this.route.snapshot.params['assetId']);
      if(this.assetId >0){
        this.isOliverAiFromdam = false;
        this.getSharedAssetDetailsById(this.assetId);
      }else{
        if(this.asset != undefined && this.asset != null){
          this.isOliverAiFromdam = true;
          this.assetDetailsViewDtoOfPartner.displayTime = new Date(this.asset.createdDateInUTCString);
          this.assetDetailsViewDtoOfPartner.assetName = this.asset.assetName;
          this.assetDetailsViewDtoOfPartner.categoryName = this.asset.categoryName;
          this.assetDetailsViewDtoOfPartner.vendorCompanyName = this.asset.companyName;
          this.assetDetailsViewDtoOfPartner.displayName = this.asset.displayName;
          this.assetType=this.asset.assetType;
          this.assetDetailsViewDtoOfPartner.assetType = this.asset.assetType;
          this.assetDetailsViewDtoOfPartner.sharedAssetPath = this.asset.assetPath;
          this.getPdfByAssetPath();
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
    this.chatGptSettingsService.generateAssistantText(this.chatGptIntegrationSettingsDto).subscribe(
      function (response) {
        console.log('API Response:', response);
        self.isLoading = false;
        var data = response.data;
        var reply = 'No response received from Oliver.';

        if (data && data.apiResponse && data.apiResponse.choices && data.apiResponse.choices.length > 0) {
          var content = data.apiResponse.choices[0].message.content;
          self.chatGptGeneratedText = self.referenceService.getTrimmedData(content);
          self.messages.push({ role: 'assistant', content: self.chatGptGeneratedText });
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
    if (this.uploadedFileId != undefined) {
      this.deleteUploadedFile();
    }
    if(this.asset != undefined && this.asset != null){
      this.isOliverAiFromdam = false;
      this.notifyParent.emit();
      }else{
        if (this.router.url.includes('/shared/view/')) {
          this.referenceService.goToRouter('/home/dam/shared/l');
        } else {
          this.referenceService.goToRouter('/home/dam/sharedp/view/' + this.assetId + '/l');
        }
      }
  }

  copyAiText(element: HTMLElement) {
    this.copyToClipboard(element);
  }

  copyToClipboard(element: any) {
    this.isEmailCopied = true;
    this.copiedText = element.innerText || element.textContent;
    const textarea = document.createElement('textarea');
    textarea.value = this.copiedText;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    setTimeout(() => {
      this.isEmailCopied = false;
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
    this.chatGptSettingsService.onUpload(this.pdfFile).subscribe(
      (response: any) => {
        const responseObject = JSON.parse(response);
        this.isPdfUploading = false;
        this.uploadedFileId = responseObject.id;
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
          this.assetDetailsViewDtoOfPartner = response.data;
          this.assetDetailsViewDtoOfPartner.displayTime = new Date(response.data.publishedTime);
          this.assetType=this.assetDetailsViewDtoOfPartner.assetType;
          console.log('API Response:', response);
        }
      },
      (error) => {
        this.loading = false;
        console.error('API Error:', error);
      }, () => {
        this.getPdfByAssetPath();
      }

    );
  }
  errorHandler(event: any) {
    event.target.src = 'assets/images/icon-user-default.png';
  }

  deleteUploadedFile() {
    this.chatGptSettingsService.deleteUploadedFileInOpenAI(this.uploadedFileId).subscribe(
      (response: any) => {
      },
      (error: string) => {
        console.log('API Error:', error);
      }
    );
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



}
