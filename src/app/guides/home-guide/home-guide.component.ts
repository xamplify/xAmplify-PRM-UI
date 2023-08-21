import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'app/core/models/menu-item';
import { Module } from 'app/core/models/module';
import { Pagination } from 'app/core/models/pagination';
import { Roles } from 'app/core/models/roles';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { UtilService } from 'app/core/services/util.service';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { VanityLoginDto } from 'app/util/models/vanity-login-dto';
import { UserGuide } from '../models/user-guide';
import { Location } from '@angular/common';
import { PagerService } from 'app/core/services/pager.service';
import { SocialPagerService } from 'app/contacts/services/social-pager.service';

var $: any;
@Component({
	selector: 'app-home-guide',
	templateUrl: './home-guide.component.html',
	styleUrls: ['./home-guide.component.css']
})
export class HomeGuideComponent implements OnInit {
	loading: boolean = false;
	vanityLoginDto: VanityLoginDto = new VanityLoginDto();
	menuItem: MenuItem = new MenuItem();
	menuItemError = false;
	contentDivs: Array<boolean> = new Array<boolean>();
	prmContentDivs: Array<boolean> = new Array<boolean>();
	customNamePartners = "Partners";
	isLoggedInAsPartner = false;
	roleName: Roles = new Roles();
	public searchKey: string;
	pagination: Pagination = new Pagination();
	userGudeTitles: UserGuide[] = [];
	loggedInUserId: number;
	hidePageBarClass = false
	titlesByModuleId: any;
	pager: any = {};
	statusCode: any;
	constructor(public authenticationService: AuthenticationService, public utilService: UtilService, public dashboardService: DashboardService,
		public refService: ReferenceService, public router: Router, public location: Location, private route: ActivatedRoute,public pagerService: PagerService, public socialPagerService: SocialPagerService) {
		this.loggedInUserId = this.authenticationService.getUserId();
		this.pagination.userId = this.loggedInUserId;
		let companyProfileName = this.authenticationService.companyProfileName;
		if (companyProfileName !== undefined && companyProfileName !== "") {
			this.pagination.vendorCompanyProfileName = companyProfileName;
			this.pagination.vanityUrlFilter = true;
		} else {
			this.pagination.vanityUrlFilter = false;
		}
	}
	
	ngOnInit() {
		let slug = this.route.snapshot.params['moduleName'];
        if(slug === undefined || slug === ""){
			this.hidePageBarClass = false;
		} else {
			this.getTitlesByModule(slug);
			//this.hidePageBarClass = true;
		}
		this.findMenuItems();
	}
	findMenuItems() {
		this.loading = true;
		let module = this.authenticationService.module;
		module.contentLoader = true;
		if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
			this.vanityLoginDto.vendorCompanyProfileName = this.authenticationService.companyProfileName;
			this.vanityLoginDto.vanityUrlFilter = true;
		} else {
			this.vanityLoginDto.vanityUrlFilter = false;
		}
		this.vanityLoginDto.userId = this.authenticationService.getUserId();
		this.vanityLoginDto.loginAsUserId = this.utilService.getLoggedInVendorAdminCompanyUserId();
		this.dashboardService.listLeftSideNavBarItems(this.vanityLoginDto)
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
					this.menuItem.sharedLeads = data.sharedLeads;
					this.menuItem.pagesAccessAsPartner = data.pagesAccessAsPartner;

					this.setDesignMenu(data, module);

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

					this.setAuthenticationServiceVariables(module, data);

