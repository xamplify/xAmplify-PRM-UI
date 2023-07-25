import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from './core/services/authentication.service';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

declare var swal:any;
export interface ComponentCanDeactivate {
    canDeactivate: () => boolean | Observable<boolean>;
}


@Injectable()
export class PendingChangesGuard implements CanDeactivate<ComponentCanDeactivate> {
  modalRef: any;

  constructor(private authenticationService: AuthenticationService,
    private modalService: BsModalService) {
      
    };

  canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> {
     this.authenticationService.module.contentLoader = false;
      this.authenticationService.leftSideMenuLoader = false;
    if(component!=null){
      return component.canDeactivate() ?
      true :
      // NOTE: this warning message will only be shown when navigating elsewhere within your angular app;
      // when navigating away from your angular app, the browser will show a generic warning message
      // see http://stackoverflow.com/a/42207299/7307355
      //https://stackoverflow.com/questions/35922071/warn-user-of-unsaved-changes-before-leaving-page
      this.callConfirmAlert();
    }else{
      this.callConfirmAlert();
    }
    }

    callConfirmAlert(){
     return confirm("You haven't saved your changes. Are you sure you want to leave this page?");
    }

    openConfirmDialog() {
      this.modalRef = this.modalService.show(ConfirmationComponent);
      return this.modalRef.content.onClose.map(result => {
          return result;
      })
    }

  

    



}