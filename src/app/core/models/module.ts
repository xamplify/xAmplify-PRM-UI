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
    isCompanyPartner:boolean = false;
    isVendor:boolean = false;
    isOrgAdmin:boolean = false;
    isPartner:boolean = false;
    isMarketing = false;

    isPartnershipEstablishedOnlyWithVendorTier = false;
    
    damAccess = false;
    damAccessAsPartner = false;

	isPrm = false;
	isPrmTeamMember = false;
	isPrmAndPartner = false;
    isPrmAndPartnerTeamMember = false;

    isVendorTier = false;
    isVendorTierTeamMember = false;
    isVendorTierAndPartner = false;
    isVendorTierAndPartnerTeamMember = false;
    
    showCampaignsAnalyticsDivInDashboard = false;

}
