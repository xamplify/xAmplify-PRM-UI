import { Component, OnInit, OnDestroy, ViewChild,Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { FormBuilder } from "@angular/forms";
import { Router,ActivatedRoute } from '@angular/router';
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
import { CampaignAccess } from '../../../campaigns/models/campaign-access';
import { CallActionSwitch } from '../../../videos/models/call-action-switch';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
import { MdfService } from 'app/mdf/services/mdf.service';
import {DashboardType} from 'app/campaigns/models/dashboard-type.enum';
import { Dimensions, ImageTransform } from 'app/common/image-cropper-v2/interfaces';
import { base64ToFile } from 'app/common/image-cropper-v2/utils/blob.utils';


declare var $,swal: any;

@Component({
    selector: 'app-edit-company-profile',
    templateUrl: './edit-company-profile.component.html',
    styleUrls: ['./edit-company-profile.component.css', '../../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                '../../../../assets/css/phone-number-plugin.css'],
    providers: [Processor, CountryNames, RegularExpressions, Properties,CampaignAccess,CallActionSwitch,MdfService]

})
export class EditCompanyProfileComponent implements OnInit, OnDestroy, AfterViewInit {
    campaignAccess = new CampaignAccess();
    upgradeToVendor: boolean;
    createAccount: boolean;
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
    
    userEmailIdDivClass: string = this.formGroupDefaultClass;
    userEmailIdError = false;
    userEmailIdErrorMessage = "";
    
    firstNameDivClass: string = this.formGroupDefaultClass;
    firstNameError = false;
    firstNameErrorMessage = "";
    
    lastNameDivClass: string = this.formGroupDefaultClass;
    lastNameError = false;
    lastNameErrorMessage = "";
    
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

    /****XNFR-281*****/
    instagramDivClass: string = this.formGroupDefaultClass;
    instagramLinkError = false;
    instagramLinkErrorMessage = "";
    /****XNFR-281*****/

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

    eventUrlDivClass: string = this.formGroupDefaultClass;
    eventUrlError = false;
    eventUrlErrorMessage = "";

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
    isFromAdminPanel = false;
    isCustmSkin = false;
    userAlias:any;
    @ViewChild(ImageCropperComponent) imageCropper: ImageCropperComponent;
    fetchResult = new Subject<string>();
    public consoleMessages: string[] = [];
    serverErrorMessage = "Oops!Something went wrong.Please try after sometime";
    userId = 0;
    countryFromBrowser:string = "";
    showVendorLogo: boolean = true;
    vendorLogoTooltipText: string;

    favIconfile: File;
    bgImageFile: File; 
    companyFavIconPath = "";
    companyBgImagePath = "";
    cropLogoImageText:string;
    squareDataForBgImage:any;
    croppedImageForBgImage: any = '';
    bgImageChangedEvent: any = '';
    allLoginScreenDirectionsList:string[] = [];  
    prm = false;  
    vendorTier = false;
    containWithinAspectRatio = false;
    transform: ImageTransform = {};
    scale = 1;
    canvasRotation = 0;
    rotation = 0;
    marketing: boolean;
    // @ViewChild(ImageCropperComponent) cropper:ImageCropperComponent;
    constructor(private logger: XtremandLogger, public authenticationService: AuthenticationService, private fb: FormBuilder,
        private companyProfileService: CompanyProfileService, public homeComponent: HomeComponent,private sanitizer: DomSanitizer,
        public refService: ReferenceService, private router: Router, public processor: Processor, public countryNames: CountryNames,
        public regularExpressions: RegularExpressions, public videoFileService: VideoFileService, public videoUtilService: VideoUtilService,
        public userService: UserService, public properties: Properties, public utilService:UtilService,public route: ActivatedRoute,public callActionSwitch: CallActionSwitch, private vanityURLService: VanityURLService, private mdfService:MdfService) {
        if(this.router.url.indexOf("/home/dashboard/admin-company-profile")>-1){
            this.userAlias = this.route.snapshot.params['alias'];
            if(this.userAlias!=undefined && $.trim(this.userAlias).length>0){
                this.companyProfile.userEmailId = this.userAlias;
                this.validatePattern('userEmailId');
                this.validateUserUsingEmailId();
            }
            this.campaignAccess.emailCampaign = true;
            this.campaignAccess.videoCampaign = true;
            this.campaignAccess.socialCampaign = true;
            this.isFromAdminPanel = true;
            this.addBlur();
            // Debounce search.
            this.fetchResult.pipe(
              debounceTime(600),
              distinctUntilChanged())
              .subscribe(value => {
                this.validateUserUsingEmailId();
              });
        }        
        else{
            this.allLoginScreenDirectionsList = ["Center","Left","Right"];
            this.loggedInUserId = this.authenticationService.getUserId();
            this.companyNameDivClass = this.refService.formGroupClass;
            this.companyProfileNameDivClass = this.refService.formGroupClass;
            this.isOnlyPartner = this.authenticationService.isOnlyPartner();
            this.isVendorRole = this.authenticationService.isVendor();
            this.uploadFileConfiguration();
        }          
        
    }
    toggleContainWithinAspectRatio() {
        if(this.croppedImage!=''){
            this.containWithinAspectRatio = !this.containWithinAspectRatio;
		}else{
        this.showCropper = false;
      //  this.errorUploadCropper = true;
        }
    }
    toggleContainWithinAspectRatioBgImage() {
        if(this.croppedImageForBgImage!=''){
            this.containWithinAspectRatio = !this.containWithinAspectRatio;
		}else{
        this.showCropper = false;
        //this.errorUploadCropper = true;
        }
    }
    
    zoomOut() {
        if(this.croppedImage!=""){
			this.scale -= .1;
			this.transform = {
				...this.transform,
				scale: this.scale       
			};
		}else{
		//	this.errorUploadCropper = true;
			this.showCropper = false; 
		}
    }
    zoomOutBgImage() {
        if(this.croppedImageForBgImage!=""){
			this.scale -= .1;
			this.transform = {
				...this.transform,
				scale: this.scale       
			};
		}else{
		//	this.errorUploadCropper = true;
			this.showCropper = false; 
		}
    }
    zoomIn() {
        if(this.croppedImage!=''){
            this.scale += .1;
            this.transform = {
                ...this.transform,
                scale: this.scale
            };
			
		}else{
        this.showCropper = false;
       // this.errorUploadCropper = true;
        }
    }
    zoomInBgImage() {
        if(this.croppedImageForBgImage!=''){
            this.scale += .1;
            this.transform = {
                ...this.transform,
                scale: this.scale
            };
			
		}else{
        this.showCropper = false;
      //  this.errorUploadCropper = true;
        }
    }
    resetImage() {
        if(this.croppedImage!=''){
            this.scale = 1;
            this.rotation = 0;
            this.canvasRotation = 0;
            this.transform = {};
		}else{
        this.showCropper = false;
    //    this.errorUploadCropper = true;
    }
    }
    resetImageBgImage() {
        if(this.croppedImageForBgImage!=''){
            this.scale = 1;
            this.rotation = 0;
            this.canvasRotation = 0;
            this.transform = {};
		}else{
        this.showCropper = false;
      //  this.errorUploadCropper = true;
    }
    }
    validateUserUsingEmailId(){
        this.customResponse = new CustomResponse();
        this.upgradeToVendor = false;
        if(this.userEmailIdErrorMessage.length==0){
            if($.trim(this.companyProfile.userEmailId).length>0 && this.userEmailIdErrorMessage.length==0){
                this.checkUser();
            }else{
                this.addBlur();
            }
        }
    }
    
    addBlur(){
        $('#blur-content-div').removeClass('admin');
        $('#blur-content-div').addClass('admin blur-content');
        $('#image-blur-content-div').removeClass('image');
        $('#image-blur-content-div').addClass('image blur-content');
        $('#module-access-blur-content-div').removeClass('module-access');
        $('#module-access-blur-content-div').addClass('module-access blur-content');
    }
    
    removeBlur(){
        $('#blur-content-div').removeClass('admin blur-content');
        $('#blur-content-div').addClass('admin');
        $('#image-blur-content-div').removeClass('image blur-content');
        $('#image-blur-content-div').addClass('image');
        this.removeModuleBlur();
    }
    
    removeModuleBlur(){
        $('#module-access-blur-content-div').removeClass('module-access blur-content');
        $('#module-access-blur-content-div').addClass('module-access');
    }
    
    ngOnInit() {
        this.geoLocation();
        if(!this.isFromAdminPanel){
            this.upadatedUserId = this.authenticationService.isSuperAdmin()? this.authenticationService.selectedVendorId: this.loggedInUserId;
            this.getCompanyProfileByUserId(this.upadatedUserId);
            if (this.authenticationService.user.hasCompany) {
                this.companyProfile.isAdd = false;
                this.profileCompleted = 100;
            }else{
				if(this.authenticationService.isPartner()){
            			this.getPartnerDetails();
            	}
            }
            if (this.authenticationService.vanityURLEnabled && this.authenticationService.checkSamlSettingsUserRoles()) {
                this.setVendorLogoTooltipText();
            }
        }
        this.getAllCompanyNames();
        this.getAllCompanyProfileNames();
        if(!this.companyLogoImageUrlPath){
          this.squareData = {};
        }

        if(!this.companyBgImagePath){
            this.squareDataForBgImage = {};
        }
    }
    
    uploadFileConfiguration(){
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
      this.croppedImageForBgImage = '';
      this.squareDataForBgImage = {};
      this.bgImageChangedEvent = null;
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
      console.log(event, base64ToFile(event.base64));
    }
    imageLoaded() {
      this.showCropper = true;
      console.log('Image loaded')
    }
    cropperReady(sourceImageDimensions: Dimensions) {
        console.log('Cropper ready', sourceImageDimensions);
    }
    loadImageFailed () {
      console.log('Load failed');
    }
    uploadLogo(){
      if(this.croppedImage!=""){
        this.loadingcrop = true;
        let fileObj:any;
        fileObj = this.utilService.convertBase64ToFileObject(this.croppedImage);
        fileObj = this.utilService.blobToFile(fileObj);
        this.fileUploadCode(fileObj);
      }else{
        //   this.refService.showSweetAlertErrorMessage("Please upload an image");
        this.errorUploadCropper = false;
            this.showCropper = false;
      }
      
    }

    fileUploadCode(fileObj:File){
      this.companyProfileService.saveCompanyProfileLogo(fileObj).subscribe(
        (response: any) => {
          console.log(response);
          this.companyLogoImageUrlPath = this.companyProfile.companyLogoPath = response.path;
          this.refService.companyProfileImage = this.companyProfile.companyLogoPath;
          this.logoError = false;
          this.logoErrorMessage = "";
        //   this.enableOrDisableButton();
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
                this.countryFromBrowser = data.country;
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
    this.cropLogoImageText = "Choose the image to be used as your company logo";
     this.fileChangeEvent();
    }

   favIconImageClick(){
    this.cropLogoImageText = "Choose the image to be used as your company fav icon";
    this.cropRounded = false;
    $('#cropFavLogoImage').modal('show');
    //this.fileChangeEvent();
   }
    
   bgImageClick(){
    this.cropLogoImageText = "Choose the image to be used as your company background";
    this.cropRounded = false;
    $('#cropBgImage').modal('show');
    //this.fileChangeEvent();
   }

    getUserByUserName( userName: string ) {
        try{
           this.authenticationService.getUserByUserName( userName )
              .subscribe(
              data => {
                this.authenticationService.user = data;
                this.authenticationService.userProfile = data;
                        const currentUser = localStorage.getItem('currentUser');
                        const userToken = {
                            'userName': userName,
                            'userId': data.id,
                            'accessToken': JSON.parse(currentUser)['accessToken'],
                            'refreshToken': JSON.parse(currentUser)['refreshToken'],
                            'expiresIn': JSON.parse(currentUser)['expiresIn'],
                            'hasCompany': data.hasCompany,
                            'roles': data.roles,
                            'campaignAccessDto': data.campaignAccessDto,
                            'logedInCustomerCompanyNeme': JSON.parse(currentUser)['companyName'],
							'source':data.source	
                        };
                        localStorage.clear();
                        if (this.authenticationService.vanityURLEnabled && this.authenticationService.companyProfileName && this.authenticationService.vanityURLUserRoles) {
                            userToken['roles'] = this.authenticationService.vanityURLUserRoles;
                        }
                        localStorage.setItem('currentUser', JSON.stringify(userToken));
                        localStorage.setItem('defaultDisplayType',data.modulesDisplayType);
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
        $('#module-access-button').prop('disabled', true);
        this.validateEmptySpace('companyProfileName');
        this.validateNames(this.companyProfile.companyName);
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
						this.authenticationService.leftSideMenuLoader = true;
                        this.isUpdateChaged = true;
                        this.message = data.message;
                        this.getUserByUserName(this.authenticationService.user.emailId);
                        if(this.message==='Company Profile Info Added Successfully') {
                          this.message = 'Company Profile saved successfully';
                          this.formUpdated = false;
                        }
                        this.authenticationService.v_companyFavIconPath = this.companyProfile.favIconLogoPath;
                        this.authenticationService.v_companyName = this.companyProfile.companyName;
						this.authenticationService.module.isContact = false;
                        this.vanityURLService.setVanityURLTitleAndFavIcon();                        
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
                            self.router.navigate(["/home/dashboard/welcome"]);
                            self.processor.set(self.processor);
                            self.saveVideoBrandLog();
                            const currentUser = localStorage.getItem('currentUser');
                            let companyName = JSON.parse(currentUser)['companyName'];
                            if(companyName==null || companyName==undefined || companyName==""){
                                companyName = self.companyProfile.companyName;
                            }
                            const userToken = {
                                'userName': JSON.parse(currentUser)['userName'],
                                'userId': JSON.parse(currentUser)['userId'],
                                'accessToken': JSON.parse(currentUser)['accessToken'],
                                'refreshToken': JSON.parse(currentUser)['refreshToken'],
                                'expiresIn': JSON.parse(currentUser)['expiresIn'],
                                'hasCompany': self.authenticationService.user.hasCompany,
                                'roles': JSON.parse(currentUser)['roles'],
                                'campaignAccessDto':JSON.parse(currentUser)['campaignAccessDto'],
                                'logedInCustomerCompanyNeme':companyName,
								'source':JSON.parse(currentUser)['source']                         
  							};
                            localStorage.setItem('currentUser', JSON.stringify(userToken));
                            self.homeComponent.getVideoDefaultSettings();
                            self.homeComponent.getTeamMembersDetails();
							
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
        $('#module-access-button').prop('disabled', true);
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
                        this.authenticationService.v_companyFavIconPath = this.companyProfile.favIconLogoPath;
                        this.authenticationService.v_companyName = this.companyProfile.companyName;
                        this.vanityURLService.setVanityURLTitleAndFavIcon();
                        this.homeComponent.getVideoDefaultSettings();
                        $('#company-profile-error-div').hide();
                        $('#info').hide();
                        $('#edit-sucess').show(600);
                        $('#saveOrUpdateCompanyButton').prop('disabled', false);
                        $('#module-access-button').prop('disabled', false);
                        this.processor.remove(this.processor);
                        this.authenticationService.user.websiteUrl = this.companyProfile.website;
                        this.refService.companyProfileImage = this.companyProfile.companyLogoPath;
                        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
                        currentUser['logedInCustomerCompanyNeme'] = this.companyProfile.companyName;
                        localStorage.setItem('currentUser',JSON.stringify(currentUser));
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
      if(this.isFromAdminPanel){
          this.validatePattern('userEmailId');
      }  
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
      this.validatePattern('instagramLink');
      this.validatePattern('city');
      this.validatePattern('state');
      this.validatePattern('eventUrl');
      this.validateCompanyLogo();
    }

    saveCompanyProfileOnDestroy(){
      this.checkValidations();
      this.aboutUsError = this.companyProfile.aboutUs? false: true;
      let errorLength = $('div.form-group.has-error.has-feedback').length;
      if (!this.companyNameError && !this.companyProfileNameError && !this.emailIdError && !this.tagLineError && !this.phoneError && !this.websiteError
          && !this.facebookLinkError && !this.googlePlusLinkError && !this.twitterLinkError && !this.linkedinLinkError && !this.cityError && !this.stateError && !this.countryError &&
          !this.zipError && !this.logoError && !this.twitterLinkError && !this.instagramLinkError) {
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
        if(userId!=undefined){
            this.companyProfileService.getByUserId(userId)
            .subscribe(
                data => {
                    if (data.data != undefined) {
                        this.companyProfile = data.data;
                        this.authenticationService.loginScreenDirection = data.data.loginScreenDirection;
                        this.setCompanyProfileViewData(data.data.companyName);
                    }
                },
                error => { this.logger.errorPage(error) },
                () => { this.logger.info("Completed getCompanyProfileByUserId()") }
            );
        }
       
    }
    
    setCompanyProfileViewData(existingCompanyName:string){
        if ($.trim(this.companyProfile.companyLogoPath).length > 0) {
            this.companyLogoImageUrlPath = this.companyProfile.companyLogoPath;
        }
        if ($.trim(this.companyProfile.backgroundLogoPath).length > 0) {
            this.backGroundImage = this.authenticationService.MEDIA_URL + this.companyProfile.backgroundLogoPath;
            this.companyBgImagePath = this.companyProfile.backgroundLogoPath;
        }
        if ($.trim(this.companyProfile.favIconLogoPath).length > 0) {
            this.companyFavIconPath = this.companyProfile.favIconLogoPath;            
        }
        if ($.trim(this.companyProfile.country).length == 0) {
            this.companyProfile.country = this.countryNames.countries[0];
        }
        
        this.geoLocation();
        this.existingCompanyName = existingCompanyName;
        this.loadPublicVideos();
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
                if(this.authenticationService.isPartner() && !this.authenticationService.user.hasCompany){
                   if ($.trim(this.existingCompanyName).toLowerCase().replace(/\s/g, '') != value) {
                      this.setCompanyNameError("Company Name Already Exists");
                   }
                }else{
                  this.setCompanyNameError("Company Name Already Exists");
                }
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
        $('#module-access-button').prop('disabled', false);
        /*let errorLength = $('div.form-group.has-error.has-feedback').length;
          if(errorLength==0){
            $('#saveOrUpdateCompanyButton').prop('disabled',false);
        }else{
            $('#saveOrUpdateCompanyButton').prop('disabled',true);
        }*/
    }

    disableButton() {
        $('#saveOrUpdateCompanyButton').prop('disabled', true);
        $('#module-access-button').prop('disabled', true);
        
    }

    validateProfileNames(value: any) {
        if ($.trim(value).length > 0) {
            let valueWithSpace = $.trim(value).toLowerCase();
            let valueWithOutSpaces = $.trim(value).toLowerCase().replace(/\s/g, '');
            if (!this.regularExpressions.ALPHA_NUMERIC.test(value)) {
                this.setCompanyProfileNameError("Please enter alpha numerics & lower case letters only");
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
        $('#module-access-button').prop('disabled', true);
        this.companyProfileNameError = true;
        this.companyProfileNameErrorMessage = errorMessage;
        this.companyProfileNameDivClass = this.refService.errorClass;
    }

    validateEmptySpace(columnName: string) {
        let value = $.trim($('#' + columnName).val());
        if (value.length == 0) {
            $('#saveOrUpdateCompanyButton').prop('disabled', true);
            $('#module-access-button').prop('disabled', true);
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
            }else if (columnName == "instagram") {
                this.instagramLinkError = true;
                this.instagramDivClass = this.refService.errorClass;
            }
             else if (columnName == "city") {
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
            }else if (columnName == "instagram") {
                this.instagramLinkError = false;
                this.instagramDivClass = this.refService.successClass;
            }  else if (columnName == "city") {
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
            }else if(columnName=="eventUrl"){
                this.eventUrlError = false;
                this.eventUrlDivClass = this.refService.successClass;
            }
            this.enableOrDisableButton();
        }
    }

    addEmailIdError() {
        this.emailIdError = true;
        this.emailIdDivClass = this.refService.errorClass;
        this.disableButton();
    }
    
    addUserEmailIdError() {
        this.userEmailIdError = true;
        this.userEmailIdDivClass = this.refService.errorClass;
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

    addInstagramError() {
        this.instagramLinkError = true;
        this.linkedInDivClass = this.refService.errorClass;
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

    addEventUrlError() {
        this.eventUrlError = true;
        this.eventUrlDivClass = this.refService.errorClass;
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
    
    removeUserEmailIdError() {
        this.userEmailIdError = false;
        this.userEmailIdDivClass = this.refService.successClass;
        this.userEmailIdErrorMessage = "";
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

    removeInstagramError() {
        this.instagramLinkError = false;
        this.instagramDivClass = this.refService.successClass;
        this.instagramLinkErrorMessage = "";
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

    removeEventUrlError() {
        this.eventUrlError = false;
        this.eventUrlDivClass = this.refService.successClass;
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
    
    validateUserEmailId() {
        if ($.trim(this.companyProfile.userEmailId).length > 0) {
            if (!this.regularExpressions.EMAIL_ID_PATTERN.test(this.companyProfile.userEmailId)) {
                this.addBlur();
                this.addUserEmailIdError();
                this.userEmailIdErrorMessage = "Please enter a valid email address.";
            } else {
                this.removeUserEmailIdError();
            }
        } else {
            this.addBlur();
            this.removeUserEmailIdError();
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
                this.websiteErrorMessage = "Please enter a valid company URL.";
            } else {
                this.removeWebSiteError();
            }
        } else {
            this.websiteError = true;
            this.websiteErrorMessage = 'Please add your company URL.';
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

    /******XNFR-281*****/
    validateInstagram() {
        if ($.trim(this.companyProfile.instagramLink).length > 0) {
            if (!this.companyProfile.instagramLink.includes('instagram.com')) {
                this.addInstagramError();
                this.instagramLinkErrorMessage = "Invalid Instagram Url";
            } else {
                this.removeInstagramError();
            }
        } else {
            this.removeInstagramError();
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
        if(column=="userEmailId"){
            this.validateUserEmailId();
        }else if (column == "emailId") {
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
        }else if (column == "instagramLink") {
            this.validateInstagram();
        }  else if (column == "linkedInLink") {
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
       if(this.upadatedUserId!=undefined &&this.upadatedUserId>0){
           this.getCompanyProfileByIdNgOnDestroy(this.upadatedUserId);
       }
       $('#cropBgImage').modal('hide');
       $('#cropLogoImage').modal('hide');
   }
   checkUser(){
       this.isLoading = true;
       this.createAccount = false;
       this.upgradeToVendor = false;
       this.customResponse = new CustomResponse();
       this.companyProfileService.getByEmailId(this.companyProfile.userEmailId)
       .subscribe(
       (result:any) => {
          let emailId = this.companyProfile.userEmailId;
          this.companyProfile = new CompanyProfile();
          let statusCode = result.statusCode;
          if(statusCode==200){
              let data = result.data;
              let user = data.user;
              this.userId = user.id;
              if(user.teamMember){
                  this.customResponse = new CustomResponse( 'ERROR', "This user is already a team member.So account cannot be created", true );
                  this.companyProfile.userEmailId = user.emailId;
                  this.addBlur();
              }else{
                  let roleIds = user.roles.map(function (a) { return a.roleId; });
                  let companyProfile = data.companyProfile;
                  if(companyProfile!=undefined && companyProfile.id!=null && companyProfile.id>0){
                      this.createAccount = false;
                      this.companyProfile = data.companyProfile;
                      this.companyProfile.userEmailId = user.emailId;
                      this.companyProfile.firstName = user.firstName;
                      this.companyProfile.lastName = user.lastName;
                      this.setCompanyProfileViewData(data.companyProfile.companyName);
                        if(roleIds.indexOf(13)>-1){
                            this.customResponse = new CustomResponse( 'ERROR', "This user is already vendor and has company profile.So account cannot be created", true );
                            this.addBlur();
                        }else if(roleIds.indexOf(18)>-1){
                            this.customResponse = new CustomResponse( 'ERROR', "This user is already vendor tier-1 and has company profile.So account cannot be created", true );
                            this.addBlur();
                        }
                        else if(roleIds.indexOf(2)>-1){
                            this.customResponse = new CustomResponse( 'ERROR', "This user is already an orgadmin.So account cannot be created", true );
                            this.addBlur();
                        }
                        else if(roleIds.length==2&&roleIds.indexOf(3)>-1 && roleIds.indexOf(12)>-1){
                            this.upgradeToVendor = true;
                            this.addBlur();
                        }
                  }else{
                      let message = "This User Canbe Upgraded.";
                      if(roleIds.length==2&&roleIds.indexOf(3)>-1 && roleIds.indexOf(12)>-1){
                          message+=" This User Is Already A Partner In xAmplify. Upgrading This User Becomes Admin & Partner.";
                      }
                      this.customResponse = new CustomResponse( 'INFO', message, true );
                      this.setNewAccount(emailId);
                  }
              }
          }else{
              this.customResponse = new CustomResponse( 'INFO', "New Account Can Be Created For This Account", true );
             this.setNewAccount(emailId);
          }
          this.isLoading = false;
       },
       (error:string) => { this.customResponse = new CustomResponse( 'ERROR', this.serverErrorMessage, true ); this.isLoading = false;});
   }
   
   setNewAccount(emailId:string){
       this.createAccount = true;
       this.companyProfile.userEmailId = emailId;
       this.companyProfile.country = this.countryFromBrowser;
       this.removeBlur();
       $('#module-access-button').prop('disabled', true);
   }
   
   addVendorRole(){
       this.refService.showSweetAlertInfoMessage();
     //  $('#module-access-button').prop('disabled', false);
      // this.removeModuleBlur();
     //  this.refService.goToDiv("module-access-blur-content-div");
   }
   updateAccess(){
       this.refService.goToTop();
       this.isLoading = true;
       this.customResponse = new CustomResponse();
       if(this.createAccount){
           this.validateEmptySpace('companyProfileName');
           this.validateNames(this.companyProfile.companyName)
           this.validateProfileNames(this.companyProfile.companyProfileName);
           this.checkValidations();
           if (!this.companyNameError && !this.companyProfileNameError && !this.emailIdError && !this.tagLineError && !this.phoneError && !this.websiteError
               && !this.facebookLinkError && !this.googlePlusLinkError && !this.twitterLinkError && !this.linkedinLinkError && !this.cityError && !this.stateError && !this.countryError &&
               !this.zipError && !this.logoError && !this.aboutUsError) {
               this.customResponse = new CustomResponse();
               this.companyProfile.campaignAccessDto = this.campaignAccess;
               this.companyProfile.roleId = $('#selectedRole option:selected').val();
               this.companyProfileService.createNewVendorRole(this.companyProfile)
               .subscribe(
               (result:any) => {
                   this.customResponse = new CustomResponse();
                   if(result.statusCode==404){
                    this.isLoading = false;
                    this.refService.showSweetAlertErrorMessage("Please Upload Company Logo");
                    this.refService.goToTop();
                   }else{
                    if(this.campaignAccess.mdf){
                        this.mdfService.saveMdfRequestForm(this.companyProfile.userEmailId, this.companyProfile.companyProfileName).subscribe((result :any)=> {
                            if (result.access) {
                                if (result.statusCode === 100) {
                                    console.log("Mdf Form already exists");
                                }                                                        
                            }else{
                                this.customResponse = new CustomResponse( 'ERROR',"MDF form not created", true );
                            }   
                            this.goBackToAdminPanel("Account Created Successfully");                     
                        },(error:string) => {
                            this.isLoading = false;
                            $('#module-access-button').show();
                            this.refService.goToTop();
                            this.customResponse = new CustomResponse( 'ERROR', this.serverErrorMessage, true );
                        });
                       }
                       else{
                        this.goBackToAdminPanel("Account Created Successfully");
                       }
                   }
                   
               },
               (error:string) => {
                   this.isLoading = false;
                   $('#module-access-button').show();
                   this.refService.goToTop();
                   this.customResponse = new CustomResponse( 'ERROR', this.serverErrorMessage, true );
               });
           }else{
               this.isLoading = false;
               this.refService.goToTop();
               $('#company-profile-error-div').show(600);
           }
        
       }else{
           this.campaignAccess.userId = this.userId;
           this.companyProfileService.upgradeToVendorRole(this.campaignAccess)
           .subscribe(
           (result:any) => {
              this.goBackToAdminPanel(result.message);
           },
           (error:string) => {
               this.isLoading = false;
               this.refService.goToTop();
               this.customResponse = new CustomResponse( 'ERROR', this.serverErrorMessage, true );
           });
           
       }
   }
   
   goBackToAdminPanel(message:string){
       this.isLoading = false;
       this.upgradeToVendor = false;
       let self = this;
       swal({
           title:message,
           type: "success",
           allowOutsideClick: false
       }).then(function() {
           self.router.navigate(["home/dashboard/admin-report"]);
       });
   }
   saveChanges(){
       this.loadingcrop = true;
       let fileObj:any;
       fileObj = this.utilService.convertBase64ToFileObject(this.croppedImage);
       fileObj = this.utilService.blobToFile(fileObj);
       console.log(fileObj);
       this.logoError = false;
       this.logoErrorMessage = "";
       this.enableOrDisableButton();
       $('#cropLogoImage').modal('hide');
       this.closeModal();
   }
   
   ngAfterViewInit(){
       if(!this.isFromAdminPanel){
           this.removeBlur();
       }
   }
   
   setVendorTier1(event:any){
       //this.campaignAccess.vendorTier1 = event;
   }

    setVendorLogoEnabled(event: any) {
        this.companyProfile.showVendorCompanyLogo = event;
    }

    setVendorLogoTooltipText() {
        this.vendorLogoTooltipText = "<b> On </b> - Your company logo will be displayed throughout the platform when your partners log into their accounts. <br/>"
            + "<b> Off </b> - Each partner's logo will be displayed throughout the platform when they log into their account. <br/>" + "<b>*This setting does not affect co-branding.</b>"
    }

    

    processFavIconFile(event: any){
        const file:File = event.target.files[0];
        if(file){
            const isSupportfile = file.type;
            if (isSupportfile === 'image/x-icon') {
                this.errorUploadCropper = false;
                this.imageChangedEvent = event;
                this.companyProfileService.uploadFavIconFile(event).subscribe(result => {
                  if(result.statusCode === 200){
                      this.companyProfile.favIconLogoPath = result.data;
                      this.companyFavIconPath = result.data;
                  }
              }, error => {
                  console.log(error);
              });
            } else {
              this.errorUploadCropper = true;
              this.showCropper = false;
            }       
            this.closeModal(); 
        }        
    }

    openFavIconFileId(){
        $('#favIconId').trigger('click');
    }

    uploadFavIconLogo(){
        
    }

    bgImageCroppedMethod(event: ImageCroppedEvent) {
        this.croppedImageForBgImage = event.base64;
        this.squareDataForBgImage=event.base64;
        console.log(event);
    }

    uploadBgImage(){
        if(this.croppedImageForBgImage!=""){
          this.loadingcrop = true;
          let fileObj:any;
          fileObj = this.utilService.convertBase64ToFileObject(this.croppedImageForBgImage);
          fileObj = this.utilService.blobToFile(fileObj);
          this.processBgImageFile(fileObj);
        }else{
            // this.refService.showSweetAlertErrorMessage("Please upload an image");
            this.errorUploadCropper = false;
            this.showCropper = false;
        }        
      }

      processBgImageFile(fileObj:File){
        this.companyProfileService.uploadBgImageFile(fileObj).subscribe(result => {
        if(result.statusCode === 200){
            this.companyProfile.backgroundLogoPath = result.data;
            this.companyBgImagePath = result.data;
            this.logoError = false;
            this.logoErrorMessage = "";
            this.enableOrDisableButton();
            $('#cropBgImage').modal('hide');
            this.closeModal();
            }            
        }, error => {
            console.log(error);
            $('#cropLogoImage').modal('hide'); this.customResponse = new CustomResponse('ERROR',this.properties.SOMTHING_WENT_WRONG,true)
        },
        ()=>{ this.loadingcrop = false; if(this.companyProfile.website) { this.saveVideoBrandLog(); }});
    }

    fileBgImageChangeEvent(event){
        const image:any = new Image();
        const file:File = event.target.files[0];
        const isSupportfile = file.type;
        if (isSupportfile === 'image/jpg' || isSupportfile === 'image/jpeg' || isSupportfile === 'image/webp' || isSupportfile === 'image/png') {
            this.errorUploadCropper = false;
            this.imageChangedEvent = event;
        } else {
          this.errorUploadCropper = true;
          this.showCropper = false;
        }
      }

      uploadfileBgImageChangeEvent(event){
        const image:any = new Image();
        const file:File = event.target.files[0];
        const isSupportfile = file.type;
        if (isSupportfile === 'image/jpg' || isSupportfile === 'image/jpeg' || isSupportfile === 'image/webp' || isSupportfile === 'image/png') {
            this.errorUploadCropper = false;
            this.bgImageChangedEvent = event;
        } else {
          this.errorUploadCropper = true;
          this.showCropper = false;
        }
      }

      setModulesByRole(){
          let roleId =  $('#selectedRole option:selected').val();
          this.prm = roleId==20;
          this.vendorTier = roleId==19;
          this.marketing = roleId==18;
          if(this.prm){
            this.campaignAccess.emailCampaign = false;
            this.campaignAccess.videoCampaign = false;
            this.campaignAccess.videoCampaign = false;
            this.campaignAccess.socialCampaign = false;
            this.campaignAccess.eventCampaign = false;
            this.campaignAccess.survey = false;
            this.campaignAccess.formBuilder = true;
            this.campaignAccess.landingPage = false;
            this.campaignAccess.landingPageCampaign = false;
            this.campaignAccess.shareLeads = false;
            this.campaignAccess.allBoundSource = false;
            this.campaignAccess.campaignPartnerTemplateOpenedAnalytics = false;
            this.campaignAccess.salesEnablement = false;
            this.campaignAccess.dataShare = false;
            this.campaignAccess.oneClickLaunch = false;
          }else if(this.vendorTier){
              this.campaignAccess.shareLeads = false;
          }else if(this.marketing){
              this.campaignAccess.loginAsPartner = false;
          }
      }

      selectDashboardType(){
        let selectedDashboard = $('#dashboardTypeC option:selected').val();
        if(selectedDashboard==DashboardType[DashboardType.DASHBOARD]){
          this.campaignAccess.dashboardType = DashboardType.DASHBOARD;
        }else if(selectedDashboard==DashboardType[DashboardType.ADVANCED_DASHBOARD]){
          this.campaignAccess.dashboardType = DashboardType.ADVANCED_DASHBOARD;
        }else if(selectedDashboard==DashboardType[DashboardType.DETAILED_DASHBOARD]){
          this.campaignAccess.dashboardType = DashboardType.DETAILED_DASHBOARD;
        }
      }

      updateLmsAndPlayBooks(){
      let isDamChecked = $('#damCheckBoxC').is(':checked');
          if(!isDamChecked){
              this.campaignAccess.lms = false;
              this.campaignAccess.playbooks = false;
          }
      }

      /****XNFR-125****/
      updateOneClickLaunchOption(){
        let isShareLeadsChecked = $('#share-leads-c').is(':checked');
        if(!isShareLeadsChecked){
            this.campaignAccess.oneClickLaunch = false;
        }
      }
      /** XNFR-134 ***** */
      portletBody = "modal fade";
      addBlurClass() {
        $('#exampleModal').removeClass(this.portletBody);
    }
    /** XNFR-139 ***** */
    setMaxAdmins(){
        let maxAdmins =  $('#maxAdmins option:selected').val();
        this.campaignAccess.maxAdmins = maxAdmins;
    }
    
    getPartnerDetails(){
            this.companyProfileService.getPartnerDetails().subscribe(
                (result: any) => {
                          this.companyProfile.isAdd = true;
                          this.companyProfile.id = result.id;
                          this.companyProfile.companyName  = result.companyName;
   						  this.companyProfile.street = result.street;
    					  this.companyProfile.city = result.city;
    					  this.companyProfile.state = result.state;
    					  this.companyProfile.country = result.country;
    					  this.companyProfile.zip = result.zip;
    					  this.companyProfile.companyNameStatus = result.companyNameStatus;
    					  this.existingCompanyName = result.companyName;
                }, (error: any) => {
                  console.log(error);
                }
            );
    }

}