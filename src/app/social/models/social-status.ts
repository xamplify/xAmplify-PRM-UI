import {SocialStatusContent} from './social-status-content';
import {SocialStatusProvider} from './social-status-provider';

export class SocialStatus{
    id: Number;
    userId: Number;
    statusMessage: String;
    scheduledTimeServer: Date;
    scheduledTimeUser: Date;
    timeZone: String;
    socialStatusContents: Array<SocialStatusContent>;
    socialStatusProviders: Array<SocialStatusProvider>;
    publishStatus: String;

    createdTime: Date;
    updatedTime: Date;
    updatedBy: Number;

    shareNow: boolean;
    isEnable: boolean;
}