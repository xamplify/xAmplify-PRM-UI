import { CustomFieldsRequestDto } from "app/dashboard/models/custom-field-request-dto";

export class Company {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zip: string;
    fax: string;
    phone: any;
    email: string;
    website: string;
    linkedinURL: string;
    facebookURL: string;
    twitterURL: string;
    source: string;
    id: number;
    userId: number;
    externalId: number;
    companyId: number;
    contactCount: string;
    companyListName: string;
    customFields : CustomFieldsRequestDto[];
}
