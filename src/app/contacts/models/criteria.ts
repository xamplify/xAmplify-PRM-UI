enum OPERATION_NAME{
eq, ne,like,ilike,gt,ge,lt,le,isNull,isNotNull,isEmpty,isNotEmpty,between
}

export class Criteria {
    property: string = "Field Name*";
    value1: any;
    value2: any=null;
    value3: any[]=null;
    operationName:OPERATION_NAME=null;
    operation:string = "Condition*";   
}