import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { XtremandLogger } from '../../../error-pages/xtremand-logger.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import {CompanyProfile} from '../models/company-profile';
import {CompanyProfileService} from '../services/company-profile.service';
import {noWhiteSpaceValidator } from '../../../form-validator';
import { ReferenceService } from '../../../core/services/reference.service';
import { ActivatedRoute,Router } from '@angular/router';
declare var $:any;
@Component({
  selector: 'app-edit-company-profile',
  templateUrl: './edit-company-profile.component.html',
  styleUrls: ['./edit-company-profile.component.css']
})
export class EditCompanyProfileComponent implements OnInit {
    loggedInUserId: number = 0;
    companyProfile:CompanyProfile = new CompanyProfile();
    message:string = "";
    constructor( private logger: XtremandLogger, private authenticationService: AuthenticationService, private companyProfileService: CompanyProfileService,
        private fb: FormBuilder,private refService:ReferenceService,private router:Router) {
        this.loggedInUserId = this.authenticationService.getUserId();

    }

    ngOnInit() {
        if(this.authenticationService.hasCompany()){
            this.getCompanyProfileByUserId();
        }
        this.validateCompanyProfileForm();
    }
  
    
    /*****Company Profile Form Validation******************/
    companyProfileForm:FormGroup;
    validateCompanyProfileForm(){
        var regexp = /^\S+$/;
        this.companyProfileForm = this.fb.group({
            'companyName': [this.companyProfile.companyName.trim(),Validators.compose([Validators.required,noWhiteSpaceValidator,Validators.maxLength( 50 )])],//Validators.pattern(nameRegEx)
            'companyProfileName': [this.companyProfile.companyProfileName.trim(), Validators.compose([Validators.required,Validators.maxLength( 50 ),Validators.pattern(regexp)])],//Validators.pattern(nameRegEx)
            'aboutUs': [this.companyProfile.aboutUs.trim(), Validators.compose([Validators.required,noWhiteSpaceValidator,Validators.maxLength( 500 )])],

        });

        this.companyProfileForm.valueChanges
            .subscribe(data => this.onUpdateCompanyProfileFormValueChanged(data));
        this.onUpdateCompanyProfileFormValueChanged(); // (re)set validation messages now
    
    }
    
    onUpdateCompanyProfileFormValueChanged(data?: any) {
        if (!this.companyProfileForm) { return; }
        const form = this.companyProfileForm;
        for (const field in this.formErrors) {
            // clear previous error message (if any)
            this.formErrors[field] = '';
            const control = form.get(field);

            if (control && control.dirty && !control.valid) {
                const messages = this.validationMessages[field];
                for (const key in control.errors) {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
    }
    
    formErrors = {
        'companyName': '',
        'companyProfileName': '',
        'aboutUs': '',
        };
    
    validationMessages = {
            'companyName': {
                'required': 'Company Name required.',
                'whitespace':'Invalid Data',
                'minlength': 'Company Name must be at least 3 characters long.',
                'maxlength': 'Company Name cannot be more than 50 characters long.',
                'pattern':'Invalid Name'
            },
            'companyProfileName': {
                'required': 'CompanyProfileName required.',
                'minlength': 'CompanyProfileName must be at least 3 characters long.',
                'maxlength': 'CompanyProfileName cannot be more than 50 characters long.',
                'pattern':'Spaces Not Allowed'
            },
        
            'aboutUs': {
                'required': 'About required.',
                'whitespace':'Invalid Data',
                'maxlength': 'description cannot be more than 500 characters long.'
            },
           


        };
    
    
    saveOrUpdate() {
        this.companyProfile = this.companyProfileForm.value;
        console.log( this.companyProfile );
        this.companyProfileService.saveOrUpdate(this.companyProfile,this.loggedInUserId)
            .subscribe(
            data => {
                this.message = data.message;
                $('#saveCompanyButtonId').prop('disabled',true);
                $('#info').hide();
                $( '#edit-sucess' ).show( 600 );
                this.refService.hasCompany  = true;
                let self = this;
                setTimeout(function(){
                    self.router.navigate(["/home/dashboard/welcome"]);
                  }, 2000);
               
            },
            error => { this.logger.errorPage( error ) },
            () => { this.logger.info( "Completed saveOrUpdate()" ) }
            );
    }
    
    
    getCompanyProfileByUserId() {
        this.companyProfileService.getByUserId( this.loggedInUserId )
            .subscribe(
            data => {
                this.companyProfile = data.data;
            },
            error => { this.logger.errorPage( error ) },
            () => { this.logger.info( "Completed getCompanyProfileByUserId()" ) }
            );

    }
    
    
    /*****List All Company/Company Profile Names******************/
    

}
