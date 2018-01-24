import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { User } from '../../core/models/user';

import { AuthenticationService } from '../../core/services/authentication.service';
import { UtilService } from '../../core/services/util.service';
import { UserService } from '../../core/services/user.service';
import {matchingPasswords,noWhiteSpaceValidator,validateCountryName} from '../../form-validator';
import { ReferenceService } from '../../core/services/reference.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
declare var Metronic, swal, $, Layout, Login, Demo: any;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css', '../../../assets/css/default.css'],
  providers: [User]
})
export class SignupComponent implements OnInit {
    signUpForm: FormGroup;
    emailRegEx:any = /^[A-Za-z0-9]+(\.[_A-Za-z0-9]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$/;
    userActive = false;
    
  constructor(private router: Router,
          private authenticationService: AuthenticationService, private fb: FormBuilder, private signUpUser: User, 
          private userService: UserService, private refService :ReferenceService, private utilService: UtilService,private logger:XtremandLogger) {
      this.buildForm();
  }

  formErrors = {
          'fullName': '',
          'emailId': '',
          'address': '',
          'city': '',
          'country': '',
          'password': '',
          'confirmPassword': '',
          'agree': ''
      };
  
  validationMessages = {
          'fullName': {
              'required': 'Name is required.',
              'whitespace':'Invalid Data',
              'minlength': 'Name must be at least 4 characters long.',
              'maxlength': 'Name cannot be more than 50 characters long.',
              'pattern':'Invalid Name'
          },
          'emailId': {
              'required': 'Email is required.',
              'pattern': 'Invalid Pattern.'
          },
          'address': {
              'required': 'Address is required.',
              'whitespace':'Invalid Data',
              'minlength': 'Address must be at least 4 characters long.',
              'maxlength': 'Address cannot be more than 50 characters long.',
              'pattern':'Invalid Address'
          },
          'city': {
              'required': 'City is required.',
              'whitespace':'Invalid Data',
              'minlength': 'City must be at least 4 characters long.',
              'maxlength': 'City cannot be more than 50 characters long.',
              'pattern':'Invalid City'
          },
          'country': {
              'required': 'Country is required.',
              'invalidCountry':'Country is required.'
          },
          'password': {
              'required': 'Password is required.',
              'minlength': 'Minimum 6 Characters',
              'pattern': 'Password should contain One Upper case letter, one lower case letter, one symbol and one Number'
          },
          'confirmPassword': {
              'required': 'Confirm Password is required.',
              'pattern': 'Password should contain One Upper case letter, one lower case letter, one symbol and one Number'
          },
          'agree': {
              'required': 'You Must Agree.'
          }
      };
  
  signUp() {
      //this.isLoading = true;
      this.signUpUser = this.signUpForm.value;
      this.signUpUser.emailId = this.signUpUser.emailId.toLowerCase();
      this.userService.signUp( this.signUpUser )
          .subscribe(
          data => {
              console.log( data['_body'] );
              var body = data['_body'];
              if ( body != "" ) {
                  var response = JSON.parse( body );
                  if ( response.message == "USER CREATED SUCCESSFULLY" ) {
                      this.userActive = true;
                  }
              } else {
                  this.logger.error(this.refService.errorPrepender+" signUp():"+data);
              }

          },
          error => {
              if ( error == "USERNAME IS ALREADY EXISTING" ) {
                  this.formErrors['userName'] = error;
                 // this.isLoading = false;
              } else if ( error == "USER IS ALREADY EXISTING WITH THIS EMAIL" ) {
                  this.formErrors['emailId'] = 'Email Id already exists';
                 // this.isLoading = false;
              } else{
                  this.logger.errorPage(error);
              }
          },
          () => console.log( "Done" )
          );
      return false;

  }
  
  buildForm() {
      var passwordRegex = '((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})';// 
      var addressRegex =  /^[a-zA-Z0-9-\/] ?([a-zA-Z0-9-\/]|[a-zA-Z0-9-\/] )*[a-zA-Z0-9-\/]$/;
     // var cityRegEx = /^[a-zA-z] ?([a-zA-z]|[a-zA-z] )*[a-zA-z]$/;
      var cityRegEx = /[a-zA-Z]+[a-zA-Z ]+/;
      //var nameRegEx = /[a-zA-Z0-9]+[a-zA-Z0-9 ]+/;
      this.signUpForm = this.fb.group( {
          'fullName': [this.signUpUser.fullName, Validators.compose([Validators.required,noWhiteSpaceValidator,Validators.maxLength( 50 )])],//Validators.pattern(nameRegEx)
          'emailId': [this.signUpUser.emailId, [Validators.required, Validators.pattern( this.emailRegEx )]],
          'address': [this.signUpUser.address,  Validators.compose([Validators.required,noWhiteSpaceValidator,Validators.maxLength( 50 ),])],//Validators.pattern(nameRegEx)
          'city': [this.signUpUser.city, Validators.compose([Validators.required,noWhiteSpaceValidator,Validators.maxLength( 50 ),Validators.pattern(cityRegEx)])],
          'country': [this.refService.countries[0],  Validators.compose([Validators.required,validateCountryName])],
          'password': [this.signUpUser.password, [Validators.required, Validators.minLength( 6 ), Validators.pattern( passwordRegex )]],
          'confirmPassword': [null, [Validators.required, Validators.pattern( passwordRegex )]],
          'agree': [false, Validators.required],
      }, {
              validator: matchingPasswords( 'password', 'confirmPassword' )
          }
      );

      this.signUpForm.valueChanges
          .subscribe( data => this.onValueChanged( data ) );

      this.onValueChanged(); // (re)set validation messages now
  }
  
  onValueChanged( data?: any ) {
      if ( !this.signUpForm ) { return; }
      const form = this.signUpForm;
      console.log(form.controls);
      for ( const field in this.formErrors ) {
          // clear previous error message (if any)
          this.formErrors[field] = '';
          const control = form.get( field );
          if ( control && control.dirty && !control.valid ) {
              const messages = this.validationMessages[field];
              for ( const key in control.errors ) {
                  console.log( this.formErrors[field]);
                  this.formErrors[field] += messages[key] + ' ';
              }
          }
      }
  }
  
  ngOnInit() {
  }

}
