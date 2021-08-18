import { Component, OnInit, DoCheck,Renderer2,Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { DashboardService } from '../../dashboard/dashboard.service';
import { UserService } from '../services/user.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { UtilService } from '../../core/services/util.service';
import { MenuItem } from '../models/menu-item';
import { Roles } from '../../core/models/roles';

declare var $: any;

@Component({
	selector: 'app-leftsidebar',
	templateUrl: './leftsidebar.component.html',
	styleUrls: ['./leftsidebar.component.css']
})
export class LeftsidebarComponent implements OnInit, DoCheck {
	isLoggedInAsTeamMember = false;
	sourceType: any;
	isLoggedInFromAdminPortal: boolean;
	loading = false;
	menuItem: MenuItem = new MenuItem();
	menuItemError = false;
	contentDivs: Array<boolean> = new Array<boolean>();
	isSuperAdmin = false;
	roleName: Roles = new Roles();
	
	constructor(private renderer2: Renderer2,
		@Inject(DOCUMENT) private _document:any,public location: Location, public authenticationService: AuthenticationService, public referenceService: ReferenceService, private router: Router
		, private dashBoardService: DashboardService, public userService: UserService, public logger: XtremandLogger, public utilService: UtilService
	) {
		this.isLoggedInAsTeamMember = this.utilService.isLoggedAsTeamMember();
		this.sourceType = this.authenticationService.getSource();
		this.isLoggedInFromAdminPortal = this.utilService.isLoggedInFromAdminPortal();
		this.isSuperAdmin = this.authenticationService.getUserId() == 1;
	}


	ngOnInit() {
		this.findMenuItems();
	}
	ngDoCheck() {

	}

	findMenuItems() {
		this.loading = true;
		let module = this.authenticationService.module;
		module.contentLoader = true;
		let vanityUrlPostDto = {};
		if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
			vanityUrlPostDto['vendorCompanyProfileName'] = this.authenticationService.companyProfileName;
			vanityUrlPostDto['vanityUrlFilter'] = true;
		}
		vanityUrlPostDto['userId'] = this.authenticationService.getUserId();
		this.dashBoardService.listLeftSideNavBarItems(vanityUrlPostDto)
			.subscribe(
				data => {
					this.menuItem.companyProfileCreated = data.companyProfileCreated;
					this.menuItem.accountDashboard = data.accountDashboard;
					this.menuItem.partners = data.partners;
					this.authenticationService.module.isPartner = data.partners;
					this.setContentMenu(data, module);
					this.menuItem.contacts = data.contacts;
					this.menuItem.shareLeads = data.shareLeads;
					this.menuItem.sharedLeads = data.sharedLeads;
					this.menuItem.pagesAccessAsPartner = data.pagesAccessAsPartner;

					this.setDesignMenu(data);

					this.menuItem.campaign = data.campaign;
					this.menuItem.campaignAccessAsPartner = data.redistribute;
					this.authenticationService.module.isCampaign = data.campaign || data.redistribute;
					this.authenticationService.module.isReDistribution = data.redistribute;
					this.authenticationService.module.hasLandingPageCampaignAccess = data.pageCampaign;

					this.authenticationService.module.isStats = data.stats;

					this.menuItem.opportunities = data.opportunities;
					module.hasOpportunityRole = data.opportunities;
					this.menuItem.opportunitiesAccessAsPartner = data.opportunitiesAccessAsPartner;
					this.authenticationService.enableLeads = data.opportunities;

					this.menuItem.socialFeeds = data.rssFeeds;
					this.menuItem.socialFeedsAccessAsPartner = data.rssFeedsAccessAsPartner;
					module.hasSocialStatusRole = data.socialShare;

					this.menuItem.mdf = data.mdf;
					this.menuItem.mdfAccessAsPartner = data.mdfAccessAsPartner;
					
					this.menuItem.team = data.team;

					this.setAuthenticationServiceVariables(module,data);

					const roles = this.authenticationService.getRoles();
					this.authenticationService.isCompanyPartner = roles.indexOf(this.roleName.companyPartnerRole) > -1;
					module.isCompanyPartner = roles.indexOf(this.roleName.companyPartnerRole) > -1;
					module.isOrgAdmin = roles.indexOf(this.roleName.orgAdminRole) > -1;
					module.isVendor = roles.indexOf(this.roleName.vendorRole) > -1;
					module.isPrm = roles.indexOf(this.roleName.prmRole) > -1;
					module.isMarketing = roles.indexOf(this.roleName.marketingRole) > -1;
					module.isVendorTier = roles.indexOf(this.roleName.vendorTierRole) > -1;

					this.addZendeskScript(data);
					
					
				},
				error => {
					let statusCode = JSON.parse(error['status']);
					if (statusCode == 401) {
						this.loading = false;
						this.authenticationService.revokeAccessToken();
					} else if (statusCode == 500) {
						this.loading = false;
						this.menuItemError = true;
					}
				},
				() => {
					this.loading = false;
					this.authenticationService.module.contentLoader = false;
					this.authenticationService.leftSideMenuLoader = false;
					this.menuItemError = false;
				}
			);
	}

	setAuthenticationServiceVariables(module: any, data: any) {
		module.isContact = data.contacts;
		module.showCampaignsAnalyticsDivInDashboard = data.showCampaignsAnalyticsDivInDashboard;
		this.authenticationService.contactsCount = data.contactsCount;
		module.damAccess = data.dam;
		module.damAccessAsPartner = data.damAccessAsPartner;
		module.isPartnershipEstablishedOnlyWithVendorTier = data.partnershipEstablishedOnlyWithVendorTier;
		let roleDisplayDto = data.roleDisplayDto;
		module.isOnlyPartner = roleDisplayDto.partner;
		module.isPrm = roleDisplayDto.prm;
		module.isPrmTeamMember = roleDisplayDto.prmTeamMember;
		module.isPrmAndPartner = roleDisplayDto.prmAndPartner;
		module.isPrmAndPartnerTeamMember = roleDisplayDto.prmAndPartnerTeamMember;
		module.isVendorTier = roleDisplayDto.vendorTier;
		module.isVendorTierTeamMember = roleDisplayDto.vendorTierTeamMember;
		module.isVendorTierAndPartner = roleDisplayDto.vendorTierAndPartner;
		module.isVendorTierAndPartnerTeamMember = roleDisplayDto.vendorTierAndPartnerTeamMember;
		this.authenticationService.isVendorAndPartnerTeamMember = roleDisplayDto.vendorAndPartnerTeamMember;
		this.authenticationService.isOrgAdminAndPartnerTeamMember = roleDisplayDto.orgAdminAndPartnerTeamMember;
		this.authenticationService.partnershipEstablishedOnlyWithPrmAndLoggedInAsPartner = data.partnershipEstablishedOnlyWithPrmAndLoggedInAsPartner;
		this.authenticationService.partnershipEstablishedOnlyWithPrm = data.partnershipEstablishedOnlyWithPrm;
		this.authenticationService.folders = data.folders;
		this.authenticationService.lmsAccess = data.lms;
		this.authenticationService.leadsAndDeals = data.opportunities;
		this.authenticationService.mdf = data.mdf;
		this.authenticationService.mdfAccessAsPartner = data.mdfAccessAsPartner;
		module.hasPartnerLandingPageAccess = data.pagesAccessAsPartner;
		module.playbookAccess = data.playbook;
		module.playbookAccessAsPartner = data.playbookAccessAsPartner;
		module.showContent = data.content;
		module.showPartnerEmailTemplatesFilter = (roleDisplayDto.vendorTierAndPartner || roleDisplayDto.vendorTierAndPartnerTeamMember || roleDisplayDto.vendorAndPartner || roleDisplayDto.vendorAndPartnerTeamMember || roleDisplayDto.orgAdminAndPartner || roleDisplayDto.orgAdminAndPartnerTeamMember);
		module.isPartnerSuperVisor = roleDisplayDto.partnerSuperVisor;
		module.isAnyAdminOrSupervisor = roleDisplayDto.anyAdminOrSuperVisor;
		module.allBoundSamlSettings = data.allBoundSamlSettings;
		
	}

	setContentMenu(data: any, module: any) {
		this.menuItem.content = data.content;
		module.showContent = data.content;
		module.isVideo = data.videos;
		module.damAccess = data.dam;
		module.damAccessAsPartner = data.damAccessAsPartner;
		module.lmsAccess = data.lms;
		module.lmsAccessAsPartner = data.lmsAccessAsPartner;
		module.playbookAccess = data.playbook;
		module.playbookAccessAsPartner = data.playbookAccessAsPartner;
		if (data.content) {
			this.contentDivs.push(module.isVideo);
			this.contentDivs.push(module.damAccess || module.damAccessAsPartner);
			this.contentDivs.push(module.lmsAccess || module.lmsAccessAsPartner);
			this.contentDivs.push(module.playbookAccess || module.playbookAccessAsPartner);
			this.contentDivs.push();
			const count = this.contentDivs.filter((value) => value).length;
			module.contentDivsCount = count;
		} else {
			module.contentDivsCount = 0;
		}
	}

	setDesignMenu(data: any) {
		this.menuItem.design = data.design;
		this.menuItem.emailTemplates = data.emailTemplates;
		this.menuItem.forms = data.forms;
		this.menuItem.pages = data.pages;
		this.authenticationService.module.isEmailTemplate = data.emailTemplates;
		this.authenticationService.module.hasFormAccess = data.forms;
		this.authenticationService.module.hasLandingPageAccess = data.pages;
		
	}

	

	addZendeskScript(data:any){
		let chatSupport = data.chatSupport;
		let chatSupportAccessAsPartner = data.chatSupportAccessAsPartner;
		if(chatSupport || chatSupportAccessAsPartner){
			var element = document.getElementById('ze-snippet');
			$('#launcher').contents().find('#Embed').show();
			if(element==null){
				const s = this.renderer2.createElement('script');
				s.type = 'text/javascript';
				s.src = 'https://static.zdassets.com/ekr/snippet.js?key=4fd51adb-a388-4f74-bfec-00878e3f02cf';
				s.text = ``;
				s.id = 'ze-snippet';
				this.renderer2.appendChild(this._document.body, s);
			}
		}else{
			this.authenticationService.removeZenDeskScript();
			
		}
	}	


}
