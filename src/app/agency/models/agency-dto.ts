import { XamplifyModuleDto } from "app/core/models/xamplify-module-dto";
import { Properties } from "app/common/models/properties";

export class AgencyDto {
    id = 0;
    firstName = "";
    lastName = "";
    agencyName = "";
    companyName = "";
    emailId = "";
    enabled:boolean = true;
    xamplifyModules:XamplifyModuleDto = new XamplifyModuleDto();
    userId = 0;
    roleIds = [];
    /******Form Related****/
    properties:Properties = new Properties();
    emaillIdDivClass: string = this.properties.defaultClass;
    validEmailId = false;
    emailIdErrorMessage = "";
    agencyNameDivClass: string = this.properties.defaultClass;
    agencyNameErrorMessage = "";
    validAgencyName = false;
    validForm = false;
    
}
