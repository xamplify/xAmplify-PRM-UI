import { Component, OnInit } from '@angular/core';

import { UserService } from '../../core/services/user.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';

@Component( {
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
    isDefaultPage: boolean;
    constructor( private userService: UserService, private authenticationService: AuthenticationService, private referenceService: ReferenceService ) { }
    getDefaultPage( userId: number ) {
        this.userService.getUserDefaultPage( userId )
            .subscribe(
            data => {
                this.isDefaultPage = data['_body'].includes( 'welcome' );
            },
            error => console.log( error ),
            () => { }
            );
    }
    setWelcomeAsDefaultPage( event: any ) {
        let defaultPage;
        if ( event )
            defaultPage = 'welcome';
        else
            defaultPage = 'dashboard';
        this.userService.setUserDefaultPage( this.authenticationService.getUserId(), defaultPage )
            .subscribe(
            data => {
                this.isDefaultPage = event;
                this.referenceService.userDefaultPage = defaultPage.toUpperCase();
            },
            error => console.log( error ),
            () => { }
            );
    }

    ngOnInit() {
        const userId = this.authenticationService.getUserId();
        this.getDefaultPage(userId);
    }

}
