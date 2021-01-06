import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ContactService } from '../services/contact.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { ReferenceService } from '../../core/services/reference.service';
import { HubSpotService } from 'app/core/services/hubspot.service';
import { IntegrationService } from 'app/core/services/integration.service';

@Component( {
    selector: 'app-social-contacts-callback',
    templateUrl: './social-contacts-callback.component.html',
    styleUrls: ['./social-contacts-callback.component.css']
})

export class SocialContactsCallbackComponent implements OnInit {
   // public isPartner: boolean;
    currentModule = '';
    callbackName: string;

    constructor( private route: ActivatedRoute, public referenceService: ReferenceService, private router: Router, private contactService: ContactService, public xtremandLogger: XtremandLogger,private hubSpotService:HubSpotService ,private integrationService:IntegrationService) {
        let currentUrl = this.router.url;
        if ( currentUrl.includes( 'home/contacts' ) ) {
            this.currentModule = 'contacts';
        } else if( currentUrl.includes( 'home/assignleads' )){
          this.currentModule = 'leads';
        } else {
          this.currentModule = 'partners';
        }
        if ( currentUrl.includes( 'google-callback' ) ) {
            this.callbackName = 'google';
            this.contactService.socialCallbackName = "googleOauth";
        }else if(currentUrl.includes( 'zoho-callback' )){
            this.callbackName = 'zoho';
            this.contactService.socialCallbackName = "zohoOauth";
        } else {
            this.contactService.socialCallbackName = "salesforceOauth";
            this.callbackName = 'salesforce';
        }
        let isErrorUrl = (currentUrl.includes( 'error=access_denied' )  || currentUrl.includes( 'zoho-callback?error'));
        if ( isErrorUrl && this.currentModule === 'contacts') {
            this.router.navigate( ['/home/contacts/add'] );
        }
        else if (isErrorUrl && this.currentModule === 'partners') {
            this.router.navigate( ['/home/partners'] );
        } else if (isErrorUrl && this.currentModule === 'leads') {
          this.router.navigate( ['/home/assignleads/add'] );
        }
    }

    socialContactsCallback(queryParam: any) {
        try {
            this.contactService.socialContactsCallback(queryParam)
                .subscribe(
                result => {
                    localStorage.removeItem( "userAlias" );
                    localStorage.removeItem( "currentModule" );
                    this.xtremandLogger.info( "result: " + result );
					/* if blocks are edited by ajay to differentiate vanity and send a message to parent window */
                    if ( this.callbackName == 'google' ) {
						let vanityUrlFilter = localStorage.getItem('vanityUrlFilter');
						if(vanityUrlFilter == 'true'){
							var message = "isGoogleAuth";
							this.postingMessageToParentWindow(message);
						}else{
							 this.contactService.socialProviderName = 'google';
						}
                    } else if ( this.callbackName == 'salesforce' ) {
						let vanityUrlFilter = localStorage.getItem('vanityUrlFilter');
						if(vanityUrlFilter == 'true'){
							var message = "isSalesForceAuth";
			                this.postingMessageToParentWindow(message);
						}else{
							this.contactService.socialProviderName = 'salesforce';
						}
                    }else if ( this.callbackName == 'zoho' ) {
						let vanityUrlFilter = localStorage.getItem('vanityUrlFilter');
						if(vanityUrlFilter == 'true'){
							var message = "isZohoAuth";
			             	this.postingMessageToParentWindow(message);
						}else{
							this.contactService.socialProviderName = 'zoho';
						}
                    }
                  if ( this.currentModule === 'contacts') {
                      this.router.navigate( ['/home/contacts/add'] );
                  } else if (this.currentModule === 'partners') {
                      this.router.navigate( ['/home/partners'] );
                  } else if (this.currentModule === 'leads') {
                    this.router.navigate( ['/home/assignleads/add'] );
                  }
                },
                error => {
                    localStorage.removeItem( "userAlias" );
                    this.xtremandLogger.info( error )
                },
                () => this.xtremandLogger.info( 'login() Complete' ) );
        } catch ( error ) {
            this.xtremandLogger.error( error, "SocialCallbackcomponent()", "socialCallback" );
        }
    }

    hubSpotCallback(code:string) {
        try {
            this.hubSpotService.hubSpotCallback(code)
                .subscribe(
                    result => {
                        this.referenceService.integrationCallBackStatus = true;
                        this.xtremandLogger.info("Hubspot Callback :: " + result);
                        localStorage.removeItem("userAlias");
                        localStorage.removeItem("currentModule");
                        this.router.navigate(['/home/dashboard/myprofile'])
                    },
                    error => {
                        localStorage.removeItem("userAlias");
                        this.xtremandLogger.info(error)
                    },
                    () => this.xtremandLogger.info('login() Complete'));
        } catch (error) {
            this.xtremandLogger.error(error, "SocialCallbackcomponent()", "hubSpotCallback()");
        }
    }

    integrationCallback(code:string,type:string) {
        try {
            this.integrationService.handleCallbackByType(code,type)
                .subscribe(
                    result => {
                        this.referenceService.integrationCallBackStatus = true;
                        this.xtremandLogger.info("Integration Callback :: " + result);
                        localStorage.removeItem("userAlias");
                        localStorage.removeItem("currentModule");
						this.router.navigate(['/home/dashboard/myprofile']);
						
						/* added if blocks for sending a message to parent window */
						let vanityUrlFilter = localStorage.getItem('vanityUrlFilter');
						if(type == 'hubspot' && vanityUrlFilter == 'true'){
							var message = "isHubSpotAuth";
			                this.postingMessageToParentWindow(message);
						}
						else if(type == 'isalesforce' && vanityUrlFilter == 'true'){
							var message = "isSalesforceAuth";
			                this.postingMessageToParentWindow(message);
						}
						
                       
                        // Commented below code by Swathi. Custom form creation should not be done here.
                        /*if(type === "isalesforce"){
                            this.contactService.getSfFormFields().subscribe(result =>{
                                console.log(result);
                            })
                        }*/
                    },
                    error => {
                        localStorage.removeItem("userAlias");
                        this.xtremandLogger.info(error)
                    });
        } catch (error) {
            this.xtremandLogger.error(error, "SocialCallbackcomponent()", "integrationCallback()");
        }
    }

	/* added postingMessageToParentWindow method by ajay */
	postingMessageToParentWindow(message: string){
			let trargetWindow = window.opener;
            trargetWindow.postMessage(message,"*");
            localStorage.removeItem('vanityUrlDomain');
			localStorage.removeItem('vanityUrlFilter');
            self.close();
	}

    ngOnInit() {
        this.contactService.socialProviderName = '';
        try {
        let queryParam: string = "";
        let code:string;
        this.route.queryParams.subscribe(
            ( param: any ) => {
                code = param['code'];
                let denied = param['denied'];
                queryParam = "?code=" + code;
            });
            this.xtremandLogger.info("Router URL :: " + this.router.url);
            if (this.router.url.includes("hubspot-callback")) {
             // this.hubSpotCallback(code);
               this.integrationCallback(code,"hubspot");
            } else if(this.router.url.includes("isalesforce-callback")){
                this.integrationCallback(code,"isalesforce");
            }else {
                this.socialContactsCallback(queryParam);
            }
        }
        catch ( err ) {
            this.xtremandLogger.error( err );
        }
    }

}

