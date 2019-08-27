import {ColumnInfo} from './column-info';
import { GeoLocationAnalyticsType } from '../../util/geo-location-analytics-type.enum';

export class Form {
    id:number;
    name = "";
    alias = "";
    description = "";
    formLabelDTOs: Array<ColumnInfo> = new Array<ColumnInfo>();
    isValid = false;    
    createdBy:number;
    updatedBy:number;
    analyticsType:GeoLocationAnalyticsType;
    landingPageId:number;
    userId:number;
    campaignId:number;
}
