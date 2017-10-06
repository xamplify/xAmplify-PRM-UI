import { SocialConnection } from './social-connection';

export class SocialStatusProvider {
    id: number;
    socialConnection: SocialConnection;
    statusId: string;
    selected: boolean = false;

    createdTime: Date;
    updatedTime: Date;
    updatedBy: number;
}