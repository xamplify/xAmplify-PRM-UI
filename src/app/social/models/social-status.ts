import {SocialStatusContent} from './social-status-content';
import {SocialStatusProvider} from './social-status-provider';

export class SocialStatus {
  id: number;
  userId: number;
  statusMessage = '';
  message;
  scheduledTime: Date;
  timeZone: string;
  socialStatusContents: Array<SocialStatusContent> = [];
  socialStatusProvider: SocialStatusProvider;
  publishStatus: string;

  createdTime: Date;
  updatedTime: Date;
  updatedBy: number;

  shareNow: boolean = true;
  isEnable: boolean;
  validLink: boolean; // if the statusMessage is a valid web url
  selected: boolean = false; 

  alias: string;
  parent: number;
  
  socialStatusList: Array<SocialStatus> = [];
  selectedAccounts: number = 0;
}