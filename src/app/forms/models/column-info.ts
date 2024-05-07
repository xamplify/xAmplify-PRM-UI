import {FormOption} from './form-option';
export class ColumnInfo {
    id:number;
    labelName = "";
    labelId = "";
    hiddenLabelId= "";
    placeHolder = "";
    labelType= "";
    value:any;
    displayName: "";
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
    //choiceType = "radio";
    choices: Array<FormOption> = new Array<FormOption>();
    allChoicesCount = 0;
    choiceErrorMessage = "";
    /****Edit Form Fields******/
    editFormLabelDivClass = "default-fieldset";
    editFormChoiceDivClass = "default-fieldset";
    editQuizChoiceDivClass = "default-fieldset";
    sfCustomField:boolean;
    labelLength:string;
    correctValues: string = "";
    
    description: string = "";
    descriptionCharacterleft: number = 500;
    skipped:boolean = false;
    submittedAnswerCorrect: boolean = false;
    formDefaultFieldType: any;

    /** XNFR-424 **/
    showOptions:boolean = false;
    index:number;
    /** XNFR-424 ENDS **/

}
