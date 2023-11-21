import {DashboardType} from '../models/dashboard-type.enum';
export class CampaignAccess {
  videoCampaign = false;
  emailCampaign = false
  socialCampaign = false;
  eventCampaign = false;
  smsCampaign = false;
  leads = false;
  formBuilder = false;
  landingPage = false;
  landingPageCampaign = false;
  partnerLandingPage = false;
  companyId = 0;
  userId = 0;
  allBoundSource = false;
  vanityUrlDomain = false;
  mdf = false;
  loginAsTeamMember = false;
  rssFeeds = false;
  dam = false;
  roleId:number = 0;
  shareLeads = false;
  campaignPartnerTemplateOpenedAnalytics = false;
  salesEnablement = false;
  lms = false;
  dashboardType:DashboardType;
  dashboardTypeInString = "";
  playbooks = false;
  excludeUsersOrDomains = false;
  chatSupport =false;
  allBoundSamlSettings = false;
  survey  = false;
  dataShare = false;
  oneClickLaunch = false;
  agency = false;
  customSkinSettings = false;
  maxAdmins = 2;
  /*** XNFR-224 ****/
  loginAsPartner = false;
  /*** XNFR-256 ****/
  microsoftSSO = false;
  /**** XNFR-255 *****/
  shareWhiteLabeledContent = false;
  createWorkflow = false;

}
