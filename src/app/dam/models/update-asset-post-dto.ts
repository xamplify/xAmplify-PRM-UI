export class UpdateAssetPostDto {
	id:number;
	name:string="";
	description:string = "";
	updatedBy:number;
	validName = false;
	validDescription = false;

}
