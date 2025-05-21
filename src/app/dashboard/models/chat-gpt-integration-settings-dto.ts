import { OliverAgentAccessDTO } from "app/common/models/oliver-agent-access-dto";

export class ChatGptIntegrationSettingsDto extends OliverAgentAccessDTO {
    chatGptIntegrationEnabled = false;
    loggedInUserId = 0;
    id = 0;
    chatGptApiKey = "";
    uploadedFileId = "";
    prompt = "";
    threadId = "";
    partnerDam: boolean = false;
    vendorDam: boolean = false;
    folderDam: boolean = false;
    isFolder = false;
    file:any;
    chatHistoryId:any;
    vectorStoreId:any;
    isFromChatGptModal: boolean = false;
    uploadedAssetIds = [];
    agentType = "";
    categoryIds = [];
    contents:any[] = [];
    partnerInsightAgent: boolean = false;
    callId: any;
    isFromContactJourney:boolean = false;
    contactId: any;
    userListId: any;
    templateId = 0;
    partnerLoggedIn:boolean = false;
    vendorCompanyProfileName:any;
    assets:any[] = [];
    accessToken:any;
    assistantId:any;
    oliverIntegrationType:any;
    assetName:any;
}
