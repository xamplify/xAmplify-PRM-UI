import {Pagination} from 'app/core/models/pagination';
import {PublishToPartnerCompanyDto} from "../models/publish-to-partner-company-dto";
export class AdminAndTeamMemberDto {
    isHeaderCheckBoxChecked = false;
	isRowSelected: boolean;
	pagination:Pagination = new Pagination();
	partnershipId:number = 0;
	publishToPartnerCompanyDto: PublishToPartnerCompanyDto = new PublishToPartnerCompanyDto();
}
