import {SocialStatus} from './social-status';

export class SocialStatusContent{
    id: Number;
    socialStatus: SocialStatus;
    fileType: String;
    filePath: String;
    fileName: String;
    fileSize: Number;

    createdTime: Date;
    updatedTime: Date;
    updatedBy: Number;
}