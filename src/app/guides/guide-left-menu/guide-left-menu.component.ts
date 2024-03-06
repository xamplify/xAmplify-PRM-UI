import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Pagination } from 'app/core/models/pagination';
import { Roles } from 'app/core/models/roles';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { UtilService } from 'app/core/services/util.service';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { VanityLoginDto } from 'app/util/models/vanity-login-dto';
import { UserGuide } from '../models/user-guide';
import { CustomResponse } from 'app/common/models/custom-response';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { PagerService } from 'app/core/services/pager.service';
import { UserService } from 'app/core/services/user.service';
import { SocialPagerService } from 'app/contacts/services/social-pager.service';
import { MenuItem } from 'app/core/models/menu-item';
import { Module } from 'app/core/models/module';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { UserGuideDashboardDto } from '../models/user-guide-dashboard-dto';

var $: any;
@Component({
	selector: 'app-guide-left-menu',
	templateUrl: './guide-left-menu.component.html',
	styleUrls: ['./guide-left-menu.component.css']
})
export class GuideLeftMenuComponent implements OnInit, OnChanges {
	@Input() guideMergeTag: any;
	vanityLoginDto: VanityLoginDto = new VanityLoginDto();
	pagination: Pagination = new Pagination();
	loggedInUserId: number;
	public searchKey: string;
	customResponse: CustomResponse = new CustomResponse();
	pager: any = {};
	isSearch: boolean = false;
	loading: boolean = false;
	public httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
	menuItem: MenuItem = new MenuItem();
	menuItemError = false;
	contentDivs: Array<boolean> = new Array<boolean>();
	prmContentDivs: Array<boolean> = new Array<boolean>();
	customNamePartners = "Partners";
	isLoggedInAsPartner = false;
	roleName: Roles = new Roles();
	moduleName: any;
	userGuide: UserGuide = new UserGuide();
	guideLink: any;
	guideLinkIframe: any;
	userGuides: UserGuide[];
	slug: any;
	userGuideLink: any;
	userGudeTitles: UserGuide[] = [];
	showListId = "";
	userGuideDashboardDto:UserGuideDashboardDto = new UserGuideDashboardDto();
	constructor(private route: ActivatedRoute, public authenticationService: AuthenticationService, public dashboardService: DashboardService,
		public userService: UserService, public utilService: UtilService, public router: Router, public location: Location,
		public sanitizer: DomSanitizer, public refService: ReferenceService, public pagerService: PagerService, public socialPagerService: SocialPagerService) {
		this.loggedInUserId = this.authenticationService.getUserId();
		this.pagination.userId = this.loggedInUserId;
		let companyProfileName = this.authenticationService.companyProfileName;
		if (companyProfileName !== undefined && companyProfileName !== "") {
			this.pagination.vendorCompanyProfileName = companyProfileName;
			this.pagination.vanityUrlFilter = true;
		} else {
			this.pagination.vanityUrlFilter = false;
			this.pagination.loginAsUserId = this.utilService.getLoggedInVendorAdminCompanyUserId();
		}
	}
	statusCode: any;
	isProgress:boolean = false;
	isSlug:boolean = false;
	getUserGuideBySlug(pagination: Pagination) {
		this.loading = true;
		this.ngxLoading = false;
		this.isSearch = false;
		this.pagination.slug = this.slug;
		this.dashboardService.getGuideGuideBySlug(pagination).subscribe(
			(response) => {
				if (response.statusCode === 200) {
					this.statusCode = 200;
					this.userGuide = response.data;
					this.guideLink = this.userGuide.link;
					this.isSearch = false;
					this.showListId = this.userGuide.customName
					this.expansionOfDIvByModuleId(this.userGuide.moduleId)
					this.guideLinkIframe = this.sanitizer.bypassSecurityTrustHtml('<iframe  width="100%" height="1110" src=' + this.guideLink + ' frameborder="0" allowfullscreen></iframe>');
					this.loading = false;
				} else if (response.statusCode === 404) {
					this.isSearch = false;
					this.loading = false;
					this.ngxLoading = false;
					this.statusCode = 404;
				} else if(response.statusCode === 403){
					this.isSearch = false;
					this.loading = false;
					this.ngxLoading = false;
					this.isSlug = true;
					if (this.slug === 'vanity_prm_account_dashboard' || this.slug === 'vanity_marketing_account_dashboard') {
						this.statusCode = 404;
					} else {
						this.statusCode = 500;
					}
				}
			}, (error: any) => {
				this.loading = false;
			})
	}
	expansionModuleName: any;
	expansionOfDIvByModuleId(moduleId: number) {
		if (moduleId === 2) {
			this.expansionModuleName = "Campaign";
		} else if (moduleId === 1) {
			this.expansionModuleName = "Account Dashboard";
		} else if (moduleId === 3) {
			this.expansionModuleName = "Contacts";
		} else if (moduleId === 4) {
			this.expansionModuleName = 'Content';
		} else if (moduleId === 5) {
			this.expansionModuleName = 'DAM';
		} else if (moduleId === 6) {
			this.expansionModuleName = 'Design';
		} else if (moduleId === 7) {
			this.expansionModuleName = 'Forms';
		} else if (moduleId === 8) {
			this.expansionModuleName = 'MDF';
		} else if (moduleId === 9) {
			this.expansionModuleName = 'Opportunities';
		} else if (moduleId === 10) {
			this.expansionModuleName = 'Pages';
		} else if (moduleId === 11) {
			this.expansionModuleName = 'Partner';
		} else if (moduleId === 12) {
			this.expansionModuleName = 'Play Book';
		} else if (moduleId === 13) {
			this.expansionModuleName = 'Share Leads';
		} else if (moduleId === 14) {
			this.expansionModuleName = 'Shared Leads';
		} else if (moduleId === 15) {
			this.expansionModuleName = 'Social Feeds';
		} else if (moduleId === 16) {
			this.expansionModuleName = 'Team';
		} else if (moduleId === 17) {
			this.expansionModuleName = 'Templates';
		} else if (moduleId === 18) {
			this.expansionModuleName = 'Track Builder';
		} else if (moduleId === 19) {
			this.expansionModuleName = 'Configuration';
		} else if(moduleId === 32) {
			this.expansionModuleName = 'Companies';
		}
		this.getUserGuidesByModuleName(this.expansionModuleName);
	}
	isShowSearchResults:boolean = false;
	getSearchKey(event: any) {
		this.searchKey = event;
		this.loading = true;
		this.isSearch = true;
		this.pagination.searchKey = this.searchKey
		this.getSearchResultsOfUserGuides(this.pagination);
		if(this.statusCode === 404) {
         this.isShowSearchResults = true;
		} else {
			this.isShowSearchResults = false;
		}
		this.loading = false;
	}

