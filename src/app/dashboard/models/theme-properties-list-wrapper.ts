import { ThemeDto } from "./theme-dto";
import { ThemePropertiesDto } from "./theme-properties-dto";

export class ThemePropertiesListWrapper {
   themeDto : ThemeDto;
   
   propertieslist : Array<ThemePropertiesDto> = new Array<ThemePropertiesDto>() ;
}