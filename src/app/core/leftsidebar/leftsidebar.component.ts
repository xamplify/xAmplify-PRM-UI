import {Component, OnInit} from '@angular/core';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../core/services/authentication.service';
import {Roles} from '../../core/models/roles';
import {ReferenceService} from '../../core/services/reference.service';
@Component({
  selector: 'app-leftsidebar',
  templateUrl: './leftsidebar.component.html',
  styleUrls: ['./leftsidebar.component.css']
})
export class LeftsidebarComponent implements OnInit {

    location: Location;
    baseRoute: string;
    enableLink = true;
    roleName: Roles= new Roles();
    isOnlyPartner:boolean = false;
    constructor(location: Location, public authService: AuthenticationService, private refService: ReferenceService,private router:Router) {
        this.updateLeftSideBar(location);
    }

    updateLeftSideBar(location:Location){
        this.location = location;
        const url = this.location.path();
        if ( url.indexOf('dashboard') >= 0) {
            this.baseRoute = 'dashboard';
        } else if ( url.indexOf('videos') >= 0) {
            this.baseRoute = 'videos';
        } else if ( url.indexOf('contacts') >= 0) {
            this.baseRoute = 'contacts';
        } else if ( url.indexOf('partners') >= 0) {
            this.baseRoute = 'partners';
        } else if ( url.indexOf('emailtemplate') >= 0) {
            this.baseRoute = 'emailtemplate';
        } else if ( url.indexOf('campaigns') >= 0) {
            this.baseRoute = 'campaigns';
        } else if ( url.indexOf('team') >= 0) {
            this.baseRoute = 'team';
        } else if ( url.indexOf('upgrade') >= 0) {
            this.baseRoute = 'upgrade';
        }
        const roles = this.authService.getRoles();
        if (roles.indexOf(this.roleName.campaignRole) > -1 ||
            roles.indexOf(this.roleName.orgAdminRole) > -1 ||
            roles.indexOf(this.roleName.allRole) > -1 ||
            roles.indexOf(this.roleName.vendorRole)>-1) {
            this.authService.module.isCampaign = true;
           // this.isCampaign = true;
        }
        if (roles.indexOf(this.roleName.contactsRole) > -1 ||
            roles.indexOf(this.roleName.orgAdminRole) > -1 ||
            roles.indexOf(this.roleName.allRole) > -1) {
            this.authService.module.isContact = true;
        }
        if (roles.indexOf(this.roleName.emailTemplateRole) > -1 ||
            roles.indexOf(this.roleName.orgAdminRole) > -1 ||
            roles.indexOf(this.roleName.allRole) > -1 ||
            roles.indexOf(this.roleName.vendorRole)>-1) {
            this.authService.module.isEmailTemplate = true;
       }
        if (roles.indexOf(this.roleName.statsRole) > -1 ||
            roles.indexOf(this.roleName.orgAdminRole) > -1 ||
            roles.indexOf(this.roleName.allRole) > -1 ||  
            roles.indexOf(this.roleName.vendorRole)>-1) {
            this.authService.module.isStats = true;
        }
        
        if (roles.indexOf(this.roleName.partnersRole) > -1 ||
                roles.indexOf(this.roleName.orgAdminRole) > -1 ||
                roles.indexOf(this.roleName.allRole) > -1 ||  
                roles.indexOf(this.roleName.vendorRole)>-1) {
            this.authService.module.isPartner = true;
            }
        if (roles.indexOf(this.roleName.videRole) > -1 ||
            roles.indexOf(this.roleName.orgAdminRole) > -1 ||
            roles.indexOf(this.roleName.allRole) > -1 ||
            roles.indexOf(this.roleName.vendorRole)>-1) {
            this.authService.module.isVideo = true;
        }
        
        
        if (roles.indexOf(this.roleName.orgAdminRole) > -1) {
            this.authService.module.isOrgAdmin = true;
        }
        
        if(roles.indexOf(this.roleName.companyPartnerRole)>-1){
            this.authService.module.isCompanyPartner = true;
        }
        
        if(roles.indexOf(this.roleName.vendorRole)>-1){
            this.authService.module.isVendor = true;
        }
        
    }
    

  ngOnInit() {
      this.isOnlyPartner = this.authService.isOnlyPartner();
  }
  
  logout(){
      this.authService.logout();
      this.router.navigate(['/login']);
  }

}