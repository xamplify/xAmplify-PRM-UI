import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
import {VanityURLService} from 'app/vanity-url/services/vanity.url.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { ReferenceService } from '../../../core/services/reference.service';


declare var $: any;
@Component( {
    selector: 'app-connect-accounts',
    templateUrl: './connect-accounts.component.html',
    styleUrls: ['./connect-accounts.component.css']
})
export class ConnectAccountsComponent implements OnInit, OnDestroy {
    isLoggedInVanityUrl = false;
    loggedInUserId = 0;
    constructor( private router: Router,private vanityUrlService:VanityURLService,private authenticationService: AuthenticationService,private refernceService:ReferenceService) { 
     this.isLoggedInVanityUrl =  this.vanityUrlService.isVanityURLEnabled();
     this.loggedInUserId = this.authenticationService.getUserId();
    }

    socialLogin( providerName: string ) {
                    $( '#connectAccountsModal' ).modal( 'toggle' );
                    if(this.isLoggedInVanityUrl){
                      this.refernceService.showSweetAlertInfoMessage();
                    //  var x = screen.width/2 - 700/2;
                    //  var y = screen.height/2 - 450/2;
                    //  window.open(providerName+"/login/"+this.loggedInUserId,"Social Login","toolbar=yes,scrollbars=yes,resizable=yes,top="+y+",left="+x+",width=700,height=485");
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
