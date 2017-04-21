import { Component, OnInit } from '@angular/core';
import {FacebookService} from '../../services/facebook.service';

@Component({
  selector: 'app-facebook-accounts',
  templateUrl: './facebook-accounts.component.html',
  styleUrls: ['./facebook-accounts.component.css']
})
export class FacebookAccountsComponent implements OnInit {
    accounts:any
    constructor(private facebookService: FacebookService){}
    getAccounts(){
        this.facebookService.getAccounts(localStorage.getItem("facebook"))
        .subscribe(
            data => this.accounts = data,
            error => console.log(error),
            () => console.log("getAccounts() Finished.")
        );
    }
    ngOnInit(){
        try{
             this.getAccounts();
        }
        catch(err){
            console.log(err);
        }
    }
}
