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

	 /****XNFR-255****/
	 shareAsWhiteLabeledAsset = false;

}
