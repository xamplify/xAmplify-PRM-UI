import {SocialConnection} from './social-connection';
import {SocialStatus} from './social-status';

export class SocialStatusProvider {
  id: number;
  socialConnection: SocialConnection;
  statusId: string;
  selected = false;

  createdTime: Date;
  updatedTime: Date;
  updatedBy: number;

  socialStatusList: Array<SocialStatus> = [];
}