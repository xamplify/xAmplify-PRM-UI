import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ContactService } from '../services/contact.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { ReferenceService } from '../../core/services/reference.service';

@Component({
  selector: 'app-google-call-back',
  templateUrl: './google-call-back.component.html',
  styleUrls: ['./google-call-back.component.css']
})
export class GoogleCallBackComponent implements OnInit {
    
    public googleContactCallBack:boolean;
    
    constructor(public referenceService: ReferenceService,private router: Router, private contactService: ContactService, public xtremandLogger:XtremandLogger) {}
    
    googleCallback(){
        this.contactService.googleCallback()
        .subscribe(
            result => {
                localStorage.removeItem("userAlias");
                localStorage.removeItem("isPartner");
                this.xtremandLogger.info("result: "+result);
                this.contactService.googleCallBack = true;
                if(this.referenceService.callBackURLCondition == 'partners'){
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
             this.googleCallback();
        }
        catch(err){
            this.xtremandLogger.error(err);
        }
    }       

}
