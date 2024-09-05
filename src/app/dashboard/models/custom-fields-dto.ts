import { PicklistValues } from "app/forms/models/picklist-values";

export class CustomFieldsDto {
    id: number;
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
    formDefaultFieldType: any;
    canEditRequired = false;
    options: Array<PicklistValues> = new Array<PicklistValues>();
    picklistValues : Array<PicklistValues> = new Array<PicklistValues>();
    originalCRMType = '';
    order: number;
    dependentPicklist = false;
    controllerName = '';
    defaultChoiceLabel: any;
    private = false;
    formLookUpDefaultFieldType: any;
    active: boolean = false;
    formFieldType: any;
}
