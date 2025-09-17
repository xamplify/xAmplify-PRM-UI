import { Component, OnInit,Input } from '@angular/core';
import { Properties } from 'app/common/models/properties';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { CustomSkin } from 'app/dashboard/models/custom-skin';
import { VanityLoginDto } from 'app/util/models/vanity-login-dto';
import { AuthenticationService } from '../services/authentication.service';
import { DomSanitizer } from "@angular/platform-browser";
import { ThemePropertiesDto } from 'app/dashboard/models/theme-properties-dto';
import { CompanyThemeActivate } from 'app/dashboard/models/company-theme-activate';

@Component({
  selector: 'app-custom-copyright',
  templateUrl: './custom-copyright.component.html',
  styleUrls: ['./custom-copyright.component.css'],
  providers: [Properties]
})
export class CustomCopyrightComponent implements OnInit {

  @Input() activeThemeDetails:CompanyThemeActivate;
  loggedUserId:number;
  footerContent:any;
  vanityLoginDto: VanityLoginDto = new VanityLoginDto();
  constructor(public dashboardService:DashboardService, public authService : AuthenticationService,
    public properties: Properties,public sanitizer:DomSanitizer) { 
     this.loggedUserId = this.authService.getUserId();
     this.vanityLoginDto.userId = this.loggedUserId;
     let companyProfileName = this.authService.companyProfileName;
     if (companyProfileName !== undefined && companyProfileName !== "") {
       this.vanityLoginDto.vendorCompanyProfileName = companyProfileName;
       this.vanityLoginDto.vanityUrlFilter = true;
     }else{
       this.vanityLoginDto.vanityUrlFilter = false;
     }
    }

  ngOnInit() {
    this.getFooterSkin()
  }
  
  skin:ThemePropertiesDto = new ThemePropertiesDto();

  getFooterSkin(){
    this.dashboardService.getPropertiesById(this.activeThemeDetails.themeId).subscribe(
      (data:any) => {
        let skinMap = data.data;
        this.skin = skinMap.FOOTER;
        this.footerContent = this.sanitizer.bypassSecurityTrustHtml(this.skin.textContent);
        // document.documentElement.style.setProperty('--footer-bg-color', this.skin.backgroundColor);
        // document.documentElement.style.setProperty('--footer-text-color', this.skin.textColor);
        // document.documentElement.style.setProperty('--footer-border-color', this.skin.buttonBorderColor);
        // if(!this.skin.defaultSkin && !this.skin.darkTheme){
        //  require("style-loader!../../../assets/admin/layout2/css/themes/custom-skin-footer.css");
        // }else {
        //  require("style-loader!../../../assets/admin/layout2/css/layout.css")
        // }
      }
    )
  }

}
