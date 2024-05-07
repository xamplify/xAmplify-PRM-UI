import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NavigationCancel, Event, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { EnvService } from 'app/env.service';
import { UserService } from "./core/services/user.service";
import { AuthenticationService } from "./core/services/authentication.service";
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Idle, DEFAULT_INTERRUPTSOURCES, IdleExpiry, LocalStorageExpiry } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { RouteConfigLoadStart,GuardsCheckStart,GuardsCheckEnd,RouteConfigLoadEnd,Event as RouterEvent } from "@angular/router";
import {VersionCheckService} from "app/version-check/version-check.service";
import { UtilService } from './core/services/util.service';
import * as io from 'socket.io-client';
declare var $: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [VersionCheckService,LocalStorageExpiry, { provide: IdleExpiry, useExisting: LocalStorageExpiry }, Idle],

})
export class AppComponent implements OnInit, AfterViewInit {

  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;
  title = 'angular-idle-timeout';
  public isShowingRouteLoadIndicator: boolean;
  public showLoaderForAuthGuard:boolean;
  public loader:boolean;
  sessionExpireMessage = "Your session has timed out. Please login again.";
  xamplifygif = "assets/images/xamplify-icon.gif";
  socket;
  numberOfOnlineUsers: number;
   
constructor(private versionCheckService:VersionCheckService,private idle: Idle, private keepalive: Keepalive,public userService: UserService,
  public authenticationService: AuthenticationService, public env: EnvService, private slimLoadingBarService: SlimLoadingBarService,
   private router: Router,private utilService:UtilService) {
    //this.socket = io();
      //this.checkIdleState(idle,keepalive);
    this.addLoaderForAuthGuardService();
		this.addLoaderForLazyLoadingModules(router);
    }

    addLoaderForAuthGuardService(){
      this.router.events.subscribe(event => {
        if (event instanceof GuardsCheckStart) {
          this.showLoaderForAuthGuard = true;
        }     
        if (event instanceof GuardsCheckEnd) {
          this.showLoaderForAuthGuard = false;
        } 
      });
    }

	addLoaderForLazyLoadingModules(router:Router){
		this.isShowingRouteLoadIndicator = false;
 
		// As the router loads modules asynchronously (via loadChildren), we're going to
		// keep track of how many asynchronous requests are currently active. If there is
		// at least one pending load request, we'll show the indicator.
		var asyncLoadCount = 0;
 
		// The Router emits special events for "loadChildren" configuration loading. We
		// just need to listen for the Start and End events in order to determine if we
		// have any pending configuration requests.
		router.events.subscribe(
			( event: RouterEvent ) : void => {
 
				if ( event instanceof RouteConfigLoadStart ) {
 
					asyncLoadCount++;
 
				} else if ( event instanceof RouteConfigLoadEnd ) {
 
					asyncLoadCount--;
 
				}
				// If there is at least one pending asynchronous config load request,
				// then let's show the loading indicator.
				// --
				// CAUTION: I'm using CSS to include a small delay such that this loading
				// indicator won't be seen by people with sufficiently fast connections.
				this.isShowingRouteLoadIndicator = !! asyncLoadCount;
				
 
			}
		);
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
      // this.socket.on('numberOfOnlineUsers', (numberOfOnlineUsers) => {
      //   this.numberOfOnlineUsers = numberOfOnlineUsers;
      // });
        this.versionCheckService.initVersionCheck();
        this.router.routeReuseStrategy.shouldReuseRoute = function () {
            return false;
        };
        this.router.events.subscribe((evt) => {
            if (evt instanceof NavigationEnd) {
                this.router.navigated = false;
                let currentUrl = evt.url;
                let loginUrl = currentUrl.indexOf('/login')>-1;
                let logoutUrl = currentUrl.indexOf('/logout')>-1;
                let expiredUrl = currentUrl.indexOf('/expired')>-1;
                let emptyUrl = currentUrl.indexOf('-/')>-1;
                let formUrl = currentUrl.indexOf('f/')>-1;
                let signUpUrl = currentUrl.indexOf('signup/')>-1;
                let forgotPasswordUrl = currentUrl.indexOf('forgot-password')>-1;
                let userLockUrl = currentUrl.indexOf('userlock')>-1;
                let registerUrl = currentUrl.indexOf('register')>-1;
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
                let teamMemberSignUpUrl = currentUrl.indexOf('tsignUp')>-1;
                let partnerSignUpUrl = currentUrl.indexOf('psignUp')>-1;
                let exculdeUrls =  ( !loginUrl && !emptyUrl && !signUpUrl && !forgotPasswordUrl && !userLockUrl && !registerUrl &&  !formUrl && !pageUrl && !partnerLandingPageUrl && !termsAndConditionUrl && !privacyPolicyUrl && !callbackUrl &&
                                  !shareUrl && !showCampaignVideoUrl &&  !showCampaignEmail &&  !companyPageUrl && !partnerPageUrl && !logeUrl &&
                                  !unsubscribeUrl && !serviceUnavailableUrl && !accessDeniedUrl &&   !rsvpUrl && !smsShowCampaignUrl && !showEventCampaignUrl &&
                                  !logsUrl && !campaignLandingPageUrl && !scpUrl && !clplUrl && !requestdemoUrl && !activateAccountUrl && !downloadUrl
                                   && !samlSecurityUrl && !logoutUrl && !expiredUrl && !teamMemberSignUpUrl && !partnerSignUpUrl 
                                  );

                 if(exculdeUrls){
                  this.logoutFromAllTabs();
                 }
                window.scrollTo(0, 0);
            }
            this.navigationInterceptor(evt);
        });
    }
    private navigationInterceptor(event: Event): void {
      if (event instanceof NavigationStart) { 
      //  this.loader = true;
         this.slimLoadingBarService.start();
      }
      if (event instanceof NavigationEnd) { 
      //  this.stopLoader();
        this.slimLoadingBarService.complete();
       }
      // Set loading state to false in both of the below events to hide the loader in case a request fails
      if (event instanceof NavigationCancel) {
      //  this.stopLoader();
         this.slimLoadingBarService.stop();
      }
      if (event instanceof NavigationError) { 
        //this.stopLoader();
        this.slimLoadingBarService.stop();
        
      }
    }
    stopLoader(){
      let self = this;
      setTimeout(() => { 
        self.loader = false;
      }, 300);
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
