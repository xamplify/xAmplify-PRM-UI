import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Properties } from '../../common/models/properties';
import { Processor } from '../../core/models/processor';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
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
  moduleToRedirect: any;
  constructor(public authenticationService: AuthenticationService, public processor: Processor,
    public activatedRoute: ActivatedRoute, public router: Router, public xtremandLogger: XtremandLogger,
    public userService: UserService, private vanityURLService: VanityURLService) { }

  ngOnInit() {
    try {
      this.processor.set(this.processor)
      this.alias = this.activatedRoute.snapshot.params['alias'];
      this.moduleToRedirect = this.activatedRoute.snapshot.params['moduleToRedirect'];
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

    if (this.vanityURLService.isVanityURLEnabled()) {      
      this.vanityURLService.getVanityURLDetails(this.authenticationService.companyProfileName).subscribe(result => {
        this.authenticationService.v_companyName = result.companyName;
        this.authenticationService.vanityURLink = result.vanityURLink;
        this.authenticationService.companyUrl = result.companyUrl;
        this.authenticationService.v_showCompanyLogo = result.showVendorCompanyLogo;
        this.authenticationService.v_companyLogoImagePath = this.authenticationService.MEDIA_URL + result.companyLogoImagePath;
        if (result.companyBgImagePath) {
          this.authenticationService.v_companyBgImagePath = this.authenticationService.MEDIA_URL + result.companyBgImagePath;
        } else {
          this.authenticationService.v_companyBgImagePath = "assets/images/stratapps.jpeg";
        }
        this.authenticationService.getVanityURLUserRoles(this.userName, this.authenticationService.access_token).subscribe(result => {
          this.authenticationService.vanityURLUserRoles = result.data;
          this.getUserNameDetailsByUserName();
        });
      }, error => {
        console.log(error);
      });
    }else{
      this.getUserNameDetailsByUserName();
    }    
  }

  getUserNameDetailsByUserName(){
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
        'source': res.source
      };

      if (this.authenticationService.vanityURLEnabled && this.authenticationService.companyProfileName && this.authenticationService.vanityURLUserRoles) {
        userToken['roles'] = this.authenticationService.vanityURLUserRoles;
      }

      localStorage.setItem('currentUser', JSON.stringify(userToken));
      localStorage.setItem('defaultDisplayType', res.modulesDisplayType);

      // if (this.authenticationService.user.hasCompany) {
      //   this.router.navigateByUrl('/home/dashboard');
      // } 
      if (this.moduleToRedirect === 'campaigns') {
        this.router.navigateByUrl('/home/campaigns/partner/all');
      } else if (this.moduleToRedirect === 'playbooks') {
        this.router.navigateByUrl('/home/playbook/shared');
      } else if (this.moduleToRedirect === 'tracks') {
        this.router.navigateByUrl('/home/tracks/shared');
      } else if (this.moduleToRedirect === 'assets') {
        this.router.navigateByUrl('/home/dam/shared');
      } else if (this.moduleToRedirect === 'pages') {
        this.router.navigateByUrl('/home/pages/partner');
      } else if (this.moduleToRedirect === 'home') {
        this.router.navigateByUrl('/home/dashboard');
      } else if (this.authenticationService.user.hasCompany) {
        // this.router.navigateByUrl('/home/dashboard');
        this.router.navigateByUrl('/home/dashboard/default');
      } else {
        this.router.navigate(['/home/dashboard/add-company-profile']);
      }
    }, (error) => {
      console.log(error);
    });
  }
}
