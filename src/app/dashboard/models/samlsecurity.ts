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

	clientId: string;
	clientSecretId: string;
	grantType: string;
	authorizationEndpoint: string;
	tokenEndpoint: string;
	userInfoEndpoint: string;
	scope: string;
	redirectUrl: string;
    createdBy: number;
	// createdTime;
	// updatedTime;
    // createdBy;
	// updatedBy;
}