import { ColumnInfo } from "app/forms/models/column-info";

export class SfCustomFieldsDataDTO{ 
    sfCfLabelId:string;
    value:string = "";
    type:string;
    dateTimeIsoValue:string
    selectedChoiceValue:string = "";
    formLabel: ColumnInfo;
}