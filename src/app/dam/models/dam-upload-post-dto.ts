export class DamUploadPostDto {
    id:number;
    loggedInUserId:number;
    description:string = "";
    assetName:string = "";

    validFile = false;
    validName = false;
    validDescription = false;
}
