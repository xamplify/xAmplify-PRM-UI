import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { SocialService } from '../../services/social.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { ReferenceService } from '../../../core/services/reference.service';

@Component( {
    selector: 'app-social-callback',
    templateUrl: './social-callback.component.html',
    styleUrls: ['./social-callback.component.css']
})
export class SocialCallbackComponent implements OnInit {
    constructor( private router: Router, private route: ActivatedRoute, private socialService: SocialService,
    		 private authenticationService:AuthenticationService,
             private refService :ReferenceService) { }
    
    callback( providerName: string ) {
        let client_id:string;
        let client_secret:string;
    
        this.socialService.callback( providerName )
            .subscribe(
            result => {
                console.log( "result :" + result);
                this.refService.user = result;
                
                if(providerName=="salesforce"){
                    client_id= "3MVG9ZL0ppGP5UrD8Ne7RAUL7u6QpApHOZv3EY_qRFttg9c1L2GtSyEqiM8yU8tT3kolxyXZ7FOZfp1V_xQ4l";
                    client_secret = "8542957351694434668";
               
                }else  if(providerName=="google"){
                    client_id= "733045589374-1u3eb2b1v5g8hsoql2f4qjr5kugkv51b.apps.googleusercontent.com";
                    client_secret = "dw8gUNgnPRqOV7V7aUuMUxye";
                }else  if(providerName=="facebook"){
                    client_id= "1348853938538956";
                    client_secret = "69202865ccc82e3cf43a5aa097c4e7bf";
                }
                
                this.socialService.xtremandlogin( client_id, client_secret )
                .subscribe( result => {
                    console.log( "result: " + result );
                    if ( result === true ) {
                        let abcd =  this.socialService.access_token;
                        let expires_in = 60;
                        let username= "naresh.kotha04@gmail.com";
                        localStorage.removeItem('currentUser');
                        localStorage.setItem('currentUser', JSON.stringify(
                                {   username: username, 
                                    access_token: abcd, 
                                    refresh_token : abcd,
                                    expires_in: expires_in
                                }
                            ));
                        this.authenticationService.access_token=abcd;
                        
                        //if user is coming from login
                        //this.getLoggedInUserDetails();
                        this.router.navigate( [''] );
                        //if user is coming from any link

                    } else {
                      console.log("hi");
                    }
                },
                    err => console.log(),
                    () => console.log( 'login() Complete' ) );
                return false;
                
               
            },
            error => console.log( error ),
            () => console.log( 'login() Complete' ) );
        return false;
    }


    /*callback( providerName: string ) {
        this.socialService.callback( providerName )
            .subscribe(
            result => {
                console.log( "result: " + result );
                localStorage.removeItem( providerName );
                localStorage.setItem( providerName, result.toString() );
                this.router.navigate( ['home/'+providerName+'/manage'] );
            },
            error => console.log( error ),
            () => console.log( 'login() Complete' ) );
    }*/

    ngOnInit() {
        try {
            let providerName = this.route.snapshot.params['social'];
            this.callback( providerName );
        }
        catch ( err ) {
            console.log( err );
        }
    }

}
