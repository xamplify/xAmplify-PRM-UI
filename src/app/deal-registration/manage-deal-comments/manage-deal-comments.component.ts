import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DealComments } from '../models/deal-comments';
import { AuthenticationService } from '../../core/services/authentication.service';
import { DealRegistrationService } from '../services/deal-registration.service';
import { User } from '../../core/models/user';
var $;
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
  constructor(public authenticationService: AuthenticationService, private dealRegService: DealRegistrationService) { }

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
    this.dealRegService.getCommentsByProperty(this.lead.id, this.property.id).subscribe(commentData =>
    {
      this.commentList = commentData.comments;
      this.comment = new DealComments;

    },
    error => console.log(error),
    () => { })

  }
  validateComment(comment: string)
  {
    if (comment.length == 0)
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
    data.createdAt = new Date();
    data.user = this.user;
    data.propertyId = this.property.id;

    this.dealRegService.saveComment(this.lead.id, data).subscribe(result =>
    {
      this.dealRegService.getCommentsByProperty(this.lead.id, data.propertyId).subscribe(commentData =>
      {
        this.commentList = commentData.comments;
        this.comment = new DealComments;

      },
      error => console.log(error),
      () => { })

    },
    error => console.log(error),
    () => { });
    // data.user.lastName = this.user.lastName;

  }

}
