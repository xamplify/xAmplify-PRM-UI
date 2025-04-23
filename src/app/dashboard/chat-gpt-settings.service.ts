import { HttpClient } from '@angular/common/http';
import { ChatGptIntegrationSettingsDto } from './models/chat-gpt-integration-settings-dto';
import { Injectable } from '@angular/core';
import { RouterUrlConstants } from 'app/constants/router-url.contstants';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';


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

  onUpload(pdfFile: Blob, chatGptSettings: ChatGptIntegrationSettingsDto) {
    const url = `${this.chatGptSettingsUrl}/upload?access_token=${this.authenticationService.access_token}`;
    const formData = new FormData();
    formData.append('file', pdfFile, 'file.pdf');
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
    let damIdRequestParameter = chatGptIntegrationSettingsDto.damId != undefined ? '&damId=' + chatGptIntegrationSettingsDto.damId : '';
    let userIdRequestParameter = userId != undefined ? '&loggedInUserId=' + userId : '';
    let isPartnerDamAssetRequestParm = chatGptIntegrationSettingsDto.partnerDam != undefined ? '&partnerDam=' + chatGptIntegrationSettingsDto.partnerDam : '';
    let isVendorDamAssetRequestParm = chatGptIntegrationSettingsDto.vendorDam != undefined ? '&vendorDam=' + chatGptIntegrationSettingsDto.vendorDam : '';
    const url = this.chatGptSettingsUrl + '/getThreadId?access_token=' + this.authenticationService.access_token + damIdRequestParameter + userIdRequestParameter + isPartnerDamAssetRequestParm + isVendorDamAssetRequestParm;
    return this.authenticationService.callGetMethod(url);
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
    const url = this.chatGptSettingsUrl + "/getThreadIdNadVectorStoreIdByContactIdAndUserListId?access_token=" + this.authenticationService.access_token + userIdRequestParameter + contactIdRequestParameter + userListIdRequestParameter;
    return this.authenticationService.callGetMethod(url);
  }

}
