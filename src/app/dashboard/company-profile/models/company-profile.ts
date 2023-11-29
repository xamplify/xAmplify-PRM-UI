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
    privacyPolicy = "";
    eventUrl = "";
    /******Admin Related*********/
    userEmailId:string = "";
    firstName:string = "";
    lastName:string = "";
    
    campaignAccessDto:CampaignAccess;

    showVendorCompanyLogo:boolean = true;
    favIconLogoPath:string;
    loginScreenDirection:string;
    enableVanityURL:boolean =false;
    roleId:number = 0;
    /****XNFR-281****/
    instagramLink: "";

    companyNameStatus : string;

    /**** XNFR-233 */
    backgroundLogoStyle2 = "";
    /*** XNFR-233 */
    

}
