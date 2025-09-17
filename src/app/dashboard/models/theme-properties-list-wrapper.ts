import { ThemeDto } from "./theme-dto";
import { ThemePropertiesDto } from "./theme-properties-dto";

export class ThemePropertiesListWrapper {
   themeDto : ThemeDto;
   propertiesList:ThemePropertiesDto[]= [];
   //propertieslist : Array<ThemePropertiesDto> = new Array<ThemePropertiesDto>() ;
}