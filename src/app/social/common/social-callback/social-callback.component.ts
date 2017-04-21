import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { SocialService } from '../../services/social.service';

@Component( {
    selector: 'app-social-callback',
    templateUrl: './social-callback.component.html',
    styleUrls: ['./social-callback.component.css']
})
export class SocialCallbackComponent implements OnInit {
    constructor( private router: Router, private route: ActivatedRoute, private socialService: SocialService ) { }

    callback( providerName: string ) {
        this.socialService.callback( providerName )
            .subscribe(
            result => {
                console.log( "result: " + result );
                localStorage.removeItem( providerName );
                localStorage.setItem( providerName, result.toString() );
                this.router.navigate( ['/home/dashboard'] );
            },
            error => console.log( error ),
            () => console.log( 'login() Complete' ) );
    }

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
