import { CampaignAccess } from '../../../campaigns/models/campaign-access';

export class CompanyProfile {
    id = 0;
    companyName = "";
    companyProfileName = "";
    emailId = "";
    phone = "";
    website = "";
    companyLogoPath = "";
    twitterLink = "";
    facebookLink = "";
    linkedInLink = "";
    googlePlusLink = "";
    mobinarId = "";
    tagLine = "";
    city = "";
    state = "";
    country = "";
    zip;
    backgroundLogoPath = "";
    aboutUs = "";
    isAdd = true;
    videoId = 0;
    street = "";
    /******Admin Related*********/
    userEmailId:string = "";
    firstName:string = "";
    lastName:string = "";
    
    campaignAccessDto:CampaignAccess;

    showVendorCompanyLogo:boolean = true;
    favIconLogoPath:string;
    loginScreenDirection:string;
    enableVanityURL:boolean =false;
}
