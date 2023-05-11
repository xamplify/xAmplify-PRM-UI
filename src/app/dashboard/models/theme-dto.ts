import {ThemePropertiesDto} from './theme-properties-dto';

export class ThemeDto {
    id : number;
    name : string;
    companyId : number;
    description : string;
    defaultTheme : false;
   //themesProperties : Set<ThemePropertiesDto> = new Set<ThemePropertiesDto>();
    createdBy : number;
    updatedBy : number;
    createdDate : number;
    updatedDate : number;

}