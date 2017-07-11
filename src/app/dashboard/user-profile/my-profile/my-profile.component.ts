import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user';
import { DefaultVideoPlayer } from '../../../videos/models/default-video-player';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { matchingPasswords } from '../../../form-validator';
import { Observable } from 'rxjs/Rx';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { Logger } from 'angular2-logger/core';
import { ReferenceService } from '../../../core/services/reference.service';
declare var swal: any;
declare var $: any;
declare var Metronic: any;
declare var Layout: any;
declare var Demo: any;

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['../../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
      '../../../../assets/admin/pages/css/profile.css' ],
  providers: [User, DefaultVideoPlayer]
})
export class MyProfileComponent implements OnInit {
    public defaultVideoPlayer: DefaultVideoPlayer;
    updatePasswordForm: FormGroup;
    defaultPlayerForm: FormGroup;
    busy:Subscription;
    updatePasswordBusy:Subscription;
    updatePasswordSuccess = false;
    profileUploadSuccess = false;
    userProfileImage: string = "assets/admin/pages/media/profile/icon-user-default.png";
    userData: User;
    parentModel = { 'displayName': '', 'profilePicutrePath': 'assets/images/profile-pic.gif' };
    className:string = "form-control ng-touched ng-dirty ng-valid";
    public uploader: FileUploader;
    public compPlayerColor: string;
    public compControllerColor: string;
    public valueRange: number;
    public PlayerSettingsClicked: boolean;
    profilePictueError:boolean = false;
    profilePictureErrorMessage:string  = "";
    active = false;
    defaultPlayerSuccess: boolean;
    constructor( private fb: FormBuilder, private userService: UserService, private authenticationService: AuthenticationService,
     private logger: Logger, private refService: ReferenceService) {
        this.PlayerSettingsClicked = false;
        this.userData = this.authenticationService.userProfile;
        console.log(this.userData);
        //     this.defaultPlayerForm = new FormGroup({
        //     defaultSettings: new FormControl(),
        //     enableVideoController: new FormControl(),
        //     playerColor: new FormControl(),
        //     controllerColor: new FormControl(),
        //     transparency: new FormControl(),
        //     allowSharing: new FormControl(),
        //     enableSettings: new FormControl(),
        //     allowFullscreen: new FormControl(),
        //     allowComments: new FormControl(),
        //     allowLikes: new FormControl(),
        //     enableCasting: new FormControl(),
        //     allowEmbed: new FormControl(),
        //     is360video:  new FormControl(),
        //   });
        if (this.userData.firstName !== null ) {
            this.parentModel.displayName =  this.userData.firstName;
        }else {
            this.parentModel.displayName =  this.userData.emailId;
        }
        if ( !( this.userData.profileImagePath.indexOf( null ) > -1 ) ) {
            this.userProfileImage = this.userData.profileImagePath;
            this.parentModel.profilePicutrePath = this.userData.profileImagePath;
        }
        this.uploader = new FileUploader( {

            allowedMimeType: ['image/jpeg', 'image/pjpeg', 'image/jpeg', 'image/pjpeg', 'image/png'],
            maxFileSize: 100 * 1024 * 1024, // 100 MB
            url: this.authenticationService.REST_URL + "admin/uploadProfilePicture/" + this.authenticationService.user.id + "?access_token=" + this.authenticationService.access_token
        });


        this.uploader.onAfterAddingFile = ( file ) => {
            file.withCredentials = false;
        };
        this.uploader.onCompleteItem = ( item: any, response: any, status: any, headers: any ) => {
            console.log( response );
            const imageFilePath = JSON.parse( response );
            console.log( imageFilePath );
            this.userProfileImage = imageFilePath['message'];
            this.parentModel.profilePicutrePath = imageFilePath['message'];
            this.uploader.queue.length = 0;
            this.clearImage();
            this.profileUploadSuccess = true;
            $('#profile-pic-upload-div').show();
            this.refService.topNavBarUserDetails.profilePicutrePath = imageFilePath['message'];
            this.authenticationService.userProfile.profileImagePath = imageFilePath['message'];
            setTimeout( function() { $( '#profile-pic-upload-div' ).hide( 500 ); }, 5000 );
        };

    }

