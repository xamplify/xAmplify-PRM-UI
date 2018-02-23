import { Component, OnInit, Output, EventEmitter, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user';
import { DefaultVideoPlayer } from '../../../videos/models/default-video-player';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { matchingPasswords, noWhiteSpaceValidator } from '../../../form-validator';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { XtremandLogger } from '../../../error-pages/xtremand-logger.service';
import { ReferenceService } from '../../../core/services/reference.service';
import { VideoUtilService } from '../../../videos/services/video-util.service';
import { CallActionSwitch } from '../../../videos/models/call-action-switch';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
declare var swal, $, Metronic, Layout, Demo, videojs: any;

@Component({
    selector: 'app-my-profile',
    templateUrl: './my-profile.component.html',
    styleUrls: ['./my-profile.component.css', '../../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
        '../../../../assets/admin/pages/css/profile.css', '../../../../assets/css/video-css/video-js.custom.css'],
    providers: [User, DefaultVideoPlayer, VideoUtilService, CallActionSwitch]
})
export class MyProfileComponent implements OnInit, AfterViewInit, OnDestroy {
    defaultVideoPlayer: DefaultVideoPlayer;
    tempDefaultVideoPlayerSettings: any;
    videoJSplayer: any;
    videoUrl: string;
    updatePasswordForm: FormGroup;
    defaultPlayerForm: FormGroup;
    busy: Subscription;
    status:boolean = true;
    updatePasswordBusy: Subscription;
    updatePlayerBusy: Subscription;
    updatePasswordSuccess = false;
    profileUploadSuccess = false;
    userProfileImage: string = "assets/admin/pages/media/profile/icon-user-default.png";
    userData: User;
    parentModel = { 'displayName': '', 'profilePicutrePath': 'assets/images/profile-pic.gif' };
    className: string = "form-control ng-touched ng-dirty ng-valid";
    uploader: FileUploader;
    compPlayerColor: string;
    compControllerColor: string;
    valueRange: number;
    profilePictueError: boolean = false;
    profilePictureErrorMessage: string = "";
    active = false;
    defaultPlayerSuccess = false;
    isPlayed = false;
    loggedInUserId: number = 0;
    tempPlayerColor: string;
    tempControllerColor: string;
    isPlayerSettingUpdated = false;
    hasAllAccess = false;
    hasCompany: boolean;
    defaultViewSuccess = false;
    orgAdminCount:number = 0;
    infoMessage:string = "";
    currentUser:User;
    roles:string[]=[];
    isOrgAdmin:boolean = false;
    isOnlyPartnerRole:boolean = false;
    logoUploader: FileUploader;
    logoImageUrlPath: string;
    imagePathSafeUrl: any;
    fullScreenMode = false;
    logoUpdated = false;
    logoLink = '';
    logoUrlUpdated = false;

    constructor(public fb: FormBuilder, public userService: UserService, public authenticationService: AuthenticationService,
        public logger: XtremandLogger, public refService: ReferenceService, public videoUtilService: VideoUtilService,
        public router: Router, public callActionSwitch: CallActionSwitch, public sanitizer: DomSanitizer,) {
        this.userData = this.authenticationService.userProfile;
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.videoUtilService.videoTempDefaultSettings = this.refService.defaultPlayerSettings;
        console.log(this.videoUtilService.videoTempDefaultSettings);
        this.loggedInUserId = this.authenticationService.getUserId();
        this.hasAllAccess = this.refService.hasAllAccess();
        this.hasCompany = this.authenticationService.user.hasCompany;
        this.callActionSwitch.size = 'normal';
        this.videoUrl = this.authenticationService.MEDIA_URL + "profile-video/Birds0211512666857407_mobinar.m3u8";
        this.hasOrgAdminRole();
        if (this.isEmpty(this.userData.roles) || this.userData.profileImagePath === undefined) {
            this.router.navigateByUrl('/home/dashboard');
        } else {
            if(this.hasCompany && this.refService.defaultPlayerSettings !== undefined){
            this.logoImageUrlPath = this.refService.defaultPlayerSettings.brandingLogoUri;
            this.logoLink  = this.refService.defaultPlayerSettings.brandingLogoDescUri;
            }
            console.log(this.userData);
            if (this.userData.firstName !== null) {
                this.parentModel.displayName = this.userData.firstName;
            } else {
                this.parentModel.displayName = this.userData.emailId;
            }
            if (!(this.userData.profileImagePath.indexOf(null) > -1)) {
                this.userProfileImage = this.userData.profileImagePath;
                this.parentModel.profilePicutrePath = this.userData.profileImagePath;
            }
        }
        this.uploader = new FileUploader({
            allowedMimeType: ['image/jpeg', 'image/pjpeg', 'image/jpeg', 'image/pjpeg', 'image/png'],
            maxFileSize: 100 * 1024 * 1024, // 100 MB
            url: this.authenticationService.REST_URL + "admin/uploadProfilePicture/" + this.loggedInUserId + "?access_token=" + this.authenticationService.access_token
        });


        this.uploader.onAfterAddingFile = (file) => {
            console.log(file);
            file.withCredentials = false;
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
            $('#profile-pic-upload-div').show();
            this.refService.topNavBarUserDetails.profilePicutrePath = imageFilePath['message'];
            this.authenticationService.userProfile.profileImagePath = imageFilePath['message'];
            setTimeout(function () { $('#profile-pic-upload-div').hide(500); }, 5000);
        };
        this.logoUploader = new FileUploader({
            allowedMimeType: ['image/jpeg', 'image/pjpeg', 'image/jpeg', 'image/pjpeg', 'image/png'],
            maxFileSize: 10 * 1024 * 1024, // 100 MB
            url: this.authenticationService.REST_URL + "videos/upload-branding-logo?userId=" + this.loggedInUserId + "&videoDefaultSetting=true&access_token=" + this.authenticationService.access_token
        });
        this.logoUploader.onAfterAddingFile = (fileItem) => {
            console.log(fileItem);
            fileItem.withCredentials = false;
            this.imagePathSafeUrl = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(fileItem._file)));
            this.logoImageUrlPath = this.imagePathSafeUrl.changingThisBreaksApplicationSecurity;
            this.logoUploader.queue[0].upload();
            $('#overLayImage').append($('#overlay-logo').show());
        };
        this.logoUploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
            console.log(response); 
            console.log(this.logoUploader.queue[0]);
            if(JSON.parse(response).message === null){
            //   this.logoUploader.queue[0].upload(); 
            } else {
             this.logoUploader.queue.length = 0;
             this.logoUpdated = true;
             this.logoImageUrlPath = this.defaultVideoPlayer.brandingLogoUri = JSON.parse(response).path;
            }
        }
    }
    isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }
    clearLogo(){
        this.logoUploader.queue.length = 0;
        this.logoImageUrlPath = undefined;
    }
    saveVideoBrandLog(){
       this.logoUpdated = false;
       this.userService.saveBrandLogo(this.logoImageUrlPath, this.logoLink, this.loggedInUserId)
        .subscribe(
        (data: any)=>{
         console.log(data);
         if(data !== undefined){
             this.logoUrlUpdated = true;
             this.logoImageUrlPath = data.brandingLogoPath
             this.logoLink = data.brandingLogoDescUri;
         }
       });
    }
    hasOrgAdminRole(){
        this.roles = this.authenticationService.getRoles();
        if(this.roles.indexOf('ROLE_ORG_ADMIN')>-1){
            this.isOrgAdmin = true;
        }else{
            this.isOrgAdmin = false;
        }
    }
    clearImage() {
        $('div#previewImage > img').remove();
        $('div#previewImage').append('<img src="assets/images/upload-profile.png"/>');
        $('#priview').attr('src', 'assets/images/upload-profile.png');

    }
    fileChange(inputFile: any, event: any) {
        console.log(inputFile.files);
        this.refService.goToTop();
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
        }
        let fileSize = (size / 1024 / 1024); //size in MB
        if (fileSize > maxSize) {
            this.profilePictueError = true;
            this.profilePictureErrorMessage = "Maximum File Size is 100 MB";
        }
        if (!this.profilePictueError) {
            this.readFiles(inputFile.files);
        }
    }
    videofileChange(inputFile){
    console.log(inputFile);
    }
    readFile(file: any, reader: any, callback: any) {
        reader.onload = () => {
            callback(reader.result);
        }
        reader.readAsDataURL(file);
    }

    readFiles(files: any, index = 0) {
        let reader = new FileReader();
        if (index in files) {
            this.readFile(files[index], reader, (result: any) => {
                $('#priview').attr('src', result);
                this.readFiles(files, index + 1); // Read the next file;
            });
        }
    }
    videojsCall() {
        if (!this.videoJSplayer) {
            const self = this;
            const overrideNativeValue = this.refService.getBrowserInfoForNativeSet();
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
                        } else if (event === 'FullscreenOff') {
                            self.fullScreenMode  = false;
                         }
                    });
                });
            this.defaultVideoSettings();
            this.defaulttransperancyControllBar(this.refService.defaultPlayerSettings.transparency);
            if (this.refService.defaultPlayerSettings.enableVideoController === false) {
                this.defaultVideoControllers();
            }
         setTimeout(function () {
             self.videoJSplayer.play();
             self.videoJSplayer.pause();  
        }, 1);
        } else { 
            this.logger.log('you already initialized the videojs');
         }
    }
    ngOnInit() {
        try {
            //    $("#defaultPlayerSettings").hide();
            this.isListView(this.authenticationService.getUserId());
            Metronic.init();
            Layout.init();
            Demo.init();
            this.validateUpdatePasswordForm();
            this.validateUpdateUserProfileForm();
            if (this.userData.firstName != null) {
                this.userData.displayName = this.userData.firstName;
            } else {
                this.userData.displayName = this.userData.emailId;
            }
            
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
              let roleNames =  currentUser.roles.map(function (a) { return a.roleName; });
              this.isOnlyPartner(roleNames);
            if(this.hasCompany){
                let roleNames =  currentUser.roles.map(function (a) { return a.roleName; });
                if(!this.isOnlyPartner(roleNames)){
                    this.getOrgAdminsCount(this.loggedInUserId);
                }
                this.getVideoDefaultSettings();
                this.defaultVideoSettings();
                this.refService.isDisabling = false;
                this.status = true;
            }else{
                this.refService.isDisabling = true;
                if(this.authenticationService.isCompanyAdded){
                    this.status = true;
                }else{
                    this.status = false;
                }
               
            }
            
            

        } catch (err) { }
    }
    
    isOnlyPartner(roleNames){
        if(roleNames.length==2 && (roleNames.indexOf('ROLE_USER')>-1 && roleNames.indexOf('ROLE_COMPANY_PARTNER')>-1)){
            this.isOnlyPartnerRole  = true;
            return true;
        }else{
            this.isOnlyPartnerRole  = false;
            return false;
        }
        
    }
    ngAfterViewInit() {
        
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if(currentUser.roles.length>1 && this.authenticationService.hasCompany()){
            this.videoUtilService.normalVideoJsFiles();
            this.videoUrl = this.authenticationService.MEDIA_URL + "profile-video/Birds0211512666857407_mobinar.m3u8";
            this.defaultVideoSettings();
            if(this.refService.defaultPlayerSettings.transparency === null){
                this.refService.defaultPlayerSettings.transparency = 100;
                this.refService.defaultPlayerSettings.controllerColor= '#456';
                this.refService.defaultPlayerSettings.playerColor = '#879';
            }
            this.defaulttransperancyControllBar(this.refService.defaultPlayerSettings.transparency);
            if (this.refService.defaultPlayerSettings.enableVideoController === false) {
                this.defaultVideoControllers();
            }
            
        }
       
    }

    updatePassword() {
        console.log(this.updatePasswordForm.value);
        $('#update-password-error-div').hide();
        $("#update-password-div").hide();
        var userPassword = {
            'oldPassword': this.updatePasswordForm.value.oldPassword,
            'newPassword': this.updatePasswordForm.value.newPassword,
            'userId': this.loggedInUserId
        }
        if (this.updatePasswordForm.value.oldPassword == this.updatePasswordForm.value.newPassword) {
            $('#update-password-error-div').show(600);
        } else {
            $('#update-password-error-div').hide();
            this.updatePasswordBusy = this.userService.updatePassword(userPassword)
                .subscribe(
                data => {
                    const body = data;
                    if (body !== "") {
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
                            $("#update-password-div").show(600);
                            this.updatePasswordForm.reset();
                        } else {
                            this.logger.error(this.refService.errorPrepender + " updatePassword():" + data);
                        }

                    } else {
                        this.logger.error(this.refService.errorPrepender + " updatePassword():" + data);
                    }

                },
                error => {
                    this.logger.error(this.refService.errorPrepender + " updatePassword():" + error);
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
                        this.logger.error(this.refService.errorPrepender + " checkPassword():" + data);
                    }

                },
                error => {
                    this.logger.error(this.refService.errorPrepender + " checkPassword():" + error);
                },
                () => console.log("Done")
                );
        }
        return false;
    }

    validateUpdatePasswordForm() {
        var passwordRegex = '((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})';
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
        'companyName':''
    };

    validationMessages = {
        'oldPassword': {
            'required': 'Old Password is required.'
        },
        'newPassword': {
            'required': 'New Password is required.',
            'minlength': 'Minimum 6 Characters',
            'pattern': 'Password should contain One Upper case letter, one lower case letter, one symbol and one Number'
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
            'minlength': 'Mobile should be 10 digit.',
            'maxlength': 'Mobile should be 10 digit.',
            'pattern': 'Mobile Number Only Should Be Numbers'

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
        },
        'companyName': {
            'required': 'Company Name required.',
            'whitespace': 'Invalid Data',
            'minlength': 'Company Name must be at least 3 characters long.',
            'maxlength': 'Company Name cannot be more than 50 characters long.',
            'pattern': 'Invalid Name'
        },


    };

    /*******************Update User Profile*************************************/
    updateUserProfileForm: FormGroup;
    validateUpdateUserProfileForm() {
        var urlPatternRegEx = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/;
        var mobileNumberPatternRegEx = /^[0-9]{10,10}$/;
        // var nameRegEx = /[a-zA-Z0-9]+[a-zA-Z0-9 ]+/;
        var charWithCommaRegEx = /^(?!.*?([A-D]).*?\1)[A-D](?:,[A-D])*$/;
        console.log(this.userData);
        this.updateUserProfileForm = this.fb.group({
            'firstName': [this.userData.firstName, Validators.compose([Validators.required, noWhiteSpaceValidator, Validators.maxLength(50)])],//Validators.pattern(nameRegEx)
            'lastName': [this.userData.lastName, Validators.compose([Validators.required, noWhiteSpaceValidator, Validators.maxLength(50)])],//Validators.pattern(nameRegEx)
            'mobileNumber': [this.userData.mobileNumber, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(mobileNumberPatternRegEx)])],
            'interests': [this.userData.interests, Validators.compose([Validators.required, noWhiteSpaceValidator, Validators.maxLength(50)])],
            'occupation': [this.userData.occupation, Validators.compose([Validators.required, noWhiteSpaceValidator, Validators.maxLength(50)])],
            'description': [this.userData.description, Validators.compose([Validators.required, noWhiteSpaceValidator, Validators.maxLength(50)])],
            'websiteUrl': [this.userData.websiteUrl, [Validators.required, Validators.pattern(urlPatternRegEx)]],
            'companyName': [this.userData.companyName, Validators.compose([Validators.required, noWhiteSpaceValidator, Validators.maxLength(50)])],//Validators.pattern(nameRegEx)


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
    
    firstNameValue(name: string){
        this.userData.displayName = name;
    }
    occupationValue(occupation: string){
        this.userData.occupation = occupation;
    }

    updateUserProfile() {
        console.log(this.updateUserProfileForm.value);
        this.refService.goToTop();
        $("#update-profile-div-id").hide();
        this.busy = this.userService.updateUserProfile(this.updateUserProfileForm.value, this.authenticationService.getUserId())
            .subscribe(
            data => {
                if (data != "") {
                    var response = data;
                    var message = response.message;
                    if (message === "User Updated") {
                        setTimeout(function () { $("#update-profile-div-id").show(500); }, 1000);
                        if(this.isOnlyPartnerRole){
                            this.authenticationService.user.hasCompany  = true;
                        }
                        this.userData = this.updateUserProfileForm.value;
                        this.userData.displayName = this.updateUserProfileForm.value.firstName;
                        this.parentModel.displayName = this.updateUserProfileForm.value.firstName;
                        this.refService.topNavBarUserDetails.displayName = this.parentModel.displayName;
                        this.userService.getUserByUserName(this.authenticationService.user.emailId).
                            subscribe(
                            res => {
                                this.authenticationService.userProfile = res;
                                this.getVideoDefaultSettings();
                                this.hasCompany = this.authenticationService.user.hasCompany;
                                const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                                let roleNames =  currentUser.roles.map(function (a) { return a.roleName; });
                                this.isOnlyPartner(roleNames);                                
                            },
                            error => { this.logger.error(this.refService.errorPrepender + " updateUserProfile():" + error) },
                            () => console.log("Finished")
                            );
                    } else {
                        this.logger.error(this.refService.errorPrepender + " updateUserProfile():" + data);
                    }

                } else {
                    this.logger.error(this.refService.errorPrepender + " updateUserProfile():" + data);
                }

            },
            error => {
                this.logger.error(this.refService.errorPrepender + " updateUserProfile():" + error);
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
                    //  this.defaultPlayerSuccess = true;
                    this.refService.defaultPlayerSettings = response;
                    this.tempDefaultVideoPlayerSettings = response;
                    this.defaultVideoPlayer = response;
                    this.compControllerColor = response.controllerColor;
                    this.compPlayerColor = response.playerColor;
                    this.valueRange = response.transparency;
                    this.tempControllerColor = response.controllerColor;
                    this.tempPlayerColor = response.playerColor;
                    this.logoImageUrlPath = response.brandingLogoUri;
                    this.logoLink = response.brandingLogoDescUri;
                    this.defaultPlayerbuildForm();
                    if (this.isPlayerSettingUpdated === true) {
                    this.videoUtilService.videoTempDefaultSettings = response; }
            }
        );
    }
    closeSuccessPopup() {
        this.defaultPlayerSuccess = false;
        this.logoUpdated = false;
        this.logoUrlUpdated = false;
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
        if (this.refService.defaultPlayerSettings.enableVideoController === false) {
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
        const color: any = this.refService.defaultPlayerSettings.controllerColor;
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
        if(this.refService.defaultPlayerSettings.playerColor === undefined || this.refService.defaultPlayerSettings.playerColor=== null){
            this.refService.defaultPlayerSettings.playerColor = '#454';
            this.refService.defaultPlayerSettings.controllerColor = '#234';
            this.refService.defaultPlayerSettings.transparency = 100;
        }
        $('.video-js').css('color', this.refService.defaultPlayerSettings.playerColor);
        $('.video-js .vjs-play-progress').css('background-color', this.refService.defaultPlayerSettings.playerColor);
        $('.video-js .vjs-volume-level').css('background-color', this.refService.defaultPlayerSettings.playerColor);
        if (this.refService.defaultPlayerSettings.controllerColor === '#fff') {
            const event = '#fbfbfb';
            $('.video-js .vjs-control-bar').css('cssText', 'background-color:' + event + '!important');
        } else { $('.video-js .vjs-control-bar').css('cssText', 'background-color:' + this.refService.defaultPlayerSettings.controllerColor + '!important'); }
        if (this.refService.defaultPlayerSettings.allowFullscreen === false) {
            $('.video-js .vjs-fullscreen-control').hide();
        } else { $('.video-js .vjs-fullscreen-control').show(); }
    }
    UpdatePlayerSettingsValues() {
        //   $("#defaultPlayerSettings").hide();
        this.isPlayerSettingUpdated = true;
        this.defaultPlayerSuccess = false;
        this.defaultVideoPlayer.playerColor = this.compPlayerColor;
        this.defaultVideoPlayer.controllerColor = this.compControllerColor;
        this.defaultVideoPlayer.transparency = this.valueRange;
        this.updatePlayerBusy = this.userService.updatePlayerSettings(this.defaultVideoPlayer)
            .subscribe((result: any) => {
                //  this.defaultPlayerSuccess = true;
                const selfCheck = this;
                setTimeout(function () {
                    selfCheck.defaultPlayerSuccess = true;
                }, 1003);
                this.getVideoDefaultSettings();
            }
            );
        // this.defaultPlayerSuccess = true;
        const self = this;
        setTimeout(function () {
            $('#defaultPlayerSettings').slideUp(500);
            self.defaultPlayerSuccess = false;
        }, 5000);
    }
    resetForm() {
        console.log(this.refService.defaultPlayerSettings);
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
    
    isListView(userId: number) {
        this.userService.isListView(userId)
            .subscribe(
            data => {this.callActionSwitch.isListView = (data === 'true');},
            error => console.log(error),
            () => { }
            );
    }
    
    setListView(isListView: boolean) {
        this.userService.setListView(this.authenticationService.getUserId(), isListView)
            .subscribe(
            data => { 
                this.refService.isListView = isListView;
                this.defaultViewSuccess = true;
            },
            error => console.log(error),
            () => { }
            );
    }
    
    changeStatus(){
        $('#org-admin-info').hide();
        if (!($('#status').is(":checked"))){
            if(this.currentUser.roles.length>1){
                this.status = true;
                $('#status').prop("checked",true);
                let self = this;
                swal({
                    title: 'Are you sure?',
                    text:'Once you change status,it cannot be undone.',
                    showCancelButton: true,
                    confirmButtonColor: '#54a7e9',
                    cancelButtonColor: '#999',
                    confirmButtonText: 'Yes',
                    showLoaderOnConfirm: true,
                    allowOutsideClick:false
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
                  }).then(function() {
                      if(self.orgAdminCount>1){
                          $('a').addClass('disabled');
                          self.refService.isDisabling = true;
                          self.disableOrgAdmin();
                      }else{
                          self.infoMessage = "Please Assign An OrgAdmin Before You Disable Yourself.";
                          $('#org-admin-info').show(600);
                          swal.close();
                          
                      }
                  },function (dismiss) {
                      if (dismiss === 'cancel') {
                          
                      }
                  })
         
            }
        }else{
            this.router.navigate(["/home/dashboard/edit-company-profile"]);
        }
    }
    
    getOrgAdminsCount(userId:number){
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
    
    disableOrgAdmin(){
        this.userService.disableOrgAdmin(this.loggedInUserId)
        .subscribe(
            data => {
                const response = data;
                if(response.statusCode==1048){
                    $('a').removeClass('disabled');
                    this.refService.isDisabling  = false;
                    $('#status').prop("checked",true);
                    this.status = false;
                    this.refService.accountDisabled = "OrgAdmin Deactivation Successfully Done.";
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
        if (this.isPlayed === true) {
            this.videoJSplayer.dispose();
        }
        $('.profile-video').remove();
        $('.h-video').remove();
        this.refService.defaulgVideoMethodCalled = false;
    }
    
}
