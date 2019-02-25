import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DealComments } from '../models/deal-comments';
import { AuthenticationService } from '../../core/services/authentication.service';
import { DealRegistrationService } from '../services/deal-registration.service';
import { User } from '../../core/models/user';
import { Campaign } from '../../campaigns/models/campaign';
import { CampaignService } from '../../campaigns/services/campaign.service';
import { ReferenceService } from '../../core/services/reference.service';
import { DealRegistration } from '../models/deal-registraton';
var $;
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

  comment: DealComments
  commentList: DealComments[] = [];
  firstName: string;
  lastName: string;
  loggedInUserId: number;
  user: User;
  isError = true;
  createdBy: any;
  deal: DealRegistration;
  userName ="";
  constructor(public authenticationService: AuthenticationService, private dealRegService: DealRegistrationService, 
    private campaignService: CampaignService,refferenceService:ReferenceService) { 

  }

  ngOnInit()
  {
      this.getCommentList();

  }
  getCommentList(){
    

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
    this.dealRegService.getDealById(this.lead.dealId).subscribe(deal=>{
        this.deal = deal.data;
       
        this.dealRegService.getDealCreatedBy(this.deal.createdBy).subscribe(user =>
          {
          
            this.createdBy = user;
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
    this.dealRegService.getComments(this.lead.dealId).subscribe(commentData =>
    {
      console.log(commentData);
      this.commentList = commentData.comments;
      this.commentList.forEach(c=>{
        c.userName = c.user.firstName+" "+c.user.lastName;
        if (c.user.profileImagePath.indexOf(null) > -1) {
          c.user.profileImagePath = 'assets/admin/pages/media/profile/icon-user-default.png';
         
        } 
      })
      this.comment = new DealComments;

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
    if (comment.length == 0)
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

      },
      error => console.log(error),
      () => { });
    }
    

  }
}
