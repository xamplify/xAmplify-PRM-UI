import {Component, OnInit} from '@angular/core';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
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
    isCampaign = false;
    isContact = false;
    isEmailTemplate = false;
    isStats = false;
    isVideo = false;
    isOrgAdmin = false;
    roleName: Roles= new Roles();
    constructor(location: Location, public authService: AuthenticationService, private refService: ReferenceService) {
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
            roles.indexOf(this.roleName.allRole) > -1) {
            this.isCampaign = true;
        }
        if (roles.indexOf(this.roleName.contactsRole) > -1 ||
            roles.indexOf(this.roleName.orgAdminRole) > -1 ||
            roles.indexOf(this.roleName.allRole) > -1) {
            this.isContact = true;
        }
        if (roles.indexOf(this.roleName.emailTemplateRole) > -1 ||
            roles.indexOf(this.roleName.orgAdminRole) > -1 ||
            roles.indexOf(this.roleName.allRole) > -1) {
           this.isEmailTemplate = true;
       }
        if (roles.indexOf(this.roleName.statsRole) > -1 ||
            roles.indexOf(this.roleName.orgAdminRole) > -1 ||
            roles.indexOf(this.roleName.allRole) > -1) {
            this.isStats = true;
        }
        if (roles.indexOf(this.roleName.videRole) > -1 ||
            roles.indexOf(this.roleName.orgAdminRole) > -1 ||
            roles.indexOf(this.roleName.allRole) > -1) {
            this.isVideo = true;
        }
        if (roles.indexOf(this.roleName.orgAdminRole) > -1) {
            this.isOrgAdmin = true;
        }
    }


  ngOnInit() {

  }

}