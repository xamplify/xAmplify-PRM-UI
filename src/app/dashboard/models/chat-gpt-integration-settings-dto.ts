export class ChatGptIntegrationSettingsDto {
    chatGptIntegrationEnabled = false;
    loggedInUserId = 0;
    damId = 0;
    chatGptApiKey = "";
    uploadedFileId = "";
    prompt = "";
    threadId = "";
    partnerDam: boolean = false;
    vendorDam: boolean = false;
    isFolder = false;
}