					const roles = this.authenticationService.getRoles();
					this.authenticationService.isCompanyPartner = roles.indexOf(this.roleName.companyPartnerRole) > -1;
					module.isCompanyPartner = roles.indexOf(this.roleName.companyPartnerRole) > -1;
					module.isOrgAdmin = roles.indexOf(this.roleName.orgAdminRole) > -1;
					module.isVendor = roles.indexOf(this.roleName.vendorRole) > -1;
					module.isPrm = roles.indexOf(this.roleName.prmRole) > -1;
					module.isMarketing = roles.indexOf(this.roleName.marketingRole) > -1;
					module.isVendorTier = roles.indexOf(this.roleName.vendorTierRole) > -1;
					/*****XNFR-84 **********/
					if (data.moduleNames != undefined && data.moduleNames.length > 0 && data.moduleNames != null) {
						this.authenticationService.moduleNames = data.moduleNames;
						this.authenticationService.partnerModule = this.authenticationService.moduleNames[0];
						this.customNamePartners = this.authenticationService.partnerModule.customName;
						localStorage.setItem('partnerModuleCustomName', this.customNamePartners);
					} else {
						this.authenticationService.partnerModule.customName = "Partners";
						this.customNamePartners = this.authenticationService.partnerModule.customName;
						localStorage.setItem('partnerModuleCustomName', this.customNamePartners);
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
					if (this.isLoggedInAsPartner && !loginAsPartnerOptionEnabledForVendor) {
						this.refService.showSweetAlertProcessingLoader("Login as is not available for this account. We are redirecting you to the login page.");
						setTimeout(() => {
							this.authenticationService.logout();
						}, 7000);
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
	setDesignMenu(data: any, module: any) {
		this.menuItem.design = data.design;
		this.menuItem.emailTemplates = data.emailTemplates;
		this.menuItem.forms = data.forms;
		this.menuItem.pages = data.pages;
		module.isEmailTemplate = data.emailTemplates;
		module.hasFormAccess = data.forms;
		module.hasLandingPageAccess = data.pages;

	}
	startLoader() {
		this.loading = true;
	}

	
	getTitlesByModule(moduleId: number) {
		this.loading = true;
		this.dashboardService.getModuleNameByModuleId(moduleId).subscribe(
			(response) => {
				if (response.statusCode === 200) {
					this.statusCode = 200;
					let moduleName = response.data;
					this.getUserGuidesByModuleName(moduleName);
					this.location.replaceState('home/help/guides/' + moduleName);
					this.loading = false;
				}else {
					this.loading = false;
					this.statusCode = 400;
				}
			}, (error: any) => {
				this.loading = false;
			})
	}
	goToHome() {
		this.hidePageBarClass = false;
		this.location.replaceState('home/help/guides');
	}

	getUserGuidesByModuleName(moduleName: any) {
		this.hidePageBarClass = true;
		this.loading = true;
		this.userGudeTitles = [];
		this.pagination.moduleName = moduleName;
		this.getGuideTitlesByModuleName(this.pagination);
	}
   getGuideTitlesByModuleName(pagination:Pagination){
	this.dashboardService.getUserGuidesByModuleName(pagination).subscribe(
		(data) => {
			if (data.statusCode === 200) {
				this.userGudeTitles = data.data;
				pagination.totalRecords = this.userGudeTitles.length;
				pagination = this.pagerService.getPagedItems(pagination, data.data);
				this.loading = false;
			} else {
				this.statusCode = 400;
				this.loading = false;
			}
		}, (error: any) => {
			this.loading = false;
		})
   }
	getGuideLinkByTitle(title:any) {
		this.pagination.guideTitle = title;
		this.dashboardService.getGuideLinkByTitle(this.pagination).subscribe(
			(response) => {
				if (response.statusCode === 200) {
				let map = response.map;
				this.router.navigate(['home/help/' + map.slug])
				} else {
					this.statusCode = 400;
				}
			}, (error: any) => {
				this.refService.scrollSmoothToTop();
			})
	}
	getSearchKey(event: any) {
		this.searchKey = event;
		if (this.searchKey != "" && this.searchKey != undefined) {
			this.router.navigate(['home/help/search/' + this.searchKey])
		}
	}
	setPage(event: any) {
		this.pagination.pageIndex = event.page;
		this.getGuideTitlesByModuleName(this.pagination);
	}
}
