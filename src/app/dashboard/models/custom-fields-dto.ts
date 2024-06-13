import { PicklistValues } from "app/forms/models/picklist-values";

export class CustomFieldsDto {
    name = "";
    label = "";
    type = "";
    selected = false;
    required = false;
    defaultField = false;
    placeHolder = "";
    canUnselect = true;
    displayName = "";
    formDefaultFieldType= '';
    options: Array<PicklistValues> = new Array<PicklistValues>();
}
