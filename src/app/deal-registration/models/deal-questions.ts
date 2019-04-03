
export class DealQuestions {
    
   
    id:number;
    createdAt: Date;
    createdBy: number
    dataType: string;
    formId: number
    isRequired: boolean
    question: string;
    answer:string;
    answerId:number;
    updatedAt: Date
    updatedBy:number;

    error:boolean;
    class:string;
    divId:string = "";
    validationStausKey:string="";
     validationStausValue:string="";
     
}
