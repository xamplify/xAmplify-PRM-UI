import { Component, OnInit, Input, Output, EventEmitter,OnDestroy } from '@angular/core';
import { ContactService } from '../services/contact.service';
import { LogService } from "../../core/services/log.service";
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

  constructor(public router:Router, public contactService: ContactService, private logService: LogService,
              public authenticationService: AuthenticationService) {
          this.notifyParent = new EventEmitter();
        if ( this.router.url.includes( 'home/contacts' ) ) {
          this.isPartner = false;
          this.checkingContactTypeName = "Contact"
      } else if( this.router.url.includes( 'home/assignleads' ) ){
          this.isPartner = false;
          this.isAssignLeads = true;
          this.checkingContactTypeName = "Lead"
      }
      else {
          this.isPartner = true;
          this.checkingContactTypeName = this.authenticationService.partnerModule.customName;
      }
   }
  
    findUnsubscribeReasons(){
    this.loading = true;
    this.unsubscribeReasons = [];
    this.contactService.findUnsubscribeReasons(this.authenticationService.getUserId()).subscribe(
      response=>{
        this.unsubscribeReasons = response.data;
        console.log(this.unsubscribeReasons);
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
    
   unSubscribeUser(){
    this.loading = true;
        var object = {
                "userId": this.selectedUser.id,
                "reason":this.reason,
                "type":"unsubscribed"
        }
   
      this.contactService.unSubscribeUser(object)
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
