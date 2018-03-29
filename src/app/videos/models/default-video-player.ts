import { CompanyProfile } from "../../dashboard/company-profile/models/company-profile";

export class DefaultVideoPlayer {
    playerColor: string;
    enableVideoController: boolean;
    controllerColor: string;
    transparency: number;
    allowSharing: boolean;
    enableSettings: boolean;
    allowFullscreen: boolean;
    allowComments: boolean;
    allowLikes: boolean;
    enableCasting: boolean;
    allowEmbed: boolean;
    is360video: boolean;
    brandingLogoUri: string;
    brandingLogoDescUri: string;
    companyProfile: CompanyProfile;
}