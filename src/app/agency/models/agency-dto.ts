import { XamplifyModuleDto } from "app/core/models/xamplify-module-dto";
export class AgencyDto {
    id = 0;
    firstName = "";
    lastName = "";
    agencyName = "";
    emailId = "";
    validForm = false;
    enabled:boolean = true;
    xamplifyModules:XamplifyModuleDto = new XamplifyModuleDto();
    userId = 0;
    emailIdErrorMessage = "";
    validEmailId = false;
}
