import { GeoLocationAnalytics } from 'app/util/geo-location-analytics';
import {FormSubmitField} from './form-submit-field';
export class FormSubmit {
    id:number;
    alias:string="";
    fields:Array<FormSubmitField> = new Array<FormSubmitField>();
    userId:number;
    learningTrackId:number;
    geoLocationAnalyticsDTO: GeoLocationAnalytics;
    vendorJourney: boolean = false;
    masterLandingPage:boolean = false;
    partnerMasterLandingPageId:number;
    vendorLandingPageId:number;
    searchKey:string;
}
