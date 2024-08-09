import { ChatGptSettingsService } from './../chat-gpt-settings.service';
import { Component, OnInit } from '@angular/core';
import { ChatGptIntegrationSettingsDto } from './../models/chat-gpt-integration-settings-dto';
import { CustomResponse } from 'app/common/models/custom-response';
import { ReferenceService } from 'app/core/services/reference.service';
import { Properties } from 'app/common/models/properties';


@Component({
  selector: 'app-chat-gpt-integration-settings',
  templateUrl: './chat-gpt-integration-settings.component.html',
  styleUrls: ['./chat-gpt-integration-settings.component.css'],
  providers:[Properties]
})
export class ChatGptIntegrationSettingsComponent implements OnInit {
  chatGptSettingsLoader = false;
  chatGptIntegrationSettingsDto = new ChatGptIntegrationSettingsDto();
  customResponse:CustomResponse = new CustomResponse();
  isSwitchOptionDisabled = false;
  chatGptIntegrationEnabledPreviousState = false;
  description = "To enable ChatGPT integration, access the settings, enter your API key, and activate the relevant options. To disable it, simply toggle the setting off and remove the API key if desired";

  constructor(public referenceService:ReferenceService,
    public chatGptSettingsService:ChatGptSettingsService,public properties:Properties) { }

  ngOnInit() {
    this.getSettings();
  }

  getSettings(){
    this.chatGptSettingsLoader = true;
    this.chatGptSettingsService.getChatGptSettingsByLoggedInUserId().subscribe(
      response=>{
        this.chatGptIntegrationSettingsDto = response.data;
        this.chatGptIntegrationEnabledPreviousState = this.chatGptIntegrationSettingsDto.chatGptIntegrationEnabled;
        this.chatGptSettingsLoader = false;
      },error=>{
        this.customResponse = new CustomResponse('ERROR',this.properties.serverErrorMessage,true);
        this.chatGptSettingsLoader = false;
      });
  }

  updateSettings(){
    this.customResponse = new CustomResponse();
    this.chatGptSettingsLoader = true;
    this.chatGptSettingsService.updateChatGptSettings(this.chatGptIntegrationSettingsDto).subscribe(
      response=>{
        let statusCode = response.statusCode;
        if(statusCode==200){
          if(this.chatGptIntegrationEnabledPreviousState!=this.chatGptIntegrationSettingsDto.chatGptIntegrationEnabled){
            this.referenceService.showSweetAlertProcessingLoader("Settings updated successfully.");
						setTimeout(() => {
							this.referenceService.goToRouter('/home/dashboard/myprofile/chatGPT');
              this.referenceService.closeSweetAlert();
						}, 3000);
          }else{
            this.customResponse = new CustomResponse('SUCCESS',"Settings updated successfully.",true);
          }
        }else{
          this.customResponse = new CustomResponse('ERROR',response.message,true);
        }
        this.chatGptSettingsLoader = false;
      },error=>{
        this.chatGptSettingsLoader = false;
        let message = this.referenceService.getApiErrorMessage(error);
        this.customResponse = new CustomResponse('ERROR',message,true);
      });
  }

  validateForm(){
    let trimmedChatGptKey = this.referenceService.getTrimmedData(this.chatGptIntegrationSettingsDto.chatGptApiKey);
    let isInvalidChatGptKey = trimmedChatGptKey==undefined || trimmedChatGptKey.length==0;
    this.isSwitchOptionDisabled = isInvalidChatGptKey;
    if(isInvalidChatGptKey){
      this.enableOrDisableChatGptSettings(false);
    }
  }
 

  enableOrDisableChatGptSettings(value:boolean){
    this.chatGptIntegrationSettingsDto.chatGptIntegrationEnabled = value;
  }

}
