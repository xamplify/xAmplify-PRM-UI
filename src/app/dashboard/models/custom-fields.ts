import { CustomFieldsDto } from "./custom-fields-dto";

export class CustomFields {
    loggedInUserId : number;
    selectedFields : Array<CustomFieldsDto> = new Array<CustomFieldsDto>();
    objectType:  any;
}
