import {SocialStatusContent} from './social-status-content';
import {SocialStatusProvider} from './social-status-provider';

export class SocialStatus{
    id: number;
    userId: number;
    statusMessage: string='';
    scheduledTimeServer: Date;
    scheduledTimeUser: Date;
    timeZone: string;
    socialStatusContents: Array<SocialStatusContent>;
    socialStatusProviders: Array<SocialStatusProvider>;
    publishStatus: string;

    createdTime: Date;
    updatedTime: Date;
    updatedBy: number;

    shareNow: boolean;
    isEnable: boolean;
}