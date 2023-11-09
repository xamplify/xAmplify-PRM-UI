import { Component, OnInit, Input, Output, EventEmitter,OnDestroy } from '@angular/core';
import { ContactService } from '../services/contact.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Router } from '@angular/router';
import { User } from '../../core/models/user';

declare var $: any;

@Component({
  selector: 'app-unsubscribe-contact-modal',
  templateUrl: './unsubscribe-contact-modal.component.html',
  styleUrls: ['./unsubscribe-contact-modal.component.css']
})
export class UnsubscribeContactModalComponent implements OnInit, OnDestroy {

@Input() selectedUser : User;
unsubscribeReasons:Array<any>;
isOtherReason = false;
characterleft = 250;
reason = '';
invalidReason = true;
loading = false;
public companyId: number;
isPartner: boolean;
isAssignLeads = false;
checkingContactTypeName = '';
@Output() notifyParent: EventEmitter<any>;

  constructor(public router:Router, public contactService: ContactService,
              public authenticationService: AuthenticationService) {
          this.notifyParent = new EventEmitter();
   }
  
    findUnsubscribeReasons(){
    this.loading = true;
    this.unsubscribeReasons = [];
    this.contactService.findUnsubscribeReasons(this.authenticationService.getUserId()).subscribe(
      response=>{
        this.unsubscribeReasons = response.data;
        this.isOtherReason = this.unsubscribeReasons.length==0;
        this.loading = false;
         $( '#unsubscribeContactModal' ).modal( 'show' );
      }
    );
  }
  
    addReason(unsubscribeReason:any){
    this.isOtherReason = unsubscribeReason.customReason;
    if(this.isOtherReason){
      this.reason = "";
      this.invalidReason = true;
    }else{
      this.invalidReason = false;
      this.reason = unsubscribeReason.reason;
    }
  } 
  
   characterSize(){
      let reasonLength = $.trim(this.reason).length;
      if(reasonLength>0){
        this.invalidReason = false;
        this.characterleft = 250 - reasonLength;
      }else{
        this.invalidReason = true;
      }
    } 
    
      unsubscribeContactModalClose() {
        $( '#unsubscribeContactModal' ).modal( 'toggle' );
        $( "#unsubscribeContactModal .close" ).click()
        $( '#unsubscribeContactModal' ).modal( 'hide' );
        $( 'body' ).removeClass( 'modal-open' );
        $( '.modal-backdrop fade in' ).remove();
        $( ".modal-backdrop in" ).css( "display", "none" );
        this.contactService.isUnsubscribeContactModalPopup = false;
    }
    
   unsubscribeUser(){
    this.loading = true;
        var object = {
                "userId": this.selectedUser.id,
                "reason":this.reason,
                "type":"unsubscribed"
        }
   
      this.contactService.unsubscribeOrResubscribeUser(object)
      .subscribe(
        (result: any) => {
         this.loading = false;
          this.closeAndEmitData(result);
        },
        (error: any) => {
        console.log(error);
        this.loading = false;
        }
      );
  }
  
    closeAndEmitData(result : any){
        this.unsubscribeContactModalClose();
        let successMessage = '['+ this.selectedUser.emailId + ']' +result.message;
        this.notifyParent.emit( successMessage );
    }

  ngOnInit() {
   this.findUnsubscribeReasons();
  }
  
  ngOnDestroy(){
        this.unsubscribeContactModalClose();
    }

}
