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
import { Module } from '../models/module';
import { CustomSkin } from 'app/dashboard/models/custom-skin';
import { VanityLoginDto } from 'app/util/models/vanity-login-dto';

declare var window:any, $: any;

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
	backgroundColor: any;
	customNamePartners = "Partners";
	userId: number;
	subMenuMergeTag = ["partners","contacts","assignLeads","campaigns","opportunities"]; 
	/*** XNFR-134***/
	skin:CustomSkin = new CustomSkin();
	vanityLoginDto: VanityLoginDto = new VanityLoginDto();
	showWorkFlow = false;
	/*** XNFR-224***/
	isLoggedInAsPartner = false;
	/*** XNFR-276***/
	public menuItems:Array<any> =  [];
	mergeTag: any;
	clickedMergeTag: string;
	constructor(private renderer2: Renderer2,
		@Inject(DOCUMENT) private _document:any,public location: Location, public authenticationService: AuthenticationService, public referenceService: ReferenceService, private router: Router
		, private dashBoardService: DashboardService, public userService: UserService, public logger: XtremandLogger, public utilService: UtilService
	) {
		this.isLoggedInAsTeamMember = this.utilService.isLoggedAsTeamMember();
		this.isLoggedInAsPartner = this.utilService.isLoggedAsPartner();
		this.sourceType = this.authenticationService.getSource();
		this.isLoggedInFromAdminPortal = this.utilService.isLoggedInFromAdminPortal();
		this.isSuperAdmin = this.authenticationService.getUserId() == 1;
		/*** XNFR-134***/
		this.userId = this.authenticationService.getUserId();
		this.vanityLoginDto.userId = this.userId;
		let companyProfileName = this.authenticationService.companyProfileName;
		if (companyProfileName !== undefined && companyProfileName !== "") {
		  this.vanityLoginDto.vendorCompanyProfileName = companyProfileName;
		  this.vanityLoginDto.vanityUrlFilter = true;
		}else{
		  this.vanityLoginDto.vanityUrlFilter = false;
		}
		const currentUser = localStorage.getItem( 'currentUser' );
		if (currentUser) {
			const userName = JSON.parse( currentUser )['userName'];
			if(this.referenceService.isQA() || this.referenceService.isProduction()){
				this.authenticationService.module.showWorkFlow = "spai@mobinar.com"==userName;
			}else{
				this.authenticationService.module.showWorkFlow = true;
			}
			
		}

	}


	ngOnInit() {
		 this.findMenuItems();
		 this.getMergeTagByPath();
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
		vanityUrlPostDto['loginAsUserId'] = this.utilService.getLoggedInVendorAdminCompanyUserId();
		//XNFR-276
		this.mergeTag = this.getMergeTagByPath();
		vanityUrlPostDto['mergeTag'] = this.mergeTag;
		this.dashBoardService.listLeftSideNavBarItems(vanityUrlPostDto)
			.subscribe(
				data => {
					this.menuItem.companyProfileCreated = data.companyProfileCreated;
					module.companyProfileCreated = data.companyProfileCreated;
					this.menuItem.accountDashboard = data.accountDashboard;
					this.menuItem.partners = data.partners;
					module.isPartner = data.partners;
					module.isOnlyPartnerCompany = data.onlyPartnerCompany;
					module.showAddLeadsAndDealsOptionInTheDashboard = data.showAddLeadsAndDealsOptionsInDashboard;
					this.setContentMenu(data, module);
					this.menuItem.contacts = data.contacts;
					this.menuItem.shareLeads = data.shareLeads;
					this.authenticationService.module.hasShareLeadAccess = data.shareLeads;
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
					this.authenticationService.module.loggedInThroughOwnVanityUrl = data.loggedInThroughOwnVanityUrl;
					this.authenticationService.module.loggedInThroughVendorVanityUrl = data.loggedInThroughVendorVanityUrl;
					this.authenticationService.module.loggedInThroughXamplifyUrl = data.loggedInThroughXamplifyUrl;
					this.authenticationService.module.adminOrSuperVisor = data.adminOrSuperVisor;
					this.authenticationService.module.deletedPartner = data.deletedPartner;
					this.authenticationService.module.upgradeToMarketing = data.upgradeToMarketing;
					this.authenticationService.module.loginAs = data.loginAs;
					/*****XNFR-130*****/
					this.authenticationService.module.prmDashboard = data.prmDashboard;
					/***XBI-1533**/
					this.authenticationService.module.isAdmin = data.admin;
					this.authenticationService.module.isPartnerAdmin = data.partnerAdmin;
					this.authenticationService.module.isTeamMember = data.teamMember;
					this.authenticationService.module.isPartnerCompany = data.partnerCompany;
					this.authenticationService.module.isAdminAndPartnerCompany = data.adminAndPartnerCompany;
					/*****XNFR-224*****/
					this.authenticationService.module.loginAsPartner = data.loginAsPartner;
					this.authenticationService.module.showSupportSettingOption = data.showSupportSettingOption;
					let loginAsPartnerOptionEnabledForVendor = data.loginAsPartnerOptionEnabledForVendor;
					if(this.isLoggedInAsPartner && !loginAsPartnerOptionEnabledForVendor){
						this.referenceService.showSweetAlertProcessingLoader("Login as is not available for this account. We are redirecting you to the login page.");
						setTimeout(() => {
							this.authenticationService.logout();
						}, 7000);
					}
					this.authenticationService.module.showAddLeadOrDealButtonInMyProfileSection = data.showAddLeadOrDealButtonInMyProfileSection;
					this.authenticationService.module.navigateToPartnerSection = data.navigateToPartnerViewSection;
					//XNFR-276
					this.menuItems = data.menuItems;
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

	setAuthenticationServiceVariables(module: Module, data: any) {
		module.isContact = data.contacts;
		module.showCampaignsAnalyticsDivInDashboard = data.showCampaignsAnalyticsDivInDashboard;
		this.authenticationService.contactsCount = data.contactsCount;
		module.damAccess = data.dam;
		module.damAccessAsPartner = data.damAccessAsPartner;
		module.isPartnershipEstablishedOnlyWithVendorTier = data.partnershipEstablishedOnlyWithVendorTier;
		let roleDisplayDto = data.roleDisplayDto;
		module.isOnlyPartner = roleDisplayDto.partner;
		module.partnerTeamMember = roleDisplayDto.partnerTeamMember;
		module.isPrm = roleDisplayDto.prm;
		module.isPrmTeamMember = roleDisplayDto.prmTeamMember;
		module.isPrmAndPartner = roleDisplayDto.prmAndPartner;
		module.isPrmAndPartnerTeamMember = roleDisplayDto.prmAndPartnerTeamMember;
		module.isVendorTier = roleDisplayDto.vendorTier;
		module.isVendorTierTeamMember = roleDisplayDto.vendorTierTeamMember;
		module.isVendorTierAndPartner = roleDisplayDto.vendorTierAndPartner;
		module.isVendorTierAndPartnerTeamMember = roleDisplayDto.vendorTierAndPartnerTeamMember;
		module.isPrmSuperVisor = roleDisplayDto.prmSuperVisor;
		module.isMarketingSuperVisor = roleDisplayDto.marketingSuperVisor;
		this.authenticationService.isVendorAndPartnerTeamMember = roleDisplayDto.vendorAndPartnerTeamMember;
		this.authenticationService.isVendorTeamMember = roleDisplayDto.vendorTeamMember;
		this.authenticationService.isVendorSuperVisor = roleDisplayDto.vendorSuperVisor;
		this.authenticationService.isOrgAdminSuperVisor = roleDisplayDto.orgAdminSuperVisor;
		this.authenticationService.isOrgAdminAndPartnerTeamMember = roleDisplayDto.orgAdminAndPartnerTeamMember;
		this.authenticationService.isOrgAdminTeamMember = roleDisplayDto.orgAdminTeamMember;
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
		module.isMarketingTeamMember = roleDisplayDto.marketingTeamMember;
		module.isMarektingAndPartner = roleDisplayDto.marketingAndPartner;
    	module.isMarketingAndPartnerTeamMember = roleDisplayDto.marketingAndPartnerTeamMember;
		module.isMarketingCompany = module.isMarketing || module.isMarketingTeamMember || module.isMarektingAndPartner || module.isMarketingAndPartnerTeamMember;
		module.isPrmCompany = module.isPrm || module.isPrmTeamMember || module.isPrmAndPartner || module.isPrmAndPartnerTeamMember;
		module.isOrgAdminCompany = roleDisplayDto.orgAdmin || roleDisplayDto.orgAdminTeamMember || roleDisplayDto.orgAdminAndPartner || roleDisplayDto.orgAdminAndPartnerTeamMember;
		/****XNFR-326****/
		module.emailNotificationSettings = data.emailNotificationSettings;
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
			//this.contentDivs.push(module.isVideo);
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
   
	toggleSubMenu(urlType: string){
		if (window.innerWidth < 990) {
			if (urlType === this.clickedMergeTag) {
				this.clickedMergeTag = "";
			} else {
				this.clickedMergeTag = urlType;
			}
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
			else if (urlType === 'opportunities') {
				this.authenticationService.module.navigatedFromMyProfileSection = false;
				this.authenticationService.module.navigateToPartnerSection = false;
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
	
	startLoader(){
		this.authenticationService.leftSideMenuLoader = true;
	}

	getMergeTagByPath(){
		if(this.router.url.includes('dashboard')){
            this.mergeTag = "dashboard";
			if(this.router.url.includes('myprofile')){
				this.mergeTag = "configuration";
			}	
		}
		else if(this.router.url.includes('partners')){
			this.mergeTag = "partners";
		}
		else if(this.router.url.includes('select-modules') || this.router.url.includes('content') || this.router.url.includes('dam') || this.router.url.includes('tracks') || this.router.url.includes('playbook')){
			this.mergeTag = "content";
		}
		else if(this.router.url.includes('contacts')){
			this.mergeTag = "contacts";
		}
		else if(this.router.url.includes('assignleads')){
			this.mergeTag = "assignleads";
		}
		else if(this.router.url.includes('sharedleads')){
			this.mergeTag = "sharedleads";
		}
		else if(this.router.url.includes('pages/partner') || this.router.url.includes('forms/partner')){
			this.mergeTag = "pages";
		}
		else if(this.router.url.includes('design') || this.router.url.includes('emailtemplates') || (this.router.url.includes('forms') && !this.router.url.includes('forms/partner') && !this.router.url.includes('forms/clpf') && !this.router.url.includes('/analytics/cfa')) || (this.router.url.includes('pages') && !this.router.url.includes('pages/partner') && !this.router.url.includes('campaign'))){
			this.mergeTag = "design";
		}
		else if((this.router.url.includes('campaigns') || this.router.url.includes('campaign') || this.router.url.includes('clpf') || this.router.url.includes('/analytics/cfa'))){
			this.mergeTag = "campaigns";
		}
		else if((this.router.url.includes('deal') || this.router.url.includes('leads') && !this.router.url.includes('assign') && !this.router.url.includes('dashboard') || this.router.url.includes('shared'))){
			this.mergeTag = "opportunities";
		}
		else if(this.router.url.includes('rss')){
			this.mergeTag = "social_feeds";
		}
		else if(this.router.url.includes('mdf')){
			this.mergeTag = "mdf";
		}
		else if(this.router.url.includes('team')){
			this.mergeTag = "team";
		}	
	}
	
	
	
}
