import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { FormGroup,FormBuilder, Validators } from '@angular/forms';

import { matchingPasswords, noWhiteSpaceValidator } from '../../../form-validator';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';

import { UserService } from '../../../core/services/user.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { XtremandLogger } from '../../../error-pages/xtremand-logger.service';
import { ReferenceService } from '../../../core/services/reference.service';
import { VideoUtilService } from '../../../videos/services/video-util.service';

import { CallActionSwitch } from '../../../videos/models/call-action-switch';
import { CustomResponse } from '../../../common/models/custom-response';
import { Properties } from '../../../common/models/properties';
import { RegularExpressions } from '../../../common/models/regular-expressions';
import { User } from '../../../core/models/user';
import { DefaultVideoPlayer } from '../../../videos/models/default-video-player';
import { CountryNames } from '../../../common/models/country-names';
import { VideoFileService } from '../../../videos/services/video-file.service'

declare var swal, $, videojs: any;

@Component({
    selector: 'app-my-profile',
    templateUrl: './my-profile.component.html',
    styleUrls: ['./my-profile.component.css', '../../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
        '../../../../assets/admin/pages/css/profile.css', '../../../../assets/css/video-css/video-js.custom.css',
        '../../../../assets/css/phone-number-plugin.css'],
    providers: [User, DefaultVideoPlayer, VideoUtilService, CallActionSwitch, Properties, RegularExpressions, CountryNames]
})
export class MyProfileComponent implements OnInit, AfterViewInit, OnDestroy {
    defaultVideoPlayer: DefaultVideoPlayer;
    tempDefaultVideoPlayerSettings: any;
    videoJSplayer: any;
    videoUrl: string;
    updatePasswordForm: FormGroup;
    defaultPlayerForm: FormGroup;
    status = true;
    updatePasswordSuccess = false;
    profileUploadSuccess = false;
    userProfileImage = "assets/admin/pages/media/profile/icon-user-default.png";
    userData: User;
    parentModel = { 'displayName': '', 'profilePicutrePath': 'assets/admin/pages/media/profile/icon-user-default.png' };
    className = "form-control ng-touched ng-dirty ng-valid";
    uploader: FileUploader;
    compPlayerColor: string;
    compControllerColor: string;
    valueRange: number;
    profilePictueError = false;
    profilePictureErrorMessage = "";
    active = false;
    isPlayed = false;
    hasVideoRole = false;
    loggedInUserId = 0;
    tempPlayerColor: string;
    tempControllerColor: string;
    isPlayerSettingUpdated = false;
    hasAllAccess = false;
    hasCompany: boolean;
    orgAdminCount = 0;
    infoMessage = "";
    currentUser: any;
    roles: string[] = [];
    isOnlyPartnerRole = false;
    logoUploader: FileUploader;
    logoImageUrlPath: string;
    fullScreenMode = false;
    logoLink = '';
    ngxloading: boolean;
    roleNames:string = "";
    customResponse: CustomResponse = new CustomResponse();
    hasClientErrors:boolean = false;
    constructor(public videoFileService: VideoFileService, public countryNames: CountryNames, public fb: FormBuilder, public userService: UserService, public authenticationService: AuthenticationService,
        public logger: XtremandLogger, public referenceService: ReferenceService, public videoUtilService: VideoUtilService,
        public router: Router, public callActionSwitch: CallActionSwitch, public properties: Properties,
        public regularExpressions: RegularExpressions,public route:ActivatedRoute) {
          if (this.isEmpty(this.authenticationService.userProfile.roles) || !this.authenticationService.userProfile.profileImagePath) {this.router.navigateByUrl(this.referenceService.homeRouter);}
          try{
            this.userData = this.authenticationService.userProfile;
            this.roleNames = this.authenticationService.showRoles();
            this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
            this.videoUtilService.videoTempDefaultSettings = this.referenceService.defaultPlayerSettings;
            console.log(this.videoUtilService.videoTempDefaultSettings);
            this.loggedInUserId = this.authenticationService.getUserId();
            this.hasAllAccess = this.referenceService.hasAllAccess();
            this.hasVideoRole = this.authenticationService.hasOnlyVideoRole();
            this.hasCompany = this.authenticationService.user.hasCompany;
            this.callActionSwitch.size = 'normal';
            this.videoUrl = this.authenticationService.MEDIA_URL + "profile-video/Birds0211512666857407_mobinar.m3u8";
            if (this.isEmpty(this.userData.roles) || !this.userData.profileImagePath) {
                this.router.navigateByUrl(this.referenceService.homeRouter);
            } else {
                console.log(this.userData);
                this.parentModel.displayName = this.userData.firstName ? this.userData.firstName : this.userData.emailId;
                if (!(this.userData.profileImagePath.indexOf(null) > -1)) {
                    this.userProfileImage = this.userData.profileImagePath;
                    this.parentModel.profilePicutrePath = this.userData.profileImagePath;
                }
            }
            this.uploader = new FileUploader({
                allowedMimeType: ['image/jpeg', 'image/pjpeg', 'image/jpeg', 'image/pjpeg', 'image/png'],
                maxFileSize: 10 * 1024 * 1024, // 10 MB
                url: this.authenticationService.REST_URL + "admin/uploadProfilePicture/" + this.loggedInUserId + "?access_token=" + this.authenticationService.access_token
            });
            this.uploader.onAfterAddingFile = (file) => {
                this.ngxloading = true;
                console.log(file);
                file.withCredentials = false;
                this.uploader.queue[0].upload();
            };
            this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
                console.log(response);
                const imageFilePath = JSON.parse(response);
                console.log(imageFilePath);
                this.userProfileImage = imageFilePath['message'];
                this.parentModel.profilePicutrePath = imageFilePath['message'];
                this.uploader.queue.length = 0;
                this.clearImage();
                this.profileUploadSuccess = true;
                this.referenceService.topNavBarUserDetails.profilePicutrePath = imageFilePath['message'];
                this.authenticationService.userProfile.profileImagePath = imageFilePath['message'];
                this.ngxloading = false;
                this.customResponse = new CustomResponse('SUCCESS', this.properties.PROFILE_PIC_UPDATED,true);
            };
        }catch(error){
            this.hasClientErrors = true;
            this.logger.showClientErrors("my-profile.component.ts", "constructor()", error);
        }

    }
    isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }
    clearImage() {
        $('div#previewImage > img').remove();
        $('div#previewImage').append('<img src="assets/images/upload-profile.png"/>');
        $('#priview').attr('src', 'assets/images/upload-profile.png');
    }
    fileChange(inputFile: any, event: any) {
        console.log(inputFile.files);
        this.referenceService.goToTop();
        $("#profile-pic-upload-div").hide();
        this.profilePictueError = false;
        let extentionsArray = ["jpg", "JPG", "jpeg", "JPEG", "png", "PNG"];
        let maxSize = 100 * 1024 * 1024;//100Mb
        let file = inputFile.files[0];
        let name = file.name;
        let size = file.size;
        let type = file.type;
        console.log(name + "::::::::::" + size + ":::::::::::" + type);
        let ext = name.split('.').pop().toLowerCase();
        if ($.inArray(ext, extentionsArray) == -1) {
            this.profilePictueError = true;
            this.profilePictureErrorMessage = "Please Upload Image Files Only";
            this.customResponse =  new CustomResponse('ERROR',this.profilePictureErrorMessage, true);
        }
        let fileSize = (size / 1024 / 1024); //size in MB
        if (fileSize > maxSize) {
            this.profilePictueError = true;
            this.profilePictureErrorMessage = "Maximum File Size is 10 MB";
            this.customResponse =  new CustomResponse('ERROR',this.profilePictureErrorMessage, true);
        }
    }
    videojsCall() {
        this.customResponse =  new CustomResponse();
        if (!this.videoJSplayer && !this.isOnlyPartnerRole) {
            const self = this;
            const overrideNativeValue = this.referenceService.getBrowserInfoForNativeSet();
            this.videoJSplayer = videojs(document.getElementById('profile_video_player'),
                {
                    html5: {
                        hls: {
                            overrideNative: overrideNativeValue
                        },
                        nativeVideoTracks: !overrideNativeValue,
                        nativeAudioTracks: !overrideNativeValue,
                        nativeTextTracks: !overrideNativeValue
                    }
                },
                { "controls": true, "autoplay": false, "preload": "auto" },
                function () {
                    const document: any = window.document;
                    this.ready(function () {
                        $('.vjs-big-play-button').css('display', 'block');
                        self.isPlayed = false;
                    });
                    this.on('play', function () {
                        self.isPlayed = true;
                        $('.vjs-big-play-button').css('display', 'none');
                    });
                    this.on('pause', function () {
                        self.isPlayed = true;
                        $('.vjs-big-play-button').css('display', 'none');
                    });
                    this.on('fullscreenchange', function () {
                        const state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
                        const event = state ? 'FullscreenOn' : 'FullscreenOff';
                        if (event === 'FullscreenOn') {
                            self.fullScreenMode = true;
                            $('#profile_video_player').append($('#overlay-logo').show());
                        } else if (event === 'FullscreenOff') {
                            self.fullScreenMode = false;
                        }
                    });
                });
            this.defaultVideoSettings();
            this.defaulttransperancyControllBar(this.referenceService.defaultPlayerSettings.transparency);
            if (!this.referenceService.defaultPlayerSettings.enableVideoController) { this.defaultVideoControllers();}
            setTimeout( ()=> {this.videoJSplayer.play(); this.videoJSplayer.pause();}, 1);
        } else {
            this.logger.log('you already initialized the videojs');
        }
    }
    imageUpload(event){ $('#'+event).click();}
    clearCustomResponse(){ this.customResponse = new CustomResponse(); }
    ngOnInit() {
        try {
            this.geoLocation();
            this.videoUtilService.normalVideoJsFiles();
            this.isGridView(this.authenticationService.getUserId());
            this.validateUpdatePasswordForm();
            this.validateUpdateUserProfileForm();
            this.userData.displayName = this.userData.firstName ? this.userData.firstName : this.userData.emailId;
            this.authenticationService.isOnlyPartner();
            if ((this.currentUser.roles.length > 1 && this.hasCompany) || (this.authenticationService.user.roles.length>1 && this.hasCompany)) {
                if (!this.authenticationService.isOnlyPartner()) {
                    this.getOrgAdminsCount(this.loggedInUserId);
                }
                this.getVideoDefaultSettings();
                this.defaultVideoSettings();
                this.referenceService.isDisabling = false;
                this.status = true;
            } else {
                this.referenceService.isDisabling = true;
                if (this.authenticationService.isCompanyAdded) {
                    this.status = true;
                } else {
                    this.status = false;
                }
            }
        } catch (error) {
            this.hasClientErrors = true;
            this.logger.showClientErrors("my-profile.component.ts", "ngAfterViewInit()", error);
        }
    }
    ngAfterViewInit() {
        try{
            if (this.currentUser.roles.length > 1 && this.authenticationService.hasCompany()) {
                this.defaultVideoSettings();
               if (this.referenceService.defaultPlayerSettings.transparency === null) {
                   this.referenceService.defaultPlayerSettings.transparency = 100;
                   this.referenceService.defaultPlayerSettings.controllerColor = '#456';
                   this.referenceService.defaultPlayerSettings.playerColor = '#879';
               }
               this.defaulttransperancyControllBar(this.referenceService.defaultPlayerSettings.transparency);
               if (this.referenceService.defaultPlayerSettings.enableVideoController === false) {
                   this.defaultVideoControllers();
               }
           }
        }catch(error){
            this.hasClientErrors = true;
            this.logger.showClientErrors("my-profile.component.ts", "ngAfterViewInit()", error);

        }

    }

    updatePassword() {
        this.ngxloading = true;
        console.log(this.updatePasswordForm.value);
        var userPassword = {
            'oldPassword': this.updatePasswordForm.value.oldPassword,
            'newPassword': this.updatePasswordForm.value.newPassword,
            'userId': this.loggedInUserId
        }
        if (this.updatePasswordForm.value.oldPassword === this.updatePasswordForm.value.newPassword) {
           this.customResponse = new CustomResponse('ERROR','Your new password cannot be the same as your current password',true);
            this.ngxloading = false;
        } else {
            this.userService.updatePassword(userPassword)
                .subscribe(
                    data => {
                        const body = data;
                        if (body !== "") {
                            this.ngxloading = false;
                            var response = body;
                            var message = response.message;
                            if (message == "Wrong Password") {
                                this.formErrors['oldPassword'] = message;
                                if (this.className == "form-control ng-touched ng-dirty ng-invalid") {
                                    this.className = "form-control ng-dirty ng-invalid ng-touched";
                                } else if (this.className = "form-control ng-dirty ng-invalid ng-touched") {
                                    this.className = "form-control ng-touched ng-dirty ng-invalid";
                                } else {
                                    this.className = "form-control ng-touched ng-dirty ng-valid";
                                }
                            } else if (response.message == "Password Updated Successfully") {
                                this.ngxloading = false;
                                this.customResponse = new CustomResponse('SUCCESS',this.properties.PASSWORD_UPDATED,true);
                                this.updatePasswordForm.reset();
                            } else {
                                this.ngxloading = false;
                                this.logger.error(this.referenceService.errorPrepender + " updatePassword():" + data);
                            }

                        } else {
                            this.ngxloading = false;
                            this.logger.error(this.referenceService.errorPrepender + " updatePassword():" + data);
                        }
                    },
                    error => {
                        this.ngxloading = false;
                        this.logger.error(this.referenceService.errorPrepender + " updatePassword():" + error);
                    },
                    () => console.log("Done")
                );
        }
        return false;
    }

    checkPassword(event: any) {
        var password = event.target.value;
        if (password != "") {
            var user = { 'oldPassword': password, 'userId': this.loggedInUserId };
            this.userService.comparePassword(user)
                .subscribe(
                    data => {
                        if (data != "") {
                            const response = data;
                            const message = response.message;
                            this.formErrors['oldPassword'] = message;
                        } else {
                            this.logger.error(this.referenceService.errorPrepender + " checkPassword():" + data);
                        }

                    },
                    error => {
                        this.logger.error(this.referenceService.errorPrepender + " checkPassword():" + error);
                    },
                    () => console.log("Done")
                );
        }
        return false;
    }

    validateUpdatePasswordForm() {
        var passwordRegex = this.regularExpressions.PASSWORD_PATTERN;
        this.updatePasswordForm = this.fb.group({
            'oldPassword': [null, [Validators.required]],
            'newPassword': [null, [Validators.required, Validators.minLength(6), Validators.pattern(passwordRegex)]],
            'confirmNewPassword': [null, [Validators.required]],
        }, {
                validator: matchingPasswords('newPassword', 'confirmNewPassword')
            }

        );

        this.updatePasswordForm.valueChanges
            .subscribe(data => this.onUpdatePasswordFormValueChanged(data));

        this.onUpdatePasswordFormValueChanged(); // (re)set validation messages now
    }


    onUpdatePasswordFormValueChanged(data?: any) {
        if (!this.updatePasswordForm) { return; }
        const form = this.updatePasswordForm;

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
        'oldPassword': '',
        'newPassword': '',
        'confirmNewPassword': '',
        'firstName': '',
        'lastName': '',
        'mobileNumber': '',
        'interests': '',
        'occupation': '',
        'description': '',
        'websiteUrl': '',
        'companyName': ''
    };

    validationMessages = {
        'oldPassword': {
            'required': 'Old Password is required.'
        },
        'newPassword': {
            'required': 'New Password is required.',
            'minlength': 'Minimum 6 Characters',
            'pattern': 'Use 6 or more characters with a mix of letters, numbers & symbols'
        },
        'confirmNewPassword': {
            'required': 'Confirm Password is required.'
        },
        'firstName': {
            'required': 'First Name required.',
            'whitespace': 'Invalid Data',
            'minlength': 'First Name must be at least 3 characters long.',
            'maxlength': 'First Name cannot be more than 50 characters long.',
            'pattern': 'Invalid Name'
        },
        'lastName': {
            'required': 'Last Name required.',
            'whitespace': 'Invalid Data',
            'minlength': 'Last Name must be at least 3 characters long.',
            'maxlength': 'Last Name cannot be more than 50 characters long.',
            'pattern': 'Invalid Name'
        },
        'mobileNumber': {
            'required': 'Mobile Number required.',
            'minlength': '',
           /* 'maxlength': 'Mobile should be 10 digit.',*/
            'pattern': 'Mobile Numbe should be 10 digits and only contain numbers.'

        },
        'interests': {
            'required': 'Interests required.',
            'whitespace': 'Invalid Data',
            'minlength': 'interest be at least 3 characters long.',
            'maxlength': 'interest cannot be more than 50 characters long.',
            'pattern': 'Only Characters Allowed'
        },
        'occupation': {
            'required': 'Occupation required.',
            'whitespace': 'Invalid Data',
            'minlength': 'occupation be at least 3 characters long.',
            'maxlength': 'occupation cannot be more than 50 characters long.',
            'pattern': 'Only Characters Allowed'
        },
        'description': {
            'required': 'About required.',
            'whitespace': 'Invalid Data',
            'minlength': 'description be at least 3 characters long.',
            'maxlength': 'description cannot be more than 50 characters long.'
        },
        'websiteUrl': {
            'required': 'WebsiteUrl required.',
            'pattern': 'Invalid Url Pattern'
        }
    };

    /*******************Update User Profile*************************************/
    geoLocation(){
        try{
        this.videoFileService.getJSONLocation()
        .subscribe(
        (data: any) => {
            if ( this.userData.mobileNumber == "" || this.userData.mobileNumber == undefined ) {
                for ( let i = 0; i < this.countryNames.countriesMobileCodes.length; i++ ) {
                    if ( data.countryCode == this.countryNames.countriesMobileCodes[i].code ) {
                        this.userData.mobileNumber = this.countryNames.countriesMobileCodes[i].dial_code;
                        break;
                    }
                }
            }

        } )
        } catch ( error ) {
            console.error( error, "addcontactOneAttimeModalComponent()", "gettingGeoLocation" );
        }
    }

    updateUserProfileForm: FormGroup;
    validateUpdateUserProfileForm() {
        var urlPatternRegEx = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/;
        var mobileNumberPatternRegEx = /^[0-9]{10,10}$/;
        // var nameRegEx = /[a-zA-Z0-9]+[a-zA-Z0-9 ]+/;
        var charWithCommaRegEx = /^(?!.*?([A-D]).*?\1)[A-D](?:,[A-D])*$/;
        this.updateUserProfileForm = this.fb.group({
            'firstName': [this.userData.firstName, Validators.compose([Validators.required, noWhiteSpaceValidator, Validators.maxLength(50)])],//Validators.pattern(nameRegEx)
            'lastName': [this.userData.lastName, Validators.compose([Validators.required, noWhiteSpaceValidator, Validators.maxLength(50)])],//Validators.pattern(nameRegEx)
           // 'mobileNumber': [this.userData.mobileNumber, Validators.compose([Validators.minLength(10), Validators.maxLength(10), Validators.pattern(mobileNumberPatternRegEx)])],
            'mobileNumber': [this.userData.mobileNumber],
            'interests': [this.userData.interests, Validators.compose([noWhiteSpaceValidator, Validators.maxLength(50)])],
            'occupation': [this.userData.occupation, Validators.compose([noWhiteSpaceValidator, Validators.maxLength(50)])],
            'description': [this.userData.description, Validators.compose([noWhiteSpaceValidator, Validators.maxLength(50)])],
            'websiteUrl': [this.userData.websiteUrl, [Validators.pattern(urlPatternRegEx)]]
        });

        this.updateUserProfileForm.valueChanges
            .subscribe(data => this.onUpdateUserProfileFormValueChanged(data));

        this.onUpdateUserProfileFormValueChanged(); // (re)set validation messages now
    }

    onUpdateUserProfileFormValueChanged(data?: any) {
        if (!this.updateUserProfileForm) { return; }
        const form = this.updateUserProfileForm;

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

    firstNameValue(name: string) {
        this.userData.displayName = name;
    }
    occupationValue(occupation: string) {
        this.userData.occupation = occupation;
    }

    updateUserProfile() {
        console.log(this.updateUserProfileForm.value);
        this.referenceService.goToTop();
        this.ngxloading = true;

        if ( this.userData.mobileNumber ) {
            if ( this.userData.mobileNumber.length > 6 ) {
                this.updateUserProfileForm.value.mobileNumber = this.userData.mobileNumber;
            } else {
                this.updateUserProfileForm.value.mobileNumber = ""
            }
        }

        this.userService.updateUserProfile(this.updateUserProfileForm.value, this.authenticationService.getUserId())
            .subscribe(
                data => {
                    if (data !== "") {
                        const response = data;
                        const message = response.message;
                        if (message === "User Updated") {
                            this.customResponse =  new CustomResponse('SUCCESS', this.properties.PROFILE_UPDATED,true);
                            this.userData = this.updateUserProfileForm.value;
                            this.userData.displayName = this.updateUserProfileForm.value.firstName;
                            this.userData.emailId = this.authenticationService.user.emailId;
                            this.parentModel.displayName = this.updateUserProfileForm.value.firstName;
                            this.referenceService.topNavBarUserDetails.displayName = this.parentModel.displayName;
                            this.userService.getUserByUserName(this.authenticationService.user.emailId).
                                subscribe(
                                    res => {
                                        this.ngxloading = false;
                                        this.authenticationService.userProfile = res;
                                    },
                                    error => { this.logger.error(this.referenceService.errorPrepender + " updateUserProfile():" + error) },
                                    () => console.log("Finished")
                                );
                        } else {
                            this.ngxloading = false;
                            this.logger.error(this.referenceService.errorPrepender + " updateUserProfile():" + data);
                        }
                    } else {
                        this.logger.error(this.referenceService.errorPrepender + " updateUserProfile():" + data);
                    }
                },
                error => {
                    this.ngxloading = false;
                    this.logger.error(this.referenceService.errorPrepender + " updateUserProfile():" + error);
                },
                () => console.log("Done")
            );
        return false;
    }

    readURL(input: any) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e: any) {
                $('#blah')
                    .attr('src', e.target.result)
                    .width(150)
                    .height(200);
            };
            reader.readAsDataURL(input.files[0]);
        }
    }
    hideDiv(divId: string) {
        $('#' + divId).hide(600);
    }
    getVideoDefaultSettings() {
        this.userService.getVideoDefaultSettings().subscribe(
            (result: any) => {
                this.active = true;
                const response = result;
                console.log(response);
                this.referenceService.defaultPlayerSettings = response;
                this.tempDefaultVideoPlayerSettings = response;
                this.defaultVideoPlayer = response;
                this.compControllerColor = response.controllerColor;
                this.compPlayerColor = response.playerColor;
                this.valueRange = response.transparency;
                this.tempControllerColor = response.controllerColor;
                this.tempPlayerColor = response.playerColor;
                this.logoImageUrlPath = response.brandingLogoUri = response.companyProfile.companyLogoPath;
                this.logoLink = response.brandingLogoDescUri = response.companyProfile.website;
                this.defaultPlayerbuildForm();
                if (this.isPlayerSettingUpdated === true) {
                    this.videoUtilService.videoTempDefaultSettings = response;
                }
            },
            (error:any)=>{ console.log('error'+error); }
        );
    }
    enableVideoController(event: any) {
        if (this.isPlayed === false) {
            this.videoJSplayer.play();
            this.videoJSplayer.pause();
        }
        this.defaultVideoPlayer.enableVideoController = event;
        if (event === true) {
            $('.video-js .vjs-control-bar').show();
        } else { $('.video-js .vjs-control-bar').hide(); }
    }
    defaultVideoControllers() {
        if (this.referenceService.defaultPlayerSettings.enableVideoController === false) {
            $('.video-js .vjs-control-bar').hide();
        } else { $('.video-js .vjs-control-bar').show(); }
    }
    changeControllerColor(event: any) {
        this.defaultVideoPlayer.controllerColor = event;
        this.compControllerColor = event;
        const rgba = this.videoUtilService.transparancyControllBarColor(event, this.valueRange);
        $('.video-js .vjs-control-bar').css('cssText', 'background-color:' + rgba + '!important');
    }
    changePlayerColor(event: any) {
        this.defaultVideoPlayer.playerColor = event;
        this.compPlayerColor = event;
        $('.video-js .vjs-play-progress').css('background-color', this.defaultVideoPlayer.playerColor);
        $('.video-js .vjs-big-play-button').css('cssText', 'color:' + this.defaultVideoPlayer.playerColor + '!important');
        $('.video-js .vjs-play-control').css('cssText', 'color:' + this.defaultVideoPlayer.playerColor + '!important');
        $('.video-js .vjs-volume-menu-button').css('cssText', 'color:' + this.defaultVideoPlayer.playerColor + '!important');
        $('.video-js .vjs-volume-level').css('cssText', 'background-color:' + this.defaultVideoPlayer.playerColor + '!important');
        $('.video-js .vjs-remaining-time-display').css('cssText', 'color:' + this.defaultVideoPlayer.playerColor + '!important');
        $('.video-js .vjs-fullscreen-control').css('cssText', 'color:' + this.defaultVideoPlayer.playerColor + '!important');
        $('.video-js .vjs-volume-panel').css('cssText', 'color:' + this.defaultVideoPlayer.playerColor + '!important');
    }
    transperancyControllBar(value: any) {
        this.valueRange = value;
        const color: any = this.defaultVideoPlayer.controllerColor;
        const rgba = this.videoUtilService.transparancyControllBarColor(color, value);
        $('.video-js .vjs-control-bar').css('cssText', 'background-color:' + rgba + '!important');
    }
    defaulttransperancyControllBar(value: any) {
        const color: any = this.referenceService.defaultPlayerSettings.controllerColor;
        const rgba = this.videoUtilService.transparancyControllBarColor(color, value);
        $('.video-js .vjs-control-bar').css('cssText', 'background-color:' + rgba + '!important');
    }
    allowLikes(event: any) {
        this.defaultVideoPlayer.allowLikes = event;
    }
    allowComments(event: any) {
        this.defaultVideoPlayer.allowComments = event;
    }
    enableSettings(event: any) {
        this.defaultVideoPlayer.enableSettings = event;
    }
    enableCasting(event: any) {
        this.defaultVideoPlayer.enableCasting = event;
    }
    allowSharing(event: any) {
        this.defaultVideoPlayer.allowSharing = event;
    }
    enableEmbed(event: any) {
        this.defaultVideoPlayer.allowEmbed = event;
    }
    enable360Video(event: any) {
        this.defaultVideoPlayer.is360video = event;
    }
    changeFullscreen(event: any) {
        this.defaultVideoPlayer.allowFullscreen = event;
        if (this.defaultVideoPlayer.allowFullscreen === false) {
            $('.video-js .vjs-fullscreen-control').hide();
        } else { $('.video-js .vjs-fullscreen-control').show(); }
    }
    defaultVideoSettings() {
        console.log('default settings called');
        if (this.referenceService.defaultPlayerSettings.playerColor === undefined || this.referenceService.defaultPlayerSettings.playerColor === null) {
            this.referenceService.defaultPlayerSettings.playerColor = '#454';
            this.referenceService.defaultPlayerSettings.controllerColor = '#234';
            this.referenceService.defaultPlayerSettings.transparency = 100;
        }
        $('.video-js').css('color', this.referenceService.defaultPlayerSettings.playerColor);
        $('.video-js .vjs-play-progress').css('background-color', this.referenceService.defaultPlayerSettings.playerColor);
        $('.video-js .vjs-volume-level').css('background-color', this.referenceService.defaultPlayerSettings.playerColor);
        if (this.referenceService.defaultPlayerSettings.controllerColor === '#fff') {
            const event = '#fbfbfb';
            $('.video-js .vjs-control-bar').css('cssText', 'background-color:' + event + '!important');
        } else { $('.video-js .vjs-control-bar').css('cssText', 'background-color:' + this.referenceService.defaultPlayerSettings.controllerColor + '!important'); }
        if (this.referenceService.defaultPlayerSettings.allowFullscreen === false) {
            $('.video-js .vjs-fullscreen-control').hide();
        } else { $('.video-js .vjs-fullscreen-control').show(); }
    }
    UpdatePlayerSettingsValues() {
        this.ngxloading = true;
        this.isPlayerSettingUpdated = true;
        this.defaultVideoPlayer.playerColor = this.compPlayerColor;
        this.defaultVideoPlayer.controllerColor = this.compControllerColor;
        this.defaultVideoPlayer.transparency = this.valueRange;
         this.userService.updatePlayerSettings(this.defaultVideoPlayer)
            .subscribe((result: any) => {
                this.ngxloading = false;
                this.customResponse = new CustomResponse('SUCCESS', this.properties.DEFAULT_PLAYER_SETTINGS, true);
                this.getVideoDefaultSettings();  },
                (error:any) => { console.error('error in update player setting api'); }
            );
    }
    resetForm() {
        console.log(this.referenceService.defaultPlayerSettings);
        console.log(this.videoUtilService.videoTempDefaultSettings);
        this.compControllerColor = this.videoUtilService.videoTempDefaultSettings.controllerColor;
        this.compPlayerColor = this.videoUtilService.videoTempDefaultSettings.playerColor;
        this.valueRange = this.videoUtilService.videoTempDefaultSettings.transparency;
        this.defaultVideoPlayer.allowFullscreen = this.videoUtilService.videoTempDefaultSettings.allowFullscreen;
        this.defaultVideoPlayer.allowComments = this.videoUtilService.videoTempDefaultSettings.allowComments;
        this.defaultVideoPlayer.allowEmbed = this.videoUtilService.videoTempDefaultSettings.allowEmbed;
        this.defaultVideoPlayer.is360video = this.videoUtilService.videoTempDefaultSettings.is360video;
        this.defaultVideoPlayer.allowLikes = this.videoUtilService.videoTempDefaultSettings.allowLikes;
        this.defaultVideoPlayer.allowSharing = this.videoUtilService.videoTempDefaultSettings.allowSharing;
        this.defaultVideoPlayer.enableCasting = this.videoUtilService.videoTempDefaultSettings.enableCasting;
        this.defaultVideoPlayer.enableSettings = this.videoUtilService.videoTempDefaultSettings.enableSettings;
        this.defaultVideoPlayer.enableVideoController = this.videoUtilService.videoTempDefaultSettings.enableVideoController;
        this.changeControllerColor(this.compControllerColor);
        this.changePlayerColor(this.compPlayerColor);
        this.transperancyControllBar(this.valueRange);
        if (this.defaultVideoPlayer.enableVideoController === false) {
            $('.video-js .vjs-control-bar').hide();
        } else { $('.video-js .vjs-control-bar').show(); }
    }
    defaultPlayerbuildForm() {
        this.defaultPlayerForm = this.fb.group({
            'enableVideoController': [this.defaultVideoPlayer.enableVideoController],
            'playerColor': [this.defaultVideoPlayer.playerColor],
            'controllerColor': [this.defaultVideoPlayer.controllerColor],
            'transparency': [this.defaultVideoPlayer.transparency],
            'allowSharing': [this.defaultVideoPlayer.allowSharing],
            'enableSettings': [this.defaultVideoPlayer.enableSettings],
            'allowFullscreen': [this.defaultVideoPlayer.allowFullscreen],
            'allowComments': [this.defaultVideoPlayer.allowComments],
            'allowLikes': [this.defaultVideoPlayer.allowLikes],
            'enableCasting': [this.defaultVideoPlayer.enableCasting],
            'allowEmbed': [this.defaultVideoPlayer.allowEmbed],
            'is360video': [this.defaultVideoPlayer.is360video],
            'brandingLogoUri': [this.defaultVideoPlayer.brandingLogoUri]
        });
        this.defaultPlayerForm.valueChanges.subscribe((data: any) => this.onDefaultPlayerValueChanged(data));
        this.onDefaultPlayerValueChanged();
    }

    onDefaultPlayerValueChanged(data?: any) {
        if (!this.defaultPlayerForm) { return; }
        const form = this.defaultPlayerForm;
        for (const field in this.formErrors) {
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

    isGridView(userId: number) {
        this.userService.isGridView(userId)
            .subscribe(
                data => {
                    this.callActionSwitch.isGridView = data; },
                error => console.log(error),
                () => { }
            );
    }

    setGridView(isGridView: boolean) {
        this.ngxloading = true;
        this.userService.setGridView(this.authenticationService.getUserId(), isGridView)
            .subscribe(
                data => {
                    this.ngxloading = false;
                    this.referenceService.isGridView = isGridView;
                    this.customResponse = new CustomResponse('SUCCESS', this.properties.PROCESS_REQUEST_SUCCESS, true);
                },
                error => {
                    this.ngxloading = false;
                    console.log(error);
                    this.customResponse = new CustomResponse('ERROR', this.properties.PROCESS_REQUEST_ERROR, true);
            },
                () => { }
            );
    }

    changeStatus() {
        $('#org-admin-info').hide();
        if (!($('#status').is(":checked"))) {
            if (this.currentUser.roles.length > 1) {
                this.status = true;
                $('#status').prop("checked", true);
                let self = this;
                swal({
                    title: 'Are you sure?',
                    text: 'Once you change status,it cannot be undone.',
                    showCancelButton: true,
                    confirmButtonColor: '#54a7e9',
                    cancelButtonColor: '#999',
                    confirmButtonText: 'Yes',
                    showLoaderOnConfirm: true,
                    allowOutsideClick: false
                    /*     preConfirm: () => {
                             if(self.orgAdminCount>1){
                                 $('a').addClass('disabled');
                                 self.refService.isDisabling = true;
                                 self.disableOrgAdmin();
                             }else{
                                 self.infoMessage = "Please Assign An OrgAdmin Before You Disable Yourself.";
                                 $('#org-admin-info').show(600);
                                 swal.close();

                             }
                         }*/
                }).then(function () {
                    if (self.orgAdminCount > 1) {
                        $('a').addClass('disabled');
                        self.referenceService.isDisabling = true;
                        self.disableOrgAdmin();
                    } else {
                        self.infoMessage = "Please Assign An OrgAdmin Before You Disable Yourself.";
                        $('#org-admin-info').show(600);
                        swal.close();

                    }
                }, function(dismiss:any) {
                    console.log('you clicked on option'+dismiss);
                });

            }
        } else {
            this.router.navigate(["/home/dashboard/edit-company-profile"]);
        }
    }

    getOrgAdminsCount(userId: number) {
        this.userService.getOrgAdminsCount(userId)
            .subscribe(
                data => {
                    this.orgAdminCount = data;
                },
                error => {
                    this.logger.errorPage(error);
                },
                () => this.logger.info("Finished getOrgAdminsCount()")
            );

    }

    disableOrgAdmin() {
        this.userService.disableOrgAdmin(this.loggedInUserId)
            .subscribe(
                data => {
                    const response = data;
                    if (response.statusCode == 1048) {
                        $('a').removeClass('disabled');
                        this.referenceService.isDisabling = false;
                        $('#status').prop("checked", true);
                        this.status = false;
                        this.referenceService.userProviderMessage = this.properties.ACCOUNT_DEACTIVATE_SUCCESS;
                        this.authenticationService.logout();
                        this.router.navigate(["/login"]);
                    }
                },
                error => {
                    this.logger.errorPage(error);
                    $('a').removeClass('disabled');
                },
                () => this.logger.info("Finished enableOrDisableOrgAdmin()")
            );
    }

    ngOnDestroy() {
        if (this.isPlayed === true) {  this.videoJSplayer.dispose(); }
        $('.profile-video').remove();
        $('.h-video').remove();
        this.referenceService.defaulgVideoMethodCalled = false;
    }
}
