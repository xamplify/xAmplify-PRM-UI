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
    
    downloadLink : string = null;
    oauthToken : string = null;
    fileName : string = null;
    cloudContent : boolean=false;
    source: string = "";
    categoryId:number = 0;
    historyTemplate = false;

    /****XNFR-255****/
    shareAsWhiteLabeledAsset = false;
    partnerGroupIds = [];
    partnerIds = [];
    partnershipIds = [];
    partnerGroupSelected = false;
    disableWhiteLabelOption = false;
    whiteLabeledToolTipMessage = "";
    publishedToPartnerGroups = false;

    /**XNFR-434***/
    assetType  = "";
    videoId = 0;
}
