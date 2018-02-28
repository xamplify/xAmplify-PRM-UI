import { SaveVideoFile } from '../../videos/models/save-video-file';
import { EmailTemplate } from '../../email-template/models/email-template';
import { Reply } from './campaign-reply';
import { Url } from './campaign-url';
import { SocialStatus } from '../../social/models/social-status';
import { CampaignType } from './campaign-type';
export class Campaign {

    campaignName: string;
    fromName: string;
    subjectLine: string;
    email: string;
    preHeader: string;
    message: string;
    selectedVideoId: number = 0;;
    userListIds: number[] = [];
    userId: number;
    emailOpened = false;
    videoPlayed = false;
    socialSharingIcons: boolean;
    replyVideo = false;
    selectedEmailTemplateId: number;
    optionForSendingMials: string;
    launchTime: Date;
    endTime: Date;
    scheduleCampaign: string = "";
    isChecked: boolean;
    campaignId = 0;
    campaignVideoFile: SaveVideoFile;
    emailTemplate: EmailTemplate = new EmailTemplate();
    scheduleTime: string;
    regularEmail: boolean;
    launched: boolean;
    launchedOn = "";
    campaignReplies: Array<Reply>;
    campaignUrls: Array<Url>;
    channelCampaign = false;
    partnerVideoSelected = false;

    socialStatus: SocialStatus;
    createdTime: Date;
    updatedTime: Date;
    updatedBy: number;
    campaignType: CampaignType;
    countryId:number = 0;
    country:string = "";
    timeZoneId: any;
    
}