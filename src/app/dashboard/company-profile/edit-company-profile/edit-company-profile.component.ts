import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { XtremandLogger } from '../../../error-pages/xtremand-logger.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import {CompanyProfile} from '../models/company-profile';
import { CustomResponse } from '../../../common/models/custom-response';
import {CompanyProfileService} from '../services/company-profile.service';
import {noWhiteSpaceValidator } from '../../../form-validator';
import { ReferenceService } from '../../../core/services/reference.service';
import { ActivatedRoute,Router } from '@angular/router';
import { Processor } from '../../../core/models/processor';
import { HomeComponent } from '../../../core/home/home.component';
import { CountryNames } from '../../../common/models/country-names';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { RegularExpressions } from '../../../common/models/regular-expressions';

declare var $:any;
@Component({
  selector: 'app-edit-company-profile',
  templateUrl: './edit-company-profile.component.html',
  styleUrls: ['./edit-company-profile.component.css','../../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css'],
  providers:[Processor,CountryNames,RegularExpressions]
})
export class EditCompanyProfileComponent implements OnInit {
    customResponse: CustomResponse = new CustomResponse();
    isLoading:boolean = false;
    loaderHeight:string = "";
    loggedInUserId: number = 0;
    companyProfile:CompanyProfile = new CompanyProfile();
    message:string = "";
    companyNames:string[]=[];
    companyProfileNames:string[] = [];
    isProcessing:boolean = false;
    formGroupDefaultClass = "form-group";
    companyProfileNameDivClass:string=this.formGroupDefaultClass;
    companyProfileNameError:boolean=false;
    companyProfileNameErrorMessage:string = "";

    companyNameDivClass:string=this.formGroupDefaultClass;
    companyNameError:boolean=false;
    companyNameErrorMessage:string = "";

    emailIdDivClass:string = this.formGroupDefaultClass;
    emailIdError:boolean = false;
    emailIdErrorMessage:string = "";

    tagLineDivClass:string = this.formGroupDefaultClass;
    tagLineError:boolean = false;
    tagLineErrorMessage:string = "";

    phoneDivClass:string = this.formGroupDefaultClass;
    phoneError:boolean = false;
    phoneErrorMessage:string = "";
    
    websiteDivClass:string = this.formGroupDefaultClass;
    websiteError:boolean = false;
    websiteErrorMessage:string = "";
    
    facebookDivClass:string = this.formGroupDefaultClass;
    facebookLinkError:boolean = false;
    facebookLinkErrorMessage:string = "";
    
    googlePlusDivClass:string = this.formGroupDefaultClass;
    googlePlusLinkError:boolean = false;
    googlePlusLinkErrorMessage:string = "";
    
    linkedInDivClass:string = this.formGroupDefaultClass;
    linkedinLinkError:boolean = false;
    linkedinLinkErrorMessage:string = "";
    
    
    twitterDivClass:string = this.formGroupDefaultClass;
    twitterLinkError:boolean = false;
    twitterLinkErrorMessage:string = "";
    
    cityDivClass:string = this.formGroupDefaultClass;
    cityError:boolean = false;
    cityErrorMessage:string = "";
    
    countryDivClass:string = this.formGroupDefaultClass;
    countryError:boolean  = false;
    countryErrorMessage:boolean = false;
    
    
    zipDivClass:string = this.formGroupDefaultClass;
    zipError:boolean = false;
    zipErrorMessage:string = "";
    
    logoDivClass:string = this.formGroupDefaultClass;
    logoError:boolean = false;
    logoErrorMessage:string = "";


    
    existingCompanyName:string = "";
    companyLogoUploader: FileUploader;
    companyLogoImageUrlPath:string = "";
    companyBackGroundLogoUploader:FileUploader;
    companyBackgroundLogoImageUrlPath:string = "";

