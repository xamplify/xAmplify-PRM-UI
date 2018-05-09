import { Component, OnInit } from '@angular/core';
import { FacebookService } from '../../services/facebook.service';
import { SocialService } from '../../services/social.service';
import { AuthenticationService } from '../../../core/services/authentication.service';

import { SocialConnection } from '../../models/social-connection';
import { ReferenceService } from '../../../core/services/reference.service';

@Component( {
    selector: 'app-facebook-accounts',
    templateUrl: './facebook-accounts.component.html',
    styleUrls: ['./facebook-accounts.component.css']
})
export class FacebookAccountsComponent implements OnInit {
    socialConnections: any[] = new Array<any>();

    constructor( private facebookService: FacebookService, private authenticationService: AuthenticationService, private socialService: SocialService,
    public referenceService:ReferenceService ) { }

    listAccounts( userId: number, providerName: string ) {
        this.socialService.listAccounts( userId, providerName, "ACTIVE" )
            .subscribe(
            result => {
                this.socialConnections = result;
                this.socialService.setDefaultAvatar(this.socialConnections);
            },
            error => console.log( error ),
            () => {});
    }

    ngOnInit() {
        try {
            const userId = this.authenticationService.getUserId();
            this.listAccounts( userId, 'FACEBOOK' );
        } catch ( err ) {
            console.log( err );
        }
    }
}
