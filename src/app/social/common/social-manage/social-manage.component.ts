import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { SocialService } from '../../services/social.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import {SocialConnection} from '../../../social/models/social-connection';
@Component( {
    selector: 'app-social-manage',
    templateUrl: './social-manage.component.html',
    styleUrls: ['./social-manage.component.css']
})
export class SocialManageComponent implements OnInit {
    socialConnections: SocialConnection[] = new Array<SocialConnection>();
    constructor( private router: Router, private route: ActivatedRoute, private socialService: SocialService,
        private authenticationService: AuthenticationService ) { }

    listAccounts( userId: number, providerName: string ) {
        this.socialService.listAccounts( userId, providerName )
            .subscribe(
            result => {
                this.socialConnections = result;
            },
            error => console.log( error ),
            () => console.log( 'login() Complete' ) );
    }
    
    save(){
        this.socialService.saveAccounts(this.socialConnections)
            .subscribe(
            result => {
                alert(result);
            },
            error => console.log( error ),
            () => console.log( 'login() Complete' ) );
    
    }
    ngOnInit() {
        try {
            let providerName = this.route.snapshot.params['social'];
            const userId = this.authenticationService.user.id;
            this.listAccounts( userId, providerName );
        }
        catch ( err ) {
            console.log( err );
        }
    }

}
