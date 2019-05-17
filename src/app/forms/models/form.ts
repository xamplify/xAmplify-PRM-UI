import {ColumnInfo} from './column-info';

export class Form {
    id:number;
    name = "";
    alias = "";
    formLabelDTOs: Array<ColumnInfo> = new Array<ColumnInfo>();
    isValid = false;    
    createdBy:number;
    updatedBy:number;
}
