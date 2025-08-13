import { HttpClient, HttpHeaders } from '@angular/common/http';
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
   oliverUrl =  this.authenticationService.REST_URL+ 'oliver/';
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
    const url = `${this.authenticationService.REST_URL}oliver/upload?access_token=${this.authenticationService.access_token}`;
    const formData = new FormData();
    // formData.append('file', pdfFile, `${assetName}.pdf`);
    chatGptSettings.loggedInUserId = this.authenticationService.getUserId();
    formData.delete('chatGptSettingsDTO');
    formData.append('chatGptSettingsDTO', new Blob([JSON.stringify(chatGptSettings)],
      {
        type: "application/json"
      }));
    // chatGptSettings.oliverIntegrationType = 'openai';
    chatGptSettings.assetName = assetName;
    return this.authenticationService.callPostMethod(url, chatGptSettings);
  }

  generateAssistantText(chatGptSettings: ChatGptIntegrationSettingsDto) {
    const url = this.chatGptSettingsUrl + '/getPromptResponse?access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callPutMethod(url, chatGptSettings);;
  }

  generateAssistantTextByAssistant(chatGptSettings: ChatGptIntegrationSettingsDto) {
    chatGptSettings.loggedInUserId = this.authenticationService.getUserId();
    let suffixUrl = this.authenticationService.REST_URL + 'oliver/';
    if (chatGptSettings.agentType && chatGptSettings.agentType != 'INSIGHTAGENT' && chatGptSettings.agentType != 'GLOBALCHAT') {
      suffixUrl = this.chatGptSettingsUrl;
    }
    const url = suffixUrl + '/getOliverResponse?access_token=' + this.authenticationService.access_token;
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

  getChatHistoryByThreadId(threadId: string, oliverIntegrationType:any, accessToken:any) {
    const url = this.authenticationService.REST_URL + 'oliver/chatHistory/' + threadId + "/" + accessToken + "/" + oliverIntegrationType + '?access_token=' + this.authenticationService.access_token;
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
    let oliverIntegrationTypeRequestParameter = chatGptIntegrationSettingsDto.oliverIntegrationType != undefined ? '&oliverIntegrationType=' + chatGptIntegrationSettingsDto.oliverIntegrationType : '';
    const url = this.chatGptSettingsUrl + '/getThreadId?access_token=' + this.authenticationService.access_token + damIdRequestParameter + userIdRequestParameter + isPartnerDamAssetRequestParm + isVendorDamAssetRequestParm + isFolderDamAssetRequestParm + callIdRequestParam + contactJourneyRequestParameter + contactIdRequestParameter + userListIdRequestParameter + oliverIntegrationTypeRequestParameter;
    return this.authenticationService.callGetMethod(url);
  }
  
  insertTemplateData(chatGptIntegrationSettingsDto: any) {
    chatGptIntegrationSettingsDto.loggedInUserId = this.authenticationService.getUserId();
    const url = this.chatGptSettingsUrl + '/insertTemplateData?access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callPutMethod(url, chatGptIntegrationSettingsDto);
  }

listDefaultTemplates(userId:any){
  const url = this.chatGptSettingsUrl+"/listDefaultTemplates/"+userId+"?access_token="+this.authenticationService.access_token;
  return  this.authenticationService.callGetMethod(url);
}

   getAssetDetailsByCategoryId(categoryId: number, isPartnerFolderView: boolean, oliverIntegrationType: any) {
    let urlPrefix = "";
    if (isPartnerFolderView) {
      urlPrefix = 'getAssetDetailsByCategoryIdForPartner';
    } else if (!isPartnerFolderView) {
      urlPrefix = 'getAssetDetailsByCategoryId';
    }
    const url = `${this.chatGptSettingsUrl}/${urlPrefix}/${categoryId}/${this.authenticationService.getUserId()}?access_token=${this.authenticationService.access_token}&oliverIntegrationtype=${oliverIntegrationType}`;
    return this.http.get(url);
  }

  onUploadFiles(pdfFiles: any[], chatGptSettings: ChatGptIntegrationSettingsDto) {
    const url = `${this.authenticationService.REST_URL}oliver/uploadFiles?access_token=${this.authenticationService.access_token}`;
    const formData = new FormData();
    // pdfFiles.forEach((pdfFile, index) => {
    //   formData.append(`fileDTOs[${index}].id`, pdfFile.assetId);
    //   formData.append(`fileDTOs[${index}].file`, pdfFile.file, `${pdfFile.assetName}.pdf`);
    // });

    chatGptSettings.loggedInUserId = this.authenticationService.getUserId();
    // formData.append('chatGptSettingsDTO', new Blob(
    //   [JSON.stringify(chatGptSettings)],
    //   { type: 'application/json' }
    // ));
    chatGptSettings.assets = pdfFiles;
    // chatGptSettings.oliverIntegrationType = 'openai';

    return this.authenticationService.callPostMethod(url, chatGptSettings);
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
    let oliverIntegrationTypeRequestParam = chatGptSettingDTO.oliverIntegrationType != undefined ? '&oliverIntegrationType=' + chatGptSettingDTO.oliverIntegrationType : '';
    let accessTokenRequestParam = chatGptSettingDTO.accessToken != undefined ? '&accessToken=' + chatGptSettingDTO.accessToken : '';
    const url = this.authenticationService.REST_URL + "oliver/analyzeCallRecordings?access_token=" + this.authenticationService.access_token + threadIdRequestParameter + userIdRequestParameter + vectorStoreIdRequestParameter + contactIdRequestParameter + userListIdRequestParameter + chatHistoryIdRequestParameter + contactJourneyRequestParameter + oliverIntegrationTypeRequestParam + accessTokenRequestParam;
    return this.authenticationService.callGetMethod(url);
  }

  getThreadIdAndVectorStoreIdByContactIdAndUserListId(contactId: any, userListId: any, activeOliverIntegrationType:any) {
    let userId = this.authenticationService.getUserId();
    let userIdRequestParameter = userId != undefined ? '&loggedInUserId=' + userId : '';
    let contactIdRequestParameter = contactId != undefined ? '&contactId=' + contactId : '';
    let userListIdRequestParameter = userListId != undefined ? '&userListId=' + userListId : '';
    let oliverIntegrationTypeRequestParam = activeOliverIntegrationType != undefined ? '&oliverIntegrationType=' + activeOliverIntegrationType : '';
    const url = this.chatGptSettingsUrl + "/getThreadIdAndVectorStoreIdByContactIdAndUserListId?access_token=" + this.authenticationService.access_token + userIdRequestParameter + contactIdRequestParameter + userListIdRequestParameter + oliverIntegrationTypeRequestParam;
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

  fetchHistories(pagination:Pagination, isPartnerLoggedIn:boolean, oliverIntegrationType:any) {
    let userId = this.authenticationService.getUserId();
    let pageableUrl = this.referenceService.getPagebleUrl(pagination);
    let vendorCompanyProfileNameRequestParam = pagination.vendorCompanyProfileName != undefined ? '&vendorCompanyProfileName=' + pagination.vendorCompanyProfileName : '';
    const url = this.chatGptSettingsUrl + "fetchChatHistories/"+userId+"/"+isPartnerLoggedIn+"/"+oliverIntegrationType+"?access_token=" + this.authenticationService.access_token + pageableUrl + vendorCompanyProfileNameRequestParam;
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
    let oliverIntegrationTypeRequestParam = chatGptSettingDTO.oliverIntegrationType != undefined ? '&oliverIntegrationType=' + chatGptSettingDTO.oliverIntegrationType : '';
    let accessTokenRequestParam = chatGptSettingDTO.accessToken != undefined ? '&accessToken=' + chatGptSettingDTO.accessToken : '';
    const url = this.authenticationService.REST_URL + "oliver/analyzeCallRecording?access_token=" + this.authenticationService.access_token + callIdRequestParameter + userIdRequestParameter + contactJourneyRequestParameter + contactIdRequestParameter + userListIdRequestParameter + oliverIntegrationTypeRequestParam + accessTokenRequestParam;
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

  /** XNFR-981 **/
  updateOliverAgentConfigurationSettings(oliverAgentAccessDTO: OliverAgentAccessDTO) {
    let loggedInUserId = this.authenticationService.getUserId();
    const url = this.chatGptSettingsUrl + 'updateOliverAgentConfigurationSettings/' + loggedInUserId + '?access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callPostMethod(url, oliverAgentAccessDTO);
  }

  fetchOliverActiveIntegration(chatGptIntegrationSettingsDto: ChatGptIntegrationSettingsDto) {
    let userId = this.authenticationService.getUserId();
    let parnerLoggedInRequestParameter = chatGptIntegrationSettingsDto.partnerLoggedIn ? '&partnerLoggedIn=' + chatGptIntegrationSettingsDto.partnerLoggedIn : '&partnerLoggedIn=' + false;
    let vendorCompanyRequestParameter = chatGptIntegrationSettingsDto.vendorCompanyProfileName != undefined ? '&vendorCompanyProfileName=' + chatGptIntegrationSettingsDto.vendorCompanyProfileName : '';
    let userIdRequestParameter = userId != undefined ? '&loggedInUserId=' + userId : '';
    const url = this.oliverUrl + "/fetchIntegrationDetials?access_token=" + this.authenticationService.access_token + vendorCompanyRequestParameter + userIdRequestParameter + parnerLoggedInRequestParameter;
    return this.authenticationService.callGetMethod(url);
  }

  fetchOliverActiveIntegrationType(companyId: any) {
    const url = this.oliverUrl + 'fetchOliverActiveIntegrationType/' + companyId + '?access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callGetMethod(url);
  }


  getSuggestedPromptsResponse(chatGptSettings: ChatGptIntegrationSettingsDto) {
    const url = this.chatGptSettingsUrl + '/getSuggestedPromptsResponse?access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callPutMethod(url, chatGptSettings);;
  }

  getSuggestedPromptsForGlobalSearch(companyProfileName: string) {
    let loggedInUserId = this.authenticationService.getUserId()
    let url = '';
    if (companyProfileName != '' && companyProfileName) {
      url = this.chatGptSettingsUrl + 'getRandomOliverSuggestedPromptsByDamIds/' + loggedInUserId + '/GLOBALCHAT/' + companyProfileName + '?access_token=' + this.authenticationService.access_token;
    } else {
      url = this.chatGptSettingsUrl + 'getRandomOliverSuggestedPromptsByDamIds/' + loggedInUserId + '/GLOBALCHAT' + '?access_token=' + this.authenticationService.access_token;
    }
    return this.authenticationService.callGetMethod(url);
  }

  getRandomOliverSuggestedPromptsByDamId(damId: number, companyProfileName: string, isPartnerView: boolean) {
    let url = '';
    if (companyProfileName != '' && companyProfileName) {
      url = this.chatGptSettingsUrl + 'getRandomOliverSuggestedPromptsByDamId/' + damId + '/' + companyProfileName + '/' + isPartnerView + '?access_token=' + this.authenticationService.access_token;
    } else {
      url = this.chatGptSettingsUrl + 'getRandomOliverSuggestedPromptsByDamId/' + damId + '?access_token=' + this.authenticationService.access_token;
    }
    return this.authenticationService.callGetMethod(url);
  }

  getDomainColorConfigurationByUserId() {
    const url = this.chatGptSettingsUrl + 'getDomainColors/' + this.authenticationService.getUserId() + '?access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callGetMethod(url);
  }

 updateDomainColorConfiguration(theme: any) {
  const userId = this.authenticationService.getUserId(); 
  const url = this.chatGptSettingsUrl + 'updateDomainColors/' + userId + '?access_token=' + this.authenticationService.access_token;
  return this.authenticationService.callPutMethod(url, theme);
}

 checkDomainColorConfigurationExists() {
    const userId = this.authenticationService.getUserId();
    const url = this.chatGptSettingsUrl + 'checkDomainColorsExists/' + userId + '?access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callGetMethod(url);
  }

  uploadContactDetails(chatGptIntegrationSettingsDto: ChatGptIntegrationSettingsDto) {
    let userId = this.authenticationService.getUserId();
    let userIdRequestParameter = userId != undefined ? '&loggedInUserId=' + userId : '';
    let contactIdRequestParameter = chatGptIntegrationSettingsDto.contactId != undefined ? '&contactId=' + chatGptIntegrationSettingsDto.contactId : '';
    let userListIdRequestParameter = chatGptIntegrationSettingsDto.userListId != undefined ? '&userListId=' + chatGptIntegrationSettingsDto.userListId : '';
    let oliverIntegrationTypeRequestParam = chatGptIntegrationSettingsDto.oliverIntegrationType != undefined ? '&oliverIntegrationType=' + chatGptIntegrationSettingsDto.oliverIntegrationType : '';
    let oliverAgentTypeParam = chatGptIntegrationSettingsDto.agentType != undefined ? '&agentType=' + chatGptIntegrationSettingsDto.agentType : '';
    let isFromChatGptModalRequestParam = '&isFromChatGptModal=true';
    let vendorCompanyProfileNameRequestParam = chatGptIntegrationSettingsDto.vendorCompanyProfileName != undefined ? '&vendorCompanyProfileName=' + chatGptIntegrationSettingsDto.vendorCompanyProfileName : '';
    const url = this.authenticationService.REST_URL + 'oliver/uploadContactDetails?access_token=' + this.authenticationService.access_token + userIdRequestParameter + contactIdRequestParameter + userListIdRequestParameter + oliverIntegrationTypeRequestParam + oliverAgentTypeParam + vendorCompanyProfileNameRequestParam + isFromChatGptModalRequestParam;
    return this.authenticationService.callGetMethod(url);
  }

  getOliverReportColors() {
    const url = this.chatGptSettingsUrl + 'getOliverReportColors/' + this.authenticationService.getUserId() + '?access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callGetMethod(url);
  }


  getSuggestedpromptsForFolderView(categoryId: number, isPartnerFolderView: boolean) {
    let urlPrefix = 'getSuggestedPromptsForFolderView/';
    const url = this.chatGptSettingsUrl + urlPrefix + categoryId + '/' + this.authenticationService.getUserId() + '/' + isPartnerFolderView + '?access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callGetMethod(url);
  }

  uploadPartnerDetails(chatGptIntegrationSettingsDto: ChatGptIntegrationSettingsDto) {
   let userId = this.authenticationService.getUserId();
    let userIdRequestParameter = userId != undefined ? '&loggedInUserId=' + userId : '';
    let contactIdRequestParameter = chatGptIntegrationSettingsDto.contactId != undefined ? '&contactId=' + chatGptIntegrationSettingsDto.contactId : '';
    let userListIdRequestParameter = chatGptIntegrationSettingsDto.userListId != undefined ? '&userListId=' + chatGptIntegrationSettingsDto.userListId : '';
    let oliverIntegrationTypeRequestParam = chatGptIntegrationSettingsDto.oliverIntegrationType != undefined ? '&oliverIntegrationType=' + chatGptIntegrationSettingsDto.oliverIntegrationType : '';
    let oliverAgentTypeParam = chatGptIntegrationSettingsDto.agentType != undefined ? '&agentType=' + chatGptIntegrationSettingsDto.agentType : '';
    let isFromChatGptModalRequestParam = '&isFromChatGptModal=true';
    let vendorCompanyProfileNameRequestParam = chatGptIntegrationSettingsDto.vendorCompanyProfileName != undefined ? '&vendorCompanyProfileName=' + chatGptIntegrationSettingsDto.vendorCompanyProfileName : '';
    const url = this.authenticationService.REST_URL + 'oliver/uploadPartnerDetails?access_token=' + this.authenticationService.access_token + userIdRequestParameter + contactIdRequestParameter + userListIdRequestParameter + oliverIntegrationTypeRequestParam + oliverAgentTypeParam + vendorCompanyProfileNameRequestParam + isFromChatGptModalRequestParam;
    return this.authenticationService.callGetMethod(url);
  }
  
   getOpenAiResponse(chatGptSettings: ChatGptIntegrationSettingsDto) {
    const url = this.chatGptSettingsUrl + 'getOpenAiResponse/' + '?access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callPutMethod(url, chatGptSettings);
  }

  generateAndDownloadPpt(blocks: any[], selectedTemplate: string): void {
    let slideBlocks: any[];
    if (typeof blocks === 'string') {
      try {
        slideBlocks = JSON.parse(blocks);
      } catch (e) {
        console.error('[pptx] could not parse blocks JSON', e);
        return;
      }
    } else {
      slideBlocks = blocks;
    }

    if (!Array.isArray(slideBlocks) || slideBlocks.length === 0) {
      console.warn('[pptx] no slide data to send');
      return;
    }

    const payload = { ppt_id: selectedTemplate, blocks: slideBlocks };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post(
      'https://imageconverter.xamplify.co/generate_ppt',
      payload,
      { headers, responseType: 'blob' as 'blob' }
    ).subscribe(
      (blob: Blob) => {
        this.downloadBlob(blob, 'Generated-Presentation.pptx');
      },
      err => {
        console.error('[pptx] generation failed', err.status, err.error);
      }
    );
  }


  private downloadBlob(blob: Blob, filename: string) {
    const url = (window.URL).createObjectURL(blob);
    const a   = document.createElement('a');
    a.href      = url;
    a.download  = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    (window.URL).revokeObjectURL(url);
  }

  uploadCampaignDetails(chatGptIntegrationSettingsDto: ChatGptIntegrationSettingsDto) {
    let userId = this.authenticationService.getUserId();
    let userIdRequestParameter = userId != undefined ? '&loggedInUserId=' + userId : '';
    let campaignIdRequestParameter = chatGptIntegrationSettingsDto.campaignId != undefined ? '&campaignId=' + chatGptIntegrationSettingsDto.campaignId : '';
    let oliverIntegrationTypeRequestParam = chatGptIntegrationSettingsDto.oliverIntegrationType != undefined ? '&oliverIntegrationType=' + chatGptIntegrationSettingsDto.oliverIntegrationType : '';
    let oliverAgentTypeParam = chatGptIntegrationSettingsDto.agentType != undefined ? '&agentType=' + chatGptIntegrationSettingsDto.agentType : '';
    let isFromChatGptModalRequestParam = '&isFromChatGptModal=true';
    let vendorCompanyProfileNameRequestParam = chatGptIntegrationSettingsDto.vendorCompanyProfileName != undefined ? '&vendorCompanyProfileName=' + chatGptIntegrationSettingsDto.vendorCompanyProfileName : '';
    const url = this.authenticationService.REST_URL + 'oliver/uploadCampaignDetails?access_token=' + this.authenticationService.access_token + userIdRequestParameter + campaignIdRequestParameter + oliverIntegrationTypeRequestParam + oliverAgentTypeParam + vendorCompanyProfileNameRequestParam + isFromChatGptModalRequestParam;
    return this.authenticationService.callGetMethod(url);
  }

  /** XNFR-1079  **/
  downloadDocx(chatGptSettings: ChatGptIntegrationSettingsDto) {
    const url = this.chatGptSettingsUrl + 'generate-docx/?access_token=' + this.authenticationService.access_token;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, chatGptSettings, {
      headers,
      responseType: 'blob' as 'json'
    });
  }

  /** XNFR-1079  **/
  downloadWordFile(chatGptSettings: ChatGptIntegrationSettingsDto) {
    this.downloadDocx(chatGptSettings).subscribe((blob: Blob) => {
      this.downloadBlob(blob, 'document.docx');
      this.referenceService.docxLoader = false;
    }, error => {
      console.error('Download failed', error);
    });
  }

  uploadLeadDetails(chatGptIntegrationSettingsDto: ChatGptIntegrationSettingsDto) {
    let userId = this.authenticationService.getUserId();
    let userIdRequestParameter = userId != undefined ? '&loggedInUserId=' + userId : '';
    let leadIdRequestParameter = chatGptIntegrationSettingsDto.leadId != undefined ? '&leadId=' + chatGptIntegrationSettingsDto.leadId : '';
    let oliverIntegrationTypeRequestParam = chatGptIntegrationSettingsDto.oliverIntegrationType != undefined ? '&oliverIntegrationType=' + chatGptIntegrationSettingsDto.oliverIntegrationType : '';
    let oliverAgentTypeParam = chatGptIntegrationSettingsDto.agentType != undefined ? '&agentType=' + chatGptIntegrationSettingsDto.agentType : '';
    let isFromChatGptModalRequestParam = '&isFromChatGptModal=true';
    let vendorCompanyProfileNameRequestParam = chatGptIntegrationSettingsDto.vendorCompanyProfileName != undefined ? '&vendorCompanyProfileName=' + chatGptIntegrationSettingsDto.vendorCompanyProfileName : '';
    const url = this.authenticationService.REST_URL + 'oliver/uploadLeadDetails?access_token=' + this.authenticationService.access_token + userIdRequestParameter + leadIdRequestParameter + vendorCompanyProfileNameRequestParam + oliverIntegrationTypeRequestParam + oliverAgentTypeParam + isFromChatGptModalRequestParam;
    return this.authenticationService.callGetMethod(url);
  }
  
  uploadPlaybookDetails(chatGptIntegrationSettingsDto: ChatGptIntegrationSettingsDto) {
    let userId = this.authenticationService.getUserId();
    let userIdRequestParameter = userId != undefined ? '&loggedInUserId=' + userId : '';
    let contactIdRequestParameter = chatGptIntegrationSettingsDto.contactId != undefined ? '&contactId=' + chatGptIntegrationSettingsDto.contactId : '';
    let userListIdRequestParameter = chatGptIntegrationSettingsDto.userListId != undefined ? '&userListId=' + chatGptIntegrationSettingsDto.userListId : '';
    let oliverIntegrationTypeRequestParam = chatGptIntegrationSettingsDto.oliverIntegrationType != undefined ? '&oliverIntegrationType=' + chatGptIntegrationSettingsDto.oliverIntegrationType : '';
    let oliverAgentTypeParam = chatGptIntegrationSettingsDto.agentType != undefined ? '&agentType=' + chatGptIntegrationSettingsDto.agentType : '';
    let isFromChatGptModalRequestParam = '&isFromChatGptModal=true';
    let vendorCompanyProfileNameRequestParam = chatGptIntegrationSettingsDto.vendorCompanyProfileName != undefined ? '&vendorCompanyProfileName=' + chatGptIntegrationSettingsDto.vendorCompanyProfileName : '';
    let learningTrackIdRequestParam = chatGptIntegrationSettingsDto.learningTrackId != undefined ? '&learningTrackId=' + chatGptIntegrationSettingsDto.learningTrackId : '';
    const url = this.authenticationService.REST_URL + 'oliver/uploadPlaybookDetails?access_token=' + this.authenticationService.access_token + userIdRequestParameter + contactIdRequestParameter +
    userListIdRequestParameter + oliverIntegrationTypeRequestParam + oliverAgentTypeParam + vendorCompanyProfileNameRequestParam + isFromChatGptModalRequestParam + learningTrackIdRequestParam;
    return this.authenticationService.callGetMethod(url);
  }

}
