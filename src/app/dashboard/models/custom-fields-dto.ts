import { PicklistValues } from "app/forms/models/picklist-values";

export class CustomFieldsDto {
    name = "";
    label = "";
    type = "";
    selected = false;
    required = false;
    defaultField = false;
    nonInteractive = false;
    placeHolder = "";
    canUnselect = true;
    displayName = "";
    formDefaultFieldType= '';
    canEditRequired = false;
    options: Array<PicklistValues> = new Array<PicklistValues>();
    picklistValues : Array<PicklistValues> = new Array<PicklistValues>();
    originalCRMType = '';
    order: number;
}
