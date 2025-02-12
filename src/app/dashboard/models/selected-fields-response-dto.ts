import { SelectedFieldsDto } from "./selected-fields-dto";

export class SelectedFieldsResponseDto {
    companyProfileName: string;
    loggedInUserId: number;
    propertiesList:SelectedFieldsDto[]=[];
}
