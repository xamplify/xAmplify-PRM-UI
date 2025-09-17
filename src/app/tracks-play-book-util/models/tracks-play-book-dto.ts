import { Form } from "app/forms/models/form";

export class TracksPlayBookDto {
    id:number= 0;
    name:string = "";
    partnerCompanyId:number= 0;
    partnerCompanyName:string = ""
    assetName:string = "";
    assetType:string = "";
    thumbnailPath:string = "";
    displayName:string = "";
    displayTime:any;
    typeQuizId: boolean = false;
    dam:any;
    quiz:any;
}
