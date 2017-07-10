import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

declare var $: any;
@Component( {
    selector: 'app-connect-accounts',
    templateUrl: './connect-accounts.component.html',
    styleUrls: ['./connect-accounts.component.css']
})
export class ConnectAccountsComponent implements OnInit {

    constructor( private router: Router ) { }

    socialLogin( providerName: string ) {
        $( '#connectAccountsModal' ).modal( 'toggle' );
        this.router.navigate( [providerName + '/login'] );
    }

    ngOnInit() {
    }

}
