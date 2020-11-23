import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ContactService } from '../services/contact.service';
import { CustomResponse} from '../../common/models/custom-response';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { ReferenceService } from 'app/core/services/reference.service';
@Component({
  selector: 'app-expired-access-token-login',
  templateUrl: './expired-access-token-login.component.html',
  styleUrls: ['./expired-access-token-login.component.css']
})
export class ExpiredAccessTokenLoginComponent implements OnInit {

  public isPartner: boolean;
  currentModule: string;

  constructor(private router: Router, private route: ActivatedRoute,private authenticationService: AuthenticationService,
    public contactService: ContactService,public xtremandLogger: XtremandLogger, public referenceService: ReferenceService)
     { }

ngOnInit()
 {
    let providerName = this.route.snapshot.params['socialProvider'];
    let zohoCurrentUser = this.route.snapshot.params['zohoCurrentUser'];
    let vanityUrlDomainName = this.route.snapshot.params['vud'];
    let accessToken = this.route.snapshot.params['accessToken'];
    let currentModule = this.route.snapshot.params['module'];
    this.currentModule = currentModule;
    let redirectUrl = this.route.snapshot.params['redirectUrl'];
    localStorage.setItem('vanityUrlDomain',vanityUrlDomainName);
    localStorage.setItem('access_token',accessToken);
    localStorage.setItem('currentUser',zohoCurrentUser);
    


    this.authenticationService.access_token = accessToken;
    this.authenticationService.vanityURLEnabled == true;

    if(redirectUrl)
    {
      window.location.href = "" + redirectUrl;
    }
    else if(providerName == "zoho"){
      this.zohoAuth();
    }
 
}
  public zohoAuth(){
    this.contactService.checkingZohoAuthentication(this.currentModule)
    .subscribe(
        (data: any) => {
            localStorage.setItem("userAlias", data.userAlias);
            localStorage.setItem("currentModule", data.module);
            localStorage.setItem("statusCode", data.statusCode);
            window.location.href = "" + data.redirectUrl;
          },
          (error: any) => {
            console.error(error);
            this.referenceService.showSweetAlertServerErrorMessage();
        },
        () => this.xtremandLogger.info("Add contact component checkingZohoContactsAuthentication() finished")
        );
  }

}
