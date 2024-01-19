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
  //XNFR-426
  @Input() editTextArea: boolean;

  loggedInUserId: number;
  commentList: DealComments[] = [];
  isError = true;
  comment: DealComments;
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
      this.dealService.getConversationByProperty(this.propertyId, this.loggedInUserId).subscribe(response =>
        {
          if (response.statusCode == 200) {
            this.commentList = response.data;        
            this.scrollBottom();
            this.comment = new DealComments();            
          }
        },
        error => console.log(error),
        () => {
          this.updateChatStatistics();
         })
    }

    getConversationForDeal(){
      this.dealService.getConversation(this.dealId, this.loggedInUserId).subscribe(response =>
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

}
