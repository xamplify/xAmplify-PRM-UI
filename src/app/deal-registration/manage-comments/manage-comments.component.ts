import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DealComments } from '../models/deal-comments';
import { AuthenticationService } from '../../core/services/authentication.service';
import { DealRegistrationService } from '../services/deal-registration.service';
import { User } from '../../core/models/user';
import { Campaign } from '../../campaigns/models/campaign';
import { CampaignService } from '../../campaigns/services/campaign.service';
import { ReferenceService } from '../../core/services/reference.service';
import { DealRegistration } from '../models/deal-registraton';
declare var $: any;
@Component({
  selector: 'app-manage-comments',
  templateUrl: './manage-comments.component.html',
  styleUrls: ['../../contacts/add-contact-modal/add-contact-modal.component.css']
})
export class ManageCommentsComponent implements OnInit
{

  @Input()
  lead: any;
  campaign: Campaign;
  @Output() isCommentSection = new EventEmitter<any>();

  comment: DealComments;  
  commentList: DealComments[] = [];
  firstName: string;
  lastName: string;
  loggedInUserId: number;
  user: User;
  isError = true;
  createdBy: any;
  deal: DealRegistration;
  userName ="";
  refreshComments: any;
  leadName="";
  constructor(public authenticationService: AuthenticationService, private dealRegService: DealRegistrationService, 
    private campaignService: CampaignService,private refferenceService:ReferenceService) { 

  }
  scrollBottom() {
    
    $(".comment-area").animate({ scrollTop: document.body.scrollHeight }, 500);
  }
  ngOnInit()
  {
    if(this.lead.firstName!=null && this.lead.firstName.length>0){
      this.leadName = this.leadName+this.lead.firstName;

    }
    if(this.lead.lastName!=null && this.lead.lastName.length>0){
      this.leadName = this.leadName+this.lead.lastName;
      
    }
      this.getCommentList();
     
   

  }
  getCommentList(){
    this.commentList = null;

    this.comment = new DealComments;
    this.loggedInUserId = this.authenticationService.getUserId();
    const obj = { 'campaignId': this.lead.campaignId };
    console.log(this.lead)
    this.campaignService.getCampaignById(obj).subscribe(data =>
    {
      this.campaign = data;
      
     

    },
    error => console.log(error),
    () => { })
    this.dealRegService.getDealById(this.lead.dealId,this.loggedInUserId).subscribe(deal=>{
        this.deal = deal.data;
      
        this.dealRegService.getDealCreatedBy(this.deal.createdBy).subscribe(user =>
          {
          
            this.createdBy = user;
            this.userName="";
            if(this.createdBy.firstName!=null && this.createdBy.firstName.length>0){
              this.userName = this.userName+this.createdBy.firstName;

            }
            if(this.createdBy.lastName!=null && this.createdBy.lastName.length>0){
              this.userName = this.userName+this.createdBy.lastName;
              
            }
          })
    },
    error => console.log(error),
    () => { })
    this.dealRegService.getDealCreatedBy(this.loggedInUserId).subscribe(user =>
    {

      this.user = user;

    },
    error => console.log(error),
    () => { })
    console.log("ngOnDestroy");
    this.getComments();
  //   this.refreshComments = setInterval(() => {
  //      this.getComments();
  // },10000);

  }

  getComments(){
    this.dealRegService.getComments(this.lead.dealId).subscribe(commentData =>
      {
        console.log(commentData);
        this.commentList = commentData.comments;
        this.userName="";
        this.commentList.forEach(c=>{
          if(c.user.firstName!= undefined && c.user.firstName!=null && c.user.firstName.length>0){
            c.userName = c.user.firstName;
          }
          if(c.user.lastName!= undefined && c.user.lastName!=null && c.user.lastName.length>0){
            if(c.userName!= undefined && c.userName!=null && c.userName.length>0 )
              c.userName = c.userName+" "+c.user.lastName;
            else
              c.userName =c.user.lastName;
          }
          if (c.user.profileImagePath.indexOf(null) > -1) {
            c.user.profileImagePath = 'assets/images/icon-user-default.png';
          
          } 
        })
        this.scrollBottom()
       

      },
      error => console.log(error),
      () => { })
  }
  addCommentModalClose()
  {
    this.isCommentSection.emit(false);
  }
  validateComment(comment: string)
  {
    if ($.trim(comment).length == 0)
      this.isError = true;
    else
      this.isError = false;
  }
  postComment(data: DealComments)
  {

    if (!this.isError)
    {
      data.createdAt = new Date();
      data.user = this.user;
      data.dealId = this.lead.dealId;

      this.dealRegService.saveComment(this.lead.dealId, data).subscribe(result =>
      {
       this.getCommentList();
       this.comment = new DealComments();

      },
      error => console.log(error),
      () => { });
    }

  }
  ngOnDestroy() {

     // clearInterval(this.refreshComments);
      console.log(this.commentList.length)
      if(this.commentList.length>0){
      
         
        let comment_id =this.commentList[this.commentList.length-1].id
      const data ={
        'user' : this.loggedInUserId,
        'comment':comment_id,
        'deal':this.deal.id,
        'property':null

      }
      console.log(data)
      this.dealRegService.updateCommentStats(data).subscribe(result =>
        {
       
        },
        error => console.log(error),
        () => { });
      }
      
  }
}
