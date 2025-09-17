import {SocialStatus} from './social-status';

export class SocialStatusContent {
  id: number;
  videoId: number;
  socialStatus: SocialStatus;
  fileType: string;
  filePath: string;
  fileName: string;
  fileSize: number;
  completeFilePath: string;

  createdTime: Date;
  updatedTime: Date;
  updatedBy: number;
}