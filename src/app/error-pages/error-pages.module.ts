import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ErrorPagesComponent } from './error-pages/error-pages.component';
import { ServiceUnavailableComponent } from './service-unavailable/service-unavailable.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { UnauthorizedPageComponent } from './unauthorized-page/unauthorized-page.component';

@NgModule({
  imports: [
    CommonModule, RouterModule
  ],
  declarations: [ErrorPagesComponent, ServiceUnavailableComponent, PageNotFoundComponent, AccessDeniedComponent, UnauthorizedPageComponent],
  exports: [ErrorPagesComponent, ServiceUnavailableComponent, PageNotFoundComponent, AccessDeniedComponent]

})
export class ErrorPagesModule { }