	ngOnInit() {
		let currentUrl = this.router.url;
		if (currentUrl.includes('/home/help/search')) {
			this.searchKey = this.route.snapshot.params['moduleName'];
			if(this.searchKey === undefined){
				this.searchKey = "";
			}
			this.isSearch = true;
			this.pagination.searchKey = this.searchKey;
			this.getSearchResultsOfUserGuides(this.pagination);
		} else {
			this.slug = this.route.snapshot.params['slug'];
			this.pagination.slug = this.slug;
			this.getUserGuideBySlug(this.pagination);
			this.isSearch = false;
			this.loading = false;
		}
		this.findMenuItems();
	}
	ngOnChanges() {
	}
	findMenuItems() {
		this.loading = true;
		this.ngxLoading = false;
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
					//this.addZendeskScript(data);
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

	getUserGuidesByModuleName(moduleName: any) {
		this.refService.loading(this.httpRequestLoader, true);
		this.httpRequestLoader.isHorizontalCss = true;
		this.loading = true;
		this.ngxLoading = false;
		this.showListId = "";
		this.userGudeTitles = [];
		this.showListId = moduleName;
		this.pagination.moduleName = moduleName;
		this.dashboardService.getUserGuidesByModuleName(this.pagination).subscribe(
			(response) => {
				if (response.statusCode === 200) {
					this.userGudeTitles = response.data;
					console.log(this.userGudeTitles)
					this.loading = false;
				} else {
					this.loading = false;
				}
			}, (error: any) => {
				this.loading = false;
				this.refService.loading(this.httpRequestLoader, false);
			})
	}

	gotoHome() {
		this.router.navigate(['home/help/guides']);
	}
   activeClass="";
	getGuideLinkByTitle(title: string) {
		this.ngxLoading = true;
		this.isShowSearchResults = false;
		this.pagination.guideTitle = title;
		this.dashboardService.getGuideLinkByTitle(this.pagination).subscribe(
			(response) => {
				this.ngxLoading = false;
				this.isSearch = false;
				this.searchKey = "";
				if (response.statusCode === 200) {
					this.statusCode = 200;
					this.isSlug = false;
					let map = response.map;
					this.userGuide.title = title;
					this.userGuideLink = map.link;
					this.slug = map.slug;
					this.expansionOfDIvByModuleId(map.moduleId);
					this.guideLinkIframe = this.sanitizer.bypassSecurityTrustHtml('<iframe  width="100%" height="1110" src=' + this.userGuideLink + ' frameborder="0" allowfullscreen></iframe>');
					this.location.replaceState('home/help/' + this.slug);
				} else if (response.statusCode === 404){
                  this.statusCode = 404;
				} else {
					this.statusCode = 500;
				}
				this.refService.scrollSmoothToTop();
				this.ngxLoading = false;
			}, (error: any) => {
				this.ngxLoading = false;
				this.refService.loading(this.httpRequestLoader, false);
				this.refService.scrollSmoothToTop();
			})
	}
	dashBoardTitle= "";
	getGuideLinkByType() {
		this.ngxLoading = true;
		this.loading = false;
		this.dashboardService.getUserGuidesForDashBoard(this.vanityLoginDto)
		.subscribe(
		  data => {
			this.userGuideDashboardDto = data.data;
			if(this.userGuideDashboardDto.partnerLoggedInThroughVanityUrl){
				this.getGuideLinkByTitle('Partner Account Dashboard');
			} else if (this.userGuideDashboardDto.vendorLoggedInThroughOwnVanityUrl) {
				if (this.userGuideDashboardDto.orgAdminCompany || this.userGuideDashboardDto.vendorCompany) {
				this.getGuideLinkByTitle('Vendor Vanity Account Dashboard')
				}else if(this.userGuideDashboardDto.prmCompany) {
				 this.statusCode = 404;
                 this.pagination.guideTitle = "Prm Account Dasboard"
				} else {
					this.statusCode = 404;
					this.pagination.guideTitle = "Marketing Account Dasboard"
				}
			} else {
				if(this.userGuideDashboardDto.vendorCompany){
					this.getGuideLinkByTitle('Account Dashboard')
				} else if(this.userGuideDashboardDto.marketingCompany){
					this.getGuideLinkByTitle('Marketing Account Dashboard');
				} else if(this.userGuideDashboardDto.orgAdminCompany) {
					this.getGuideLinkByTitle('Orgadmin Account Dashboard')
				} else if(this.userGuideDashboardDto.prmCompany) {
					this.getGuideLinkByTitle('PRM Account Dashboard');
				} else {
					this.getGuideLinkByTitle('Partner Account Dashboard');
				}
			}
		},
		  error => {
			console.log(error);
		  }
		);  
		this.isSearch = false;
		this.ngxLoading = false;
		this.loading = false;
	}

	/***** Search Results  ***/
	getSearchResultByModuleName(){
		if (this.searchKey.toLowerCase() === 'Campaign'.toLowerCase()) {
		  this.pagination.searchWithModuleName = true;
			} else if (this.searchKey.toLowerCase() === 'Account Dashboard'.toLowerCase()) {
		  this.pagination.searchWithModuleName = true;
			} else if (this.searchKey.toLowerCase() === 'Contacts'.toLowerCase()) {
		  this.pagination.searchWithModuleName = true;
			} else if (this.searchKey.toLowerCase()  === 'Content'.toLowerCase()) {
		  this.pagination.searchWithModuleName = true;
			} else if (this.searchKey.toLowerCase()  === 'DAM'.toLowerCase()) {
		  this.pagination.searchWithModuleName = true;
			} else if (this.searchKey.toLowerCase()  === 'Design'.toLowerCase()) {
		  this.pagination.searchWithModuleName = true;
			} else if (this.searchKey.toLowerCase()  === 'Forms'.toLowerCase()) {
		  this.pagination.searchWithModuleName = true;
			} else if (this.searchKey.toLowerCase()  === 'MDF'.toLowerCase()) {
		  this.pagination.searchWithModuleName = true;
			} else if (this.searchKey.toLowerCase()  === 'Opportunities'.toLowerCase()) {
		  this.pagination.searchWithModuleName = true;
			} else if (this.searchKey.toLowerCase()  === 'Pages'.toLowerCase()) {
		  this.pagination.searchWithModuleName = true;
			} else if (this.searchKey.toLowerCase()  === 'Partner'.toLowerCase()) {
		  this.pagination.searchWithModuleName = true;
			} else if (this.searchKey.toLowerCase()  === 'Play Book'.toLowerCase()) {
		  this.pagination.searchWithModuleName = true;
			} else if (this.searchKey.toLowerCase()  === 'Share Leads'.toLowerCase()) {
		  this.pagination.searchWithModuleName = true;
			} else if (this.searchKey.toLowerCase()  === 'Shared Leads'.toLowerCase()) {
		  this.pagination.searchWithModuleName = true;
			} else if (this.searchKey.toLowerCase()  === 'Social Feeds'.toLowerCase()) {
		  this.pagination.searchWithModuleName = true;
			} else if (this.searchKey.toLowerCase()  === 'Team'.toLowerCase()) {
		  this.pagination.searchWithModuleName = true;
			} else if (this.searchKey.toLowerCase()  === 'Templates'.toLowerCase()) {
		  this.pagination.searchWithModuleName = true;
			} else if (this.searchKey.toLowerCase()  === 'Track Builder'.toLowerCase()) {
		  this.pagination.searchWithModuleName = true;
			} else if (this.searchKey.toLowerCase()  === 'Configuration'.toLowerCase()) {
		  this.pagination.searchWithModuleName = true;
			} else {
		  this.pagination.searchWithModuleName = false;
	
		}
	  }
	ngxLoading = false;
	getSearchResultsOfUserGuides(pagination: Pagination) {
		this.loading = true;
		this.ngxLoading = true;
		this.refService.loading(this.httpRequestLoader, true);
		this.httpRequestLoader.isHorizontalCss = true;
		this.getSearchResultByModuleName();
		this.dashboardService.getSearchResultsOfUserGuides(pagination).subscribe(
		  (response) => {
			if (response.statusCode === 200) {
			  let userGuide = response.data;
			  this.userGuides = userGuide.list;
			  console.log(userGuide.totalRecords);
			  console.log(userGuide.list)
			  pagination.totalRecords = userGuide.totalRecords;
			  pagination = this.pagerService.getPagedItems(pagination, userGuide.list);
			  this.pager = this.socialPagerService.getPager(this.userGuides.length, this.pagination.pageIndex, this.pagination.maxResults);
			  this.pagination.pagedItems = this.userGuides.slice(this.pager.startIndex, this.pager.endIndex + 1);
			  this.location.replaceState('home/help/search/'+this.searchKey);
			  this.statusCode = 200;
			  this.loading = false;
			  this.ngxLoading = false;
			  this.refService.loading(this.httpRequestLoader, false);

			} else if(response.statusCode = 404){
				this.statusCode = 404;
				this.loading = false;
				this.ngxLoading = false;

			} else {
			this.statusCode = 500;
			 this.loading = false;
			 this.ngxLoading = false;
			}
			this.refService.loading(this.httpRequestLoader, false);

		  }, (error: any) => {
			this.loading = false;
			this.ngxLoading = false;
		  })
	  }
		setPage(event: any) {
			this.pagination.pageIndex = event.page;
			this.getSearchResultsOfUserGuides(this.pagination);
		}
}  
