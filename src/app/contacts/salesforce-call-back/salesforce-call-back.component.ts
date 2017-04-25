import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ContactService } from '../services/contact.service';

@Component({
  selector: 'app-salesforce-call-back',
  templateUrl: './salesforce-call-back.component.html',
  styleUrls: ['./salesforce-call-back.component.css']
})
export class SalesforceCallBackComponent implements OnInit {
    constructor(private router: Router, private contactService: ContactService) {}
    
    salesforceCallback(){
        this.contactService.salesforceCallback()
        .subscribe(
            result => {
                localStorage.removeItem("userAlias");
                console.log("result: "+result);
                this.contactService.salesforceContactCallBack = true;
                this.router.navigate(['/home/contacts/addContacts']);
                
            },
        error => {                
            localStorage.removeItem("userAlias");
            console.log(error)
        },
        () => console.log('login() Complete'));
    }
    
    ngOnInit(){
        try{
             this.salesforceCallback();
        }
        catch(err){
            console.log(err);
        }
    }       

}
