import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PartnerService } from '../services/partner.service';

@Component({
  selector: 'app-google-call-back',
  templateUrl: './google-call-back.component.html',
  styleUrls: ['./google-call-back.component.css']
})
export class GoogleCallBackComponent implements OnInit {
    
    public googleContactCallBack:boolean;
    
    constructor(private router: Router, private partnerService: PartnerService) {}
    
    googleCallback(){
        this.partnerService.googleCallback()
        .subscribe(
            result => {
                localStorage.removeItem("userAlias");
                console.log("result: "+result);
                this.partnerService.googleCallBack = true;
                this.router.navigate(['/home/contacts/add']);
                
            },
        error => {                
            localStorage.removeItem("userAlias");
            console.log(error)
        },
        () => console.log('login() Complete'));
    }
    
    ngOnInit(){
        this.partnerService.googleCallBack = true;
        try{
             this.googleCallback();
        }
        catch(err){
            console.log(err);
        }
    }       

}
