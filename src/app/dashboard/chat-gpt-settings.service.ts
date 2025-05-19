import { HttpClient } from '@angular/common/http';
import { ChatGptIntegrationSettingsDto } from './models/chat-gpt-integration-settings-dto';
import { Injectable } from '@angular/core';
import { RouterUrlConstants } from 'app/constants/router-url.contstants';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { Pagination } from 'app/core/models/pagination';
import { OliverAgentAccessDTO } from 'app/common/models/oliver-agent-access-dto';


@Injectable()
export class ChatGptSettingsService {

  chatGptSettingsUrl =  this.authenticationService.REST_URL+RouterUrlConstants.chatGptSettings;
  constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService,private http: HttpClient) { 

  }

  updateChatGptSettings(chatGptSettings:ChatGptIntegrationSettingsDto){
    chatGptSettings.loggedInUserId = this.authenticationService.getUserId();
    if(chatGptSettings.chatGptApiKey==null){
      chatGptSettings.chatGptApiKey = "";
    }
    const url = this.chatGptSettingsUrl + '?access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callPutMethod(url,chatGptSettings);
  }

  getChatGptSettingsByLoggedInUserId(){
    const url = this.chatGptSettingsUrl + '/loggedInUserId/'+this.authenticationService.getUserId()+'?access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callGetMethod(url);
  }

  generateText(input:string) {
    let trimmedInput = this.referenceService.getTrimmedData(input);
    const url = this.chatGptSettingsUrl + '/loggedInUserId/'+this.authenticationService.getUserId()+'/input/'+trimmedInput+'?access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callGetMethod(url);
  }

  onUpload(pdfFile: Blob, chatGptSettings: ChatGptIntegrationSettingsDto, assetName: string) {
    const url = `${this.chatGptSettingsUrl}/upload?access_token=${this.authenticationService.access_token}`;
    const formData = new FormData();
    formData.append('file', pdfFile, `${assetName}.pdf`);
    chatGptSettings.loggedInUserId = this.authenticationService.getUserId();
    formData.delete('chatGptSettingsDTO');
    formData.append('chatGptSettingsDTO', new Blob([JSON.stringify(chatGptSettings)],
      {
        type: "application/json"
      }));
    return this.authenticationService.callPostMethod(url, formData);
  }

  generateAssistantText(chatGptSettings: ChatGptIntegrationSettingsDto) {
    const url = this.chatGptSettingsUrl + '/getPromptResponse?access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callPutMethod(url, chatGptSettings);;
  }

  generateAssistantTextByAssistant(chatGptSettings: ChatGptIntegrationSettingsDto) {
    chatGptSettings.loggedInUserId = this.authenticationService.getUserId();
    const url = this.chatGptSettingsUrl + '/getOliverResponse?access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callPutMethod(url, chatGptSettings);
  }

  getSharedAssetDetailsById(id: number) {
    const url = `${this.chatGptSettingsUrl}/getSharedAssetDetailsById/${id}/${this.authenticationService.getUserId()}?access_token=${this.authenticationService.access_token}`;
    return this.http.get(url);
  }

  deleteUploadedFileInOpenAI(uploadedFileId: any) {
    const url = this.chatGptSettingsUrl + '/deleteUploadedFile/' + uploadedFileId + '?access_token=' + this.authenticationService.access_token;
    return this.http.delete(url);
  }

  getChatHistoryByThreadId(threadId: string) {
    const url = this.chatGptSettingsUrl + '/chatHistory/' + threadId + '?access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callGetMethod(url);
  }

  getThreadIdByDamId(chatGptIntegrationSettingsDto: any) {
    let userId = this.authenticationService.getUserId();
    let damIdRequestParameter = chatGptIntegrationSettingsDto.id != undefined ? '&id=' + chatGptIntegrationSettingsDto.id : '';
    let userIdRequestParameter = userId != undefined ? '&loggedInUserId=' + userId : '';
    let isPartnerDamAssetRequestParm = chatGptIntegrationSettingsDto.partnerDam != undefined ? '&partnerDam=' + chatGptIntegrationSettingsDto.partnerDam : '';
    let isVendorDamAssetRequestParm = chatGptIntegrationSettingsDto.vendorDam != undefined ? '&vendorDam=' + chatGptIntegrationSettingsDto.vendorDam : '';
    let isFolderDamAssetRequestParm = chatGptIntegrationSettingsDto.folderDam != undefined ? '&folderDam=' + chatGptIntegrationSettingsDto.folderDam : '';
    let callIdRequestParam = chatGptIntegrationSettingsDto.callId != undefined ? '&callId=' + chatGptIntegrationSettingsDto.callId : '';
    let contactJourneyRequestParameter = chatGptIntegrationSettingsDto.isFromContactJourney ? '&contactJourney=' + true : '';
    let contactIdRequestParameter = chatGptIntegrationSettingsDto.contactId != undefined ? '&contactId=' + chatGptIntegrationSettingsDto.contactId : '';
    let userListIdRequestParameter = chatGptIntegrationSettingsDto.userListId != undefined ? '&userListId=' + chatGptIntegrationSettingsDto.userListId : '';
    const url = this.chatGptSettingsUrl + '/getThreadId?access_token=' + this.authenticationService.access_token + damIdRequestParameter + userIdRequestParameter + isPartnerDamAssetRequestParm + isVendorDamAssetRequestParm + isFolderDamAssetRequestParm + callIdRequestParam + contactJourneyRequestParameter + contactIdRequestParameter + userListIdRequestParameter;
    return this.authenticationService.callGetMethod(url);
  }
