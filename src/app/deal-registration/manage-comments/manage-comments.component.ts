import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { DealComments } from '../models/deal-comments';
import { AuthenticationService } from '../../core/services/authentication.service';
import { DealRegistrationService } from '../services/deal-registration.service';
import { User } from '../../core/models/user';
var $ ;
@Component({
  selector: 'app-manage-comments',
  templateUrl: './manage-comments.component.html',
  styleUrls: ['../../contacts/add-contact-modal/add-contact-modal.component.css']
})
export class ManageCommentsComponent implements OnInit {

  @Input()
  lead:any;

   @Output()  isCommentSection = new EventEmitter<any>();

   comment:DealComments
   commentList:DealComments[] = [];
    firstName:string;
    lastName:string;
  loggedInUserId: number;
  user: User;
  constructor(public authenticationService: AuthenticationService,private dealRegService: DealRegistrationService) { }

  ngOnInit() {
     this.comment = new DealComments;
      this.loggedInUserId =this.authenticationService.getUserId();
      this.dealRegService.getDealCreatedBy(this.loggedInUserId).subscribe(user => {
       
        this.user = user;

      })

    console.log(this.lead);
  }

  addCommentModalClose(){
    this.isCommentSection.emit(false);
  }
  postComment(data:DealComments){
    alert("Comment Section")
  //   data.createdAt = new Date();
  //   data.user = this.user;
  //  // data.user.lastName = this.user.lastName;
  //   this.commentList.push(data);
  //   this.comment = new DealComments;
  }
}
