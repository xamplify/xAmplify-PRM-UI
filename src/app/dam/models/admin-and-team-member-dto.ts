import {Pagination} from 'app/core/models/pagination';
export class AdminAndTeamMemberDto {
    isHeaderCheckBoxChecked = false;
	selectedTeamMemberIds: any[] = [];
	isRowSelected: boolean;
	pagination:Pagination = new Pagination();
}
