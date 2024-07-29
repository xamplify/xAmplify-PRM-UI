export class MarketPlaceCategory {
    id: number;
    tagNames:string[] = [];
    name: string;
    createdBy: string;
    updatedBy: number;
    tagIds:number[] = [];
    displayTime: Date;
    isTagNameValid= false;
    loggedInUserId: number;
    isValid= true;
    description : string;

}