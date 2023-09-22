
export class Module {
    isCampaign:boolean = false;
    isContact:boolean = false;
    isEmailTemplate:boolean = false;
    isStats:boolean = false;
    isVideo:boolean = false;
    hasVideoRole:boolean = false;
    hasOpportunityRole = false;
    hasSocialStatusRole:boolean = false;
    

    hasFormAccess:boolean = false;
    hasLandingPageAccess:boolean = false;
    hasPartnerLandingPageAccess:boolean = false;
    hasLandingPageCampaignAccess:boolean = false;


    enableLeadsByVendor = false;
    enableLeads = false;
    
    isAddingPartnersAccess = false;
    isReDistribution = false;

    isOnlyPartner = false;
    partnerTeamMember = false;
    isCompanyPartner:boolean = false;
    isVendor:boolean = false;
    isOrgAdmin:boolean = false;
    isPartner:boolean = false;

    isPartnershipEstablishedOnlyWithVendorTier = false;
    
    damAccess = false;
    damAccessAsPartner = false;

	lmsAccess = false;
	lmsAccessAsPartner = false;
	
	playbookAccess = false;
	playbookAccessAsPartner = false;

	isPrm = false;
	isPrmTeamMember = false;
	isPrmAndPartner = false;
    isPrmAndPartnerTeamMember = false;
    isPrmSuperVisor = false;

    isVendorTier = false;
    isVendorTierTeamMember = false;
    isVendorTierAndPartner = false;
    isVendorTierAndPartnerTeamMember = false;
    
    showCampaignsAnalyticsDivInDashboard = false;
    showContent = false;
    contentDivsCount = 0;
    contentLoader = false;
    isPartnerSuperVisor : boolean = false;

    showPartnerEmailTemplatesFilter = false;
    
    isAnyAdminOrSupervisor = false;

    allBoundSamlSettings = false;

    notifyPartners = false;
    prmContentDivsCount = 0;

    opportunitiesAccessAsPartner = false;
    isOnlyPartnerCompany = false;
    showAddLeadsAndDealsOptionInTheDashboard = false;
    showCampaignOptionInManageVideos = false;
    createCampaign = false;
    loggedInThroughVendorVanityUrl = false;
    loggedInThroughOwnVanityUrl = false;
    loggedInThroughXamplifyUrl = false;
    adminOrSuperVisor = false;

    isMarketing = false;
	isMarketingTeamMember = false;
	isMarektingAndPartner = false;
    isMarketingAndPartnerTeamMember = false;
    isMarketingSuperVisor = false;
    isMarketingCompany = false;

    isPrmCompany = false;
    deletedPartner = false;
    upgradeToMarketing = false;
    companyProfileCreated = false;
    loginAs = false;

    prmDashboard = false;

    /*******XNFR-84*******/
    agencyAccess = false;

    isAgency = false;
	isAgencyTeamMember = false;
    isAgencySuperVisor = false;
    isAgencyCompany = false;
    agencyUserDashboard = false;
    /***XBI-1533**/
    isAdmin = false;
    isPartnerAdmin = false;
    isTeamMember = false;
    isPartnerCompany = false;
    isAdminAndPartnerCompany = false;

    /*******XNFR-224*******/
    loginAsPartner = false;
    showSupportSettingOption = false;

    navigatedFromMyProfileSection = false;
    showAddLeadOrDealButtonInMyProfileSection = false;
    navigateToPartnerSection = false;

    /***XNFR-318***/
    isOrgAdminCompany = false;

    topNavBarLoader = false;
    logoutButtonClicked =false;

    /****XNFR-326****/
    emailNotificationSettings = false;
    showWorkFlow = false;


}
