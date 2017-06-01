import { SocialStatus } from './social-status';

export class SocialStatusProvider {
    id: Number;
    socialStatus: SocialStatus;
    providerId: string;
    providerName: String;

    profileImagePath: String;
    profileName: String;
    selected: boolean = false;

    createdTime: Date;
    updatedTime: Date;
    updatedBy: Number;

    accessToken: string;
}