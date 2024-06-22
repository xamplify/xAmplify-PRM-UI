export class SamlSecurity {
    id: number;
    emailId: string;
    companyId: number;
    metadata: string;
    acsURL: string;
    statusMessage: string;
    metadataFileName: string;
    acsId: string;
    identityProviderName: string = '';
    loggedInUserId: number;
}