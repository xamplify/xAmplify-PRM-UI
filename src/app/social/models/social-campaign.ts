import { SocialStatusContent } from './social-status-content';
import { SocialStatusProvider } from './social-status-provider';
import { SocialStatus } from './social-status';

export class SocialCampaign {
  id: number;
  campaignId: number;
  parentCampaignId: number;
  userId: number;
  campaignName: string;
  socialStatusList: Array<SocialStatus> = [];

  socialCampaign = false;
  emailOpened = false;
  shareNow = true;
  isPartner = true;
  channelCampaign = false;
  toPartner = false;
  nurtureCampaign = false;
  userListIds: Array<number> = [];

  socialStatusProviderList: Array<SocialStatusProvider> = [];

  scheduledTimeInString: string;
  timeZone: string;
  categoryId:number;
  emailNotification = false;

  /****XNFR-222****/
  allowPartnerToEditThePost = false;
  country = "";
  alias = "";
  fromName = "";
  fromEmail = "";
  vanityUrlCampaign = false;
  vanityUrlDomainName = "";
}