insertTemplateData(chatGptIntegrationSettingsDto: any) {
    const url = this.chatGptSettingsUrl + '/insertTemplateData?access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callPutMethod(url, chatGptIntegrationSettingsDto);
}

listDefaultTemplates(userId:any){
  const url = this.chatGptSettingsUrl+"/listDefaultTemplates/"+userId+"?access_token="+this.authenticationService.access_token;
  return  this.authenticationService.callGetMethod(url);
}

  getAssetDetailsByCategoryId(categoryId: number, isPartnerFolderView: boolean) {
    let urlPrefix = "";
    if (isPartnerFolderView) {
      urlPrefix = 'getAssetDetailsByCategoryIdForPartner';
    } else if (!isPartnerFolderView) {
      urlPrefix = 'getAssetDetailsByCategoryId';
    }
    const url = `${this.chatGptSettingsUrl}/${urlPrefix}/${categoryId}/${this.authenticationService.getUserId()}?access_token=${this.authenticationService.access_token}`;
    return this.http.get(url);
  }

  onUploadFiles(pdfFiles: any[], chatGptSettings: ChatGptIntegrationSettingsDto) {
    const url = `${this.chatGptSettingsUrl}/uploadFiles?access_token=${this.authenticationService.access_token}`;
    const formData = new FormData();
    pdfFiles.forEach((pdfFile, index) => {
      formData.append(`fileDTOs[${index}].id`, pdfFile.assetId);
      formData.append(`fileDTOs[${index}].file`, pdfFile.file, `${pdfFile.assetName}.pdf`);
    });

    chatGptSettings.loggedInUserId = this.authenticationService.getUserId();
    formData.append('chatGptSettingsDTO', new Blob(
      [JSON.stringify(chatGptSettings)],
      { type: 'application/json' }
    ));

    return this.authenticationService.callPostMethod(url, formData);
  }

  analyzeCallRecordings(chatGptSettingDTO: any) {
    let userId = this.authenticationService.getUserId();
    let threadIdRequestParameter = chatGptSettingDTO.threadId != undefined ? '&threadId=' + chatGptSettingDTO.threadId : '';
    let userIdRequestParameter = userId != undefined ? '&loggedInUserId=' + userId : '';
    let vectorStoreIdRequestParameter = chatGptSettingDTO.vectorStoreId != undefined ? '&vectorStoreId=' + chatGptSettingDTO.vectorStoreId : '';
    let contactIdRequestParameter = chatGptSettingDTO.contactId != undefined ? '&contactId=' + chatGptSettingDTO.contactId : '';
    let userListIdRequestParameter = chatGptSettingDTO.userListId != undefined ? '&userListId=' + chatGptSettingDTO.userListId : '';
    let chatHistoryIdRequestParameter = chatGptSettingDTO.chatHistoryId != undefined ? '&chatHistoryId=' + chatGptSettingDTO.chatHistoryId : '';
    let contactJourneyRequestParameter = '&contactJourney='+true;
    const url = this.chatGptSettingsUrl + "/analyzeCallRecordings?access_token=" + this.authenticationService.access_token + threadIdRequestParameter + userIdRequestParameter + vectorStoreIdRequestParameter + contactIdRequestParameter + userListIdRequestParameter + chatHistoryIdRequestParameter + contactJourneyRequestParameter;
    return this.authenticationService.callGetMethod(url);
  }

  getThreadIdAndVectorStoreIdByContactIdAndUserListId(contactId: any, userListId: any) {
    let userId = this.authenticationService.getUserId();
    let userIdRequestParameter = userId != undefined ? '&loggedInUserId=' + userId : '';
    let contactIdRequestParameter = contactId != undefined ? '&contactId=' + contactId : '';
    let userListIdRequestParameter = userListId != undefined ? '&userListId=' + userListId : '';
    const url = this.chatGptSettingsUrl + "/getThreadIdAndVectorStoreIdByContactIdAndUserListId?access_token=" + this.authenticationService.access_token + userIdRequestParameter + contactIdRequestParameter + userListIdRequestParameter;
    return this.authenticationService.callGetMethod(url);
  }

  deleteChatHistory(chatHistoryId:any, threadId:any, vectorStoreId:any, agentType:any) {
    let userId = this.authenticationService.getUserId();
    let threadIdRequestParameter = threadId != undefined ? '&threadId=' + threadId : '';
    let userIdRequestParameter = userId != undefined ? '&loggedInUserId=' + userId : '';
    let vectorStoreIdRequestParameter = vectorStoreId != undefined ? '&vectorStoreId=' + vectorStoreId : '';
    let chatHistoryIdRequestParameter = chatHistoryId != undefined ? '&chatHistoryId=' + chatHistoryId : '';
    let agentTypeParameter = agentType != undefined ? '&agentType=' + agentType : '';
    const url = this.chatGptSettingsUrl + "/deleteChatHistory?access_token=" + this.authenticationService.access_token + threadIdRequestParameter + userIdRequestParameter + vectorStoreIdRequestParameter + chatHistoryIdRequestParameter + agentTypeParameter;
    return this.authenticationService.callDeleteMethod(url);
  }

  getAssetDetailsByCategoryIds(chatGptIntegrationSettingsDto: ChatGptIntegrationSettingsDto) {
    let userId = this.authenticationService.getUserId();
    const url = this.chatGptSettingsUrl + 'getAssetDetailsByCategoryIds/' + userId + '?access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callPostMethod(url, chatGptIntegrationSettingsDto);
  }

  fetchHistories(pagination:Pagination, isPartnerLoggedIn:boolean) {
    let userId = this.authenticationService.getUserId();
    let pageableUrl = this.referenceService.getPagebleUrl(pagination);
    let vendorCompanyProfileNameRequestParam = pagination.vendorCompanyProfileName != undefined ? '&vendorCompanyProfileName=' + pagination.vendorCompanyProfileName : '';
    const url = this.chatGptSettingsUrl + "fetchChatHistories/"+userId+"/"+isPartnerLoggedIn+"?access_token=" + this.authenticationService.access_token + pageableUrl + vendorCompanyProfileNameRequestParam;
    return this.authenticationService.callGetMethod(url);
  }

  updateHistoryTitle(title:any, chatHistoryId:any) {
    let data = {
      'chatHistoryId':chatHistoryId,
      'title':title
    }
    const url = this.chatGptSettingsUrl + "updateHistoryTitle?access_token=" + this.authenticationService.access_token;
    return this.authenticationService.callPutMethod(url,data);
  }

  analyzeCallRecording(chatGptSettingDTO: any) {
    let userId = this.authenticationService.getUserId();
    let callIdRequestParameter = chatGptSettingDTO.callId != undefined ? '&callId=' + chatGptSettingDTO.callId : '';
    let userIdRequestParameter = userId != undefined ? '&loggedInUserId=' + userId : '';
    let contactJourneyRequestParameter = '&contactJourney='+true;
    let contactIdRequestParameter = chatGptSettingDTO.contactId != undefined ? '&contactId=' + chatGptSettingDTO.contactId : '';
    let userListIdRequestParameter = chatGptSettingDTO.userListId != undefined ? '&userListId=' + chatGptSettingDTO.userListId : '';
    const url = this.chatGptSettingsUrl + "/analyzeCallRecording?access_token=" + this.authenticationService.access_token + callIdRequestParameter + userIdRequestParameter + contactJourneyRequestParameter + contactIdRequestParameter + userListIdRequestParameter;
    return this.authenticationService.callGetMethod(url);
  }

  /** XNFR-982 **/
  getOliverAgentConfigurationSettings() {
    let loggedInUserId = this.authenticationService.getUserId()
    let url = this.chatGptSettingsUrl + 'getOliverAgentConfigurationSettings/' + loggedInUserId + '?access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callGetMethod(url);
  }

  getOliverAgentConfigurationSettingsForVanityLogin() {
    let companyProfileName = this.authenticationService.companyProfileName;
    let url = this.chatGptSettingsUrl + 'getOliverAgentConfigurationSettingsForVanityLogin/' + companyProfileName + '?access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callGetMethod(url);
  }

  /** XNFR-982 **/
  updateOliverAgentConfigurationSettings(oliverAgentAccessDTO: OliverAgentAccessDTO) {
    let loggedInUserId = this.authenticationService.getUserId();
    const url = this.chatGptSettingsUrl + 'updateOliverAgentConfigurationSettings/' + loggedInUserId + '?access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callPostMethod(url, oliverAgentAccessDTO);
  }

}
