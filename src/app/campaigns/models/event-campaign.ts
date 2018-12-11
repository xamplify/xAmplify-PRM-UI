import { EmailTemplate } from '../../email-template/models/email-template';
import { Location } from './location';
import { CampaignEventTime } from './campaign-event-time';
import { CampaignEventMedia } from './campaign-event-media';
import { Reply } from './campaign-reply';
import { User } from '../../core/models/user';
import { ContactList } from '../../contacts/models/contact-list';
import { UserListIds } from '../../contacts/models/user-listIds';

export class EventCampaign {
    id: number;
    campaign: string;
    user: User = new User();
    message: string;
    channelCampaign: boolean = false;
    emailOpened: boolean = true;
    socialSharingIcons: boolean = true;
    fromName: string;
    email: string = "";
    launchTimeInString: string;
    emailTemplate: EmailTemplate = new EmailTemplate();
    timeZone: string;
    campaignScheduleType: string;
    campaignLocation: Location = new Location();
    country: string;
    countryId:number = 0;
    publicEventCampaign: boolean = true;
    toPartner: boolean = true;
    inviteOthers: boolean = true;
    rsvpReceived: boolean = true;
    onlineMeeting: boolean = true;
    enableCoBrandingLogo = false;

    userLists: Array<ContactList> = [];
    userListIds: Array<number> = [];

    emailTemplateDTO: EmailTemplate;
    userDTO: User;
    userListDTOs: Array<ContactList> = [];

    campaignEventTimes: Array<CampaignEventTime> = [];
    campaignEventMedias: Array<CampaignEventMedia> = [];
    campaignReplies: Array<Reply> = [];

    hostedBy: string = "";

    constructor() {
        this.campaignEventMedias.push(new CampaignEventMedia());
        this.campaignEventTimes.push(new CampaignEventTime());
    }
}
