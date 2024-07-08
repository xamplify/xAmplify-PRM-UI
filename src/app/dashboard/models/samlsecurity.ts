export class SamlSecurity {
    id: number;
    emailId: string;
    companyId: number;
    metadata: any;
    acsURL: string;
    statusMessage: string;
    metadataFileName: string;
    acsId: string;
    identityProviderName: string = '';
    loggedInUserId: number;

}