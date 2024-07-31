import { Component, OnInit } from '@angular/core';
import { ChatGptIntegrationSettingsDto } from './../models/chat-gpt-integration-settings-dto';
import { CustomResponse } from 'app/common/models/custom-response';
import { ReferenceService } from 'app/core/services/reference.service';
@Component({
  selector: 'app-chat-gpt-integration-settings',
  templateUrl: './chat-gpt-integration-settings.component.html',
  styleUrls: ['./chat-gpt-integration-settings.component.css']
})
export class ChatGptIntegrationSettingsComponent implements OnInit {


  chatGptSettingsLoader = false;
  chatGptIntegrationSettingsDto = new ChatGptIntegrationSettingsDto();
  customResponse:CustomResponse = new CustomResponse();
  isSwitchOptionDisabled = false;
  description = "To enable ChatGPT integration, access the settings, enter your API key, and activate the relevant options. To disable it, simply toggle the setting off and remove the API key if desired";

  constructor(public referenceService:ReferenceService) { }

  ngOnInit() {

  }

  updateSettings(){
    
  }

  validateForm(){
    let trimmedChatGptKey = this.referenceService.getTrimmedData(this.chatGptIntegrationSettingsDto.chatGptApiKey);
    let isInvalidChatGptKey = trimmedChatGptKey==undefined || trimmedChatGptKey.length==0;
    this.isSwitchOptionDisabled = isInvalidChatGptKey;
    if(isInvalidChatGptKey){
      this.chatGptIntegrationSettingsDto.chatGptIntegrationSettingsEnabled = false;
    }
  }

  setChatGptSettingsOption(event:boolean){
    this.chatGptIntegrationSettingsDto.chatGptIntegrationSettingsEnabled = event;
  }

}
