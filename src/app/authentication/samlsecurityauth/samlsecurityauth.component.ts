import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Properties } from '../../common/models/properties';
import { Processor } from '../../core/models/processor';
declare var $: any;

@Component({
  selector: 'app-samlsecurityauth',
  templateUrl: './samlsecurityauth.component.html',
  styleUrls: ['./samlsecurityauth.component.css'],
  providers: [Processor]
})
export class SamlsecurityauthComponent implements OnInit {
  alias: string;
  userName: string;
  constructor(public authenticationService: AuthenticationService, public processor: Processor,
    public activatedRoute: ActivatedRoute, public router: Router, public xtremandLogger: XtremandLogger,
    public userService: UserService) { }

  ngOnInit() {
    try {
      this.processor.set(this.processor)
      this.alias = this.activatedRoute.snapshot.params['alias'];
      console.log(this.alias);
      this.checkAuthenticationSamlSecurity();
    }
    catch (error) { this.xtremandLogger.error('error in verifyemail' + error); }
  }

  checkAuthenticationSamlSecurity() {
    this.authenticationService.getSamlSecurityAlias(this.alias).subscribe((result: any) => {
      console.log(result);
      if (!result) {
        console.log(result);
      } else {
        console.log(result);
        // this.getUserNameDetails(result);
        this.getSamlSecurityUserName(result);
      }
    }, (error: any) => {
      console.log(error);
    });
  }

  getSamlSecurityUserName(result) {
    this.userName = result;
    this.authenticationService.getSamlsecurityAccessToken(result).subscribe((result: any) => {
      console.log(result);
      if (!result) {
        console.log(result);
      } else {
        console.log(result);
        this.getUserNameDetails(result);
      }
    }, (error: any) => {
      console.log(error);
    });
  }

  getUserNameDetails(result: any) {
    this.authenticationService.access_token = result.access_token;
    this.authenticationService.refresh_token = result.refresh_token;
    this.authenticationService.expires_in = result.expires_in;
    this.authenticationService.getUserByUserName(this.userName).subscribe((res: any) => {
      this.authenticationService.user.hasCompany = res.hasCompany;
      const userToken = {
        'userName': this.userName,
        'userId': res.id,
        'accessToken': this.authenticationService.access_token,
        'refreshToken': this.authenticationService.refresh_token,
        'expiresIn': this.authenticationService.expires_in,
        'hasCompany': res.hasCompany,
        'roles': res.roles,
        'campaignAccessDto': res.campaignAccessDto,
        'logedInCustomerCompanyNeme': res.companyName,
		'source':res.source
      };
      localStorage.setItem('currentUser', JSON.stringify(userToken));
	  localStorage.setItem('defaultDisplayType',res.modulesDisplayType);
   
      if (this.authenticationService.user.hasCompany) {
        this.router.navigateByUrl('/home/dashboard');
      } else {
        this.router.navigate(['/home/dashboard/add-company-profile']);
      }
    }, (error) => {
      console.log(error);
    });
  }
}
