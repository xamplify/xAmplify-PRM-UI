import { SocialStatus } from './social-status';

export class SocialStatusProvider {
    id: Number;
    socialStatus: SocialStatus;
    providerName: String;

    providerImagePath: String;
    profileImagePath: String;
    profileName: String;
    selected: boolean = true;

    createdTime: Date;
    updatedTime: Date;
    updatedBy: Number;
}