    constructor( private logger: XtremandLogger, private authenticationService: AuthenticationService, private fb: FormBuilder,
        private companyProfileService: CompanyProfileService, public homeComponent: HomeComponent,
        public refService:ReferenceService,private router:Router,public processor:Processor,public countryNames: CountryNames,public regularExpressions: RegularExpressions) {
        this.loggedInUserId = this.authenticationService.getUserId();
        this.companyNameDivClass = this.refService.formGroupClass;
        this.companyProfileNameDivClass = this.refService.formGroupClass;
        
        
        this.companyLogoUploader = new FileUploader({
            allowedMimeType: ['image/jpeg', 'image/pjpeg', 'image/jpeg', 'image/pjpeg', 'image/png'],
            maxFileSize: 10 * 1024 * 1024, // 100 MB
            url: this.authenticationService.REST_URL + "admin/company-profile/upload-logo?userId=" + this.loggedInUserId+"&access_token=" + this.authenticationService.access_token
        });
        this.companyLogoUploader.onAfterAddingFile = (fileItem) => {
            console.log(fileItem);
            fileItem.withCredentials = false;
           // this.imagePathSafeUrl = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(fileItem._file)));
           // this.logoImageUrlPath = this.imagePathSafeUrl.changingThisBreaksApplicationSecurity;
            this.companyLogoUploader.queue[0].upload();
        };
        this.companyLogoUploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
            console.log(response);
            console.log(this.companyLogoUploader.queue[0]);
            if (JSON.parse(response).message === null) {
                   this.companyLogoUploader.queue[0].upload(); 
            } else {
                this.companyLogoUploader.queue.length = 0;
                this.companyLogoImageUrlPath =  this.companyProfile.companyLogoPath =JSON.parse(response).path;
            }
        }
        
        
        
