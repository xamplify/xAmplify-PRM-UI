import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ContactService } from '../contact.service';

@Component({
  selector: 'myprofile-app',
  templateUrl: 'app/social/login.html',
})
export class GoogleContactsCallbackComponent implements OnInit{
    
    public googleContactCallBack:boolean;
    
    constructor(private router: Router, private contactService: ContactService) {}
    
    googleCallback(){
        this.contactService.googleCallback()
        .subscribe(
            result => {
                localStorage.removeItem("userAlias");
                console.log("result: "+result);
                this.contactService.googleCallBack = true;
                this.router.navigate(['/home/contacts/addContacts']);
                
            },
        error => {                
            localStorage.removeItem("userAlias");
            console.log(error)
        },
        () => console.log('login() Complete'));
    }
    
    ngOnInit(){
        this.contactService.googleCallBack = true;
        try{
             this.googleCallback();
        }
        catch(err){
            console.log(err);
        }
    }       

}