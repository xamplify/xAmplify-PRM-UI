import { SocialStatus } from './social-status';

export class SocialStatusProvider {
    id: number;
    socialStatus: SocialStatus;
    providerId: string;
    providerName: string;

    profileImagePath: string;
    profileName: string;
    firstName: string;
    lastName: string;
    selected: boolean = false;

    createdTime: Date;
    updatedTime: Date;
    updatedBy: number;

    accessToken: string;
    oAuthTokenValue: string;
    oAuthTokenSecret: string;
}