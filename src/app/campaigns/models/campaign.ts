import { SaveVideoFile } from '../../videos/models/save-video-file';
import { EmailTemplate } from '../../email-template/models/email-template';
export class Campaign {

    campaignName: string;
    fromName: string;
    subjectLine: string;
    email: string;
    preHeader: string;
    message: string;
    selectedVideoId :number;
    userListIds: any[] = [];
    userId: number;
    emailOpened: boolean;
    videoPlayed: boolean;
    socialSharingIcons:boolean;
    replyVideo: boolean;
    selectedEmailTemplateId :number;
    optionForSendingMials :string;
    launchTime:Date;
    endTime:Date;
    scheduleCampaign :string;
    isChecked :boolean;
    campaignId:number=0;
    campaignVideoFile:SaveVideoFile;
    emailTemplate:EmailTemplate=new EmailTemplate();
    scheduleTime:string;
    regularEmail:boolean;
}