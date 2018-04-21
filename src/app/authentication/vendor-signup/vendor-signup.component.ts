import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { User } from '../../core/models/user';
import { RegularExpressions } from '../../common/models/regular-expressions';

import { CustomResponse } from '../../common/models/custom-response';
import { Properties } from '../../common/models/properties';

import { UserService } from '../../core/services/user.service';
import { matchingPasswords, noWhiteSpaceValidator, validateCountryName } from '../../form-validator';
import { ReferenceService } from '../../core/services/reference.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { CountryNames } from '../../common/models/country-names';

declare var $: any;

@Component({
  selector: 'app-vendor-signup',
  templateUrl: './vendor-signup.component.html',
  styleUrls: ['./vendor-signup.component.css', '../../../assets/css/default.css', '../../../assets/css/authentication-page.css'],
  providers: [User, CountryNames, RegularExpressions, Properties]
})
export class VendorSignupComponent implements OnInit {
    vendorSignUpForm: FormGroup;
loading = false;
isError = false;
customResponse: CustomResponse = new CustomResponse();
formErrors = {
    'firstName': '',
    'lastName': '',
    'emailId': '',
    'address': '',
    'city': '',
    'country': '',
    'password': '',
    'confirmPassword': '',
    'agree': ''
};

validationMessages = {
    'firstName': {
        'required': 'First name is required.',
    },
    'emailId': {
        'required': 'Email is required.',
        'pattern': 'Please enter a valid email address'
    },
    'address': {
        'required': 'Address is required.',
        'whitespace': 'Invalid Address',
        'minlength': 'Address must be at least 4 characters long.',
        'maxlength': 'Address cannot be more than 50 characters long.',
        'pattern': 'Invalid Address'
    },
    'city': {
        'required': 'City is required.',
        'whitespace': 'Invalid City',
        'minlength': 'City must be at least 4 characters long.',
        'maxlength': 'City cannot be more than 50 characters long.',
        'pattern': 'Invalid City'
    },
    'country': {
        'required': 'Country is required.',
        'invalidCountry': 'Country is required.'
    },
    'password': {
        'required': 'Password is required.',
        'minlength': '',
        'pattern': 'Use 6 or more characters with a mix of letters, numbers & symbols'
    },
    'confirmPassword': {
        'required': 'Confirm Password is required.',
        'pattern': 'Use 6 or more characters with a mix of letters, numbers & symbols'
    },
    'agree': {
        'required': 'You Must Agree to the Terms of Service & Privacy Policy.'
    }
};

constructor(private router: Router, public countryNames: CountryNames, public regularExpressions: RegularExpressions, public properties: Properties,
    private formBuilder: FormBuilder, private signUpUser: User,
    private userService: UserService, public referenceService: ReferenceService,private xtremandLogger: XtremandLogger) {
    this.buildForm();
}

signUp() {
    //this.isLoading = true;
    this.signUpUser = this.vendorSignUpForm.value;
    this.signUpUser.emailId = this.signUpUser.emailId.toLowerCase();
    this.signUpUser.vendorSignUp = true;
    this.loading = true;
    console.log(this.signUpUser);
    this.userService.signUp(this.signUpUser)
        .subscribe(
            data => {
                this.loading = false;
                if (data !== undefined) {
                    if (data.message === 'USER CREATED SUCCESSFULLY' || data.message.includes('USER CREATED')) {
                        this.loading = false;
                        this.referenceService.userProviderMessage = this.properties.SIGN_UP_SUCCESS;
                        this.router.navigate(['/login']);
                    }
                } else {
                    this.loading = false;
                    this.isError = true;
                    this.xtremandLogger.error(this.referenceService.errorPrepender + " signUp():" + data);
                }
            },
            error => {
                this.loading = false;
                if (error === "USERNAME IS ALREADY EXISTING") {
                    this.formErrors['userName'] = error;
                    // this.isLoading = false;
                } else if (error === "USER IS ALREADY EXISTING WITH THIS EMAIL") {
                    this.formErrors['emailId'] = 'Email Id already exists';
                    // this.isLoading = false;
                } else {
                    this.xtremandLogger.errorPage(error);
                }
            },
            () => this.xtremandLogger.log("Done")
        );
}

buildForm() {
    this.vendorSignUpForm = this.formBuilder.group({
        'emailId': [this.signUpUser.emailId, [Validators.required, Validators.pattern(this.regularExpressions.EMAIL_ID_PATTERN)]],
        'password': [this.signUpUser.password, [Validators.required, Validators.minLength(6), Validators.pattern(this.regularExpressions.PASSWORD_PATTERN)]],
        'confirmPassword': [null, [Validators.required, Validators.pattern(this.regularExpressions.PASSWORD_PATTERN)]],
        'agree': [false, Validators.required],
        'firstName': [this.signUpUser.firstName, Validators.required],
        'lastName': [this.signUpUser.lastName]
        // 'fullName': [this.signUpUser.fullName, Validators.compose([Validators.required, noWhiteSpaceValidator, Validators.maxLength(50)])],//Validators.pattern(nameRegEx)
        // 'address': [this.signUpUser.address, Validators.compose([Validators.required, noWhiteSpaceValidator, Validators.maxLength(50),])],//Validators.pattern(nameRegEx)
        // 'city': [this.signUpUser.city, Validators.compose([Validators.required, noWhiteSpaceValidator, Validators.maxLength(50), Validators.pattern(this.regularExpressions.CITY_PATTERN)])],
        // 'country': [this.countryNames.countries[0], Validators.compose([Validators.required, validateCountryName])],
    }, {
            validator: matchingPasswords('password', 'confirmPassword')
        }
    );
    this.vendorSignUpForm.valueChanges
        .subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // (re)set validation messages now
}

onValueChanged(data?: any) {
    if (!this.vendorSignUpForm) { return; }
    const form = this.vendorSignUpForm;
    this.xtremandLogger.log(form.controls);
    for (const field of Object.keys(this.formErrors)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
            const messages = this.validationMessages[field];
            for (const key of Object.keys(control.errors)) {
                this.xtremandLogger.log(this.formErrors[field]);
                this.formErrors[field] += messages[key] + ' ';
            }
        }
    }
}
toggleChild() {
    this.isError = !this.isError;
}
ngOnInit() {
    $("[rel='tooltip']").tooltip();
}

}