    clearImage() {
        $( 'div#previewImage > img' ).remove();
        $( 'div#previewImage' ).append( '<img src="assets/images/upload-profile.png"/>' );
        $( '#priview' ).attr( 'src', 'assets/images/upload-profile.png' );

    }
    fileChange( inputFile: any, event: any ) {
        console.log(inputFile.files);
        this.refService.goToTop();
        $("#profile-pic-upload-div" ).hide();
        this.profilePictueError = false;
        let  extentionsArray = ["jpg","JPG","jpeg","JPEG","png","PNG"];
        let maxSize = 100*1024*1024;//100Mb
        let file = inputFile.files[0];
        let name = file.name;
        let size = file.size;
        let type = file.type;
        console.log(name+"::::::::::"+size+":::::::::::"+type);
        let ext = name.split('.').pop().toLowerCase();
        if ($.inArray(ext, extentionsArray) == -1) {
            this.profilePictueError = true;
            this.profilePictureErrorMessage = "Please Upload Image Files Only";
        }
        let fileSize = (size/ 1024 / 1024); //size in MB
        if (fileSize > maxSize) {
            this.profilePictueError = true;
            this.profilePictureErrorMessage = "Maximum File Size is 100 MB";
        }
        if(!this.profilePictueError){
            this.readFiles( inputFile.files );
        }
    }
    readFile( file: any, reader: any, callback: any ) {
        reader.onload = () => {
            callback( reader.result );
        }
        reader.readAsDataURL( file );
    }

    readFiles( files: any, index = 0 ) {
        let reader = new FileReader();
        if ( index in files ) {
            this.readFile( files[index], reader, ( result: any ) => {
                $( '#priview' ).attr( 'src', result );
                this.readFiles( files, index + 1 ); // Read the next file;
            });
        }
    }
    ngOnInit() {
        try {
            Metronic.init();
            Layout.init();
            Demo.init();
            this.getVideoDefaultSettings();
            this.validateUpdatePasswordForm();
            this.validateUpdateUserProfileForm();
          //  this.defaultPlayerbuildForm();
            if ( this.userData.firstName != null ) {
                this.userData.displayName = this.userData.firstName;
            } else {
                this.userData.displayName = this.userData.emailId;
            }

        } catch ( err ) { }
    }


    updatePassword() {
        console.log( this.updatePasswordForm.value );
        $('#update-password-error-div').hide();
        $("#update-password-div" ).hide();
        var userPassword = {
            'oldPassword': this.updatePasswordForm.value.oldPassword,
            'newPassword': this.updatePasswordForm.value.newPassword,
            'userId':this.authenticationService.user.id
        }
        if(this.updatePasswordForm.value.oldPassword==this.updatePasswordForm.value.newPassword){
            $('#update-password-error-div').show(600);
        }else{
            $('#update-password-error-div').hide();
            this.updatePasswordBusy = this.userService.updatePassword(userPassword)
            .subscribe(
            data => {
                var body = data['_body'];
                if ( body != "" ) {
                    var response = JSON.parse( body );
                    var message = response.message;
                    if ( message == "Wrong Password" ) {
                        this.formErrors['oldPassword'] = message;
                        if(this.className=="form-control ng-touched ng-dirty ng-invalid"){
                            this.className = "form-control ng-dirty ng-invalid ng-touched";
                        }else if(this.className = "form-control ng-dirty ng-invalid ng-touched"){
                            this.className = "form-control ng-touched ng-dirty ng-invalid";
                        }else{
                            this.className = "form-control ng-touched ng-dirty ng-valid";
                        }
                       
                       
                    } else if ( response.message == "Password Updated Successfully" ) {
                        $("#update-password-div" ).show(600);
                        this.updatePasswordForm.reset();
                    } else {
                        this.logger.error(this.refService.errorPrepender+" updatePassword():"+data);
                    }

                } else {
                    this.logger.error(this.refService.errorPrepender+" updatePassword():"+data);
                }

            },
            error => {
                this.logger.error(this.refService.errorPrepender+" updatePassword():"+error);
            },
            () => console.log( "Done" )
            );
        }
        return false;

    }


