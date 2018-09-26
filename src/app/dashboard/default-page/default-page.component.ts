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
      if(this.referenceService.userDefaultPage==='WELCOME'|| this.referenceService.userDefaultPage==='DASHBOARD'){
        this.checkDefaultPage(this.referenceService.userDefaultPage);
      }else {
      this.userService.getUserDefaultPage(userId)
            .subscribe(
            data => this.defaultPage = data.replace(/['"]+/g, ''),
            error => {this.goToWelcomePage();
                    this.referenceService.userDefaultPage = "WELCOME";
            },
            () => {
                console.log(this.defaultPage);
                this.checkDefaultPage(this.defaultPage);
            }
            );
       }
    }
   checkDefaultPage(defaultPage:string){
    if (defaultPage === 'welcome' || defaultPage==='WELCOME') {  this.goToWelcomePage();
    } else {  this.goToDashBoard();  }
   }

    goToWelcomePage(){
        if(this.authenticationService.isSuperAdmin()){
            this.router.navigate(['/home/dashboard/admin-report']);
        }
        else if(this.authenticationService.user.hasCompany){
            this.router.navigate(['/home/dashboard/welcome']);
        }else{
            this.router.navigate(['/home/dashboard/add-company-profile']);
        }
    }

    goToDashBoard(){
        if(this.authenticationService.isSuperAdmin()){
            this.router.navigate(['/home/dashboard/admin-report']);
        }
        else if(this.authenticationService.user.hasCompany){
            this.router.navigate(['/home/dashboard']);
        }else{
            this.router.navigate(['/home/dashboard/add-company-profile']);
        }
    }

    isGridView(userId: number) {
        this.userService.isGridView(userId)
            .subscribe(
            data => {this.referenceService.isGridView = data;},
            error => console.log(error),
            () => { }
            );
    }
    ngOnInit() {
        const userId = this.authenticationService.user.id;
        this.getDefaultPage(userId);
        if(!this.referenceService.isMobileScreenSize()){
        this.isGridView(userId); }
        else { this.referenceService.isGridView = true; }
    }

}
