import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DealComments } from '../models/deal-comments';
import { AuthenticationService } from '../../core/services/authentication.service';
import { DealRegistrationService } from '../services/deal-registration.service';
import { User } from '../../core/models/user';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { ReferenceService } from '../../core/services/reference.service';
declare var $:any;
@Component({
  selector: 'app-manage-deal-comments',
  templateUrl: './manage-deal-comments.component.html',
  styleUrls: ['./manage-deal-comments.component.css']
})
export class ManageDealCommentsComponent implements OnInit
{

  @Input()
  lead: any;


  @Input()
  property: any;

  @Output() isCommentSection = new EventEmitter<any>();

  comment: DealComments
  commentList: DealComments[] = [];
  firstName: string;
  lastName: string;
  loggedInUserId: number;
  user: User;
  isError = true;
  constructor(private logger: XtremandLogger, public referenceService: ReferenceService,
    public authenticationService: AuthenticationService, private dealRegService: DealRegistrationService) { }

  ngOnInit()
  {

    this.comment = new DealComments;
    
    this.loggedInUserId = this.authenticationService.getUserId();
    this.dealRegService.getDealCreatedBy(this.loggedInUserId).subscribe(user =>
    {

      this.user = user;

    },
    error => console.log(error),
    () => { })
    this.getCommentList();
   

  }
  getCommentList(){
    this.dealRegService.getCommentsByProperty(this.lead.id, this.property.id).subscribe(commentData =>
      {
        this.commentList = commentData.comments;
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
        this.scrollBottom();
        this.comment = new DealComments;
  
      },
      error => console.log(error),
      () => { })
  }
  validateComment(comment: string)
  {
    if ($.trim(comment).length == 0)
      this.isError = true;
    else
      this.isError = false;
  }
  addCommentModalClose()
  {
    this.isCommentSection.emit(false);
  }
  postComment(data: DealComments)
  {

    if (!this.isError && data.comment.length >0)
    {
    data.createdAt = new Date();
    data.user = this.user;
    data.propertyId = this.property.id;

    this.dealRegService.saveComment(this.lead.id, data).subscribe(result =>
    {
      this.getCommentList();

    },
    error => console.log(error),
    () => { });
    }
    // data.user.lastName = this.user.lastName;

  }

  scrollBottom() {
    this.referenceService.scrollSmoothToDiv("comment-area");
   // $(".comment-area").animate({ scrollTop: document.body.scrollHeight }, 500);
  }
  ngOnDestroy() {

    
    if(this.commentList.length>0){
    
       
      let comment_id =this.commentList[this.commentList.length-1].id
    const data ={
      'user' : this.loggedInUserId,
      'comment':comment_id,
      'deal':null,
      'property':this.property.id

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
