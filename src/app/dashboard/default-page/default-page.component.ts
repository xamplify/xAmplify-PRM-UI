import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { UserService } from '../../core/services/user.service';

@Component({
    selector: 'app-default-page',
    templateUrl: './default-page.component.html',
    styleUrls: ['./default-page.component.css']
})
export class DefaultPageComponent implements OnInit {
    defaultPage: string;
    constructor(private router: Router, private userService: UserService, private authenticationService: AuthenticationService,
        private referenceService: ReferenceService) { }

    getDefaultPage(userId: number) {
        this.userService.getUserDefaultPage(userId)
            .subscribe(
            data => this.defaultPage = data.replace(/['"]+/g, ''),
            error => console.log(error),
            () => {
                console.log(this.defaultPage);
                if (this.defaultPage === 'welcome') {
                   this.goToWelcomePage();
                } else {
                    this.goToDashBoard();
                }
            }
            );
    }

    
    goToWelcomePage(){
        if(this.authenticationService.user.hasCompany){
            this.router.navigate(['/home/dashboard/welcome']);
        }else{
            this.router.navigate(['/home/dashboard/add-company-profile']);
        }
    }
    
    goToDashBoard(){
        if(this.authenticationService.user.hasCompany){
            this.router.navigate(['/home/dashboard']);
        }else{
            this.router.navigate(['/home/dashboard/add-company-profile']);
        }
    }
    
    isListView(userId: number) {
        this.userService.isListView(userId)
            .subscribe(
            data => {this.referenceService.isListView = data;},
            error => console.log(error),
            () => { }
            );
    }
    ngOnInit() {
        const userId = this.authenticationService.user.id;
        this.getDefaultPage(userId);
        this.isListView(userId);
    }

}
