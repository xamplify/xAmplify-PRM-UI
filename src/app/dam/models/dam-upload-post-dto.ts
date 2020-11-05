export class DamUploadPostDto {
    id:number;
    loggedInUserId:number;
    description:string = "";
    assetName:string = "";
    thumbnailPath:string = "";
    assetPath:string = "";
    beeTemplate=false;
    validFile = false;
    validName = false;
    validDescription = false;
}
