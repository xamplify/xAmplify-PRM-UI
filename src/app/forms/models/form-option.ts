export class FormOption {
    
    id = 0;
    labelId = "";
    name = "";
    hiddenLabelId = "";
    errorMessage = "";
    borderColor ="#e5e5e5";
    isValid = true;
    defaultColumn = false;
    correct = false;
    parentChoices: Array<FormOption> = new Array<FormOption>();
    
}
