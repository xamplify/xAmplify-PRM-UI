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

declare var window,$: any;

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
	prmContentDivs: Array<boolean> = new Array<boolean>();
	isSuperAdmin = false;
	roleName: Roles = new Roles();
	emailtemplates: boolean;
	contacts: boolean;
	partners: boolean;
	campaigns: boolean;
	videos: boolean;
	forms: boolean;
	landingPages: boolean;
	mdf: boolean;
	dam: boolean;
	assignLeads: boolean;
	deals: any;
	sharedLeads: boolean;
	lms: any;
	playbook: boolean;
	customNamePartners = "Partners";
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
					module.isPartner = data.partners;
					module.isOnlyPartnerCompany = data.onlyPartnerCompany;
					module.showAddLeadsAndDealsOptionInTheDashboard = data.showAddLeadsAndDealsOptionsInDashboard;
					this.setContentMenu(data, module);
					this.menuItem.contacts = data.contacts;
					this.menuItem.shareLeads = data.shareLeads;
					this.menuItem.sharedLeads = data.sharedLeads;
					this.menuItem.pagesAccessAsPartner = data.pagesAccessAsPartner;

					this.setDesignMenu(data,module);

					this.menuItem.campaign = data.campaign;
					this.authenticationService.module.createCampaign = data.campaign;
					this.menuItem.campaignAccessAsPartner = data.redistribute;
					module.isCampaign = data.campaign || data.redistribute;
					module.showCampaignOptionInManageVideos = data.campaign;
					module.isReDistribution = data.redistribute;
					module.hasLandingPageCampaignAccess = data.pageCampaign;

					module.isStats = data.stats;

					this.menuItem.opportunities = data.opportunities;
					module.hasOpportunityRole = data.opportunities;
					this.menuItem.opportunitiesAccessAsPartner = data.opportunitiesAccessAsPartner;
					module.opportunitiesAccessAsPartner = data.opportunitiesAccessAsPartner;
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
					/*****XNFR-84 **********/
					if(data.moduleNames!=undefined && data.moduleNames.length>0 && data.moduleNames!=null){
						this.authenticationService.moduleNames = data.moduleNames;
						this.authenticationService.partnerModule = this.authenticationService.moduleNames[0];
						this.customNamePartners = this.authenticationService.partnerModule.customName;
						localStorage.setItem('partnerModuleCustomName',this.customNamePartners);
					}else{
						this.authenticationService.partnerModule.customName = "Partners";
						this.customNamePartners = this.authenticationService.partnerModule.customName;
						localStorage.setItem('partnerModuleCustomName',this.customNamePartners);
					}
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
					module.contentLoader = false;
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
		module.notifyPartners = data.notifyPartners;
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
			const count = this.contentDivs.filter((value) => value).length;
			module.contentDivsCount = count;
			this.prmContentDivs.push(module.damAccess || module.damAccessAsPartner);
			this.prmContentDivs.push(module.lmsAccess || module.lmsAccessAsPartner);
			this.prmContentDivs.push(module.playbookAccess || module.playbookAccessAsPartner);
			module.prmContentDivsCount = this.prmContentDivs.filter((value) => value).length;
		} else {
			module.contentDivsCount = 0;
			module.prmContentDivsCount = 0;
		}
	}

	setDesignMenu(data: any,module:any) {
		this.menuItem.design = data.design;
		this.menuItem.emailTemplates = data.emailTemplates;
		this.menuItem.forms = data.forms;
		this.menuItem.pages = data.pages;
		module.isEmailTemplate = data.emailTemplates;
		module.hasFormAccess = data.forms;
		module.hasLandingPageAccess = data.pages;
		
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

	ngDoCheck() {
		if (window.innerWidth > 990) {
			this.clearSubMenuValues(false, false, false, false, false, false, false, false, false, false, false, false, false, false);
		}
	}

	openOrCloseTabs(urlType: string) {
		if (window.innerWidth < 990) {
			if (urlType === 'emailtemplates') {
				this.emailtemplates = this.router.url.includes('emailtemplates') ? true : (this.emailtemplates = !this.emailtemplates);
				this.clearSubMenuValues(this.emailtemplates, false, false, false, false, false, false, false, false, false, false, false, false, false);
			}
			else if (urlType === 'contacts') {
				this.contacts = this.router.url.includes('contacts') ? true : (this.contacts = !this.contacts);
				this.clearSubMenuValues(false, false, false, this.contacts, false, false, false, false, false, false, false, false, false, false);
			}
			else if (urlType === 'partners') {
				this.partners = this.router.url.includes('partners') ? true : (this.partners = !this.partners);
				this.clearSubMenuValues(false, false, false, false, this.partners, false, false, false, false, false, false, false, false, false);
			}
			else if (urlType === 'campaigns') {
				this.campaigns = this.router.url.includes('campaigns') ? true : (this.campaigns = !this.campaigns);
				this.clearSubMenuValues(false, this.campaigns, false, false, false, false, false, false, false, false, false, false, false, false);
			}
			else if (urlType === 'content') {
				this.videos = this.router.url.includes('content') ? true : (this.videos = !this.videos);
				this.clearSubMenuValues(false, false, this.videos, false, false, false, false, false, false, false, false, false, false, false);
			}
			else if (urlType === 'forms') {
				this.videos = this.router.url.includes('forms') ? true : (this.forms = !this.forms);
				this.clearSubMenuValues(false, false, false, false, false, this.forms, false, false, false, false, false, false, false, false);
			}
			else if (urlType === 'landing-pages') {
				this.videos = this.router.url.includes('forms') ? true : (this.landingPages = !this.landingPages);
				this.clearSubMenuValues(false, false, false, false, false, false, this.landingPages, false, false, false, false, false, false, false);
			}
			else if (urlType === 'mdf') {
				this.mdf = this.router.url.includes('mdf') ? true : (this.mdf = !this.mdf);
				this.clearSubMenuValues(false, false, false, false, false, false, false, this.mdf, false, false, false, false, false, false);
			}
			else if (urlType === 'dam') {
				this.dam = this.router.url.includes('dam') ? true : (this.dam = !this.dam);
				this.clearSubMenuValues(false, false, false, false, false, false, false, false, this.dam, false, false, false, false, false);
			}
			else if (urlType === 'assignleads') {
				this.assignLeads = this.router.url.includes('assignleads') ? true : (this.assignLeads = !this.assignLeads);
				this.clearSubMenuValues(false, false, false, false, false, false, false, false, false, true, false, false, false, false);
			}
			else if (urlType === 'deal') {
				this.deals = this.router.url.includes('deal') ? true : (this.deals = !this.deals);
				this.clearSubMenuValues(false, false, false, false, false, false, false, false, false, false, this.deals, false, false, false);
			}
			else if (urlType === 'sharedleads') {
				this.sharedLeads = this.router.url.includes('sharedleads') ? true : (this.sharedLeads = !this.sharedLeads);
				this.clearSubMenuValues(false, false, false, false, false, false, false, false, false, false, false, this.sharedLeads, false, false);
			} else if (urlType === 'lms') {
				this.lms = this.router.url.includes('lms') ? true : (this.lms = !this.lms);
				this.clearSubMenuValues(false, false, false, false, false, false, false, false, false, false, false, false, this.lms, false);
			} else if (urlType === 'playbook') {
				this.playbook = this.router.url.includes('playbook') ? true : (this.playbook = !this.playbook);
				this.clearSubMenuValues(false, false, false, false, false, false, false, false, false, false, false, false, false, this.playbook);
			}
		}
	}
	clearSubMenuValues(emailTemplate, campaigs, videos, contacts, partners, forms, landingPages, mdf, dam, assignLeads, deals, sharedLeads, lms, playbook) {
		this.emailtemplates = emailTemplate; 
		this.campaigns = campaigs; 
		this.videos = videos; 
		this.contacts = contacts; 
		this.partners = partners;
		this.forms = forms; 
		this.landingPages = landingPages; 
		this.mdf = mdf; 
		this.dam = dam; 
		this.assignLeads = assignLeads; 
		this.sharedLeads = sharedLeads;
		this.deals = deals;
		this.lms = lms;
		this.playbook = playbook;
	}
	

}
