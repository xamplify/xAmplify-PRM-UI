import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ContactService } from '../services/contact.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';

@Component({
  selector: 'app-salesforce-call-back',
  templateUrl: './salesforce-call-back.component.html',
  styleUrls: ['./salesforce-call-back.component.css']
})
export class SalesforceCallBackComponent implements OnInit {
    constructor(private router: Router, private contactService: ContactService, public xtremandLogger:XtremandLogger) {}
    
    salesforceCallback(){
        this.contactService.salesforceCallback()
        .subscribe(
            result => {
                localStorage.removeItem("userAlias");
                this.xtremandLogger.info("result: "+result);
                this.contactService.salesforceContactCallBack = true;
                this.router.navigate(['/home/contacts/add']);
                
            },
        error => {                
            localStorage.removeItem("userAlias");
            this.xtremandLogger.error(error)
        },
        () => this.xtremandLogger.info('login() Complete'));
    }
    
    ngOnInit(){
        try{
             this.salesforceCallback();
        }
        catch(err){
            this.xtremandLogger.error(err);
        }
    }       

}
