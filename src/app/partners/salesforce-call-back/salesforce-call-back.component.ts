import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PartnerService } from '../services/partner.service';

@Component({
  selector: 'app-salesforce-call-back',
  templateUrl: './salesforce-call-back.component.html',
  styleUrls: ['./salesforce-call-back.component.css']
})
export class SalesforceCallBackComponent implements OnInit {
    constructor(private router: Router, private partnerService: PartnerService) {}
    
    salesforceCallback(){
        this.partnerService.salesforceCallback()
        .subscribe(
            result => {
                localStorage.removeItem("userAlias");
                console.log("result: "+result);
                this.partnerService.salesforceContactCallBack = true;
                this.router.navigate(['/home/partners/add']);
                
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
