import {ColumnInfo} from './column-info';
import { GeoLocationAnalyticsType } from '../../util/geo-location-analytics-type.enum';
import {FormType} from './form-type.enum';
import { FormSubType } from './form-sub-type.enum';
export class Form {
    id:number;
    name = "";
    alias = "";
    description = "";
    formLabelDTOs: Array<ColumnInfo> = new Array<ColumnInfo>();
    isValid = false;    
    isFormButtonValueValid = true;  
    createdBy:number;
    updatedBy:number;
    analyticsType:GeoLocationAnalyticsType;
    formType:FormType
    landingPageId:number;
    userId:number;
    campaignId:number;
    partnerCompanyId:number;   
    categoryId:number = 0; 
    ailasUrl = "";
    backgroundColor = ""; 
    labelColor= "";
    buttonValue= "Submit";
    buttonColor= "";
    buttonValueColor= "";
    formSubmitMessage= "";
    backgroundImage= "";
    companyLogo="";
    showCompanyLogo=false;
    footer:any;
    showFooter=false;
    titleColor="";
    borderColor="";

    userName:string = "";
    createdByAdmin = false;    
    pageBackgroundColor="";
    showBackgroundImage=false;
    showCaptcha=false;
    showTitleHeader = true;
    descriptionColor="";
    
    openLinkInNewTab = false;
    formSubmissionUrl = "";
    isValidFormSubmissionUrl = true;
    isValidColorCode = true;
    quizForm = false;
    saveAs = false;
    thumbnailImage="";
    saveAsDefaultForm = false;
    formSubType:FormSubType = FormSubType.REGULAR;
    isSurvey = false;
    disableEmail = false;
    emailId:string = "";
    selectedTeamMemberIds:any[] = [];
    selectedGroupIds:any[] = [];

    selected: boolean = false;
    associatedWithTrack = false;

    vanityUrlFilter: boolean = false;
    vendorCompanyProfileName:string = "";

    customSkinTextColor: string = "";
    customSkinBackgroundColor: string = "";
    customSkinDivBackgroundColor: string = "";
    customSkinButtonBorderColor: string = "";
    /***XNFR-423****/
    countryNames = [];
    showConnectWiseProducts: boolean = false;

    /** XNFR-424 **/
    formLabelDTORows = [];
   /** XNFR-424 ENDS ***/

}