    checkPassword( event: any ) {
        var password = event.target.value;
        if ( password != "" ) {
            var user = { 'oldPassword': password, 'userId':this.authenticationService.user.id };
            this.userService.comparePassword( user )
                .subscribe(
                data => {
                    var body = data['_body'];
                    if ( body != "" ) {
                        var response = JSON.parse( body );
                        var message = response.message;
                        this.formErrors['oldPassword'] = message;
                    } else {
                        this.logger.error(this.refService.errorPrepender+" checkPassword():"+data);
                    }

                },
                error => {
                    this.logger.error(this.refService.errorPrepender+" checkPassword():"+error);
                },
                () => console.log( "Done" )
                );
        }
        return false;
    }

    validateUpdatePasswordForm() {
        var passwordRegex = '((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})';
        this.updatePasswordForm = this.fb.group( {
            'oldPassword': [null, [Validators.required]],
            'newPassword': [null, [Validators.required, Validators.minLength( 6 ), Validators.pattern( passwordRegex )]],
            'confirmNewPassword': [null, [Validators.required]],
        }, {
                validator: matchingPasswords( 'newPassword', 'confirmNewPassword' )
            }

        );

        this.updatePasswordForm.valueChanges
            .subscribe( data => this.onUpdatePasswordFormValueChanged( data ) );

        this.onUpdatePasswordFormValueChanged(); // (re)set validation messages now
    }


