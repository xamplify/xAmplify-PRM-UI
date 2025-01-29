import { Component, OnInit,Input } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
@Component({
  selector: 'app-public-top-navigation-bar',
  templateUrl: './public-top-navigation-bar.component.html',
  styleUrls: ['./public-top-navigation-bar.component.css']
})

export class PublicTopNavigationBarComponent implements OnInit {

  requestAccountButtonClicked = false;
  requestAccountButtonText = "Request An Account";
  alias = "";
  @Input() companyLogoPath:string;
  @Input() emailAddress:string;
  constructor(public vanityUrlService:VanityURLService,public authenticationService:AuthenticationService,public referenceService:ReferenceService) { }

  ngOnInit() {
  }

  requestAccount(){
    this.requestAccountButtonClicked = true;
    this.requestAccountButtonText = "Please Wait...";
    let campaignMdfRequestAccountDto= {};
    campaignMdfRequestAccountDto['mdfAlias'] = this.alias;
    this.authenticationService.requestAccount(campaignMdfRequestAccountDto).subscribe(
      response => {
        this.referenceService.showSweetAlertSuccessMessage("Your account request has been submitted successfully");
        this.requestAccountButtonClicked = false;
        this.requestAccountButtonText = "Request an Account";
      }, error => {
        this.requestAccountButtonClicked = false;
        this.requestAccountButtonText = "Request an Account";
       this.referenceService.showSweetAlertServerErrorMessage();
      });
  }



}
