export class DamUploadPostDto {
    loggedInUserId:number;
    description:string = "";
    assetName:string = "";

    validFile = false;
    validName = false;
    validDescription = false;
}
