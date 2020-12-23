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
import {UtilService} from '../../core/services/util.service';

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
    assignLeads = false;
    sharedLeads = false;
    sharedLeadsAccess = false;
    partners = false;
    enableLeads = false;
    enableLeadsByVendor = false;
    changeTemplateCss = false;
    pagination = new Pagination();
    formAccess = false;
    forms: any;
    landingPages:any;
    isLoggedInAsTeamMember = false;
    sourceType = "";
    isLoggedInFromAdminPortal = false;
    loggedInThroughVanityUrl:boolean = false;
    checkCreateCampaignOptionForVanityURL:boolean = true;
    loading = false;
    rssFeedAccess: boolean;
    mdfAccess: boolean;
    mdfAccessAsPartner: boolean;
    mdf: boolean;
    dam:boolean;
    damAccess = false;
    shareLeadsAccess = false;
    damAccessAsPartner = false;
    deals: boolean;
    constructor( location: Location, public authService: AuthenticationService, public refService: ReferenceService, private router: Router
        , private dashBoardService: DashboardService,public userService: UserService,public logger: XtremandLogger,public utilService:UtilService
        ) {
        this.isLoggedInAsTeamMember = this.utilService.isLoggedAsTeamMember();
        this.updateLeftSideBar( location );
        this.sourceType = this.authService.getSource();
        this.isLoggedInFromAdminPortal = this.utilService.isLoggedInFromAdminPortal(); 
    }

    updateLeftSideBar( location: Location ) {
        this.location = location;
        try {

            const roles = this.authService.getRoles();
            if ( roles ) {
                if(roles.indexOf(this.roleName.companyPartnerRole) > -1) {
                    this.authService.isCompanyPartner = true;
                }else{
                    this.authService.isCompanyPartner = false;
                }
                
                if ( roles.indexOf( this.roleName.campaignRole ) > -1 ||
                    roles.indexOf( this.roleName.orgAdminRole ) > -1 ||
                    roles.indexOf( this.roleName.vendorRole ) > -1 ||
                    roles.indexOf( this.roleName.vendorTierRole ) > -1 ||
                    roles.indexOf( this.roleName.marketingRole ) > -1 ||
                    roles.indexOf( this.roleName.companyPartnerRole ) > -1) {
                    this.authService.module.isCampaign = true;
                    if( (roles.indexOf( this.roleName.campaignRole ) > -1 && (this.authService.superiorRole === 'OrgAdmin & Partner' || this.authService.superiorRole === 'Vendor & Partner' || this.authService.superiorRole === 'Partner'))
                            || this.authService.isCompanyPartner){
                        this.authService.module.isReDistribution = true;
                    }else{
                        this.authService.module.isReDistribution = false;
                    }
                }
                if ( roles.indexOf( this.roleName.emailTemplateRole ) > -1 ||
                    roles.indexOf( this.roleName.orgAdminRole ) > -1 ||
                    roles.indexOf( this.roleName.vendorTierRole ) > -1 ||
                    roles.indexOf( this.roleName.marketingRole ) > -1 ||
					roles.indexOf( this.roleName.prmRole ) > -1 ||
                    roles.indexOf( this.roleName.vendorRole ) > -1 ) {
                    this.authService.module.isEmailTemplate = true;
                }
                if ( roles.indexOf( this.roleName.statsRole ) > -1 ||
                    roles.indexOf( this.roleName.orgAdminRole ) > -1 ||
                    roles.indexOf( this.roleName.vendorTierRole ) > -1 ||
                    roles.indexOf( this.roleName.marketingRole ) > -1 ||
					roles.indexOf( this.roleName.prmRole ) > -1 ||
                    roles.indexOf( this.roleName.vendorRole ) > -1 ) {
                    this.authService.module.isStats = true;
                }
                if ( roles.indexOf( this.roleName.partnersRole ) > -1 ||
                    roles.indexOf( this.roleName.orgAdminRole ) > -1 ||
                    roles.indexOf( this.roleName.vendorTierRole ) > -1 ||
                    roles.indexOf( this.roleName.marketingRole ) > -1 ||
					roles.indexOf( this.roleName.prmRole ) > -1 ||
                    roles.indexOf( this.roleName.vendorRole ) > -1 ) {
                    this.authService.module.isPartner = true;
                }
                if ( roles.indexOf( this.roleName.videRole ) > -1 ||
                    roles.indexOf( this.roleName.orgAdminRole ) > -1 ||
                    roles.indexOf( this.roleName.vendorTierRole ) > -1 ||
                    roles.indexOf( this.roleName.marketingRole ) > -1 ||
					roles.indexOf( this.roleName.prmRole ) > -1 ||
                    roles.indexOf( this.roleName.vendorRole ) > -1 ) {
                    this.authService.module.isVideo = true;
                }
                if ( roles.indexOf( this.roleName.opportunityRole ) > -1 ||
                    roles.indexOf( this.roleName.orgAdminRole ) > -1 ||
                    roles.indexOf( this.roleName.vendorTierRole ) > -1 ||
                    roles.indexOf( this.roleName.marketingRole ) > -1 ||
					roles.indexOf( this.roleName.prmRole ) > -1 ||
                    roles.indexOf( this.roleName.vendorRole ) > -1 ) {
                    this.authService.module.hasOpportunityRole = true;
                }

                if ( roles.indexOf( this.roleName.companyPartnerRole ) > -1 &&
                        roles.indexOf( this.roleName.orgAdminRole ) < 0 &&
                        roles.indexOf( this.roleName.vendorRole ) < 0 && 
                        roles.indexOf( this.roleName.vendorTierRole )<0 && 
						 roles.indexOf( this.roleName.prmRole )<0 && 
                        roles.indexOf( this.roleName.marketingRole )<0  ) {
                        this.authService.module.isOnlyPartner = true;
                    }

                if ( roles.indexOf( this.roleName.orgAdminRole ) > -1 ) {
                    this.authService.module.isOrgAdmin = true;
                }

                if (roles.indexOf(this.roleName.vendorRole) > -1){
                    this.authService.module.isVendor = true;
                }
                if (roles.indexOf(this.roleName.vendorTierRole) > -1){
                    this.authService.module.isVendorTier = true;
                }
				if(roles.indexOf(this.roleName.prmRole)>-1){
					this.authService.module.isPrm = true;
				}
				if(roles.indexOf(this.roleName.marketingRole)>-1){
					this.authService.module.isMarketing = true;
				}
                
                 if ( roles.indexOf( this.roleName.companyPartnerRole ) > -1 ) {
                    this.pagination.pageIndex = 1;
                    this.pagination.maxResults = 10000;
                    this.dashBoardService.loadVendorDetails( this.authService.getUserId(), this.pagination ).subscribe( response => {
                        if(response.data!=undefined){
                            response.data.forEach( element => {
                                this.refService.getOrgCampaignTypes( element.companyId ).subscribe( data => {
                                    if ( !this.enableLeadsByVendor ) {
                                        this.enableLeadsByVendor = data.enableLeads;
                                    }
                                } );
                            } );
                        }
                       
                    } )
                    this.authService.module.isCompanyPartner = true;
                }
                
                this.refService.getCompanyIdByUserId( this.authService.getUserId() ).subscribe( response => {
                    this.refService.getOrgCampaignTypes( response ).subscribe( data => {
                        this.enableLeads = data.enableLeads;
                        this.formAccess = data.form;
                        this.authService.module.hasPartnerLandingPageAccess = data.partnerLandingPage;
						let anyAdminRole =  roles.indexOf( this.roleName.orgAdminRole ) > -1 || roles.indexOf( this.roleName.vendorRole ) > -1 ||roles.indexOf( this.roleName.vendorTierRole ) > -1  || roles.indexOf( this.roleName.marketingRole ) > -1|| roles.indexOf( this.roleName.prmRole ) > -1;
						                        /**********Form**************/
                        if ((anyAdminRole || roles.indexOf( this.roleName.formRole ) > -1 )  && this.formAccess ) {
                            this.authService.module.hasFormAccess = true;
                        }
                        /**********Landing Page**************/
                        if ( ( anyAdminRole || roles.indexOf( this.roleName.landingPageRole ) > -1 ) && data.landingPage ) {
                            this.authService.module.hasLandingPageAccess = true;
                        }
                       /*************Landing Page Campaign*************/ 
                        if ( (anyAdminRole) && data.landingPageCampaign ) {
                            this.authService.module.hasLandingPageCampaignAccess = true;
                        }

                        if(this.authService.vanityURLEnabled && this.authService.vanityURLUserRoles && this.authService.loggedInUserRole === "Team Member" && (this.authService.superiorRole === "Vendor & Partner" || this.authService.superiorRole === "OrgAdmin & Partner")){                                        
                            if(!this.authService.vanityURLUserRoles.find(role => role.roleId === 11 || role.roleId === 10 || role.roleId === 8 || role.roleId === 4 || role.roleId === 7)){
                                this.checkCreateCampaignOptionForVanityURL = false;
                            }
                        }
                        
                    } );
                    /**********Landing Page************/    
                } );
            }
        } catch ( error ) { console.log( error ); }
    }
    
    ngOnInit() { 
        this.isOnlyPartner = this.authService.loggedInUserRole =="Partner" && this.authService.isPartnerTeamMember==false;        
        this.listLeftSideBarNavItems();
    }
    ngDoCheck() {
        if ( window.innerWidth > 990 ) { 
            this.clearSubMenuValues( false, false, false, false, false,false,false,false,false,false, false,false ); }
    }
    openOrCloseTabs( urlType: string ) {
        if ( window.innerWidth < 990 ) {
            if ( urlType === 'emailtemplates' ) {
                this.emailtemplates = this.router.url.includes( 'emailtemplates' ) ? true : ( this.emailtemplates = !this.emailtemplates );
                this.clearSubMenuValues( this.emailtemplates, false, false, false, false,false,false,false,false,false ,false, false);
            }
            else if ( urlType === 'contacts' ) {
                this.contacts = this.router.url.includes( 'contacts' ) ? true : ( this.contacts = !this.contacts );
                this.clearSubMenuValues( false, false, false, this.contacts, false,false,false,false,false,false,false, false );
            }
            else if ( urlType === 'partners' ) {
                this.partners = this.router.url.includes( 'partners' ) ? true : ( this.partners = !this.partners );
                this.clearSubMenuValues( false, false, false, false, this.partners,false,false,false,false,false,false, false );
            }
            else if ( urlType === 'campaigns' ) {
                this.campaigns = this.router.url.includes( 'campaigns' ) ? true : ( this.campaigns = !this.campaigns );
                this.clearSubMenuValues( false, this.campaigns, false, false, false,false,false,false,false,false,false, false );
            }
            else if ( urlType === 'content' ) {
                this.videos = this.router.url.includes( 'content' ) ? true : ( this.videos = !this.videos );
                this.clearSubMenuValues( false, false, this.videos, false, false,false,false,false,false,false,false, false );
            }
            else if(urlType ==='forms') {
                this.videos = this.router.url.includes('forms') ? true: (this.forms = !this.forms);
                this.clearSubMenuValues(false,false,false,false,false,this.forms,false,false,false,false,false, false); 
            }
            else if(urlType ==='landing-pages') {
                this.videos = this.router.url.includes('forms') ? true: (this.landingPages = !this.landingPages);
                this.clearSubMenuValues(false,false,false,false,false,false,this.landingPages,false,false,false,false, false); 
            }
            else if(urlType ==='mdf') {
                this.mdf = this.router.url.includes('mdf') ? true: (this.mdf = !this.mdf);
                this.clearSubMenuValues(false,false,false,false,false,false,false,this.mdf,false,false,false, false); 
            }
            else if(urlType ==='dam') {
                this.dam = this.router.url.includes('dam') ? true: (this.dam = !this.dam);
                this.clearSubMenuValues(false,false,false,false,false,false,false,false,this.dam,false,false, false); 
            }
            else if ( urlType === 'assignleads' ) {
                this.assignLeads = this.router.url.includes( 'assignleads' ) ? true : ( this.assignLeads = !this.assignLeads );
                this.clearSubMenuValues( false, false, false, false, false,false,false,false,false,true,false, false );
            }
            else if(urlType ==='deals') {
                this.deals = this.router.url.includes('deals') ? true: (this.deals = !this.deals);
                this.clearSubMenuValues(false,false,false,false,false,false,false,false,false,false,this.deals, false); 
            }
            else if ( urlType === 'sharedleads' ) {
                this.sharedLeads = this.router.url.includes( 'sharedleads' ) ? true : ( this.sharedLeads = !this.sharedLeads );
                this.clearSubMenuValues( false, false, false, false, false,false,false,false,false,true,false, true );
            }
        }
    }
    clearSubMenuValues( emailTemplate, campaigs, videos, contacts, partners,forms,landingPages,mdf,dam, assignLeads, deals, sharedLeads) {
        this.emailtemplates = emailTemplate; this.campaigns = campaigs; this.videos = videos; this.contacts = contacts; this.partners = partners;
        this.forms = forms;this.landingPages = landingPages;this.mdf = mdf;this.dam = dam;this.assignLeads=assignLeads;this.sharedLeads=sharedLeads;
        this.deals = deals;
    }
    logout() {
        this.authService.logout();
        this.router.navigate( ['/login'] );
    }

    listLeftSideBarNavItems(){
        this.loading = true;
        let vanityUrlPostDto = {};
        if(this.authService.companyProfileName !== undefined && this.authService.companyProfileName !== ''){
            vanityUrlPostDto['vendorCompanyProfileName'] = this.authService.companyProfileName;
            vanityUrlPostDto['vanityUrlFilter'] = true;
        }
        vanityUrlPostDto['userId'] = this.authService.getUserId();
        this.dashBoardService.listLeftSideNavBarItems(vanityUrlPostDto)
        .subscribe(
          data => {
            this.loading = false;
            this.rssFeedAccess = data.rssFeeds;
            this.authService.module.isContact = data.contacts;
            this.mdfAccess = data.mdf;
            this.mdfAccessAsPartner = data.mdfAccessAsPartner;
            this.authService.contactsCount = data.contactsCount;
            this.damAccess = data.dam;
            this.shareLeadsAccess = data.shareLeads;
            this.sharedLeadsAccess = data.sharedLeads;
            this.damAccessAsPartner = data.damAccessAsPartner;
            this.authService.module.damAccess = data.dam;
            this.authService.module.damAccessAsPartner = data.damAccessAsPartner;
            this.authService.module.isPartnershipEstablishedOnlyWithVendorTier = data.partnershipEstablishedOnlyWithVendorTier;
          },
          _error => {
            this.loading = false;
            this.rssFeedAccess = false;
            this.mdfAccess = false;
            this.mdfAccessAsPartner = false;
            this.authService.contactsCount = false;
          },
          () => {
            this.loading = false;
          }
        );
    }

    


}
