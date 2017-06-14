import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { SocialService } from '../../services/social.service';
import { AuthenticationService } from '../../../core/services/authentication.service';

@Component({
  selector: 'app-social-manage',
  templateUrl: './social-manage.component.html',
  styleUrls: ['./social-manage.component.css']
})
export class SocialManageComponent implements OnInit {
    socialStatusProviders: any;
    accessToken = this.authenticationService.access_token;
    MEDIA_URL = this.authenticationService.MEDIA_URL;
    constructor( private router: Router, private route: ActivatedRoute, private socialService: SocialService, 
            private authenticationService: AuthenticationService) { }
    
    listAccounts( providerName: string ) {/*
        this.socialService.listAccounts( providerName )
            .subscribe(
            result => {
                this.socialStatusProviders = result;
            },
            error => console.log( error ),
            () => console.log( 'login() Complete' ) );
    */}
    ngOnInit() {
        try {
            let providerName = this.route.snapshot.params['social'];
            this.listAccounts( providerName );
        }
        catch ( err ) {
            console.log( err );
        }
    }

}
