export class DamPostDto {
	id:number;
	name:string = "";
	description:string = "";
	beeTemplate: boolean=false;
	categoryId:number=0;
	htmlBody:string = "";
	jsonBody:string = "";
	createdBy:number = 0;
	tagIds:Array<number> = new Array<number>();
	saveAs =false;
	pageSize = "A4";
	pageOrientation="Portrait";

	 /****XNFR-255****/
	 shareAsWhiteLabeledAsset = false;
	 partnerGroupIds = [];
	 partnerIds = [];
	 partnerGroupSelected = false;

	 /***XNFR-427**/
	 loggedInUserId = 0;
 	 addedToQuickLinks = false;

	/** XNFR-884 **/
	approvalStatus: string = "";
	draft: boolean = false;
  	published: boolean = false;
	createdByAnyApprover: boolean = false;

	partnerSignatureRequired = false;
    disablePartnerSignatureOption = false;
    partnerSignatureToolTipMessage = "";
    vendorSignatureRequired = false;
    disableVendorSignatuerOption = false;
    vendorSignatureToolTipMessage = "";
    selectedSignatureImagePath = "";
    vendorSignatureCompleted = false;

}
