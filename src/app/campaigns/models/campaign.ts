import { SaveVideoFile } from '../../videos/models/save-video-file';
import { EmailTemplate } from '../../email-template/models/email-template';
import {LandingPage} from '../../landing-pages/models/landing-page';
import { Reply } from './campaign-reply';
import { Url } from './campaign-url';
import { SocialStatus } from '../../social/models/social-status';
import { CampaignType } from './campaign-type';
export class Campaign {

    campaignName: string="";
    fromName: string="";
    subjectLine: string="";
    email: string="";
    preHeader: string="";
    message: string="";
    selectedVideoId: number = 0;;
    userListIds: number[] = [];
    userId: number;
    emailNotification = false;
    emailOpened = false;
    videoPlayed = false;
    linkOpened = false;
    socialSharingIcons: boolean;
    replyVideo = false;
    selectedEmailTemplateId: number=0;
    optionForSendingMials: string;
    launchTime: Date;
    endTime: Date;
    scheduleCampaign: string = "";
    isChecked: boolean;
    campaignId = 0;
    campaignVideoFile: SaveVideoFile;
    emailTemplate: EmailTemplate = new EmailTemplate();
    scheduleTime: string="";
    regularEmail: boolean;
    launched: boolean=false;
    launchedOn = "";
    campaignReplies: Array<Reply>;
    campaignUrls: Array<Url>;
    channelCampaign = false;
    throughPartner:boolean = false;
    enableCoBrandingLogo = false;
    partnerVideoSelected = false;

    socialStatus: SocialStatus;
    createdTime: Date;
    updatedTime: Date;
    updatedBy: number;
    campaignType: CampaignType;
    campaignTypeInString:string="";
    countryId:number = 0;
    country:string = "";
    timeZoneId: any;
    createdFromVideos=false;
    scheduleType:string = "";
    nurtureCampaign = false;
    campaignScheduleType:string = "";
    dataShare: boolean = false;
    detailedAnalyticsShared:boolean = false;
    vendorOrganizationId:number = 0;
    launchedByVendor:boolean = false;
    partnerCompanyLogo:string = "";
    parentCampaignId:number = 0;
    redistributedCount:number = 0;
    displayTime:Date;
    userLists:any;
    parentCampaignUserId:number = 0;
    companyLogo:string = "";

    formsCount:number = 0;
    landingPageId:number = 0;
    landingPage:LandingPage = new LandingPage();

    myMergeTagsInfo:any;
    dipCampaign = false;
    publicEventAlias:string = "";
    formAlias:string = "";
    publicEventCampaign:boolean = false;
    allowDownload = false;
    sendCampaignToIndividual = false;
    categoryName = "";
    categoryId:number = 0;
	pushToMarketo = false;
	pushToHubspot = false;
	pushToSalesforce = false;
    pushToMicrosoft = false;
    pushToMarketingAutomation = false;
    ownCampaignLeadAndDeal = false;
    showRegisterLeadButton = false;
    leadPipelineId: number;
    dealPipelineId: number;
    viewInBrowserTag = true;
    unsubscribeLink = true;
    toPartner : boolean;
    companyId : number; 

    endDate: string;
    endDateInUtcString: string;
    clientTimeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone;
    oneClickLaunch = false;
    partnershipId = 0;
    oneClickLaunchCampaignRedistributed = false;
    oneClickLaunchCondition = false;
    pushToCRM = [];
    configurePipelines = false;
    utcTimeInString = "";
    campaignProcessing = false;
    campaignEmailNotificationStatusInString = "";
    whiteLabeled = false;
    description = "";
    /***XNFR-387****/
    notifyChannelCampaignWorkflows = false;

    
    hasAccess : boolean;
    showGearIconOptions : boolean;
    showCancelButton : boolean = false;

    leadTicketTypeId: number = 0;
    dealTicketTypeId: number = 0;

    /**XNFR-664***/
    fromEmailUserId = 0;

}