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
                    //this.router.navigate( [providerName + '/login'] );
                    var x = screen.width/2 - 700/2;
                    var y = screen.height/2 - 450/2;
                     window.open(" " + providerName + '/login', "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top="+y+",left="+x+",width=700,height=485");
                    // this.router.navigate( ['/home/social/manage/all'] );
                    // window.location.reload();

                   
    }

    ngOnInit() {
    }
    ngOnDestroy(){
      $('#connectAccountsModal').modal('hide');
    }

    
}
