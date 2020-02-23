export class LandingPageAnalytics {
    
    id:number;
    landingPageAlias:string;
    deviceType:string;
    os:string;
    city:string;
    state:string;
    zip:string;
    country:string;
    isp:string; 
    ipAddress:string;
    latitude:string;
    longitude:string;
    countryCode:string;
    timezone:string;
    openedTime:Date=new Date();
    openedTimeInString:string;
    campaignId:number;
    userId:number;
    url:string;
    formId:number;
}
