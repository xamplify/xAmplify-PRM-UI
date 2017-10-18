import { SaveVideoFile } from '../../videos/models/save-video-file';
import { EmailTemplate } from '../../email-template/models/email-template';
import { Reply } from './campaign-reply';
import { Url } from './campaign-url';
import { SocialStatus } from '../../social/models/social-status';
export class Campaign {

    campaignName: string;
    fromName: string;
    subjectLine: string;
    email: string;
    preHeader: string;
    message: string;
    selectedVideoId: number;
    userListIds: number[] = [];
    userId: number;
    emailOpened: boolean = false;
    videoPlayed: boolean = false;
    socialSharingIcons: boolean;
    replyVideo: boolean = false;
    selectedEmailTemplateId: number;
    optionForSendingMials: string;
    launchTime: Date;
    endTime: Date;
    scheduleCampaign: string;
    isChecked: boolean;
    campaignId: number = 0;
    campaignVideoFile: SaveVideoFile;
    emailTemplate: EmailTemplate = new EmailTemplate();
    scheduleTime: string;
    regularEmail: boolean;
    launched: boolean;
    launchedOn: string = "";
    campaignReplies: Array<Reply>;
    campaignUrls: Array<Url>;
    timeZoneId: any;
    channelCampaign: boolean = false;
    partnerVideoSelected:boolean = false;

    socialStatus: SocialStatus;
    createdTime: Date;
    updatedTime: Date;
    updatedBy: number;
    
}