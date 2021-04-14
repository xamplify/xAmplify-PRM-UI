export class DamPublishPostDto {

    damId:number=0;
    partnershipIds:Array<number> = new Array<number>();
    partnerGroupIds:Array<number> = new Array<number>();
	partnerIds:Array<number> = new Array<number>();
    publishedBy:number=0;
    partnerGroupSelected:boolean = false;

}
