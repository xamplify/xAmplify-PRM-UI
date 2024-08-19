import { ChatGptIntegrationSettingsDto } from './models/chat-gpt-integration-settings-dto';
import { Injectable } from '@angular/core';
import { RouterUrlConstants } from 'app/constants/router-url.contstants';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';


@Injectable()
export class ChatGptSettingsService {

  chatGptSettingsUrl =  this.authenticationService.REST_URL+RouterUrlConstants.chatGptSettings;
  constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService) { 

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

}
