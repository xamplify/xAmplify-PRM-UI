import { Component, OnInit } from '@angular/core';

import { UserService } from '../../core/services/user.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';

import { UserDefaultPage } from '../../core/models/user-default-page';

@Component( {
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
    userDefaultPage: UserDefaultPage = new UserDefaultPage();
    constructor( private userService: UserService, private authenticationService: AuthenticationService, private referenceService: ReferenceService ) { }
    
    getDefaultPage( userId: number ) {
        this.userService.getUserDefaultPage( userId )
            .subscribe(
            data => {
                if(data['_body'].includes('welcome')){
                    this.userDefaultPage.isCurrentPageDefaultPage = true;
                    this.referenceService.userDefaultPage = 'WELCOME';
                }
            },
            error => console.log( error ),
            () => { }
            );
    }
    setWelcomeAsDefaultPage( event: any ) {
        this.referenceService.userDefaultPage = event ?  'WELCOME': 'DASHBOARD';
        this.userService.setUserDefaultPage(this.authenticationService.getUserId(), this.referenceService.userDefaultPage)
            .subscribe(
            data => {
                this.userDefaultPage.isCurrentPageDefaultPage = event;
                this.userDefaultPage.responseType = 'SUCCESS';
                this.userDefaultPage.responseMessage = 'Your setting has been saved successfully';
            },
            error => {
                this.userDefaultPage.responseType = 'ERROR';
                this.userDefaultPage.responseMessage = 'an error occurred while processing your request';
            },
            () => { }
            );
    }

    ngOnInit() {
        const userId = this.authenticationService.getUserId();
        this.getDefaultPage(userId);
    }

}