    onUpdatePasswordFormValueChanged( data?: any ) {
        if ( !this.updatePasswordForm ) { return; }
        const form = this.updatePasswordForm;

        for ( const field in this.formErrors ) {
            // clear previous error message (if any)
            this.formErrors[field] = '';
            const control = form.get( field );

            if ( control && control.dirty && !control.valid ) {
                const messages = this.validationMessages[field];
                for ( const key in control.errors ) {
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
        'websiteUrl': ''
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
            'required': 'First Name required.'
        },
        'lastName': {
            'required': 'Last Name required.'
        },
        'mobileNumber': {
            'required': 'Mobile Number required.'
        },
        'interests': {
            'required': 'Interests required.'
        },
        'occupation': {
            'required': 'Occupation required.'
        },
        'description': {
            'required': 'About required.'
        },
        'websiteUrl': {
            'required': 'WebsiteUrl required.',
            'pattern': 'Invalid Url Pattern'
        }


    };

    /*******************Update User Profile*************************************/
    updateUserProfileForm: FormGroup;
    validateUpdateUserProfileForm() {
        var urlPatternRegEx = "https?://.+";
        console.log( this.userData );
        this.updateUserProfileForm = this.fb.group( {
            'firstName': [this.userData.firstName, Validators.required],
            'lastName': [this.userData.lastName, Validators.required],
            'mobileNumber': [this.userData.mobileNumber, Validators.required],
            'interests': [this.userData.interests, Validators.required],
            'occupation': [this.userData.occupation, Validators.required],
            'description': [this.userData.description, Validators.required],
            'websiteUrl': [this.userData.websiteUrl, [Validators.required, Validators.pattern( urlPatternRegEx )]],

        });

        this.updateUserProfileForm.valueChanges
            .subscribe( data => this.onUpdateUserProfileFormValueChanged( data ) );

        this.onUpdateUserProfileFormValueChanged(); // (re)set validation messages now

    }


    onUpdateUserProfileFormValueChanged( data?: any ) {
        if ( !this.updateUserProfileForm ) { return; }
        const form = this.updateUserProfileForm;

        for ( const field in this.formErrors ) {
            // clear previous error message (if any)
            this.formErrors[field] = '';
            const control = form.get( field );

            if ( control && control.dirty && !control.valid ) {
                const messages = this.validationMessages[field];
                for ( const key in control.errors ) {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
    }


    updateUserProfile() {
        console.log( this.updateUserProfileForm.value );
        this.refService.goToTop();
        $( "#update-profile-div-id" ).hide();
        this.busy  = this.userService.updateUserProfile( this.updateUserProfileForm.value,this.authenticationService.user.id )
            .subscribe(
            data => {
                var body = data['_body'];
                if ( body != "" ) {
                    var response = JSON.parse( body );
                    var message = response.message;
                    if ( message == "User Updated" ) {
                        setTimeout( function() { $( "#update-profile-div-id" ).show(500); }, 1000 );
                        this.userData = this.updateUserProfileForm.value;
                        this.userData.displayName = this.updateUserProfileForm.value.firstName;
                        this.parentModel.displayName =this.updateUserProfileForm.value.firstName;
                        this.refService.topNavBarUserDetails.displayName = this.parentModel.displayName;
                        this.userService.getUserByUserName(this.authenticationService.user.emailId).
                        subscribe(
                                res => {
                                   this.authenticationService.userProfile = res;
                                },
                                error => {this.logger.error(this.refService.errorPrepender+" updateUserProfile():"+error)},
                                () => console.log("Finished")
                            );
                    } else {
                        this.logger.error(this.refService.errorPrepender+" updateUserProfile():"+data);
                    }

                } else {
                    this.logger.error(this.refService.errorPrepender+" updateUserProfile():"+data);
                }

            },
            error => {
                this.logger.error(this.refService.errorPrepender+" updateUserProfile():"+error);
            },
            () => console.log( "Done" )
            );
        return false;
    }

    readURL( input: any ) {
        if ( input.files && input.files[0] ) {
            var reader = new FileReader();
            reader.onload = function( e: any ) {
                $( '#blah' )
                    .attr( 'src', e.target.result )
                    .width( 150 )
                    .height( 200 );
            };
            reader.readAsDataURL( input.files[0] );
        }
    }
    hideDiv(divId:string){
        $('#'+divId).hide(600);
    }
    getVideoDefaultSettings() {
        this.userService.getVideoDefaultSettings().subscribe(
           (result: any) => {
                var body = result['_body'];
                if ( body != "" ) {
                this.active = true;  
                var response = JSON.parse( body );
                console.log(response);
                this.refService.defaultPlayerSettings = response;
                this.defaultVideoPlayer = response;
                this.compControllerColor = response.controllerColor;
                this.compPlayerColor = response.playerColor;
                this.valueRange = response.transparency;
                this.defaultPlayerbuildForm();
              }
            }
        );
    }
    cssSettings(event: boolean) {
        this.PlayerSettingsClicked = event;
    }

    changeControllerColor(event: any) {
    this.defaultVideoPlayer.controllerColor = event;
    this.compControllerColor = event;
    }
    changePlayerColor(event: any) {
      this.defaultVideoPlayer.playerColor = event;
      this.compPlayerColor = event;
    }
    transperancyControllBar(value: any) {
    this.valueRange = value;
    this.defaultVideoPlayer.transparency = value;
    }
   allowLikes(event: any) {
       this.defaultVideoPlayer.allowLikes = event;
   }
   allowComments(event: any) {
       this.defaultVideoPlayer.allowComments = event;
   }
   allowSharing(event: any) {
    this.defaultVideoPlayer.allowSharing = event;
   }
   changeFullscreen(event: any) {
       this.defaultVideoPlayer.allowFullscreen = event;
   }
   UpdatePlayerSettingsValues() {
        //  this.defaultVideoPlayer = this.defaultPlayerForm.value;
        this.defaultVideoPlayer.playerColor = this.compPlayerColor;
        this.defaultVideoPlayer.controllerColor = this.compControllerColor;
        this.defaultVideoPlayer.transparency = this.valueRange;

        this.userService.updatePlayerSettings(this.defaultVideoPlayer)
        .subscribe(
            (result: any) => {
                this.defaultPlayerSuccess = true;
                 setTimeout(function() {
                  $('#defaultPlayerSettings').slideUp(500);
             }, 5000);
                this.getVideoDefaultSettings();
            }
        );
       this.defaultPlayerSuccess = false;
        // write service mthod to save the data in db
    }
    defaultPlayerbuildForm() {
        this.defaultPlayerForm = this.fb.group({
          //  'defaultSettings': [this.defaultVideoPlayer.defaultSettings],
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
}
