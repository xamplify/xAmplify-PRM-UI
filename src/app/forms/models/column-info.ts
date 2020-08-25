import {FormOption} from './form-option';
export class ColumnInfo {
    id:number;
    labelName = "";
    labelId = "";
    hiddenLabelId= "";
    placeHolder = "";
    labelType= "";
    value:any;
    isDefaultColumn = false;
    required:boolean;
    radioButtonChoices: Array<FormOption> = new Array<FormOption>();
    allRadioButtonChoicesCount= 0;
    checkBoxChoices: Array<FormOption> = new Array<FormOption>();
    allCheckBoxChoicesCount = 0;
    dropDownChoices: Array<FormOption> = new Array<FormOption>();
    dropDownIds = [];
    dropdownIds = [];
    allDropDownChoicesCount = 0;
    divId= "";
    divClass= "form-group";
    errorMessage= "";
    radioButtonErrorMessage = "";
    checkBoxErrorMessage = "";
    dropDownErrorMessage = "";
    priceType="Dollar";
    priceSymbol="$";
    defaultColumn = false;
    /****Edit Form Fields******/
    editFormLabelDivClass = "default-fieldset";
    editFormChoiceDivClass = "default-fieldset";
    sfCustomField:boolean;
    labelLength:string;

}
