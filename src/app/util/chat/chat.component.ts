import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { ReferenceService } from '../../core/services/reference.service';
import { DealsService } from '../../deals/services/deals.service';
import { LeadsService } from '../../leads/services/leads.service';
import { DealComments } from '../../deal-registration/models/deal-comments';
declare var $:any;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {  
  @Input() moduleType: string;
  @Input() enableWrite: boolean;
  @Input() propertyId: any = null;
  @Input() dealId: any = null;
  @Input() leadId: any = null;
  /*****XNFR-426*****/
  @Input() editTextArea: boolean;
  @Input() isPreviewDealOrLeadComponent:boolean;

  loggedInUserId: number;
  commentList: DealComments[] = [];
  isError = true;
  comment: DealComments;
  showError: boolean = false;
  constructor(private logger: XtremandLogger, public referenceService: ReferenceService,
    public authenticationService: AuthenticationService, private dealService: DealsService, private leadService: LeadsService) { }

    ngOnInit() {
      this.loggedInUserId = this.authenticationService.getUserId();
      this.comment = new DealComments; 
      this.getChatConversation();      
    }
  
    getChatConversation(){
      if ("property" === this.moduleType && this.propertyId != undefined) {
        this.getConversationForProperty();        
      } else if ("deal" === this.moduleType && this.dealId != undefined) {
        this.getConversationForDeal();
      } else if ("lead" === this.moduleType && this.leadId != undefined) {
        this.getConversationForLead();
      }

    }

    getConversationForProperty(){
      this.dealService.getConversationByProperty(this.propertyId, this.loggedInUserId).
      subscribe(response =>{
          if (response.statusCode == 200) {
            this.commentList = response.data;        
            this.scrollBottom();
            this.comment = new DealComments();            
          }
        },
        error => console.log(error),
        () => {
          this.updateChatStatistics();
         });
    }

    getConversationForDeal(){
      this.dealService.getConversation(this.dealId, this.loggedInUserId).
      subscribe(response =>{
          if (response.statusCode == 200) {
            this.commentList = response.data; 
            if(!this.isPreviewDealOrLeadComponent){
              this.scrollBottom();
            }       
            this.comment = new DealComments();
          }
        },
        error => console.log(error),
        () => { })
    }

    getConversationForLead(){
      this.leadService.getConversation(this.leadId, this.loggedInUserId).subscribe(response =>
        {
          if (response.statusCode == 200) {
            this.commentList = response.data;        
            this.scrollBottom();
            this.comment = new DealComments();
          }
        },
        error => console.log(error),
        () => { })
    }
  
    scrollBottom() {
      this.referenceService.scrollSmoothToDiv("comment-area");
     // $(".comment-area").animate({ scrollTop: document.body.scrollHeight }, 500);
    }
  
    validateComment(comment: string)
    {
      if ($.trim(comment).length == 0)
        this.isError = true;
      else
        this.isError = false;
    }
  
    postComment(comment: DealComments) {    
      if (!this.isError && comment.comment.length > 0) {
        comment.userId = this.loggedInUserId;      
        if ("property" === this.moduleType) {
          comment.propertyId = this.propertyId;
        } else if ("deal" === this.moduleType) {
          comment.dealId = this.dealId;
        } else if ("lead" === this.moduleType) {
          comment.leadId = this.leadId;
        }
  
        this.leadService.saveComment(comment).subscribe(response => {
          this.getChatConversation();                
        },
          error => console.log(error),
          () => { });
      }
    }

    updateChatStatistics() {
      if(this.commentList.length>0){       
        let comment_id =this.commentList[this.commentList.length-1].id;
        let commentStats = new DealComments();
        commentStats.id = comment_id;
        commentStats.userId = this.loggedInUserId;
        commentStats.dealId = this.dealId;
        commentStats.propertyId = this.propertyId;
        commentStats.leadId = this.leadId;
      
      this.leadService.updateChatStatistics(commentStats).subscribe(result =>
        {
       
        },
        error => console.log(error),
        () => { });
      }
    }

    ngOnDestroy() {
      console.log(this.commentList.length); 
      if ("deal" === this.moduleType || "lead" === this.moduleType) {
        this.updateChatStatistics();
      }        
      
    }

    isPreviewFromAssetPopup: boolean = false;
    assetPreview(assetDetails: any, isFromPopup: boolean) {
      this.isPreviewFromAssetPopup = isFromPopup;
      let isBeeTemplate = assetDetails.beeTemplate;
        if(isBeeTemplate){
          let url = assetDetails.url;
          this.openWindowInNewTab(url);
        }
          
    }

    getCommentParts(comment: string): { beforeUrl: string; url: string; afterUrl: string } {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
    const cleanComment = comment.replace(/<[^>]*>/g, ''); // Remove any HTML tags
    const match = cleanComment.match(urlRegex);
    
    if (match && match.length > 0) {
        const url = match[0]; // First URL found
        const parts = cleanComment.split(url);
        return {
            beforeUrl: parts[0],  // Text before the URL
            url: url,              // The URL itself
            afterUrl: parts[1] || '' // Text after the URL (if any)
        };
    }

    return {
        beforeUrl: cleanComment,  // No URL, the whole comment is just plain text
        url: '',
        afterUrl: ''
    };

    }

    containsTextAndUrl(comment: string): boolean {
      const urlPattern = /https?:\/\/[^\s]+/; // Regex to match URLs
      return urlPattern.test(comment) && comment.trim().includes(' ');
  }
    
    urlInNewTab(url: string) {
      url = url.trim();
      if (url && !url.startsWith('http') && !url.startsWith('https') && !url.startsWith('file') && !url.startsWith('mailto') && !url.startsWith('gopher')) {
        url = window.location.origin + url;  // Prepend base URL if relative
      }
      if (this.isValidUrl(url)) {
      this.openWindowInNewTab(url);
      } else{
      this.showError = true;
    }
  }
   
  
    openWindowInNewTab(url:string){
      console.log('Opening URL:', url);
      window.open(url,"_blank");
    }

    isLikelyUrl(comment: string): boolean{
      return comment.startsWith('http');
    }
    
    isValidUrl(url: string): boolean {
      url = url.trim(); // Trim whitespace from the URL

      const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z0-9][a-z0-9-]*[a-z0-9])?\\.)+[a-z]{2,}|' + // domain name
        'localhost|' + // localhost
        '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}|' + // IP address
        '\\[?[a-f0-9]*:[a-f0-9:]+\\])' + // IPv6
        '(\\:\\d+)?(\\/[-a-z0-9%_.~+!*\'();:@&=+$,/?#]*)*' + // port and path (including special characters)
        '(\\?[;&a-z0-9%_.~+=-]*)?' + // query string
        '(\\#[-a-z0-9_]*)?$', 'i'); // fragment locator
    
      return !!pattern.test(url); // Validate the trimmed URL
    }
  }