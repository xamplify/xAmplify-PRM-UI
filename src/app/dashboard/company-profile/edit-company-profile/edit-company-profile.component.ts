import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from "@angular/forms";
import { Router } from '@angular/router';
import { FileUploader} from 'ng2-file-upload/ng2-file-upload';
import { DomSanitizer } from '@angular/platform-browser';
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
import { Properties } from '../../../common/models/properties';
import { UtilService } from 'app/core/services/util.service';
// import { CropperSettings, ImageCropperComponent } from 'ng2-img-cropper';
// ImageCroppedEvent
import { ImageCroppedEvent } from '../../../common/image-cropper/interfaces/image-cropped-event.interface';
import { ImageCropperComponent } from '../../../common/image-cropper/component/image-cropper.component';

declare var $,swal: any;

@Component({
    selector: 'app-edit-company-profile',
    templateUrl: './edit-company-profile.component.html',
    styleUrls: ['./edit-company-profile.component.css', '../../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                '../../../../assets/css/phone-number-plugin.css'],
    providers: [Processor, CountryNames, RegularExpressions, Properties]

})
export class EditCompanyProfileComponent implements OnInit, OnDestroy {
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
    maxFileSize = 10;
    profileCompleted = 50;
    formUpdated = true;
    tempCompanyProfile:any;
    upadatedUserId:any;
    isUpdateChaged = false;
    squareCropperSettings: any;
    squareData:any;
    cropRounded = false;
    loadingcrop = false;
    errorUploadCropper = false;
    imageChangedEvent: any = '';
    croppedImage: any = '';
    showCropper = false;
    isAspectRatio = false;
    aspectRatioValue = '4/3';

    @ViewChild(ImageCropperComponent) imageCropper: ImageCropperComponent;
    // @ViewChild(ImageCropperComponent) cropper:ImageCropperComponent;
    constructor(private logger: XtremandLogger, public authenticationService: AuthenticationService, private fb: FormBuilder,
        private companyProfileService: CompanyProfileService, public homeComponent: HomeComponent,private sanitizer: DomSanitizer,
        public refService: ReferenceService, private router: Router, public processor: Processor, public countryNames: CountryNames,
        public regularExpressions: RegularExpressions, public videoFileService: VideoFileService, public videoUtilService: VideoUtilService,
        public userService: UserService, public properties: Properties, public utilService:UtilService) {
        this.loggedInUserId = this.authenticationService.getUserId();
        this.companyNameDivClass = this.refService.formGroupClass;
        this.companyProfileNameDivClass = this.refService.formGroupClass;
        this.isOnlyPartner = this.authenticationService.isOnlyPartner();
        this.isVendorRole = this.authenticationService.isVendor();
        // this.cropperSettings();
        this.squareCropperSettings = this.utilService.cropSettings(this.squareCropperSettings,130,196,130,false);

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
    closeModal(){
      this.cropRounded = !this.cropRounded;
      this.squareData = {};
      this.imageChangedEvent = null;
      this.croppedImage = '';
    }
    // cropperSettings(){
    //   this.squareCropperSettings = this.utilService.cropSettings(this.squareCropperSettings,130,196,130,false);
    //   this.squareCropperSettings.noFileInput = true;
    //   this.squareData = {};
    // }
    fileChangeEvent(){ this.cropRounded = false; $('#cropLogoImage').modal('show'); }
    // fileChangeListener($event,cropperComp: ImageCropperComponent) {
    //   // this.cropper = cropperComp;
    //   const image:any = new Image();
    //   const file:File = $event.target.files[0];
    //   const isSupportfile = file.type;
    //   if (isSupportfile === 'image/jpg' || isSupportfile === 'image/jpeg' || isSupportfile === 'image/png') {
    //     this.errorUploadCropper = false;
    //     const myReader:FileReader = new FileReader();
    //     const that = this;
    //     myReader.onloadend = function (loadEvent:any) {
    //         image.src = loadEvent.target.result;
    //         that.cropper.setImage(image);
    //     };
    //     myReader.readAsDataURL(file);
    //   } else {  this.errorUploadCropper = true;}

    //   }

    setValue(event){
      if(event === 'None') { this.isAspectRatio = false; }
      else { this.isAspectRatio = true; this.aspectRatioValue = event; }
    }
    filenewChangeEvent(event){
      const image:any = new Image();
      const file:File = event.target.files[0];
      const isSupportfile = file.type;
      if (isSupportfile === 'image/jpg' || isSupportfile === 'image/jpeg' || isSupportfile === 'image/png') {
          this.errorUploadCropper = false;
          this.imageChangedEvent = event;
      } else {
        this.errorUploadCropper = true;
        this.showCropper = false;
      }
    }
    imageCroppedMethod(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
      console.log(event);
    }
    imageLoaded() {
      this.showCropper = true;
      console.log('Image loaded')
    }
    cropperReady() {
      console.log('Cropper ready')
    }
    loadImageFailed () {
      console.log('Load failed');
      this.errorUploadCropper = true;
      this.showCropper = false;
    }
    uploadLogo(){
      this.loadingcrop = true;
      let fileObj:any;
      fileObj = this.utilService.convertBase64ToFileObject(this.croppedImage);
      fileObj = this.utilService.blobToFile(fileObj);
      console.log(fileObj);
      this.fileUploadCode(fileObj);
    }

    fileUploadCode(fileObj:File){
      this.companyProfileService.saveCompanyProfileLogo(fileObj).subscribe(
        (response: any) => {
          console.log(response);
          this.companyLogoImageUrlPath = this.companyProfile.companyLogoPath = response.path;
          this.refService.companyProfileImage = this.companyProfile.companyLogoPath;
          this.logoError = false;
          this.logoErrorMessage = "";
          this.enableOrDisableButton();
          $('#cropLogoImage').modal('hide');
          this.closeModal();
        },
        (error) => { console.log(error);  $('#cropLogoImage').modal('hide'); this.customResponse = new CustomResponse('ERROR',this.properties.SOMTHING_WENT_WRONG,true); },
        ()=>{ this.loadingcrop = false; if(this.companyProfile.website) { this.saveVideoBrandLog(); }});
    }
    errorHandler(event){ event.target.src ='assets/images/company-profile-logo.png'; }
    saveVideoBrandLog() {
     console.log("");
    }

    geoLocation(){
        this.utilService.getJSONLocation()
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
    imageClick(){
     this.fileChangeEvent();
    }

    ngOnInit() {
        this.geoLocation();
        this.upadatedUserId = this.authenticationService.isSuperAdmin()? this.authenticationService.selectedVendorId: this.loggedInUserId;
        this.getCompanyProfileByUserId(this.upadatedUserId);
        if (this.authenticationService.user.hasCompany) {
            this.companyProfile.isAdd = false;
            this.profileCompleted = 100;
        } /*else {
            this.companyProfile.country = this.countryNames.countries[0];
        }*/
        this.getAllCompanyNames();
        this.getAllCompanyProfileNames();
    }
    
    getUserByUserName( userName: string ) {
        try{
           this.authenticationService.getUserByUserName( userName )
              .subscribe(
              data => {
                console.log('logged in user profile info:');
                console.log(data);
                this.authenticationService.user = data;
                this.authenticationService.userProfile = data;
                
                const currentUser = localStorage.getItem( 'currentUser' );
                const userToken = {
                        'userName': userName,
                        'userId': data.id,
                        'accessToken': JSON.parse( currentUser )['accessToken'],
                        'refreshToken': JSON.parse( currentUser )['refreshToken'],
                        'expiresIn':  JSON.parse( currentUser )['expiresIn'],
                        'hasCompany': data.hasCompany,
                        'roles': data.roles
                    };
                    localStorage.clear();
                    localStorage.setItem('currentUser', JSON.stringify(userToken));
                
              },
              error => {console.log( error ); this.router.navigate(['/su'])},
              () => { }
              );
          }catch(error){ console.log('error'+error); }
      }
    
    
    save() {
        this.ngxloading = true;
        this.refService.goToTop();
        $('#saveOrUpdateCompanyButton').prop('disabled', true);
        this.validateEmptySpace('companyProfileName');
        this.validateNames(this.companyProfile.companyName)
        this.validateProfileNames(this.companyProfile.companyProfileName);
        this.checkValidations();
        if (!this.companyNameError && !this.companyProfileNameError && !this.emailIdError && !this.tagLineError && !this.phoneError && !this.websiteError
            && !this.facebookLinkError && !this.googlePlusLinkError && !this.twitterLinkError && !this.linkedinLinkError && !this.cityError && !this.stateError && !this.countryError &&
            !this.zipError && !this.logoError && !this.aboutUsError) {
            this.processor.set(this.processor);

            if( this.companyProfile.phone.length < 6){
                this.companyProfile.phone = "";
            }

            this.companyProfileService.save(this.companyProfile, this.loggedInUserId)
                .subscribe(
                    data => {
                        this.isUpdateChaged = true;
                        this.message = data.message;
                        this.getUserByUserName(this.authenticationService.user.emailId);
                        if(this.message==='Company Profile Info Added Successfully') {
                          this.message = 'Company Profile saved successfully';
                          this.formUpdated = false;
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
                            self.homeComponent.getTeamMembersDetails();
                            
                            
                       /*     if (self.isOnlyPartner) {
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
                                self.homeComponent.getTeamMembersDetails();
                            }*/

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
        this.checkValidations();
        let errorLength = $('div.form-group.has-error.has-feedback').length;
        if (!this.companyNameError && !this.companyProfileNameError && !this.emailIdError && !this.tagLineError && !this.phoneError && !this.websiteError
            && !this.facebookLinkError && !this.googlePlusLinkError && !this.twitterLinkError && !this.linkedinLinkError && !this.cityError && !this.stateError && !this.countryError &&
            !this.zipError && !this.logoError && !this.aboutUsError) {
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
                          this.formUpdated = false;
                        }
                        this.homeComponent.getVideoDefaultSettings();
                        $('#company-profile-error-div').hide();
                        $('#info').hide();
                        $('#edit-sucess').show(600);
                        $('#saveOrUpdateCompanyButton').prop('disabled', false);
                        this.processor.remove(this.processor);
                        this.authenticationService.user.websiteUrl = this.companyProfile.website;
                        this.refService.companyProfileImage = this.companyProfile.companyLogoPath;
                        setTimeout(function () { $("#edit-sucess").slideUp(500); }, 5000);
                    },
                    error => { this.ngxloading = false;
                        this.logger.errorPage(error) },
                    () => {  this.saveVideoBrandLog();this.logger.info("Completed saveOrUpdate()") }
                );
        } else {
            this.ngxloading = false;
            $('#company-profile-error-div').show(600);
        }
    }

    checkValidations(){
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
    }

    saveCompanyProfileOnDestroy(){
      this.checkValidations();
      this.aboutUsError = this.companyProfile.aboutUs? false: true;
      let errorLength = $('div.form-group.has-error.has-feedback').length;
      if (!this.companyNameError && !this.companyProfileNameError && !this.emailIdError && !this.tagLineError && !this.phoneError && !this.websiteError
          && !this.facebookLinkError && !this.googlePlusLinkError && !this.twitterLinkError && !this.linkedinLinkError && !this.cityError && !this.stateError && !this.countryError &&
          !this.zipError && !this.logoError) {
        if(this.companyProfile.phone) { this.companyProfile.phone = this.companyProfile.phone.length <6 ? "": this.companyProfile.phone;}
       this.companyProfileService.update(this.companyProfile, this.loggedInUserId)
        .subscribe(
            data => {
                this.message = data.message;
                if(this.message ==='Company Profile Info Updated Successfully'){
                  this.logger.log('success');
                  this.homeComponent.getVideoDefaultSettings();
                  this.saveVideoBrandLog();
                }
            },
            error => { this.ngxloading = false;
                this.logger.errorPage(error) ; this.logger.log('failed');},
            () => { this.logger.info("Completed saveOrUpdate()") }
        );
      }
    }
    getCompanyProfileByUserId(userId) {
        this.companyProfileService.getByUserId(userId)
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
    getCompanyProfileByIdNgOnDestroy(userId) {
      this.companyProfileService.getByUserId(userId)
          .subscribe(
              data => {
                  if (data.data != undefined) {
                     this.tempCompanyProfile = data.data;
                  }
              },
              error => { this.logger.errorPage(error) },
              () => { this.logger.info("Completed getCompanyProfileByIdNgOnDestroy()");
              if(!this.isUpdateChaged && this.authenticationService.user.hasCompany && this.router.url!="/login" && this.isFormUpdated()) {
                const self = this;
                swal( {
                    title: 'Are you sure?',
                    text: "Do you want to save your changes?",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#54a7e9',
                    cancelButtonColor: '#999',
                    confirmButtonText: 'Yes, Save it!',
                    cancelButtonText : 'No'

                }).then(function() {
                        self.saveCompanyProfileOnDestroy();
                },function (dismiss) {
                    if (dismiss === 'cancel') {
                      console.log('clicked cancel');
                      self.refService.companyProfileImage = self.tempCompanyProfile.companyLogoPath;
                   }
                })

              }
            }
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
                this.aboutUsErrorMessage = "Please add About Us";
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
    addAboutUsError(){
        this.aboutUsError = true;
        this.aboutUsDivClass = this.refService.errorClass;
        this.disableButton();
    }
    
    removeAboutUsError(){
        this.aboutUsError = false;
        this.aboutUsDivClass = this.refService.successClass;
        this.aboutUsErrorMessage = "";
        this.enableOrDisableButton();
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
                this.emailIdErrorMessage = "Please enter a valid email address.";
            } else {
                this.removeEmailIdError();
            }
        } else {
            this.removeEmailIdError();
        }
    }

    validatePhone() {
        if (this.companyProfile.phone) {
            if (this.companyProfile.phone.length< 8) {
                this.addPhoneError();
                this.phoneErrorMessage = "Invalid Phone Number"
            } else {
                this.removePhoneError();
            }
        } else {
            this.addPhoneError();
        }
    }

    validateCity() {
      if ($.trim(this.companyProfile.city).length > 0) {
        if(/^[A-Za-z\s]+$/.test(this.companyProfile.city) == false){
          this.addCityError();
          this.cityErrorMessage = "Invalid City";
         } else {  this.removeCityError(); }
          //  if (!this.regularExpressions.CITY_PATTERN.test(this.companyProfile.city)) {
          //       this.addCityError();
          //       this.cityErrorMessage = "Invalid City";
          //   } else {
          //       this.removeCityError();
          //   }
        } else {
            this.removeCityError();
        }
    }

    validateState() {
        if ($.trim(this.companyProfile.state).length > 0) {
          if(/^[A-Za-z\s]+$/.test(this.companyProfile.state) == false){
            // if (!this.regularExpressions.CITY_PATTERN.test(this.companyProfile.state)) {
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
                this.websiteErrorMessage = "Please enter a valid company’s URL.";
            } else {
                this.removeWebSiteError();
            }
        } else {
            this.websiteError = true;
            this.websiteErrorMessage = 'Please add your company’s URL.';
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
            if (!this.companyProfile.facebookLink.includes('facebook.com')) {
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
            if (!this.companyProfile.twitterLink.includes('twitter.com') ) {
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
          // !this.regularExpressions.URL_PATTERN.test(this.companyProfile.linkedInLink) && !
            if (!this.companyProfile.linkedInLink.includes('linkedin.com')) {
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

    isFormUpdated(){
     console.log(this.companyProfile);
     console.log(this.tempCompanyProfile);
      if((this.companyProfile.companyLogoPath !== this.tempCompanyProfile.companyLogoPath) ||
         (this.companyProfile.companyProfileName !== this.tempCompanyProfile.companyProfileName) ||
         (this.companyProfile.companyName !== this.tempCompanyProfile.companyName) ||
         (this.companyProfile.emailId !== this.tempCompanyProfile.emailId) ||
         (this.companyProfile.phone !== this.tempCompanyProfile.phone) ||
         (this.companyProfile.website !== this.tempCompanyProfile.website) ||
         (this.companyProfile.facebookLink !== this.tempCompanyProfile.facebookLink) ||
         (this.companyProfile.twitterLink !== this.tempCompanyProfile.twitterLink) ||
         (this.companyProfile.linkedInLink !== this.tempCompanyProfile.linkedInLink) ||
         (this.companyProfile.googlePlusLink !== this.tempCompanyProfile.googlePlusLink) ||
         (this.companyProfile.tagLine !== this.tempCompanyProfile.tagLine) ||
         (this.companyProfile.city !== this.tempCompanyProfile.city) ||
         (this.companyProfile.state !== this.tempCompanyProfile.state) ||
         (this.companyProfile.country !== this.tempCompanyProfile.country) ||
         (this.companyProfile.zip !== this.tempCompanyProfile.zip) ||
         (this.companyProfile.aboutUs !== this.tempCompanyProfile.aboutUs) ||
         (this.companyProfile.street !== this.tempCompanyProfile.street)
       ) { return true  }
      return false;
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

    changeBackGroundLogo(inputFile) {
        console.log(inputFile);
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
                () => { this.logger.info("Completed loadPublicVideos()") }
            );
    }

   ngOnDestroy(): void {
     this.getCompanyProfileByIdNgOnDestroy(this.upadatedUserId);
   }

}
