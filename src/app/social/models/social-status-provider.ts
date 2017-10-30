import {SocialConnection} from './social-connection';

export class SocialStatusProvider {
  id: number;
  socialConnection: SocialConnection;
  statusId: string;
  selected = false;

  createdTime: Date;
  updatedTime: Date;
  updatedBy: number;
}