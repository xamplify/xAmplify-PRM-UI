import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NavigationCancel, Event, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { EnvService } from 'app/env.service';
import { UserService } from "./core/services/user.service";
import { AuthenticationService } from "./core/services/authentication.service";
import { Title }     from '@angular/platform-browser';

import { SlimLoadingBarService } from 'ng2-slim-loading-bar';

import { Idle, DEFAULT_INTERRUPTSOURCES, IdleExpiry, LocalStorageExpiry } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';


declare var QuickSidebar, $: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [LocalStorageExpiry, { provide: IdleExpiry, useExisting: LocalStorageExpiry }, Idle],

})
export class AppComponent implements OnInit, AfterViewInit {

  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;
  title = 'angular-idle-timeout';
sessionExpireMessage = "Your session has timed out. Please login again.";
    constructor(private idle: Idle, private keepalive: Keepalive, private titleService: Title,public userService: UserService,public authenticationService: AuthenticationService, public env: EnvService, private slimLoadingBarService: SlimLoadingBarService, private router: Router) {
      
      //this.checkIdleState(idle,keepalive);
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
      console.log("on inint");
        
        //QuickSidebar.init();
       // this.getTeamMembersDetails();
        // reloading the same url with in the application
        this.router.routeReuseStrategy.shouldReuseRoute = function () {
            return false;
        };
        this.router.events.subscribe((evt) => {
            if (evt instanceof NavigationEnd) {
                this.router.navigated = false;
                let currentUrl = evt.url;
                console.log("current Url:-"+currentUrl);
                let formUrl = currentUrl.indexOf('f/')>-1;
                let pageUrl = currentUrl.indexOf('l/')>-1;
                let partnerLandingPageUrl = currentUrl.indexOf('pl/')>-1;
                let termsAndConditionUrl = currentUrl.indexOf('terms-conditions')>-1;
                let privacyPolicyUrl = currentUrl.indexOf('privacy-policy')>-1;
                let callbackUrl = currentUrl.indexOf('callback')>-1;
                let shareUrl = currentUrl.indexOf('embed')>-1;
                let showCampaignVideoUrl = currentUrl.indexOf('showCampaignVideo')>-1;
                let showCampaignEmail = currentUrl.indexOf('showCampaignEmail')>-1;
                let companyPageUrl = currentUrl.indexOf('company-page')>-1;
                let partnerPageUrl = currentUrl.indexOf('partner-page')>-1;
                let logeUrl = currentUrl.indexOf('loge')>-1;
                let unsubscribeUrl = currentUrl.indexOf('unsubscribe')>-1;
                let serviceUnavailableUrl = currentUrl.indexOf('su')>-1;
                let accessDeniedUrl = currentUrl.indexOf('access-denied')>-1;
                let rsvpUrl = currentUrl.indexOf('rsvp')>-1;
                let smsShowCampaignUrl = currentUrl.indexOf('smsShowCampaign')>-1;
                let showEventCampaignUrl = currentUrl.indexOf('showEventCampaignSMS')>-1;
                let logsUrl = currentUrl.indexOf('logs')>-1;
                let campaignLandingPageUrl  = currentUrl.indexOf('showCampaignLandingPage')>-1;
                let scpUrl = currentUrl.indexOf('scp/')>-1;
                let clplUrl = currentUrl.indexOf('clpl/')>-1;
                let requestdemoUrl = currentUrl.indexOf('requestdemo')>-1;
                let activateAccountUrl = currentUrl.indexOf('axAa')>-1;
                let downloadUrl = currentUrl.indexOf('download')>-1;
                let samlSecurityUrl = currentUrl.indexOf('samlsecurity')>-1;
                let exculdeUrls =  ( !formUrl && !pageUrl && !partnerLandingPageUrl && !termsAndConditionUrl && !privacyPolicyUrl && !callbackUrl &&
                                  !shareUrl && !showCampaignVideoUrl &&  !showCampaignEmail &&  !companyPageUrl && !partnerPageUrl && !logeUrl &&
                                  !unsubscribeUrl && !serviceUnavailableUrl && !accessDeniedUrl &&   !rsvpUrl && !smsShowCampaignUrl && !showEventCampaignUrl &&
                                  !logsUrl && !campaignLandingPageUrl && !scpUrl && !clplUrl && !requestdemoUrl && !activateAccountUrl && !downloadUrl && !samlSecurityUrl
                                  );

                 if(exculdeUrls || currentUrl=="-/"){
                  this.logoutFromAllTabs();
                 }else{
                  console.log("Will not be logged out");
                 }
                 
               
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

    logoutFromAllTabs(){
      window.addEventListener('storage', (event) => {
          if (event.storageArea == localStorage) {
              const currentUser = localStorage.getItem( 'currentUser' );
            if(currentUser==undefined){
              this.authenticationService.sessinExpriedMessage = this.sessionExpireMessage;
              this.authenticationService.logout();
            }else{
              this.authenticationService.sessinExpriedMessage = "";
            }
           
          }
        }, false);
    }


    /***************Idle State Check************* */
    checkIdleState(idle:Idle,keepalive:Keepalive){
      // sets an idle timeout of 5*60*60 seconds, for testing purposes.
      idle.setIdle(5);
      // sets a timeout period of 5 seconds. after 15 seconds of inactivity, the user will be considered timed out.
      idle.setTimeout(5);
      // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
      idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
  
      idle.onIdleEnd.subscribe(() => { 
        this.idleState = 'No longer idle.'
        console.log(this.idleState);
        this.resetIdleState();
      });
      
      idle.onTimeout.subscribe(() => {
        this.idleState = 'Timed out!';
        this.timedOut = true;
        console.log(idle);
        console.log(this.idleState);
        this.authenticationService.sessinExpriedMessage = this.sessionExpireMessage;
        this.authenticationService.logout();
      });
      
      idle.onIdleStart.subscribe(() => {
          this.idleState = 'You\'ve gone idle!'
          console.log(this.idleState);
      });
      
      idle.onTimeoutWarning.subscribe((countdown) => {
        this.idleState = 'You will time out in ' + countdown + ' seconds!'
      });
  
      // sets the ping interval to 15 seconds
      keepalive.interval(1800);
      keepalive.onPing.subscribe(() => this.lastPing = new Date());
      this.authenticationService.getUserLoggedIn().subscribe(userLoggedIn => {
        if (userLoggedIn) {
          idle.watch();
          this.timedOut = false;
        } else {
          console.log(this.lastPing);
          console.log("timeout");
          idle.stop();
        }
      });
      }
  
      resetIdleState() {
        this.idle.watch();
        //xthis.idleState = 'Started.';
        this.timedOut = false;
      }


 
}
