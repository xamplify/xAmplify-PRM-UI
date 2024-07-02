export class CustomLinkDto {
    id: number;
    vendorId: number;
    companyProfileName: string;
    buttonTitle: string;
    buttonSubTitle: string;
    buttonDescription: string;
    buttonLink: string;
    buttonIcon: string;
    openInNewTab: boolean;
    openInNewTabTarget: string; 
    type = "";
    title = "";
    link = "";
    icon = "";
    description = "";
    loggedInUserId = 0;
    openLinkInNewTab = false;
    bannerImagePath = "";
    /***XNFR-532*****/
    displayTitle = false;
    buttonText = "Learn More";
    /***XNFR-532*****/
    /****XNFR-571***/
    partnerGroupIds = [];
    partnerIds = [];
    partnershipIds = [];
    partnerGroupSelected = false;
     /****XNFR-571***/


}
