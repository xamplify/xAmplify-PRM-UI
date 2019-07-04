import { Component, OnInit, DoCheck } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Roles } from '../../core/models/roles';
import { ReferenceService } from '../../core/services/reference.service';
import { DashboardService } from '../../dashboard/dashboard.service';
import { Pagination } from '../models/pagination';
import { UserService } from '../services/user.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
declare var window: any;

@Component( {
    selector: 'app-leftsidebar',
    templateUrl: './leftsidebar.component.html',
    styleUrls: ['./leftsidebar.component.css']
} )
export class LeftsidebarComponent implements OnInit, DoCheck {
    location: Location;
    baseRoute: string;
    enableLink = true;
    roleName: Roles = new Roles();
    isOnlyPartner = false;
    emailtemplates = false;
    campaigns = false;
    videos = false;
    contacts = false;
    partners = false;
    enableLeads = false;
    enableLeadsByVendor = false;
    changeTemplateCss = false;
    pagination = new Pagination();
    constructor( location: Location, public authService: AuthenticationService, public refService: ReferenceService, private router: Router
        , private dashBoardService: DashboardService,public userService: UserService,public logger: XtremandLogger ) {
        console.log( authService.getUserId() );
        this.refService.getCompanyIdByUserId( this.authService.getUserId() ).subscribe( response => {
            this.refService.getOrgCampaignTypes( response ).subscribe( data => {
                this.enableLeads = data.enableLeads;
                console.log( data )
            } );

        } )
        this.updateLeftSideBar( location );
    }

    updateLeftSideBar( location: Location ) {
        this.location = location;
        try {
            const roles = this.authService.getRoles();
            if ( roles ) {
                if ( roles.indexOf( this.roleName.campaignRole ) > -1 ||
                    roles.indexOf( this.roleName.orgAdminRole ) > -1 ||
                    roles.indexOf( this.roleName.allRole ) > -1 ||
                    roles.indexOf( this.roleName.vendorRole ) > -1 ) {
                    this.authService.module.isCampaign = true;
                    // this.isCampaign = true;
                }
                if ( roles.indexOf( this.roleName.contactsRole ) > -1 ||
                    roles.indexOf( this.roleName.orgAdminRole ) > -1 )//roles.indexOf(this.roleName.allRole) > -1)
                {
                    this.authService.module.isContact = true;
                }
                if ( roles.indexOf( this.roleName.emailTemplateRole ) > -1 ||
                    roles.indexOf( this.roleName.orgAdminRole ) > -1 ||
                    roles.indexOf( this.roleName.allRole ) > -1 ||
                    roles.indexOf( this.roleName.vendorRole ) > -1 ) {
                    this.authService.module.isEmailTemplate = true;
                }
                if ( roles.indexOf( this.roleName.statsRole ) > -1 ||
                    roles.indexOf( this.roleName.orgAdminRole ) > -1 ||
                    roles.indexOf( this.roleName.allRole ) > -1 ||
                    roles.indexOf( this.roleName.vendorRole ) > -1 ) {
                    this.authService.module.isStats = true;
                }
                if ( roles.indexOf( this.roleName.partnersRole ) > -1 ||
                    roles.indexOf( this.roleName.orgAdminRole ) > -1 ||
                    roles.indexOf( this.roleName.allRole ) > -1 ||
                    roles.indexOf( this.roleName.vendorRole ) > -1 ) {
                    this.authService.module.isPartner = true;
                }
                if ( roles.indexOf( this.roleName.videRole ) > -1 ||
                    roles.indexOf( this.roleName.orgAdminRole ) > -1 ||
                    roles.indexOf( this.roleName.allRole ) > -1 ||
                    roles.indexOf( this.roleName.vendorRole ) > -1 ) {
                    this.authService.module.isVideo = true;
                }
                if ( roles.indexOf( this.roleName.opportunityRole ) > -1 ||
                    roles.indexOf( this.roleName.orgAdminRole ) > -1 ||
                    roles.indexOf( this.roleName.allRole ) > -1 ||
                    roles.indexOf( this.roleName.vendorRole ) > -1 ) {
                    this.authService.module.hasOpportunityRole = true;
                }
                if ( roles.indexOf( this.roleName.orgAdminRole ) > -1 ) {
                    this.authService.module.isOrgAdmin = true;
                }
                if (roles.indexOf(this.roleName.companyPartnerRole) > -1)
                {
                    this.pagination.pageIndex = 1;
                    this.pagination.maxResults = 10000;
                    this.dashBoardService.loadVendorDetails(this.authService.getUserId(), this.pagination).subscribe(response =>
                    {
                        response.data.forEach(element =>
                        {
                            this.refService.getOrgCampaignTypes(element.companyId).subscribe(data =>
                            {
                                if (!this.authService.module.enableLeadsByVendor)
                                {
                                    this.authService.module.enableLeadsByVendor =data.enableLeads;
                                }
                                console.log(data)
                            });
                        });
                    })
                    this.authService.module.isCompanyPartner = true;
                }
                if (roles.indexOf(this.roleName.vendorRole) > -1)
                {
                    this.authService.module.isVendor = true;
                }
            
            }
        } catch ( error ) { console.log( error ); }
    }
    ngOnInit() {
      //  this.isOnlyPartner = this.authService.isOnlyPartner();
        this.userService.getRoles(this.authService.getUserId())
        .subscribe(
        response => {
             if(response.statusCode==200){
                this.authService.loggedInUserRole = response.data.role;
                this.authService.isPartnerTeamMember = response.data.partnerTeamMember;
                this.isOnlyPartner = this.authService.loggedInUserRole =="Partner" && this.authService.isPartnerTeamMember==false;
             }else{
                 this.authService.loggedInUserRole = 'User';
             }
        },
        error => this.logger.errorPage(error),
        () => this.logger.log('Finished')
        );
    }
    ngDoCheck() {
        if ( window.innerWidth > 990 ) { this.clearSubMenuValues( false, false, false, false, false ); }
    }
    openOrCloseTabs( urlType: string ) {
        if ( window.innerWidth < 990 ) {
            if ( urlType === 'emailtemplates' ) {
                this.emailtemplates = this.router.url.includes( 'emailtemplates' ) ? true : ( this.emailtemplates = !this.emailtemplates );
                this.clearSubMenuValues( this.emailtemplates, false, false, false, false );
            }
            else if ( urlType === 'contacts' ) {
                this.contacts = this.router.url.includes( 'contacts' ) ? true : ( this.contacts = !this.contacts );
                this.clearSubMenuValues( false, false, false, this.contacts, false );
            }
            else if ( urlType === 'partners' ) {
                this.partners = this.router.url.includes( 'partners' ) ? true : ( this.partners = !this.partners );
                this.clearSubMenuValues( false, false, false, false, this.partners );
            }
            else if ( urlType === 'campaigns' ) {
                this.campaigns = this.router.url.includes( 'campaigns' ) ? true : ( this.campaigns = !this.campaigns );
                this.clearSubMenuValues( false, this.campaigns, false, false, false );
            }
            else if ( urlType === 'videos' ) {
                this.videos = this.router.url.includes( 'videos' ) ? true : ( this.videos = !this.videos );
                this.clearSubMenuValues( false, false, this.videos, false, false );
            }
        }
    }
    clearSubMenuValues( emailTemplate, campaigs, videos, contacts, partners ) {
        this.emailtemplates = emailTemplate; this.campaigns = campaigs; this.videos = videos; this.contacts = contacts; this.partners = partners;
    }
    logout() {
        this.authService.logout();
        this.router.navigate( ['/login'] );
    }

}
