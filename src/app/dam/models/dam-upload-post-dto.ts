import { GeoLocationAnalytics } from "app/util/geo-location-analytics";

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
    fileName : string ="";
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
    replaceVideoAsset = false;

    /***XNFR-586 */
    addedToQuickLinks = false;

    /***XNFR-833 */
    partnerSignatureRequired = false;
    disablePartnerSignatureOption = false;
    partnerSignatureToolTipMessage = "";
    vendorSignatureRequired = false;
    disableVendorSignatuerOption = false;
    vendorSignatureToolTipMessage = "";
    selectedSignatureImagePath = "";
    vendorSignatureCompleted = false;
    geoLocationDetails:GeoLocationAnalytics = new GeoLocationAnalytics();

    /** XNFR-884 **/
    draft: boolean = false;
    approvalStatus: string;
    published: boolean = false;
    createdByAnyApprover: boolean = false;

    /** XNFR-885 **/
    sendForReApproval: boolean = false;
    approvalReferenceId: number;
    tags: any;
    htmlBody:string = "";
	jsonBody:string = "";
    createdBy:number = 0;
    saveAs =false;
    sendForApproval: boolean = false;
}
