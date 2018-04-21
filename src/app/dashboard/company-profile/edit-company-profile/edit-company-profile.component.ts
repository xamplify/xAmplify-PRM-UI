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
import {VideoFileService} from '../../../videos/services/video-file.service';
import { SaveVideoFile } from '../../../videos/models/save-video-file';
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
    
    aboutUsDivClass:string = this.formGroupDefaultClass;
    aboutUsError:boolean = false;
    aboutUsErrorMesssage:string = "";
    
    logoDivClass:string = this.formGroupDefaultClass;
    logoError:boolean = false;
    logoErrorMessage:string = "";
    hasPublicVideo:boolean = false;

    
    existingCompanyName:string = "";
    companyLogoUploader: FileUploader;
    companyLogoImageUrlPath:string = "";
    companyBackGroundLogoUploader:FileUploader;
    companyBackgroundLogoImageUrlPath:string = "";
    backGroundImage:string = "https://i.imgur.com/tgYLuLr.jpg";
    publicVideos: Array<SaveVideoFile>;
    isOnlyPartner:boolean = false;
    isVendorRole:boolean = false;
    constructor( private logger: XtremandLogger, public authenticationService: AuthenticationService, private fb: FormBuilder,
        private companyProfileService: CompanyProfileService, public homeComponent: HomeComponent,
        public refService:ReferenceService,private router:Router,public processor:Processor,public countryNames: CountryNames,
        public regularExpressions: RegularExpressions,public videoFileService:VideoFileService) {
        this.loggedInUserId = this.authenticationService.getUserId();
        this.companyNameDivClass = this.refService.formGroupClass;
        this.companyProfileNameDivClass = this.refService.formGroupClass;
        this.isOnlyPartner = this.authenticationService.isOnlyPartner();
        this.isVendorRole = this.authenticationService.isVendor();
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
                   this.logoError = false;
                   this.logoErrorMessage  = "";
            } else {
                this.companyLogoUploader.queue.length = 0;
                this.companyLogoImageUrlPath =  this.companyProfile.companyLogoPath =JSON.parse(response).path;
                this.logoError = false;
                this.logoErrorMessage  = "";
                this.enableOrDisableButton();
                console.log(this.companyLogoImageUrlPath);
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
                this.backGroundImage = this.authenticationService.MEDIA_URL+this.companyBackgroundLogoImageUrlPath;
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
        this.validateEmptySpace('aboutUs');
        this.validateNames(this.companyProfile.companyName)
        this.validateProfileNames(this.companyProfile.companyProfileName);
        this.validateEmptySpace('aboutUs');
        this.validatePattern('phone');
        this.validatePattern('website');
        this.validatePattern('facebook');
        this.validatePattern('googlePlusLink');
        this.validatePattern('linkedInLink');
        this.validatePattern('twitterLink');
        this.validatePattern('city');
        this.validatePattern('emailId');
        this.validateCompanyLogo();
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
                $('#company-profile-error-div').hide();
                setTimeout(function(){
                    $('#company-profile-error-div').hide();
                    $('#saveOrUpdateCompanyButton').prop('disabled',true);
                    self.authenticationService.user.hasCompany = true;
                    self.authenticationService.isCompanyAdded = true;
                    let module = self.authenticationService.module;
                    if(self.isOnlyPartner){
                        self.router.navigate(["/home/dashboard"]);
                    }else{
                        if(self.isVendorRole){
                            module.isVendor = true;
                        }else{
                            module.isOrgAdmin = true;
                            module.isContact = true;
                            module.isPartner = true;
                            module.isEmailTemplate = true;
                            module.isCampaign = true;
                            module.isStats = true;
                            module.hasVideoRole = true;
                            module.hasSocialStatusRole = true;
                            
                        }
                       
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
                    }
                   
                  }, 3000);
            },
            error => { this.logger.errorPage( error ) },
            () => { this.logger.info( "Completed saveOrUpdate()" ) }
            ); 
        }else{
            $('#company-profile-error-div').show(600);
        }
    }
    
   validateCompanyLogo(){
       if(this.companyLogoImageUrlPath.length>0){
           this.logoError = false;
           this.logoErrorMessage  = "";
           this.logoDivClass = this.refService.successClass;
           this.enableOrDisableButton();
       }else{
           this.logoError = true;
           this.logoErrorMessage  = "Please Upload Logo";
           this.logoDivClass = this.refService.errorClass;
           this.disableButton();
       }
   }
    
   
   /***************************Update******************************/
    update(){
        this.refService.goToTop();
        $('#company-profile-error-div').hide();
        $('#edit-sucess').hide();
        $('#saveOrUpdateCompanyButton').prop('disabled',true);
        this.validateEmptySpace('companyName');
        this.validateNames(this.companyProfile.companyName);
        this.validateEmptySpace('aboutUs');
        this.validatePattern('emailId');
        this.validatePattern('phone');
        this.validatePattern('website');
        this.validatePattern('facebook');
        this.validatePattern('googlePlusLink');
        this.validatePattern('linkedInLink');
        this.validatePattern('twitterLink');
        this.validatePattern('city');
        this.validatePattern('emailId');
        this.validateCompanyLogo();
        let errorLength = $('div.form-group.has-error.has-feedback').length;
        if(!this.companyNameError && !this.companyProfileNameError && !this.emailIdError && !this.tagLineError && !this.phoneError && !this.websiteError
                && !this.facebookLinkError && !this.googlePlusLinkError && !this.twitterLinkError && !this.linkedinLinkError && !this.cityError && !this.countryError &&
                !this.zipError && !this.aboutUsError && !this.logoError){
            this.processor.set(this.processor);
            this.companyProfileService.update(this.companyProfile,this.loggedInUserId)
            .subscribe(
            data => {
                this.message = data.message;
                $('#company-profile-error-div').hide();
                $('#info').hide();
                $('#edit-sucess').show( 600 );
                $('#saveOrUpdateCompanyButton').prop('disabled',false);
                this.processor.remove(this.processor);
                setTimeout( function() { $( "#edit-sucess" ).slideUp( 500 ); }, 5000 );
            },
            error => { this.logger.errorPage( error ) },
            () => { this.logger.info( "Completed saveOrUpdate()" ) }
            ); 
        }else{
            $('#company-profile-error-div').show(600);
        }
       
    }
    
    
    getCompanyProfileByUserId() {
        this.companyProfileService.getByUserId( this.loggedInUserId )
            .subscribe(
            data => {
               if(data.data!=undefined){
                   this.companyProfile = data.data;
                   if($.trim(this.companyProfile.companyLogoPath).length>0){
                       this.companyLogoImageUrlPath = this.companyProfile.companyLogoPath;
                   }
                  if($.trim(this.companyProfile.backgroundLogoPath).length>0){
                     this.backGroundImage = this.authenticationService.MEDIA_URL+this.companyProfile.backgroundLogoPath;
                  }
                  if($.trim(this.companyProfile.country).length==0){
                      this.companyProfile.country = this.countryNames.countries[0];
                  }
                   this.existingCompanyName = data.data.companyName;
                   this.loadPublicVideos();
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
        if($.trim(value).length>0){
            value = $.trim(value).toLowerCase().replace(/\s/g,'');
            if(this.companyNames.indexOf(value)>-1){
                if(this.companyProfile.isAdd){
                  this.setCompanyNameError("Company Name Already Exists");
                }else{
                    if($.trim(this.existingCompanyName).toLowerCase().replace(/\s/g,'')!=value){
                        this.setCompanyNameError("Company Name Already Exists");
                    }else{
                        this.removeCompanyNameError();
                    }
                }
                
            }else{
                this.removeCompanyNameError();
            }
        }else{
            this.companyNameErrorMessage = "";
            this.setCompanyNameError("Please Enter Company Name");
        }
    }
    
    setCompanyNameError(message:string){
       this.disableButton();
        this.companyNameError = true;
        this.companyNameErrorMessage = message;
        this.companyNameDivClass = this.refService.errorClass;
    }
    
    removeCompanyNameError(){
      //  $('#saveOrUpdateCompanyButton').prop('disabled',false);
        this.enableOrDisableButton();
        this.companyNameError = false;
        this.companyNameDivClass = this.refService.successClass;
    }
    
    enableOrDisableButton(){
        $('#saveOrUpdateCompanyButton').prop('disabled',false);
        /*let errorLength = $('div.form-group.has-error.has-feedback').length;
          if(errorLength==0){
            $('#saveOrUpdateCompanyButton').prop('disabled',false);
        }else{
            $('#saveOrUpdateCompanyButton').prop('disabled',true);
        }*/
    }
    
    disableButton(){
        $('#saveOrUpdateCompanyButton').prop('disabled',true);
    }
    
    validateProfileNames(value:any){
        if($.trim(value).length>0){
            let valueWithSpace = $.trim(value).toLowerCase();
            let valueWithOutSpaces = $.trim(value).toLowerCase().replace(/\s/g,'');
            if (/\s/.test(value)) {
                this.setCompanyProfileNameError("Spaces are not allowed");
            }else if(valueWithOutSpaces.length<3){
                this.setCompanyProfileNameError("Minimum 3 letters required");
            }
            else if(this.companyProfileNames.indexOf(valueWithOutSpaces)>-1){
                this.setCompanyProfileNameError("Company Profile Name Already Exists");
            }else{
             //   $('#saveOrUpdateCompanyButton').prop('disabled',false);
                this.enableOrDisableButton();
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
           }else if(columnName=="aboutUs"){
               this.aboutUsError = true;
               this.aboutUsDivClass = this.refService.errorClass;
           }
        }else if(value.length>0){
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
            }else if(columnName=="aboutUs"){
                this.aboutUsError = false;
                this.aboutUsDivClass = this.refService.successClass;
            }
            this.enableOrDisableButton();
        }
       
        
    }
    
    addEmailIdError(){
        this.emailIdError = true;
        this.emailIdDivClass  = this.refService.errorClass;
        this.disableButton();
    }
    
    addPhoneError(){
        this.phoneError = true;
        this.phoneDivClass = this.refService.errorClass;
        this.disableButton();
    }
    
    addCityError(){
        this.cityError = true;
        this.cityDivClass = this.refService.errorClass;
        this.disableButton();
    }
    
    addWebSiteError(){
        this.websiteError = true;
        this.websiteDivClass = this.refService.errorClass;
        this.disableButton();
    }
    
    addGooglePlusError(){
        this.googlePlusLinkError = true;
        this.googlePlusDivClass = this.refService.errorClass;
        this.disableButton();
    }
    
    addFacebookError(){
        this.facebookLinkError = true;
        this.facebookDivClass = this.refService.errorClass;
        this.disableButton();
        
    }
    
    addLinkedInError(){
        this.linkedinLinkError = true;
        this.linkedInDivClass = this.refService.errorClass;
        this.disableButton();
    }
    
    addTwitterError(){
        this.twitterLinkError = true;
        this.twitterDivClass = this.refService.errorClass;
        this.disableButton();
    }
    addCountryError(){
        this.countryError = true;
        this.countryDivClass = this.refService.errorClass;
        this.disableButton();
    }
    
    removeEmailIdError(){
        this.emailIdError = false;
        this.emailIdDivClass = this.refService.successClass;
        this.emailIdErrorMessage = "";
        this.enableOrDisableButton();
    }
    
    removePhoneError(){
        this.phoneError = false;
        this.phoneDivClass = this.refService.successClass;
        this.phoneErrorMessage = "";
        this.enableOrDisableButton();
    }
   
    
    removeCityError(){
        this.cityError = false;
        this.cityDivClass = this.refService.successClass;
        this.cityErrorMessage = "";
        this.enableOrDisableButton();
    }
    
    removeWebSiteError(){
        this.websiteError = false;
        this.websiteDivClass = this.refService.successClass;
        this.websiteErrorMessage = "";
        this.enableOrDisableButton();
    }
    
    removeGooglePlusError(){
        this.googlePlusLinkError = false;
        this.googlePlusDivClass = this.refService.successClass;
        this.googlePlusLinkErrorMessage = "";
        this.enableOrDisableButton();
    }
    
    removeFacebookError(){
        this.facebookLinkError = false;
        this.facebookDivClass = this.refService.successClass;
        this.facebookLinkErrorMessage = "";
        this.enableOrDisableButton();
    }
    
    removeLinkedInError(){
        this.linkedinLinkError = false;
        this.linkedInDivClass = this.refService.successClass;
        this.linkedinLinkErrorMessage = "";
        this.enableOrDisableButton();
    }
    
    removeTwitterError(){
        this.twitterLinkError = false;
        this.twitterDivClass = this.refService.successClass;
        this.twitterLinkErrorMessage = "";
        this.enableOrDisableButton();
    }
    
    removeCountryError(){
        this.countryError = false;
        this.countryDivClass = this.refService.successClass;
        this.enableOrDisableButton();
    }
    
    validateEmailId(){
        if($.trim(this.companyProfile.emailId).length>0){
            if(!this.regularExpressions.EMAIL_ID_PATTERN.test(this.companyProfile.emailId)){
                this.addEmailIdError();
                this.emailIdErrorMessage = "Invalid EmailId";
            }else{
                this.removeEmailIdError();
            }
        }else{
            this.removeEmailIdError();
        }
    }
    
    validatePhone(){
        if($.trim(this.companyProfile.phone).length>0){
            if(!this.regularExpressions.PHONE_NUMBER_PATTERN.test(this.companyProfile.phone)){
                this.addPhoneError();
                this.phoneErrorMessage = "Invalid Contact Number"
            }else{
                this.removePhoneError();
            }
        }else{
            this.removePhoneError();
        }
       
    }
    
    validateCity(){
        if($.trim(this.companyProfile.city).length>0){
            if(!this.regularExpressions.CITY_PATTERN.test(this.companyProfile.city)){
                this.addCityError();
                this.cityErrorMessage = "Invalid City";
            }else{
                this.removeCityError();
            }
        }else{
            this.removeCityError();
        }
    }
    
    validateWebSite(){
        if($.trim(this.companyProfile.website).length>0){
            if(!this.regularExpressions.URL_PATTERN.test(this.companyProfile.website)){
                this.addWebSiteError();
                this.websiteErrorMessage = "Invalid WebSite Url";
            }else{
                this.removeWebSiteError();
            }
        }else{
            this.removeWebSiteError();
        }
    }
    
    validateGooglePlus(){
        
        if($.trim(this.companyProfile.googlePlusLink).length>0){
            if(!this.regularExpressions.URL_PATTERN.test(this.companyProfile.googlePlusLink)){
                this.addGooglePlusError();
                this.googlePlusLinkErrorMessage = "Invalid Google Plus Url";
            }else{
                this.removeGooglePlusError();
            }
        }else{
            this.removeGooglePlusError();
        }
       
    }
    
    validateFacebook(){
        if($.trim(this.companyProfile.facebookLink).length>0){
            if(!this.regularExpressions.URL_PATTERN.test(this.companyProfile.facebookLink)){
                this.addFacebookError();
                this.facebookLinkErrorMessage = "Invalid Facebook Url";
            }else{
                this.removeFacebookError();
            }
        }else{
            this.removeFacebookError();
        }
    }
    
    validateTwitter(){
        if($.trim(this.companyProfile.twitterLink).length>0){
            if(!this.regularExpressions.URL_PATTERN.test(this.companyProfile.twitterLink)){
                this.addTwitterError();
                this.twitterLinkErrorMessage = "Invalid Twiiter Url";
            }else{
                this.removeTwitterError();
            }
        }else{
            this.removeTwitterError();
        }
        
    }
    
    validateLinkedIn(){
        if($.trim(this.companyProfile.linkedInLink).length>0){
            if(!this.regularExpressions.URL_PATTERN.test(this.companyProfile.linkedInLink)){
                this.addLinkedInError();
                this.linkedinLinkErrorMessage = "Invalid LinkedIn Url";
            }else{
                this.removeLinkedInError();
            }
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
    
    loadPublicVideos(){
        this.videoFileService.loadPublicVideos(this.companyProfile.id)
            .subscribe(
            data => {
              this.publicVideos = data;
            },
            error => { this.logger.errorPage( error ) },
            () => { this.logger.info( "Completed getCompanyProfileByUserId()" ) }
            );

    
    }
    
   

}
