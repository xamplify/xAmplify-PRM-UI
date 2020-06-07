import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
import {VanityURLService} from 'app/vanity-url/services/vanity.url.service';
import { ReferenceService } from 'app/core/services/reference.service';


declare var $: any;
@Component( {
    selector: 'app-connect-accounts',
    templateUrl: './connect-accounts.component.html',
    styleUrls: ['./connect-accounts.component.css']
})
export class ConnectAccountsComponent implements OnInit, OnDestroy {
    isLoggedInVanityUrl = false;
    constructor( private router: Router,private vanityUrlService:VanityURLService,private referenceService:ReferenceService) { 
     this.isLoggedInVanityUrl =  this.vanityUrlService.isVanityURLEnabled();
    }

    socialLogin( providerName: string ) {
                    $( '#connectAccountsModal' ).modal( 'toggle' );
                    if(this.isLoggedInVanityUrl){
                      this.referenceService.showSweetAlertInfoMessage('Work In Progress');
                    // var x = screen.width/2 - 700/2;
                    // var y = screen.height/2 - 450/2;
                    // window.open(" " + providerName + '/login', "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top="+y+",left="+x+",width=700,height=485");
                    }else{
                    this.router.navigate( [providerName + '/login'] );
                    }
    }

    ngOnInit() {
    }
    ngOnDestroy(){
      $('#connectAccountsModal').modal('hide');
    }

    
}
