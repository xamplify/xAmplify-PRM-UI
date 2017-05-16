import { SocialStatus } from './social-status';

export class SocialStatusProvider {
    id: Number;
    socialStatus: SocialStatus;
    providerId: string;
    providerName: String;

    providerImagePath: String;
    profileImagePath: String;
    profileName: String;
    selected: boolean;

    createdTime: Date;
    updatedTime: Date;
    updatedBy: Number;

    accessToken: string;
}