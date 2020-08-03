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
  providerName: any = 'zoho';

  constructor(private router: Router, private route: ActivatedRoute,private authenticationService: AuthenticationService,
    public contactService: ContactService,public xtremandLogger: XtremandLogger, public referenceService: ReferenceService) { }

  customResponse: CustomResponse = new CustomResponse();
  zohoPopupLoader: boolean = false;

  ngOnInit() {

    let providerName = this.route.snapshot.params['socialProvider'];
    let parentWindowUserId = this.route.snapshot.params['userId'];
    let vanityUrlDomainName = this.route.snapshot.params['vud'];
    let accessToken = this.route.snapshot.params['accessToken'];
   
    localStorage.setItem('parentWindowUserId',parentWindowUserId);
    localStorage.setItem('vanityUrlDomain',vanityUrlDomainName);
    localStorage.setItem('vanityUrlFilter','true');
    localStorage.setItem('access_token',accessToken);

    this.authenticationService.access_token = accessToken;
  //  this.authenticationService.getUserId = parentWindowUserId;
    
 
  //  alert("before zoho auth method");
    console.log(providerName);
     if(providerName == "zoho"){
      this.zohoAuth();
    }

  } 
  public zohoAuth(){
  
  // alert("its in zoho auth method");
    let isPartner = false;
    let statusCode :any;
    this.contactService.checkingZohoAuthentication(isPartner)
    .subscribe(
        (data: any) => {
        //   alert("its in zoho checkingzohoauthentication");
            localStorage.setItem("userAlias", data.userAlias)
            localStorage.setItem("isPartner", data.isPartner);
            statusCode = localStorage.getItem("statusCode");
            localStorage.setItem("statusCode", data.statusCode);
            window.location.href = "" + data.redirectUrl;
           // let url = "http://"+"localhost"+":4200/home/contacts/manage/";
           // this.referenceService.closeChildWindowAndRefreshParentWindow(url);
          },
          (error: any) => {
            console.error(error);
         //   alert("its in error block of checkingzohoauthentication");
            this.referenceService.showSweetAlertServerErrorMessage();
        },
        () => this.xtremandLogger.info("Add contact component checkingZohoContactsAuthentication() finished")
        );
  }
}
