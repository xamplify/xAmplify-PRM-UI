import { EmailTemplate } from '../../email-template/models/email-template';
import { Location } from './location';
import { CampaignEventTime } from './campaign-event-time';
import { User } from '../../core/models/user';
import { ContactList } from '../../contacts/models/contact-list';
export class EventCampaign {
    campaign: string;
    user: User = new User();
    message: string;
    channelCampaign: boolean = true;
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
    publicEventCampaign: boolean = true;
    toPartner: boolean = true;
    inviteOthers: boolean = true;
    rsvpReceived: boolean = true;
    onlineMeeting: boolean = true;

    userLists: Array<ContactList> = [];
    userListIds: Array<number> = [];

    campaignEventTimes: Array<CampaignEventTime> = [];

    hostedBy: string = "";
}