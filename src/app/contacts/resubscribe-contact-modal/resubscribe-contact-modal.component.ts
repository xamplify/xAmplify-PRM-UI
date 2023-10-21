import { Component, OnInit, Input, Output, EventEmitter,OnDestroy } from '@angular/core';
import { ContactService } from '../services/contact.service';
import { User } from '../../core/models/user';

declare var $: any;

@Component({
  selector: 'app-resubscribe-contact-modal',
  templateUrl: './resubscribe-contact-modal.component.html',
  styleUrls: ['./resubscribe-contact-modal.component.css']
})
export class ResubscribeContactModalComponent implements OnInit {

@Input() selectedUser : User;
@Output() notifyParent: EventEmitter<any>;
characterleft = 250;
reason = '';
loading = false;
invalidReason = true;
  constructor(public contactService: ContactService) {
    this.notifyParent = new EventEmitter();
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
    
      resubscribeContactModalClose() {
        $( '#resubscribeContactModal' ).modal( 'toggle' );
        $( "#resubscribeContactModal .close" ).click()
        $( '#resubscribeContactModal' ).modal( 'hide' );
        $( 'body' ).removeClass( 'modal-open' );
        $( '.modal-backdrop fade in' ).remove();
        $( ".modal-backdrop in" ).css( "display", "none" );
        this.contactService.isresubscribeContactModalPopup = false;
    }
    
   resubscribeUser(){
    this.loading = true;
        var object = {
                "userId": this.selectedUser.id,
                "reason":this.reason,
                "type":"resubscribed"
        }
      this.contactService.unsubscribeOrResubscribeUser(object)
      .subscribe(
        (result: any) => {
         this.loading = false;
          this.closeAndEmitData(result);
        },
        (error: any) => {
        this.loading = false;
        }
      );
  }
  
      closeAndEmitData(result : any){
        this.resubscribeContactModalClose();
        let successMessage = '['+ this.selectedUser.emailId + ']' +result.message;
        this.notifyParent.emit( successMessage );
    }
    
    openResubscribeContactModalPopup(){
      console.log(this.selectedUser);
      $( '#resubscribeContactModal' ).modal( 'show' );
    }
    

  ngOnInit() {
   this.openResubscribeContactModalPopup();
  }
  
    ngOnDestroy(){
        this.resubscribeContactModalClose();
    }

}
