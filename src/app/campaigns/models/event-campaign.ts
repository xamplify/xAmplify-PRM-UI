import { EmailTemplate } from "../../email-template/models/email-template";
import { Location } from "./location";
import { CampaignEventTime } from "./campaign-event-time";
import { CampaignEventMedia } from "./campaign-event-media";
import { Reply } from "./campaign-reply";
import { User } from "../../core/models/user";
import { ContactList } from "../../contacts/models/contact-list";
import { UserListIds } from "../../contacts/models/user-listIds";
import { SocialStatus } from "../../social/models/social-status";
import { Form } from "app/forms/models/form";
import { EventCancellation } from "./event-cancellation";

export class EventCampaign {
  id: number;
  campaign: string;
  user: User = new User();
  message: string;
  subjectLine: string = "";
  updateMessage = "";
  channelCampaign: boolean = false;
  emailOpened: boolean = true;
  emailNotification: boolean = true;
  linkOpened = true;
  socialSharingIcons: boolean = true;
  fromName: string;
  email: string = "";
  launchTimeInString: string;
  emailTemplate: EmailTemplate = new EmailTemplate();
  selectedEditEmailTemplate: EmailTemplate = new EmailTemplate();
  timeZone: string;
  campaignScheduleType: string;
  campaignLocation: Location = new Location();
  country: string;
  countryId: number = 0;
  publicEventCampaign: boolean = false;
  toPartner: boolean = true;
  inviteOthers: boolean = true;
  rsvpReceived: boolean = true;
  onlineMeeting: boolean = true;
  enableCoBrandingLogo = false;
  parentCampaignId: number = 0;

  eventUrl: string = "";

  dataShare = false;
  detailedAnalyticsShared = false;

  userLists: Array<ContactList> = [];
  userListIds: Array<number> = [];

  emailTemplateDTO: EmailTemplate;
  userDTO: User;
  userListDTOs: Array<ContactList> = [];

  campaignEventTimes: Array<CampaignEventTime> = [];
  campaignEventMedias: Array<CampaignEventMedia> = [];
  campaignReplies: Array<Reply> = [];

  hostedBy: string = "";
  nurtureCampaign: boolean = false;

  pushToMarketo = false;
  socialStatusList: Array<SocialStatus> = [];
  forms: Array<Form> = [];

  pushToCRM = [];

  emailIds = [];
  eventStarted = false;
  categoryId: number = 0;
  categoryName: string = "";
  pushToHubspot = false;
  pushToSalesforce = false;
  pushToMarketingAutomation = false;

  eventCancellation: EventCancellation;
  leadPipelineId: number;
  dealPipelineId: number;
  endDateString: string;
  clientTimeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone;
  oneClickLaunch = false;
  configurePipelines = false;
  campaignProcessed = false;

  isRedistributeEvent = false;
  isPreviewEvent = false;

  constructor() {
    this.campaignEventMedias.push(new CampaignEventMedia());
    this.campaignEventTimes.push(new CampaignEventTime());
  }
}
