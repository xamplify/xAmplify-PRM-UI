import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';


@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, RouterModule
  ],
  declarations: [SignupComponent, LoginComponent, ForgotPasswordComponent, VerifyEmailComponent]
})
export class AuthenticationModule { }
