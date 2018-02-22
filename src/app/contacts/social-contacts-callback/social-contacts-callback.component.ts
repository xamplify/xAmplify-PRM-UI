import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ContactService } from '../services/contact.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { ReferenceService } from '../../core/services/reference.service';

@Component({
    selector: 'app-social-contacts-callback',
    templateUrl: './social-contacts-callback.component.html',
    styleUrls: ['./social-contacts-callback.component.css']
  })
  
  export class SocialContactsCallbackComponent implements OnInit {
    public isPartner:boolean;
    isGoogleCallBack: boolean;
    
    constructor(public referenceService: ReferenceService,private router: Router, private contactService: ContactService, public xtremandLogger:XtremandLogger) {
        let currentUrl = this.router.url;
        if(currentUrl.includes('home/contacts')){
            this.isPartner = false;
        }else{
            this.isPartner = true;  
        }
        
        if(currentUrl.includes('google-callback')){
            this.isGoogleCallBack = true;
            this.contactService.socialCallbackName = "googleOauth";
        }else{
            this.contactService.socialCallbackName = "salesforceOauth";
            this.isGoogleCallBack = false;  
        }
        
        if(currentUrl.includes('error=access_denied') && this.isPartner == false){
            this.router.navigate(['/home/contacts/add']);
        } 
        else if(currentUrl.includes('error=access_denied') && this.isPartner == true) {
            this.router.navigate(['/home/partners']);
        }
    }
    
    socialContactsCallback(){
        this.contactService.socialContactsCallback()
        .subscribe(
            result => {
                localStorage.removeItem("userAlias");
                localStorage.removeItem("isPartner");
                this.xtremandLogger.info("result: "+result);
                this.contactService.googleCallBack = true;
                if(this.isPartner == true){
                    this.router.navigate(['/home/partners']);
                }else{
                    this.router.navigate(['/home/contacts/add']);
                }
            },
        error => {                
            localStorage.removeItem("userAlias");
            this.xtremandLogger.info(error)
        },
        () => this.xtremandLogger.info('login() Complete'));
    }
    
    ngOnInit(){
        this.contactService.googleCallBack = true;
        try{
             this.socialContactsCallback();
        }
        catch(err){
            this.xtremandLogger.error(err);
        }
    }       

}

