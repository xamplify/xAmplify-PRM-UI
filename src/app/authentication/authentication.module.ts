import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { CoreModule } from "../core/core.module";
import { SharedModule } from "../shared/shared.module";
import { SharedLibraryModule } from '../shared/shared-library.module';

import { SignupComponent } from "./signup/signup.component";
import { LoginComponent } from "./login/login.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { VerifyEmailComponent } from "./verify-email/verify-email.component";
import { VideoComponent } from "./video/video.component";
import { CommonComponentModule } from "../common/common.module";
import { IntroComponent } from "./intro/intro.component";
import { TermsConditonComponent } from "./terms-conditon/terms-conditon.component";
import { RequestDemoComponent } from "./request-demo/request-demo.component";

import { AgmCoreModule } from "@agm/core";
import { AccessAccountComponent } from './access-account/access-account.component';
import { SamlsecurityauthComponent } from './samlsecurityauth/samlsecurityauth.component';
import { LogoutComponent } from './logout/logout.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { PreviewLoginComponent } from "app/common/preview-login/preview-login.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CoreModule,
    SharedModule,
    CommonComponentModule,
    SharedLibraryModule,
    AgmCoreModule.forRoot({ apiKey: "AIzaSyDDdgixbmMAkOIcujVZpwsguQXefh1-Kqw" })
  ],
  declarations: [
    SignupComponent,
    LoginComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    VideoComponent,
    IntroComponent,
    TermsConditonComponent,
    RequestDemoComponent,
    AccessAccountComponent,
    SamlsecurityauthComponent,
    LogoutComponent,
    MaintenanceComponent,
    PreviewLoginComponent
  ],
  exports: []
})
export class AuthenticationModule {}
