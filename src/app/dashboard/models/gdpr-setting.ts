export class GdprSetting {
    
    id:number;
    companyId:number;
    createdUserId:number;
    updatedUserId:number;
    gdprStatus:boolean = true;
    unsubscribeStatus:boolean=true;
    formStatus:boolean=true;
    termsAndConditionStatus:boolean=true;
    deleteContactStatus:boolean=true;
    eventStatus:boolean=true;
    allowMarketingEmails:boolean = true;
    isExists = false;
}
