import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { DealComments } from '../models/deal-comments';
import { AuthenticationService } from '../../core/services/authentication.service';
import { DealRegistrationService } from '../services/deal-registration.service';
import { User } from '../../core/models/user';
import { Campaign } from '../../campaigns/models/campaign';
import { CampaignService } from '../../campaigns/services/campaign.service';
var $ ;
@Component({
  selector: 'app-manage-comments',
  templateUrl: './manage-comments.component.html',
  styleUrls: ['../../contacts/add-contact-modal/add-contact-modal.component.css']
})
export class ManageCommentsComponent implements OnInit {

  @Input()
  lead:any;
  campaign:Campaign;
   @Output()  isCommentSection = new EventEmitter<any>();

   comment:DealComments
   commentList:DealComments[] = [];
    firstName:string;
    lastName:string;
  loggedInUserId: number;
  user: User;
  isError = true;
  constructor(public authenticationService: AuthenticationService,private dealRegService: DealRegistrationService,private campaignService:CampaignService) { }

  ngOnInit() {
   
    
     this.comment = new DealComments;
      this.loggedInUserId =this.authenticationService.getUserId();
      const obj = { 'campaignId': this.lead.campaignId };
      this.campaignService.getCampaignById(obj).subscribe(data =>{
         this.campaign = data;
         console.log(data)
         
     })
      this.dealRegService.getDealCreatedBy(this.loggedInUserId).subscribe(user => {
       
        this.user = user;

      }) 
      this.dealRegService.getComments(this.lead.dealId).subscribe(commentData => {
        this.commentList = commentData.comments;
        this.comment = new DealComments;
        console.log(commentData.comments)
      })

    console.log(this.lead);
  } 

  addCommentModalClose(){
    this.isCommentSection.emit(false);
  }
  validateComment(comment:string){
    if(comment.length == 0)
        this.isError =true;
    else
        this.isError = false;
  }
  postComment(data:DealComments){ 
   console.log(!this.isError)
    if(!this.isError){
    data.createdAt = new Date();
    data.user = this.user;
    data.dealId = this.lead.dealId;
    console.log(data);
    this.dealRegService.saveComment(this.lead.dealId,data).subscribe(result =>{
      this.dealRegService.getComments(this.lead.dealId).subscribe(commentData => {
        this.commentList = commentData.comments;
        this.comment = new DealComments;
        console.log(commentData.comments)
      })
       
    });
  }
   // data.user.lastName = this.user.lastName;
    
  }
}
