import { SocialStatus } from './social-status';
import { SocialStatusContent } from './social-status-content';
import { SocialStatusProvider } from './social-status-provider';

export class SocialStatusDto {
    socialStatus: SocialStatus;
    socialStatusContents: Array<SocialStatusContent>;
    socialStatusProvider: SocialStatusProvider;
}