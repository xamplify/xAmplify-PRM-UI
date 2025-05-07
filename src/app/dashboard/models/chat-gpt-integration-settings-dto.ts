export class ChatGptIntegrationSettingsDto {
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
}
