export class DamUploadPostDto {
    id:number;
    loggedInUserId:number;
    description:string = "";
    assetName:string = "";
    thumbnailPath:string = "";
    assetPath:string = "";
    beeTemplate=false;
    tagIds:Array<number> = new Array<number>();

    validFile = false;
    validName = false;
    validDescription = false;
    
    //
    downloadLink : string;
    oauthToken : string;
    fileName : string;
    cloudContent : boolean=false;
    source: string = "";
}
