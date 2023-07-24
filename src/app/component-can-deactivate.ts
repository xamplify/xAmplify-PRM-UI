import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from './core/services/authentication.service';

declare var swal:any;
export interface ComponentCanDeactivate {
    canDeactivate: () => boolean | Observable<boolean>;
}


@Injectable()
export class PendingChangesGuard implements CanDeactivate<ComponentCanDeactivate> {

  constructor(private authenticationService: AuthenticationService) {};

  canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> {
    this.authenticationService.module.contentLoader = false;
    this.authenticationService.leftSideMenuLoader = false;
    // if there are no pending changes, just allow deactivation; else confirm first
    return component.canDeactivate() ?
      true :
      // NOTE: this warning message will only be shown when navigating elsewhere within your angular app;
      // when navigating away from your angular app, the browser will show a generic warning message
      // see http://stackoverflow.com/a/42207299/7307355
      //https://stackoverflow.com/questions/35922071/warn-user-of-unsaved-changes-before-leaving-page
     confirm('WARNING: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes.');
  }

  
    



}