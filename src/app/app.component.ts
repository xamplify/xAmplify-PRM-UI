import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NavigationCancel, Event, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { EnvService } from 'app/env.service';
import { UserService } from "./core/services/user.service";
import { AuthenticationService } from "./core/services/authentication.service";
import { Title }     from '@angular/platform-browser';

import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
declare var QuickSidebar, $: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

    constructor(private titleService: Title,public userService: UserService,public authenticationService: AuthenticationService, public env: EnvService, private slimLoadingBarService: SlimLoadingBarService, private router: Router) {
        // logger.level = logger.Level.LOG;
    }
    
    getTeamMembersDetails(){
        this.userService.getRoles(this.authenticationService.getUserId())
        .subscribe(
        response => {
             if(response.statusCode==200){
                this.authenticationService.loggedInUserRole = response.data.role;
                this.authenticationService.isPartnerTeamMember = response.data.partnerTeamMember;
                this.authenticationService.superiorRole = response.data.superiorRole;
             }else{
                 this.authenticationService.loggedInUserRole = 'User';
             }
        },
        () => console.log('Finished')
        );
    }
    
    
    ngOnInit() {

        window.addEventListener('storage', (event) => {
            if (event.storageArea == localStorage) {
                const currentUser = localStorage.getItem( 'currentUser' );
              if(currentUser==undefined){
                this.authenticationService.sessinExpriedMessage = "Your session has timed out. Please login again.";
                this.authenticationService.logout();
              }else{
                this.authenticationService.sessinExpriedMessage = "";
              }
             
            }
          }, false);

        //QuickSidebar.init();
       // this.getTeamMembersDetails();
        // reloading the same url with in the application
        this.router.routeReuseStrategy.shouldReuseRoute = function () {
            return false;
        };
        this.router.events.subscribe((evt) => {
            if (evt instanceof NavigationEnd) {
                this.router.navigated = false;
                window.scrollTo(0, 0);
            }
            this.navigationInterceptor(evt);
        });
    }
    private navigationInterceptor(event: Event): void {
      if (event instanceof NavigationStart) {  this.slimLoadingBarService.start(); }
      if (event instanceof NavigationEnd) { this.slimLoadingBarService.complete(); }
      // Set loading state to false in both of the below events to hide the loader in case a request fails
      if (event instanceof NavigationCancel) { this.slimLoadingBarService.stop(); }
      if (event instanceof NavigationError) { this.slimLoadingBarService.stop(); }
    }
    ngAfterViewInit(){
          $('body').tooltip({ selector: '[data-toggle="tooltip"]' }); 
          $('body').popover({ selector: '[data-toggle="popover"]' }); 
    }
}
