import { Component, OnInit } from '@angular/core';
import { FacebookService } from '../../services/facebook.service';

@Component({
    selector: 'app-facebook-accounts',
    templateUrl: './facebook-accounts.component.html',
    styleUrls: ['./facebook-accounts.component.css']
})
export class FacebookAccountsComponent implements OnInit {
    pages: any;
    constructor(private facebookService: FacebookService) { }
    getAccounts() {
        this.facebookService.listPages(localStorage.getItem('facebook'))
            .subscribe(
            data => this.pages = data,
            error => console.log(error),
            () => console.log('getAccounts() Finished.')
            );
    }
    ngOnInit() {
        try {
            this.getAccounts();
        }catch (err) {
            console.log(err);
        }
    }
}
