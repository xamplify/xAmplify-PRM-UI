export class DomainRequestDto {
    domainNames: Array<string> = new Array<string>();
    isDomainAllowedToAddToSamePartnerAccount: boolean;
    id = 0;
    createdUserId = 0;
}
