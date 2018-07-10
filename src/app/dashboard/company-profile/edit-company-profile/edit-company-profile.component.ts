import { Component, OnInit } from '@angular/core';
import { FormBuilder } from "@angular/forms";
import { Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';

import { Processor } from '../../../core/models/processor';
import { HomeComponent } from '../../../core/home/home.component';
import { CountryNames } from '../../../common/models/country-names';

import { AuthenticationService } from '../../../core/services/authentication.service';
import { XtremandLogger } from '../../../error-pages/xtremand-logger.service';
import { RegularExpressions } from '../../../common/models/regular-expressions';
import { VideoFileService } from '../../../videos/services/video-file.service';
import { CompanyProfileService } from '../services/company-profile.service';
import { UserService } from '../../../core/services/user.service';
import { VideoUtilService } from '../../../videos/services/video-util.service';
import { ReferenceService } from '../../../core/services/reference.service';

import { CompanyProfile } from '../models/company-profile';
import { CustomResponse } from '../../../common/models/custom-response';
import { SaveVideoFile } from '../../../videos/models/save-video-file';

declare var $: any;

@Component({
    selector: 'app-edit-company-profile',
    templateUrl: './edit-company-profile.component.html',
    styleUrls: ['./edit-company-profile.component.css', '../../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                '../../../../assets/css/phone-number-plugin.css'],
    providers: [Processor, CountryNames, RegularExpressions]
})
export class EditCompanyProfileComponent implements OnInit {
    customResponse: CustomResponse = new CustomResponse();
    isLoading = false;
    loaderHeight = "";
    loggedInUserId = 0;
    companyProfile: CompanyProfile = new CompanyProfile();
    message = "";
    companyNames: string[] = [];
    companyProfileNames: string[] = [];
    isProcessing = false;
    formGroupDefaultClass = "form-group";
    companyProfileNameDivClass: string = this.formGroupDefaultClass;
    companyProfileNameError = false;
    companyProfileNameErrorMessage = "";

    companyNameDivClass: string = this.formGroupDefaultClass;
    companyNameError = false;
    companyNameErrorMessage = "";

    emailIdDivClass: string = this.formGroupDefaultClass;
    emailIdError = false;
    emailIdErrorMessage = "";

    tagLineDivClass: string = this.formGroupDefaultClass;
    tagLineError = false;
    tagLineErrorMessage = "";

    phoneDivClass: string = this.formGroupDefaultClass;
    phoneError = false;
    phoneErrorMessage = "";

    websiteDivClass: string = this.formGroupDefaultClass;
    websiteError = false;
    websiteErrorMessage = "";

    facebookDivClass: string = this.formGroupDefaultClass;
    facebookLinkError = false;
    facebookLinkErrorMessage = "";

    googlePlusDivClass: string = this.formGroupDefaultClass;
    googlePlusLinkError = false;
    googlePlusLinkErrorMessage = "";

    linkedInDivClass: string = this.formGroupDefaultClass;
    linkedinLinkError = false;
    linkedinLinkErrorMessage = "";


    twitterDivClass: string = this.formGroupDefaultClass;
    twitterLinkError = false;
    twitterLinkErrorMessage = "";

    cityDivClass: string = this.formGroupDefaultClass;
    cityError = false;
    cityErrorMessage = "";

    stateDivClass: string = this.formGroupDefaultClass;
    stateError = false;
    stateErrorMessage = "";

    countryDivClass: string = this.formGroupDefaultClass;
    countryError = false;
    countryErrorMessage = false;


    zipDivClass: string = this.formGroupDefaultClass;
    zipError = false;
    zipErrorMessage = "";

    aboutUsDivClass: string = this.formGroupDefaultClass;
    aboutUsError = false;
    aboutUsErrorMessage = "";

    logoDivClass: string = this.formGroupDefaultClass;
    logoError = false;
    logoErrorMessage = "";
    hasPublicVideo = false;


    existingCompanyName = "";
    companyLogoUploader: FileUploader;
    companyLogoImageUrlPath = "";
    companyBackGroundLogoUploader: FileUploader;
    companyBackgroundLogoImageUrlPath = "";
    backGroundImage = "https://i.imgur.com/tgYLuLr.jpg";
    publicVideos: Array<SaveVideoFile>;
    isOnlyPartner = false;
    isVendorRole = false;
    ngxloading = false;
    maxFileSize:number = 10;
    profileCompleted = 50;
    constructor(private logger: XtremandLogger, public authenticationService: AuthenticationService, private fb: FormBuilder,
        private companyProfileService: CompanyProfileService, public homeComponent: HomeComponent,
        public refService: ReferenceService, private router: Router, public processor: Processor, public countryNames: CountryNames,
        public regularExpressions: RegularExpressions, public videoFileService: VideoFileService, public videoUtilService: VideoUtilService,
        public userService: UserService) {
        this.loggedInUserId = this.authenticationService.getUserId();
        this.companyNameDivClass = this.refService.formGroupClass;
        this.companyProfileNameDivClass = this.refService.formGroupClass;
        this.isOnlyPartner = this.authenticationService.isOnlyPartner();
        this.isVendorRole = this.authenticationService.isVendor();
        this.companyLogoUploader = new FileUploader({
            allowedMimeType: ['image/jpeg', 'image/pjpeg', 'image/jpg', 'image/png'],
            maxFileSize: this.maxFileSize * 1024 * 1024, // 10 MB
            url: this.authenticationService.REST_URL + "admin/company-profile/upload-logo?userId=" + this.loggedInUserId + "&access_token=" + this.authenticationService.access_token
        });
        this.companyLogoUploader.onAfterAddingFile = (fileItem) => {
            console.log(fileItem);
            this.isLoading = true;
            fileItem.withCredentials = false;
            this.companyLogoUploader.queue[0].upload();
        };
        this.companyLogoUploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
            console.log(response);
            console.log(this.companyLogoUploader.queue[0]);
            if (JSON.parse(response).message === null) {
                this.companyLogoUploader.queue[0].upload();
                this.logoError = false;
                this.logoErrorMessage = "";
            } else {
                this.companyLogoUploader.queue.length = 0;
                this.companyLogoImageUrlPath = this.companyProfile.companyLogoPath = JSON.parse(response).path;
                this.logoError = false;
                this.logoErrorMessage = "";
                this.enableOrDisableButton();
                console.log(this.companyLogoImageUrlPath);
            }
            this.isLoading = false;
        }

        this.companyBackGroundLogoUploader = new FileUploader({
            allowedMimeType: ['image/jpeg', 'image/pjpeg', 'image/jpeg', 'image/pjpeg', 'image/png'],
            maxFileSize: 10 * 1024 * 1024, // 100 MB
            url: this.authenticationService.REST_URL + "admin/company-profile/upload-background-image?userId=" + this.loggedInUserId + "&access_token=" + this.authenticationService.access_token
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
                this.companyBackgroundLogoImageUrlPath = this.companyProfile.backgroundLogoPath = JSON.parse(response).path;
                this.backGroundImage = this.authenticationService.MEDIA_URL + this.companyBackgroundLogoImageUrlPath;
            }
        }

    }
    errorHandler(event){ event.target.src ='assets/images/company-profile-logo.png'; }
    saveVideoBrandLog() {
        const logoLink = this.videoUtilService.isStartsWith(this.companyProfile.website);
        this.userService.saveBrandLogo(this.companyProfile.companyLogoPath, logoLink, this.loggedInUserId)
            .subscribe(
                (data: any) => {
                    console.log(data);
                    if (data !== undefined) { console.log('logo updated successfully');
                    } else { this.ngxloading = false; }
                },
                (error) => { this.ngxloading = false; });
    }

    geoLocation(){
        this.videoFileService.getJSONLocation()
        .subscribe(
        (data: any) => {
            if ( this.companyProfile.country == undefined || this.companyProfile.country == "" || this.companyProfile.country =="Select Country" ) {
                this.companyProfile.country = data.country;
            }
            if ( this.companyProfile.phone == undefined || this.companyProfile.phone == "" && !this.companyProfile.phone) {
                for ( let i = 0; i < this.countryNames.countriesMobileCodes.length; i++ ) {
                    if ( data.countryCode == this.countryNames.countriesMobileCodes[i].code ) {
                        this.companyProfile.phone = this.countryNames.countriesMobileCodes[i].dial_code;
                        break;
                    }
                }
            }

        } )
    }


    ngOnInit() {
        this.geoLocation();
        this.getCompanyProfileByUserId();
        if (this.authenticationService.user.hasCompany) {
            this.companyProfile.isAdd = false;
            this.profileCompleted = 100;
        } /*else {
            this.companyProfile.country = this.countryNames.countries[0];
        }*/
        this.getAllCompanyNames();
        this.getAllCompanyProfileNames();
    }

    save() {
        this.ngxloading = true;
        this.refService.goToTop();
        $('#saveOrUpdateCompanyButton').prop('disabled', true);
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
        this.validatePattern('state');
        this.validatePattern('emailId');
        this.validateCompanyLogo();
        if (!this.companyNameError && !this.companyProfileNameError && !this.emailIdError && !this.tagLineError && !this.phoneError && !this.websiteError
            && !this.facebookLinkError && !this.googlePlusLinkError && !this.twitterLinkError && !this.linkedinLinkError && !this.cityError && !this.stateError && !this.countryError &&
            !this.zipError && !this.logoError) {
            this.processor.set(this.processor);

            if( this.companyProfile.phone.length < 6){
                this.companyProfile.phone = "";
            }

            this.companyProfileService.save(this.companyProfile, this.loggedInUserId)
                .subscribe(
                    data => {
                        this.message = data.message;
                        if(this.message==='Company Profile Info Added Successfully') {
                          this.message = 'Company Profile saved successfully';
                        }
                        $('#info').hide();
                        $('#edit-sucess').show(600);
                        let self = this;
                        $('#company-profile-error-div').hide();
                        setTimeout(function () {
                            $('#company-profile-error-div').hide();
                            $('#saveOrUpdateCompanyButton').prop('disabled', true);
                            self.authenticationService.user.hasCompany = true;
                            self.authenticationService.user.websiteUrl = self.companyProfile.website;
                            self.authenticationService.isCompanyAdded = true;
                            let module = self.authenticationService.module;
                            if (self.isOnlyPartner) {
                                self.router.navigate(["/home/dashboard"]);
                            } else {
                                if (self.isVendorRole) {
                                    module.isVendor = true;
                                } else {
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
                                self.saveVideoBrandLog();
                                const currentUser = localStorage.getItem('currentUser');
                                const userToken = {
                                    'userName': JSON.parse(currentUser)['userName'],
                                    'userId': JSON.parse(currentUser)['userId'],
                                    'accessToken': JSON.parse(currentUser)['accessToken'],
                                    'refreshToken': JSON.parse(currentUser)['refreshToken'],
                                    'expiresIn': JSON.parse(currentUser)['expiresIn'],
                                    'hasCompany': self.authenticationService.user.hasCompany,
                                    'roles': JSON.parse(currentUser)['roles']
                                };
                                localStorage.setItem('currentUser', JSON.stringify(userToken));
                                self.homeComponent.getVideoDefaultSettings();
                            }

                        }, 3000);
                    },
                    error => { this.ngxloading = false;
                          this.logger.errorPage(error) },
                    () => {
                        this.saveVideoBrandLog();
                        this.logger.info("Completed saveOrUpdate()") }
                );
        } else {
            this.ngxloading = false;
            $('#company-profile-error-div').show(600);
        }
    }

    validateCompanyLogo() {
        if (this.companyLogoImageUrlPath.length > 0) {
            this.logoError = false;
            this.logoErrorMessage = "";
            this.logoDivClass = this.refService.successClass;
            this.enableOrDisableButton();
        } else {
            this.logoError = true;
            this.logoErrorMessage = "";
            this.logoDivClass = this.refService.errorClass;
            this.disableButton();
        }
    }

    /***************************Update******************************/
    update() {
        this.ngxloading = true;
        this.refService.goToTop();
        $('#company-profile-error-div').hide();
        $('#edit-sucess').hide();
        $('#saveOrUpdateCompanyButton').prop('disabled', true);
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
        this.validatePattern('state');
        this.validatePattern('emailId');
        this.validateCompanyLogo();
        let errorLength = $('div.form-group.has-error.has-feedback').length;
        if (!this.companyNameError && !this.companyProfileNameError && !this.emailIdError && !this.tagLineError && !this.phoneError && !this.websiteError
            && !this.facebookLinkError && !this.googlePlusLinkError && !this.twitterLinkError && !this.linkedinLinkError && !this.cityError && !this.stateError && !this.countryError &&
            !this.zipError && !this.aboutUsError && !this.logoError) {
            this.processor.set(this.processor);

            if ( this.companyProfile.phone ) {
                if ( this.companyProfile.phone.length < 6 ) {
                    this.companyProfile.phone = "";
                }
             }

            this.companyProfileService.update(this.companyProfile, this.loggedInUserId)
                .subscribe(
                    data => {
                        this.message = data.message;
                        if(this.message ==='Company Profile Info Updated Successfully'){
                          this.message = 'Company Profile updated successfully'
                        }
                        $('#company-profile-error-div').hide();
                        $('#info').hide();
                        $('#edit-sucess').show(600);
                        $('#saveOrUpdateCompanyButton').prop('disabled', false);
                        this.processor.remove(this.processor);
                        this.authenticationService.user.websiteUrl = this.companyProfile.website;
                        setTimeout(function () { $("#edit-sucess").slideUp(500); }, 5000);
                        this.saveVideoBrandLog();
                    },
                    error => { this.ngxloading = false;
                        this.logger.errorPage(error) },
                    () => { this.logger.info("Completed saveOrUpdate()") }
                );
        } else {
            this.ngxloading = false;
            $('#company-profile-error-div').show(600);
        }
    }

    getCompanyProfileByUserId() {
        this.companyProfileService.getByUserId(this.loggedInUserId)
            .subscribe(
                data => {
                    if (data.data != undefined) {
                        this.companyProfile = data.data;
                        if ($.trim(this.companyProfile.companyLogoPath).length > 0) {
                            this.companyLogoImageUrlPath = this.companyProfile.companyLogoPath;
                        }
                        if ($.trim(this.companyProfile.backgroundLogoPath).length > 0) {
                            this.backGroundImage = this.authenticationService.MEDIA_URL + this.companyProfile.backgroundLogoPath;
                        }
                        if ($.trim(this.companyProfile.country).length == 0) {
                            this.companyProfile.country = this.countryNames.countries[0];
                        }
                        this.geoLocation();
                        this.existingCompanyName = data.data.companyName;
                        this.loadPublicVideos();
                    }
                },
                error => { this.logger.errorPage(error) },
                () => { this.logger.info("Completed getCompanyProfileByUserId()") }
            );
    }

    getAllCompanyNames() {
        this.companyProfileService.getAllCompanyNames()
            .subscribe(
                response => {
                    this.companyNames = response.data;
                },
                error => { this.logger.errorPage(error) },
                () => { this.logger.info("Completed getAllCompanyNames()") }
            );
    }

    getAllCompanyProfileNames() {
        this.companyProfileService.getAllCompanyProfileNames()
            .subscribe(
                response => {
                    this.companyProfileNames = response.data;
                },
                error => { this.logger.errorPage(error) },
                () => { this.logger.info("Completed getAllCompanyProfileNames()") }
            );
    }

    validateNames(value: any) {
        if ($.trim(value).length > 0) {
            value = $.trim(value).toLowerCase().replace(/\s/g, '');
            if (this.companyNames.indexOf(value) > -1) {
                if (this.companyProfile.isAdd) {
                    this.setCompanyNameError("Company Name Already Exists");
                } else {
                    if ($.trim(this.existingCompanyName).toLowerCase().replace(/\s/g, '') != value) {
                        this.setCompanyNameError("Company Name Already Exists");
                    } else {
                        this.removeCompanyNameError();
                    }
                }
            } else {
                this.removeCompanyNameError();
            }
        } else {
            this.companyNameErrorMessage = "";
            this.setCompanyNameError("Please Enter Company Name");
        }
    }

    setCompanyNameError(message: string) {
        this.disableButton();
        this.companyNameError = true;
        this.companyNameErrorMessage = message;
        this.companyNameDivClass = this.refService.errorClass;
    }

    removeCompanyNameError() {
        //  $('#saveOrUpdateCompanyButton').prop('disabled',false);
        this.enableOrDisableButton();
        this.companyNameError = false;
        this.companyNameDivClass = this.refService.successClass;
    }

    enableOrDisableButton() {
        $('#saveOrUpdateCompanyButton').prop('disabled', false);
        /*let errorLength = $('div.form-group.has-error.has-feedback').length;
          if(errorLength==0){
            $('#saveOrUpdateCompanyButton').prop('disabled',false);
        }else{
            $('#saveOrUpdateCompanyButton').prop('disabled',true);
        }*/
    }

    disableButton() {
        $('#saveOrUpdateCompanyButton').prop('disabled', true);
    }

    validateProfileNames(value: any) {
        if ($.trim(value).length > 0) {
            let valueWithSpace = $.trim(value).toLowerCase();
            let valueWithOutSpaces = $.trim(value).toLowerCase().replace(/\s/g, '');
            if (/\s/.test(value)) {
                this.setCompanyProfileNameError("Spaces are not allowed");
            } else if (valueWithOutSpaces.length < 3) {
                this.setCompanyProfileNameError("Minimum 3 letters required");
            }
            else if (this.companyProfileNames.indexOf(valueWithOutSpaces) > -1) {
                this.setCompanyProfileNameError("Company Profile Name Already Exists");
            } else {
                //   $('#saveOrUpdateCompanyButton').prop('disabled',false);
                this.enableOrDisableButton();
                this.companyProfileNameError = false;
                this.companyProfileNameDivClass = this.refService.successClass;
            }
        } else {
            this.setCompanyProfileNameError("Please Enter Company Profile Name");

        }

    }
    setCompanyProfileNameError(errorMessage: string) {
        $('#saveOrUpdateCompanyButton').prop('disabled', true);
        this.companyProfileNameError = true;
        this.companyProfileNameErrorMessage = errorMessage;
        this.companyProfileNameDivClass = this.refService.errorClass;
    }

    validateEmptySpace(columnName: string) {
        let value = $.trim($('#' + columnName).val());
        if (value.length == 0) {
            $('#saveOrUpdateCompanyButton').prop('disabled', true);
            if (columnName == "companyName") {
                this.companyNameError = true;
                this.companyNameDivClass = this.refService.errorClass;
            } else if (columnName == "companyProfileName") {
                this.companyProfileNameError = true;
                this.companyProfileNameDivClass = this.refService.errorClass;
            } else if (columnName == "emailId") {
                this.emailIdError = true;
                this.emailIdDivClass = this.refService.errorClass;
            } else if (columnName == "tagLine") {
                this.tagLineError = true;
                this.tagLineDivClass = this.refService.errorClass;
            } else if (columnName == "phone") {
                this.phoneError = true;
                this.phoneDivClass = this.refService.errorClass;
            } else if (columnName == "website") {
                this.websiteError = true;
                this.websiteDivClass = this.refService.errorClass;
            } else if (columnName == "facebook") {
                this.facebookLinkError = true;
                this.facebookDivClass = this.refService.errorClass;
            } else if (columnName == "googlePlusLink") {
                this.googlePlusLinkError = true;
                this.googlePlusDivClass = this.refService.errorClass;
            } else if (columnName == "linkedInLink") {
                this.linkedinLinkError = true;
                this.linkedInDivClass = this.refService.errorClass;
            } else if (columnName == "twitter") {
                this.twitterLinkError = true;
                this.twitterDivClass = this.refService.errorClass;
            } else if (columnName == "city") {
                this.cityError = true;
                this.cityDivClass = this.refService.errorClass;
            } else if (columnName == "country") {
                this.countryError = true;
                this.countryDivClass = this.refService.errorClass;
            } else if (columnName == "zip") {
                this.zipError = true;
                this.zipDivClass = this.refService.errorClass;
            } else if (columnName == "aboutUs") {
                this.aboutUsError = true;
                this.aboutUsDivClass = this.refService.errorClass;
            }
        } else if (value.length > 0) {
            if (columnName == "companyName") {
                this.companyNameError = false;
                this.companyNameDivClass = this.refService.successClass;
            } else if (columnName == "companyProfileName") {
                this.companyProfileNameError = false;
                this.companyProfileNameDivClass = this.refService.successClass;
            } else if (columnName == "emailId") {
                this.validatePattern("emailId");
            } else if (columnName == "tagLine") {
                this.tagLineError = false;
                this.tagLineDivClass = this.refService.successClass;
            } else if (columnName == "phone") {
                this.phoneError = false;
                this.phoneDivClass = this.refService.successClass;
            } else if (columnName == "website") {
                this.websiteError = false;
                this.websiteDivClass = this.refService.successClass;
            } else if (columnName == "facebook") {
                this.facebookLinkError = false;
                this.facebookDivClass = this.refService.successClass;
            } else if (columnName == "googlePlusLink") {
                this.googlePlusLinkError = false;
                this.googlePlusDivClass = this.refService.successClass;
            } else if (columnName == "linkedInLink") {
                this.linkedinLinkError = false;
                this.linkedInDivClass = this.refService.successClass;
            } else if (columnName == "twitter") {
                this.twitterLinkError = false;
                this.twitterDivClass = this.refService.successClass;
            } else if (columnName == "city") {
                this.cityError = false;
                this.cityDivClass = this.refService.successClass;
            } else if (columnName == "country") {
                this.countryError = false;
                this.countryDivClass = this.refService.successClass;
            } else if (columnName == "zip") {
                this.zipError = false;
                this.zipDivClass = this.refService.successClass;
            } else if (columnName == "aboutUs") {
                this.aboutUsError = false;
                this.aboutUsDivClass = this.refService.successClass;
            }
            this.enableOrDisableButton();
        }
    }

    addEmailIdError() {
        this.emailIdError = true;
        this.emailIdDivClass = this.refService.errorClass;
        this.disableButton();
    }

    addPhoneError() {
        this.phoneError = true;
        this.phoneErrorMessage = "Phone number is mandatory";
        this.phoneDivClass = this.refService.errorClass;
        this.disableButton();
    }

    addCityError() {
        this.cityError = true;
        this.cityDivClass = this.refService.errorClass;
        this.disableButton();
    }

    addStateError() {
        this.stateError = true;
        this.stateDivClass = this.refService.errorClass;
        this.disableButton();
    }

    addWebSiteError() {
        this.websiteError = true;
        this.websiteDivClass = this.refService.errorClass;
        this.disableButton();
    }

    addGooglePlusError() {
        this.googlePlusLinkError = true;
        this.googlePlusDivClass = this.refService.errorClass;
        this.disableButton();
    }

    addFacebookError() {
        this.facebookLinkError = true;
        this.facebookDivClass = this.refService.errorClass;
        this.disableButton();

    }

    addLinkedInError() {
        this.linkedinLinkError = true;
        this.linkedInDivClass = this.refService.errorClass;
        this.disableButton();
    }

    addTwitterError() {
        this.twitterLinkError = true;
        this.twitterDivClass = this.refService.errorClass;
        this.disableButton();
    }
    addCountryError() {
        this.countryError = true;
        this.countryDivClass = this.refService.errorClass;
        this.disableButton();
    }

    removeEmailIdError() {
        this.emailIdError = false;
        this.emailIdDivClass = this.refService.successClass;
        this.emailIdErrorMessage = "";
        this.enableOrDisableButton();
    }

    removePhoneError() {
        this.phoneError = false;
        this.phoneDivClass = this.refService.successClass;
        this.phoneErrorMessage = "";
        this.enableOrDisableButton();
    }

    removeCityError() {
        this.cityError = false;
        this.cityDivClass = this.refService.successClass;
        this.cityErrorMessage = "";
        this.enableOrDisableButton();
    }

    removeStateError() {
        this.stateError = false;
        this.stateDivClass = this.refService.successClass;
        this.stateErrorMessage = "";
        this.enableOrDisableButton();
    }

    removeWebSiteError() {
        this.websiteError = false;
        this.websiteDivClass = this.refService.successClass;
        this.websiteErrorMessage = "";
        this.enableOrDisableButton();
    }

    removeGooglePlusError() {
        this.googlePlusLinkError = false;
        this.googlePlusDivClass = this.refService.successClass;
        this.googlePlusLinkErrorMessage = "";
        this.enableOrDisableButton();
    }

    removeFacebookError() {
        this.facebookLinkError = false;
        this.facebookDivClass = this.refService.successClass;
        this.facebookLinkErrorMessage = "";
        this.enableOrDisableButton();
    }

    removeLinkedInError() {
        this.linkedinLinkError = false;
        this.linkedInDivClass = this.refService.successClass;
        this.linkedinLinkErrorMessage = "";
        this.enableOrDisableButton();
    }

    removeTwitterError() {
        this.twitterLinkError = false;
        this.twitterDivClass = this.refService.successClass;
        this.twitterLinkErrorMessage = "";
        this.enableOrDisableButton();
    }

    removeCountryError() {
        this.countryError = false;
        this.countryDivClass = this.refService.successClass;
        this.enableOrDisableButton();
    }

    validateEmailId() {
        if ($.trim(this.companyProfile.emailId).length > 0) {
            if (!this.regularExpressions.EMAIL_ID_PATTERN.test(this.companyProfile.emailId)) {
                this.addEmailIdError();
                this.emailIdErrorMessage = "Invalid EmailId";
            } else {
                this.removeEmailIdError();
            }
        } else {
            this.removeEmailIdError();
        }
    }

    validatePhone() {
        if (this.companyProfile.phone) {
            if (!this.regularExpressions.PHONE_NUMBER_PATTERN.test(this.companyProfile.phone)) {
                this.addPhoneError();
                this.phoneErrorMessage = "Invalid Contact Number"
            } else {
                this.removePhoneError();
            }
        } else {
            this.addPhoneError();
        }
    }

    validateCity() {
        if ($.trim(this.companyProfile.city).length > 0) {
            if (!this.regularExpressions.CITY_PATTERN.test(this.companyProfile.city)) {
                this.addCityError();
                this.cityErrorMessage = "Invalid City";
            } else {
                this.removeCityError();
            }
        } else {
            this.removeCityError();
        }
    }

    validateState() {
        if ($.trim(this.companyProfile.state).length > 0) {
            if (!this.regularExpressions.CITY_PATTERN.test(this.companyProfile.state)) {
                this.addStateError();
                this.stateErrorMessage = "Invalid State";
            } else {
                this.removeStateError();
            }
        } else {
            this.removeStateError();
        }
    }

    validateWebSite() {
        if ($.trim(this.companyProfile.website).length > 0) {
            if (!this.regularExpressions.URL_PATTERN.test(this.companyProfile.website)) {
                this.addWebSiteError();
                this.websiteErrorMessage = "Invalid WebSite Url";
            } else {
                this.removeWebSiteError();
            }
        } else {
            this.websiteError = true;
            this.websiteErrorMessage = 'Please add your company’s URL';
        }
    }

    validateGooglePlus() {

        if ($.trim(this.companyProfile.googlePlusLink).length > 0) {
            if (!this.regularExpressions.URL_PATTERN.test(this.companyProfile.googlePlusLink)) {
                this.addGooglePlusError();
                this.googlePlusLinkErrorMessage = "Invalid Google Plus Url";
            } else {
                this.removeGooglePlusError();
            }
        } else {
            this.removeGooglePlusError();
        }

    }

    validateFacebook() {
        if ($.trim(this.companyProfile.facebookLink).length > 0) {
            if (!this.regularExpressions.URL_PATTERN.test(this.companyProfile.facebookLink)) {
                this.addFacebookError();
                this.facebookLinkErrorMessage = "Invalid Facebook Url";
            } else {
                this.removeFacebookError();
            }
        } else {
            this.removeFacebookError();
        }
    }

    validateTwitter() {
        if ($.trim(this.companyProfile.twitterLink).length > 0) {
            if (!this.regularExpressions.URL_PATTERN.test(this.companyProfile.twitterLink)) {
                this.addTwitterError();
                this.twitterLinkErrorMessage = "Invalid Twiiter Url";
            } else {
                this.removeTwitterError();
            }
        } else {
            this.removeTwitterError();
        }
    }

    validateLinkedIn() {
        if ($.trim(this.companyProfile.linkedInLink).length > 0) {
            if (!this.regularExpressions.URL_PATTERN.test(this.companyProfile.linkedInLink)) {
                this.addLinkedInError();
                this.linkedinLinkErrorMessage = "Invalid LinkedIn Url";
            } else {
                this.removeLinkedInError();
            }
        } else {
            this.removeLinkedInError();
        }
    }

    validateCountry() {
        if (this.companyProfile.country == "---Please Select Country---") {
            this.addCountryError();
        } else {
            this.removeCountryError();
        }
    }

    validatePattern(column: string) {
        if (column == "emailId") {
            this.validateEmailId();
        } else if (column == "phone") {
            this.validatePhone();
        } else if (column == "website") {
            this.validateWebSite();
        } else if (column == "facebook") {
            this.validateFacebook();
        } else if (column == "googlePlusLink") {
            this.validateGooglePlus();
        } else if (column == "twitterLink") {
            this.validateTwitter();
        } else if (column == "linkedInLink") {
            this.validateLinkedIn();
        }
        else if (column == "city") {
            this.validateCity();
        }
        else if (column == "state") {
            this.validateState();
        }
    }

    changeLogo(event: any) {
          this.customResponse.isVisible = false;
            let fileList: any;
            if (event.target != undefined) {
                fileList = event.target.files[0];
            } else {
                fileList = event[0];
            }
        if (fileList!=undefined) {
            let maxSize = this.maxFileSize*1024*1024;//10 Mb
            let  size = fileList.size;
            let ext = fileList.name.split('.').pop().toLowerCase();
            let  extentionsArray = ['jpeg','pjpeg', 'png','jpg'];
            if ($.inArray(ext, extentionsArray) == -1) {
                this.refService.goToTop();
                this.customResponse = new CustomResponse('ERROR',"Please upload image files only", true );
            }else{
                let fileSize = (size/ 1024 / 1024); //size in MB
                if (size > maxSize) {
                    this.refService.goToTop();
                    this.customResponse = new CustomResponse( 'ERROR',"Max size is 10 MB", true );
                }
            }
        }

    }

    changeBackGroundLogo(inputFile) {
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

    loadPublicVideos() {
        this.videoFileService.loadPublicVideos(this.companyProfile.id)
            .subscribe(
                data => { this.publicVideos = data; },
                error => { this.logger.errorPage(error) },
                () => { this.logger.info("Completed getCompanyProfileByUserId()") }
            );
    }
}
