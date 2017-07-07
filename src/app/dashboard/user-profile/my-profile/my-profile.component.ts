import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
    updatePasswordSuccess = false;
    profileUploadSuccess = false;
    userProfileImage: string = "assets/admin/pages/media/profile/icon-user-default.png";
    userData: User;
    parentModel = { 'displayName': '', 'profilePicutrePath': 'assets/admin/pages/media/profile/icon-user-default.png' };
    public uploader: FileUploader;
    public compPlayerColor = '#a3d816';
    public compControllerColor = '#d61b1b';
    public valueRange = 100;
    public PlayerSettingsClicked: boolean;
    constructor( private fb: FormBuilder, private userService: UserService, private authenticationService: AuthenticationService,
     private logger: Logger, private refService: ReferenceService) {
        this.PlayerSettingsClicked = false;
        this.userData = this.authenticationService.userProfile;
        console.log(this.userData);
        this.defaultVideoPlayer = this.refService.playerValues;
        this.compControllerColor = this.defaultVideoPlayer.controllerColor;
        this.compPlayerColor = this.defaultVideoPlayer.playerColor;
        console.log(this.defaultVideoPlayer);
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
            var imageFilePath = JSON.parse( response );
            console.log( imageFilePath );
            this.userProfileImage = imageFilePath['message'];
            this.parentModel.profilePicutrePath = imageFilePath['message'];
            this.uploader.queue.length = 0;
            this.clearImage();
            this.profileUploadSuccess = true;
            $("#profile-pic-upload-div" ).show();
            this.refService.topNavBarUserDetails.profilePicutrePath = imageFilePath['message'];
            this.authenticationService.userProfile.profileImagePath = imageFilePath['message'];
            setTimeout( function() { $( "#profile-pic-upload-div" ).hide( 500 ); }, 5000 );
        };

    }

    clearImage() {
        $( 'div#previewImage > img' ).remove();
        $( 'div#previewImage' ).append( '<img src="http://www.placehold.it/200x150/EFEFEF/AAAAAA&amp;text=no+image"/>' );
        $( '#priview' ).attr( 'src', 'http://www.placehold.it/200x150/EFEFEF/AAAAAA&amp;text=no+image' );

    }
    fileChange( inputFile: any, event: any ) {
        this.readFiles( inputFile.files );
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
                this.readFiles( files, index + 1 );// Read the next file;
            });
        }
    }
    ngOnInit() {
        try {
            Metronic.init();
            Layout.init();
            Demo.init();
            // Profile.init();
            this.validateUpdatePasswordForm();
            this.validateUpdateUserProfileForm();
            this.defaultPlayerbuildForm();
            if ( this.userData.firstName != null ) {
                this.userData.displayName = this.userData.firstName;
            } else {
                this.userData.displayName = this.userData.emailId;
            }

        } catch ( err ) { }
    }


    updatePassword() {
        console.log( this.updatePasswordForm.value );
        var userPassword = {
            'oldPassword': this.updatePasswordForm.value.oldPassword,
            'newPassword': this.updatePasswordForm.value.newPassword,
            'userId':this.authenticationService.user.id
        }
        this.userService.updatePassword(userPassword)
            .subscribe(
            data => {
                var body = data['_body'];
                if ( body != "" ) {
                    var response = JSON.parse( body );
                    var message = response.message;
                    if ( message == "Wrong Password" ) {
                        this.formErrors['oldPassword'] = message;
                    } else if ( response.message == "Password Updated Successfully" ) {
                        this.updatePasswordSuccess = true;
                        $("#update-password-div" ).show();
                        this.updatePasswordForm.reset();
                        setTimeout( function() { $( "#update-password-div" ).hide( 500 ); }, 5000 );
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
            'required': 'WebsiteUrl required.'
        }


    };

    /*******************Update User Profile*************************************/
    updateUserProfileForm: FormGroup;
    updateProfileSuccess = false;
    validateUpdateUserProfileForm() {
        console.log( this.userData );
        this.updateUserProfileForm = this.fb.group( {
            'firstName': [this.userData.firstName, Validators.required],
            'lastName': [this.userData.lastName, Validators.required],
            'mobileNumber': [this.userData.mobileNumber, Validators.required],
            'interests': [this.userData.interests, Validators.required],
            'occupation': [this.userData.occupation, Validators.required],
            'description': [this.userData.description, Validators.required],
            'websiteUrl': [this.userData.websiteUrl, Validators.required],

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
    defaultPlayerbuildForm() {
        this.defaultPlayerForm = this.fb.group({
            'defaultSettings': [this.defaultVideoPlayer.defaultSettings],
            'enableVideoController': [this.defaultVideoPlayer.enableVideoController, Validators.required],
            'enableSettings': [this.defaultVideoPlayer.enableSettings, Validators.required],
            'allowFullscreen': [this.defaultVideoPlayer.allowFullscreen, Validators.required],
            'playerColor': [this.defaultVideoPlayer.playerColor],
            'controllerColor': [this.defaultVideoPlayer.controllerColor],
            'transparency': [this.defaultVideoPlayer.transparency],
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
     
    updateUserProfile() {
        console.log( this.updateUserProfileForm.value );
        this.userService.updateUserProfile( this.updateUserProfileForm.value,this.authenticationService.user.id )
            .subscribe(
            data => {
                var body = data['_body'];
                if ( body != "" ) {
                    var response = JSON.parse( body );
                    var message = response.message;
                    if ( message == "User Updated" ) {
                        this.updateProfileSuccess = true;
                        $( "#update-profile-div-id" ).show();
                        this.userData = this.updateUserProfileForm.value;
                        this.userData.displayName = this.updateUserProfileForm.value.firstName;
                        this.parentModel.displayName =this.updateUserProfileForm.value.firstName;
                        this.refService.topNavBarUserDetails.displayName = this.parentModel.displayName;
                        setTimeout( function() { $( "#update-profile-div-id" ).hide( 500 ); }, 5000 );
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
    cssSettings(event: boolean) {
        this.PlayerSettingsClicked = event;
    }

    changeControllerColor(event: any) {

    }
    changePlayerColor(event: any) {

    }
    transperancyControllBar(value: any) {
    this.valueRange = value;
    }
    UpdatePlayerSettings() {
         this.defaultVideoPlayer = this.defaultPlayerForm.value;
         const updateDefaultValues = {
            'defaultSettings': this.defaultPlayerForm.value.defaultSettings,
            'enableVideoController': this.defaultPlayerForm.value.enableVideoController,
            'enableSettings': this.defaultPlayerForm.value.enableSettings,
            'allowFullscreen': this.defaultPlayerForm.value.allowFullscreen,
            'playerColor': this.defaultPlayerForm.value.playerColor,
            'controllerColor': this.defaultPlayerForm.value.controllerColor,
            'transparency': this.defaultPlayerForm.value.transparency,
        }

        // write service mthod to save the data in db
    }

}
