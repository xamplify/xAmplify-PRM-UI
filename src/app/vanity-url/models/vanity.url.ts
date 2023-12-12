export class VanityURL{
    companyName: string;
    companyLogoImagePath: string;
    companyBgImagePath: string;
    vanityURLink:string;
    showVendorCompanyLogo:boolean;
    companyFavIconPath:string;
    loginScreenDirection:string;
    enableVanityURL:boolean;
    companyId:number = 0;
    showMicrosoftSSO:boolean = false;   
    /***** XNFR-233*****/ 
    loginType: string;
    backgroundLogoStyle2:string;
    /***** XNFR-233*****/
    /**** XNFR-416 ******/
	 backgroundColorStyle1:string = "";
	
	 backgroundColorStyle2:string = "";
	
	styleOneBgColor:boolean = false;
	
	styleTwoBgColor:boolean = false ;
	/**** XNFR-416 ****/
    /** XBI-2016 ***/
    loginFormDirectionStyleOne:string;
    /** XBI-2016**/
}