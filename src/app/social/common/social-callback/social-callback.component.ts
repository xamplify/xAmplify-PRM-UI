import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SocialConnection } from '../../../social/models/social-connection';
import { SocialService } from '../../services/social.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { ReferenceService } from '../../../core/services/reference.service';

@Component( {
    selector: 'app-social-callback',
    templateUrl: './social-callback.component.html',
    styleUrls: ['./social-callback.component.css']
})
export class SocialCallbackComponent implements OnInit {
    providerName: string;
    socialConnection: SocialConnection = new SocialConnection();
    error: string;
    constructor( private router: Router, private route: ActivatedRoute, private socialService: SocialService,
        private authenticationService: AuthenticationService,
        private refService: ReferenceService ) { }

    callback( providerName: string ) {
        let client_id: string;
        let client_secret: string;

        this.socialService.callback( providerName )
            .subscribe(
            result => {
                this.socialConnection = result;
                if(localStorage.getItem( 'currentUser' )){
                    this.redirect();
                }else{
                    this.refService.userName = result["emailId"];

                    if ( providerName == "salesforce" ) {
                        client_id = "3MVG9ZL0ppGP5UrD8Ne7RAUL7u6QpApHOZv3EY_qRFttg9c1L2GtSyEqiM8yU8tT3kolxyXZ7FOZfp1V_xQ4l";
                        client_secret = "8542957351694434668";

                    } else if ( providerName == "google" ) {
                        client_id = "733045589374-1u3eb2b1v5g8hsoql2f4qjr5kugkv51b.apps.googleusercontent.com";
                        client_secret = "dw8gUNgnPRqOV7V7aUuMUxye";
                    } else if ( providerName == "facebook" ) {
                        client_id = "1348853938538956";
                        client_secret = "69202865ccc82e3cf43a5aa097c4e7bf";
                    } else if ( providerName == "twitter" ) {
                        client_id = "J60F2OG6jZOEK33xK3MtiU4zI";
                        client_secret = "d3xQ5hPlPZtQdeMkNAjlejXFvwRrPSalwbpyApncxi49Pf4lFi";
                    }

                    var authorization = 'Basic' + btoa( client_id + ':' );
                    var body = 'client_id=' + client_id + '&client_secret=' + client_secret + '&grant_type=client_credentials';

                    this.authenticationService.login( authorization, body, this.refService.userName )
                        .subscribe( result => {
                            console.log( "result: " + this.authenticationService.user );
                            if ( this.authenticationService.user ) {
                               let currentUser = JSON.parse(localStorage.getItem( 'currentUser' ));
                               if(currentUser.hasCompany){
                                   this.redirect();
                               }else{
                                   this.router.navigate( ['/home/dashboard/add-company-profile'] );
                               }
                            } else {
                                this.router.navigate( ['/logout'] );
                            }
                        },
                        error => {
                            this.error = error;
                        },
                        () => console.log( 'login() Complete' ) );
                    return false;
                }
            },
            error => {
                this.error = error;   
            },
            () => console.log( 'login() Complete' ) );
        return false;
    }

    redirect() {
        if ( !this.socialConnection.existingUser )
            this.router.navigate( ['/home/social/manage/' + this.providerName] );
        else
            this.router.navigate( ['/home/dashboard/default'] );
    }

    ngOnInit() {
        try {
            this.error = null;
            this.providerName = this.route.snapshot.params['social'];
            this.callback( this.providerName );
        }
        catch ( error ) {
            this.error = error;
        }
    }

}
