import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { SocialService } from '../../services/social.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { SocialConnection } from '../../../social/models/social-connection';

declare var swal: any;
@Component( {
    selector: 'app-social-manage',
    templateUrl: './social-manage.component.html',
    styleUrls: ['./social-manage.component.css']
})
export class SocialManageComponent implements OnInit {
    socialConnections: SocialConnection[] = new Array<SocialConnection>();
    response : any;
    constructor( private router: Router, private route: ActivatedRoute, private socialService: SocialService,
        private authenticationService: AuthenticationService ) { }

    listAccounts( userId: number, providerName: string ) {
        this.socialService.listAccounts( userId, providerName, "ALL" )
            .subscribe(
            result => {
                this.socialConnections = result;
                this.socialService.setDefaultAvatar(this.socialConnections);
            },
            error => console.log( error ),
            () => {});
    }

    save() {
        this.socialService.saveAccounts( this.socialConnections )
            .subscribe(
            result => {
                this.response = 'success';
            },
            error => console.log( error ),
            () => console.log( 'save() Complete' ) );

    }
    
    confirmDialog(socialConnection: SocialConnection){
        if(! socialConnection.active)
            socialConnection.active = !socialConnection.active;
        else {
            let self = this;
            swal( {
                title: 'Are you sure?',
                text: "Do you really want to deselect it!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, deselect'

            }).then( function() {
                socialConnection.active = !socialConnection.active;
            }).catch( swal.noop );
        }
    }

    cancel() {
        this.router.navigate( [''] );
    }
    ngOnInit() {
        try {
            let providerName = this.route.snapshot.params['social'];
            let userId = this.authenticationService.getUserId();
            this.listAccounts( userId, providerName );
        }
        catch ( err ) {
            console.log( err );
        }
    }

}
