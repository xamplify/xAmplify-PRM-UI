import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SocialService } from '../../services/social.service';

@Component( {
    selector: 'app-social-login',
    templateUrl: './social-login.component.html',
    styleUrls: ['./social-login.component.css']
})
export class SocialLoginComponent implements OnInit {
    constructor( private router: Router, private route: ActivatedRoute, private socialService: SocialService ) {

    }

    login( providerName: string ) {
        this.socialService.login( providerName )
            .subscribe(
            result => {
                console.log( "result: " + result );
                if ( result !== null ) {
                    window.location.href = "" + result;
                } else {
                    //this.logError(); 
                }
            },
            error => console.log( error ),
            () => console.log( 'login() Complete' ) );
    }

    ngOnInit() {
        try {
            let providerName = this.route.snapshot.params['social'];
            this.login( providerName );
        }
        catch ( err ) {
            console.log( err );
        }
    }

}
