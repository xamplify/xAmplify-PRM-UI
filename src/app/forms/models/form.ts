import {ColumnInfo} from './column-info';
import { GeoLocationAnalyticsType } from '../../util/geo-location-analytics-type.enum';
import {FormType} from './form-type.enum';
export class Form {
    id:number;
    name = "";
    alias = "";
    description = "";
    formLabelDTOs: Array<ColumnInfo> = new Array<ColumnInfo>();
    isValid = false;    
    isFormNameValid = false;  
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
    buttonValue= "";
    buttonColor= "";
    buttonValueColor= "";
    formSubmitMessage= "";
    backgroundImage= "";
}
