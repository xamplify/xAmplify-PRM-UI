export class Category {
    id:number;
    name:string="";
    description:string="";
    isValid:boolean;
    companyId:number;
    createdUserId:number;
    count:number;
    idToMoveItems:number;
    isMoveAndDelete = false;
    defaultCategory = false;
}
