import { Reply } from './campaign-reply';
import { Url } from './campaign-url';
export class CampaignWorkflowPostDto {
    
    campaignId = 0;
    campaignReplies: Array<Reply>;
    campaignUrls: Array<Url>;
}