        this.companyBackGroundLogoUploader = new FileUploader({
            allowedMimeType: ['image/jpeg', 'image/pjpeg', 'image/jpeg', 'image/pjpeg', 'image/png'],
            maxFileSize: 10 * 1024 * 1024, // 100 MB
            url: this.authenticationService.REST_URL + "admin/company-profile/upload-background-image?userId=" + this.loggedInUserId+"&access_token=" + this.authenticationService.access_token
        });
        this.companyBackGroundLogoUploader.onAfterAddingFile = (fileItem) => {
            console.log(fileItem);
            fileItem.withCredentials = false;
            this.companyBackGroundLogoUploader.queue[0].upload();
        };
        this.companyBackGroundLogoUploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
            console.log(response);
            console.log(this.companyBackGroundLogoUploader.queue[0]);
            if (JSON.parse(response).message === null) {
                   this.companyBackGroundLogoUploader.queue[0].upload(); 
            } else {
                this.companyBackGroundLogoUploader.queue.length = 0;
                this.companyBackgroundLogoImageUrlPath =  this.companyProfile.backgroundLogoPath = JSON.parse(response).path;
            }
        }

    }
    ngOnInit() {
        this.getCompanyProfileByUserId();
        if(this.authenticationService.user.hasCompany){
            this.companyProfile.isAdd = false;
        }else{
            this.companyProfile.country = this.countryNames.countries[0];
        }
        this.getAllCompanyNames();
        this.getAllCompanyProfileNames();
        
    }
  
   
    save() {
        this.refService.goToTop();
        
        $('#saveOrUpdateCompanyButton').prop('disabled',true);
       
        this.validateEmptySpace('companyName');
        
        this.validateEmptySpace('companyProfileName');
        
        this.validateEmptySpace('emailId');
        
        this.validateEmptySpace('tagLine');
        
        this.validateEmptySpace('phone');
        
        this.validateEmptySpace('website');
        
        this.validateEmptySpace('facebook');
        
        this.validateEmptySpace('googlePlusLink');
        
        this.validateEmptySpace('linkedInLink');
        
        this.validateEmptySpace('twitter');
        
        this.validateEmptySpace('city');
        
        this.validateCountry();
        
        this.validateEmptySpace('zip');
        
        this.validateCompanyLogo();
        
        this.validateNames(this.companyProfile.companyName);
        
        this.validateProfileNames(this.companyProfile.companyProfileName);
        
       
        this.validatePattern('phone');
        this.validatePattern('website');
        this.validatePattern('facebook');
        this.validatePattern('googlePlusLink');
        this.validatePattern('linkedInLink');
        this.validatePattern('twitterLink');
        this.validatePattern('city');
        this.validatePattern('emailId');
        
        
        if(!this.companyNameError && !this.companyProfileNameError && !this.emailIdError && !this.tagLineError && !this.phoneError && !this.websiteError
            && !this.facebookLinkError && !this.googlePlusLinkError && !this.twitterLinkError && !this.linkedinLinkError && !this.cityError && !this.countryError &&
            !this.zipError && !this.logoError){
            this.processor.set(this.processor);
            this.companyProfileService.save(this.companyProfile,this.loggedInUserId)
            .subscribe(
            data => {
                this.message = data.message;
                $('#info').hide();
                $('#edit-sucess' ).show( 600 );
                let self = this;
                setTimeout(function(){
                    $('#saveOrUpdateCompanyButton').prop('disabled',true);
                    self.authenticationService.user.hasCompany = true;
                    self.authenticationService.isCompanyAdded = true;
                    let module = self.authenticationService.module;
                    module.isOrgAdmin = true;
                    module.isContact = true;
                    module.isPartner = true;
                    module.isEmailTemplate = true;
                    module.isCampaign = true;
                    module.isStats = true;
                    module.hasVideoRole = true;
                    module.hasSocialStatusRole = true;
                    self.router.navigate(["/home/dashboard/welcome"]);
                    self.processor.set(self.processor);
                    self.homeComponent.getVideoDefaultSettings();
                    const currentUser = localStorage.getItem( 'currentUser' );
                    const userToken = {
                    'userName': JSON.parse( currentUser )['userName'],
                    'userId': JSON.parse(currentUser)['userId'],
                    'accessToken': JSON.parse( currentUser )['accessToken'],
                    'refreshToken': JSON.parse( currentUser )['refreshToken'],
                    'expiresIn': JSON.parse( currentUser )['expiresIn'],
                    'hasCompany': self.authenticationService.user.hasCompany,
                    'roles': JSON.parse( currentUser )['roles']
                    };
                    localStorage.setItem('currentUser', JSON.stringify(userToken));
                  }, 3000);
            },
            error => { this.logger.errorPage( error ) },
            () => { this.logger.info( "Completed saveOrUpdate()" ) }
            ); 
        }
    }
    
   validateCompanyLogo(){
       if(this.companyLogoImageUrlPath.length>0){
           this.logoError = false;
           this.logoErrorMessage  = "";
           this.logoDivClass = this.refService.successClass;
       }else{
           this.logoError = true;
           this.logoErrorMessage  = "Please Upload Logo";
           this.logoDivClass = this.refService.errorClass;
       }
   }
    
    update(){
        this.refService.goToTop();
        $('#edit-sucess').hide();
        $('#saveOrUpdateCompanyButton').prop('disabled',true);
        let errorLength = $('div.form-group.has-error.has-feedback').length;
        if(errorLength==0){
            this.processor.set(this.processor);
            this.companyProfileService.update(this.companyProfile,this.loggedInUserId)
            .subscribe(
            data => {
                this.message = data.message;
                $('#info').hide();
                $('#edit-sucess').show( 600 );
                $('#saveOrUpdateCompanyButton').prop('disabled',false);
                this.processor.remove(this.processor);
                setTimeout( function() { $( "#edit-sucess" ).slideUp( 500 ); }, 5000 );
            },
            error => { this.logger.errorPage( error ) },
            () => { this.logger.info( "Completed saveOrUpdate()" ) }
            ); 
        }
       
    }
    
    
    getCompanyProfileByUserId() {
        this.companyProfileService.getByUserId( this.loggedInUserId )
            .subscribe(
            data => {
               if(data.data!=undefined){
                   this.companyProfile = data.data;
                   console.log(this.companyProfile);
                   this.existingCompanyName = data.data.companyName;
               }
                
            },
            error => { this.logger.errorPage( error ) },
            () => { this.logger.info( "Completed getCompanyProfileByUserId()" ) }
            );

    }
    
    getAllCompanyNames(){
        this.companyProfileService.getAllCompanyNames()
        .subscribe(
        response => {
            this.companyNames = response.data;
        },
        error => { this.logger.errorPage( error ) },
        () => { this.logger.info( "Completed getAllCompanyNames()" ) }
        );
    }
    
    getAllCompanyProfileNames(){
        this.companyProfileService.getAllCompanyProfileNames()
        .subscribe(
        response => {
            this.companyProfileNames = response.data;
        },
        error => { this.logger.errorPage( error ) },
        () => { this.logger.info( "Completed getAllCompanyProfileNames()" ) }
        );
    }
    
    validateNames(value:any){
        if(value.trim().length>0){
            value = value.trim().toLowerCase().replace(/\s/g,'');
            if(this.companyNames.indexOf(value)>-1){
                if(this.companyProfile.isAdd){
                  this.setCompanyNameError("Company Name Already Exists");
                }else{
                    if(this.existingCompanyName.trim().toLowerCase().replace(/\s/g,'')!=value){
                        this.setCompanyNameError("Company Name Already Exists");
                    }else{
                        this.removeCompanyNameError();
                    }
                }
                
            }else{
                this.removeCompanyNameError();
            }
        }else{
            this.setCompanyNameError("Please Enter Company Name");
        }
    }
    
    setCompanyNameError(message:string){
        $('#saveOrUpdateCompanyButton').prop('disabled',true);
        this.companyNameError = true;
        this.companyNameErrorMessage = message;
        this.companyNameDivClass = this.refService.errorClass;
    }
    
    removeCompanyNameError(){
        $('#saveOrUpdateCompanyButton').prop('disabled',false);
        this.companyNameError = false;
        this.companyNameDivClass = this.refService.successClass;
    }
    
    
    validateProfileNames(value:any){
        if(value.trim().length>0){
            let valueWithSpace = value.trim().toLowerCase();
            let valueWithOutSpaces = value.trim().toLowerCase().replace(/\s/g,'');
            if (/\s/.test(value)) {
                this.setCompanyProfileNameError("Spaces are not allowed");
            }else if(valueWithOutSpaces.length<3){
                this.setCompanyProfileNameError("Minimum 3 letters required");
            }
            else if(this.companyProfileNames.indexOf(valueWithOutSpaces)>-1){
                this.setCompanyProfileNameError("Company Profile Name Already Exists");
            }else{
                $('#saveOrUpdateCompanyButton').prop('disabled',false);
                this.companyProfileNameError = false;
                this.companyProfileNameDivClass = this.refService.successClass;
            }
        }else{
            this.setCompanyProfileNameError("Please Enter Company Profile Name");

        }
       
    }
    setCompanyProfileNameError(errorMessage:string){
        $('#saveOrUpdateCompanyButton').prop('disabled',true);
        this.companyProfileNameError = true;
        this.companyProfileNameErrorMessage = errorMessage;
        this.companyProfileNameDivClass = this.refService.errorClass;
    }
    
    
    
    validateEmptySpace(columnName:string){
        let value = $.trim($('#'+columnName).val());
        if(value.length==0){
            $('#saveOrUpdateCompanyButton').prop('disabled',true);
           if(columnName=="companyName"){
               this.companyNameError = true;
               this.companyNameDivClass = this.refService.errorClass;
           }else if(columnName=="companyProfileName"){
               this.companyProfileNameError = true;
               this.companyProfileNameDivClass = this.refService.errorClass;
           }else if(columnName=="emailId"){
               this.emailIdError = true;
               this.emailIdDivClass = this.refService.errorClass;
           }else if(columnName=="tagLine"){
               this.tagLineError = true;
               this.tagLineDivClass = this.refService.errorClass;
           }else if(columnName=="phone"){
               this.phoneError = true;
               this.phoneDivClass = this.refService.errorClass;
           }else if(columnName=="website"){
               this.websiteError = true;
               this.websiteDivClass = this.refService.errorClass;
           }else if(columnName=="facebook"){
               this.facebookLinkError = true;
               this.facebookDivClass = this.refService.errorClass;
           }else if(columnName=="googlePlusLink"){
               this.googlePlusLinkError = true;
               this.googlePlusDivClass = this.refService.errorClass;
           }else if(columnName=="linkedInLink"){
               this.linkedinLinkError = true;
               this.linkedInDivClass = this.refService.errorClass;
           }else if(columnName=="twitter"){
               this.twitterLinkError = true;
               this.twitterDivClass = this.refService.errorClass;
           }else if(columnName=="city"){
               this.cityError = true;
               this.cityDivClass = this.refService.errorClass;
           }else if(columnName=="country"){
               this.countryError = true;
               this.countryDivClass = this.refService.errorClass;
           }else if(columnName=="zip"){
               this.zipError = true;
               this.zipDivClass = this.refService.errorClass;
           }
        }else if(value.length>0){
            $('#saveOrUpdateCompanyButton').prop('disabled',false);
            if(columnName=="companyName"){
                this.companyNameError = false;
                this.companyNameDivClass = this.refService.successClass;
            }else if(columnName=="companyProfileName"){
                this.companyProfileNameError = false;
                this.companyProfileNameDivClass = this.refService.successClass;
            }else if(columnName=="emailId"){
                this.validatePattern("emailId");
            }else if(columnName=="tagLine"){
                this.tagLineError = false;
                this.tagLineDivClass = this.refService.successClass;
            }else if(columnName=="phone"){
                this.phoneError = false;
                this.phoneDivClass = this.refService.successClass;
            }else if(columnName=="website"){
                this.websiteError = false;
                this.websiteDivClass = this.refService.successClass;
            }else if(columnName=="facebook"){
                this.facebookLinkError = false;
                this.facebookDivClass = this.refService.successClass;
            }else if(columnName=="googlePlusLink"){
                this.googlePlusLinkError = false;
                this.googlePlusDivClass = this.refService.successClass;
            }else if(columnName=="linkedInLink"){
                this.linkedinLinkError = false;
                this.linkedInDivClass = this.refService.successClass;
            }else if(columnName=="twitter"){
                this.twitterLinkError = false;
                this.twitterDivClass = this.refService.successClass;
            }else if(columnName=="city"){
                this.cityError = false;
                this.cityDivClass = this.refService.successClass;
            }else if(columnName=="country"){
                this.countryError = false;
                this.countryDivClass = this.refService.successClass;
            }else if(columnName=="zip"){
                this.zipError = false;
                this.zipDivClass = this.refService.successClass;
            }
        }
        
    }
    
    addEmailIdError(){
        this.emailIdError = true;
        this.emailIdDivClass  = this.refService.errorClass;
    }
    
    addPhoneError(){
        this.phoneError = true;
        this.phoneDivClass = this.refService.errorClass;
    }
    
    addCityError(){
        this.cityError = true;
        this.cityDivClass = this.refService.errorClass;
    }
    
    addWebSiteError(){
        this.websiteError = true;
        this.websiteDivClass = this.refService.errorClass;
    }
    
    addGooglePlusError(){
        this.googlePlusLinkError = true;
        this.googlePlusDivClass = this.refService.errorClass;
    }
    
    addFacebookError(){
        this.facebookLinkError = true;
        this.facebookDivClass = this.refService.errorClass;
        
    }
    
    addLinkedInError(){
        this.linkedinLinkError = true;
        this.linkedInDivClass = this.refService.errorClass;
    }
    
    addTwitterError(){
        this.twitterLinkError = true;
        this.twitterDivClass = this.refService.errorClass;
    }
    addCountryError(){
        this.countryError = true;
        this.countryDivClass = this.refService.errorClass;
    }
    
    removePhoneError(){
        this.phoneError = false;
        this.phoneDivClass = this.refService.successClass;
        this.phoneErrorMessage = "";
    }
    removeEmailIdError(){
        this.emailIdError = false;
        this.emailIdDivClass = this.refService.successClass;
        this.emailIdErrorMessage = "";
    }
    
    removeCityError(){
        this.cityError = false;
        this.cityDivClass = this.refService.successClass;
        this.cityErrorMessage = "";
    }
    
    removeWebSiteError(){
        this.websiteError = false;
        this.websiteDivClass = this.refService.successClass;
        this.websiteErrorMessage = "";
    }
    
    removeGooglePlusError(){
        this.googlePlusLinkError = false;
        this.googlePlusDivClass = this.refService.successClass;
        this.googlePlusLinkErrorMessage = "";
    }
    
    removeFacebookError(){
        this.facebookLinkError = false;
        this.facebookDivClass = this.refService.successClass;
        this.facebookLinkErrorMessage = "";
    }
    
    removeLinkedInError(){
        this.linkedinLinkError = false;
        this.linkedInDivClass = this.refService.successClass;
        this.linkedinLinkErrorMessage = "";
    }
    
    removeTwitterError(){
        this.twitterLinkError = false;
        this.twitterDivClass = this.refService.successClass;
        this.twitterLinkErrorMessage = "";
    }
    
    removeCountryError(){
        this.countryError = false;
        this.countryDivClass = this.refService.successClass;
    }
    
    validateEmailId(){
        console.log("validating Email Id");
        if(!this.regularExpressions.EMAIL_ID_PATTERN.test(this.companyProfile.emailId)){
            this.addEmailIdError();
            this.emailIdErrorMessage = "Invalid EmailId";
            console.log("Invalide Emil Id");
        }else{
            this.removeEmailIdError();
        }
    }
    
    validatePhone(){
        if(!this.regularExpressions.PHONE_NUMBER_PATTERN.test(this.companyProfile.phone)){
            this.addPhoneError();
            this.phoneErrorMessage = "Invalid Phone Number"
        }else{
            this.removeEmailIdError();
        }
    }
    
    validateCity(){
        if(!this.regularExpressions.CITY_PATTERN.test(this.companyProfile.city)){
            this.addCityError();
            this.cityErrorMessage = "Invalid City";
        }else{
            this.removeCityError();
        }
    }
    
    validateWebSite(){
        if(!this.regularExpressions.URL_PATTERN.test(this.companyProfile.website)){
            this.addWebSiteError();
            this.websiteErrorMessage = "Invalid Pattern";
        }else{
            this.removeWebSiteError();
        }
        
    }
    
    validateGooglePlus(){
        if(!this.regularExpressions.URL_PATTERN.test(this.companyProfile.googlePlusLink)){
            this.addGooglePlusError();
            this.googlePlusLinkErrorMessage = "Invalid Pattern";
        }else{
            this.removeGooglePlusError();
        }
    }
    
    validateFacebook(){
        if(!this.regularExpressions.URL_PATTERN.test(this.companyProfile.facebookLink)){
            this.addFacebookError();
            this.facebookLinkErrorMessage = "Invalid Pattern";
        }else{
            this.removeFacebookError();
        }
    }
    
    validateTwitter(){
        if(!this.regularExpressions.URL_PATTERN.test(this.companyProfile.twitterLink)){
            this.addTwitterError();
            this.twitterLinkErrorMessage = "Invalid Pattern";
        }else{
            this.removeTwitterError();
        }
    }
    
    validateLinkedIn(){
        if(!this.regularExpressions.URL_PATTERN.test(this.companyProfile.linkedInLink)){
            this.addLinkedInError();
            this.linkedinLinkErrorMessage = "Invalid Pattern";
        }else{
            this.removeLinkedInError();
        }
    }
    
    
    
    validateCountry(){
        if(this.companyProfile.country=="---Please Select Country---"){
            this.addCountryError();
        }else{
            this.removeCountryError();
        }
    }
    
    validatePattern(column:string){
        if(column=="emailId"){
            this.validateEmailId();
        }else if(column=="phone"){
            this.validatePhone();
        }else if(column=="website"){
            this.validateWebSite();
        }else if(column=="facebook"){
            this.validateFacebook();
        }else if(column=="googlePlusLink"){
            this.validateGooglePlus();
        }else if(column=="twitterLink"){
            this.validateTwitter();
        }else if(column=="linkedInLink"){
            this.validateLinkedIn();
        }
        else if(column=="city"){
            this.validateCity();
        }
    }
    
   
    
    changeLogo(inputFile) {
        console.log(inputFile);
    }
    
    changeBackGroundLogo(inputFile){
        console.log(inputFile);
    }
    
    clearLogo() {
        this.companyLogoUploader.queue.length = 0;
        this.companyLogoImageUrlPath = "";
    }
    
    clearBackgroundLogo() {
        this.companyBackGroundLogoUploader.queue.length = 0;
        this.companyBackgroundLogoImageUrlPath = "";
    }
    

}
