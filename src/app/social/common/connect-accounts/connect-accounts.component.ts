import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";

declare var $: any;
@Component( {
    selector: 'app-connect-accounts',
    templateUrl: './connect-accounts.component.html',
    styleUrls: ['./connect-accounts.component.css']
})
export class ConnectAccountsComponent implements OnInit, OnDestroy {

    constructor( private router: Router ) { }

    socialLogin( providerName: string ) {
        $( '#connectAccountsModal' ).modal( 'toggle' );
        this.router.navigate( [providerName + '/login'] );
    }

    ngOnInit() {
    }
    ngOnDestroy(){
      $('#connectAccountsModal').modal('hide');
    }
}
