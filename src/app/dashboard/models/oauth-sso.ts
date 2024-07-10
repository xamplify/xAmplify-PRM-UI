export class OauthSso {

    id: number;
    companyId: number;
    clientId: string;
    clientSecretId: string;
    grantType: string;
    authorizationEndpoint: string;
    tokenEndpoint: string;
    userInfoEndpoint: string;
    scope: string;
    redirectUri: string;
    createdBy: number;
    statusCode: number;
    createdTime: Date;
    updatedTime: Date;
    updatedBy: number;
    message: string;
    data: any;
    authenticationServiceName: string;
}
