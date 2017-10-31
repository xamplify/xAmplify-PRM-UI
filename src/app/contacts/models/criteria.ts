enum OPERATION_NAME{
eq, ne,like,ilike,gt,ge,lt,le,isNull,isNotNull,isEmpty,isNotEmpty,between, in
}

export class Criteria {
    property: string;
    value1: any;
    value2: any;
    value3: any[];
    operationName:OPERATION_NAME;
    operation:string;   
}