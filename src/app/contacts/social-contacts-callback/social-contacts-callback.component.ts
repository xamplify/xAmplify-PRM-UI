import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ContactService } from '../services/contact.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { ReferenceService } from '../../core/services/reference.service';
import { HubSpotService } from 'app/core/services/hubspot.service';

@Component( {
    selector: 'app-social-contacts-callback',
    templateUrl: './social-contacts-callback.component.html',
    styleUrls: ['./social-contacts-callback.component.css']
})

export class SocialContactsCallbackComponent implements OnInit {
    public isPartner: boolean;
    callbackName: string;

    constructor( private route: ActivatedRoute, public referenceService: ReferenceService, private router: Router, private contactService: ContactService, public xtremandLogger: XtremandLogger,private hubSpotService:HubSpotService ) {
        let currentUrl = this.router.url;
        if ( currentUrl.includes( 'home/contacts' ) ) {
            this.isPartner = false;
        } else {
            this.isPartner = true;
        }

        if ( currentUrl.includes( 'google-callback' ) ) {
            this.callbackName = 'google';
            this.contactService.socialCallbackName = "googleOauth";
        } else {
            this.contactService.socialCallbackName = "salesforceOauth";
            this.callbackName = 'salesforce';
        }

        if ( currentUrl.includes( 'error=access_denied' ) && this.isPartner == false ) {
            this.router.navigate( ['/home/contacts/add'] );
        }
        else if ( currentUrl.includes( 'error=access_denied' ) && this.isPartner == true ) {
            this.router.navigate( ['/home/partners'] );
        }
    }

    socialContactsCallback(queryParam: any) {
        try {
            this.contactService.socialContactsCallback(queryParam)
                .subscribe(
                result => {
                    localStorage.removeItem( "userAlias" );
                    localStorage.removeItem( "isPartner" );
                    this.xtremandLogger.info( "result: " + result );

                    if ( this.callbackName == 'google' ) {
                        this.contactService.socialProviderName = 'google';
                    } else if ( this.callbackName == 'salesforce' ) {
                        this.contactService.socialProviderName = 'salesforce';
                    }

                    if ( this.isPartner == true ) {
                        this.router.navigate( ['/home/partners'] );
                    } else {
                        this.router.navigate( ['/home/contacts/add'] );
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
                        this.referenceService.isHubspotCallBack = true;
                        this.xtremandLogger.info("Hubspot Callback :: " + result);
                        localStorage.removeItem("userAlias");
                        localStorage.removeItem("isPartner");
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
                this.hubSpotCallback(code);
            } else {
                this.socialContactsCallback(queryParam);
            }
        }
        catch ( err ) {
            this.xtremandLogger.error( err );
        }
    }

}

