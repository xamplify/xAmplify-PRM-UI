import { ChatGptSettingsService } from './../chat-gpt-settings.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChatGptIntegrationSettingsDto } from './../models/chat-gpt-integration-settings-dto';
import { CustomResponse } from 'app/common/models/custom-response';
import { ReferenceService } from 'app/core/services/reference.service';
import { Properties } from 'app/common/models/properties';
import { AuthenticationService } from 'app/core/services/authentication.service';


@Component({
  selector: 'app-chat-gpt-integration-settings',
  templateUrl: './chat-gpt-integration-settings.component.html',
  styleUrls: ['./chat-gpt-integration-settings.component.css'],
  providers:[Properties]
})
export class ChatGptIntegrationSettingsComponent implements OnInit {

  @Input() isFromOliverSettingsModalPopup: boolean = false;
  
  chatGptSettingsLoader = false;
  chatGptIntegrationSettingsDto = new ChatGptIntegrationSettingsDto();
  customResponse:CustomResponse = new CustomResponse();
  isSwitchOptionDisabled = false;
  chatGptIntegrationEnabledPreviousState = false;
  description = "To enable ChatGPT integration, access the settings, enter your API key, and activate the relevant options. To disable it, simply toggle the setting off and remove the API key if desired";
  helperText = "If you prefer to use your own AI infrastructure, you can enter your OpenAI API key here. This allows custom control over AI behavior while continuing to access Oliver's features";

  activeTab: string = 'settings';
  showOliverInsights: boolean = false;
  showBrainstormWithOliver: boolean = false;
  showOliverSparkWriter: boolean = false;
  showOliverParaphraser: boolean = false;
  showOliverContactAgent: boolean = false;
  showAskOliver: boolean = true;
  updateButtonName: string = 'Update';
  disableUpdateButton: boolean;

  @Output() updateOliverFlags = new EventEmitter<{
    showOliverInsights: boolean;
    showBrainstormWithOliver: boolean;
    showOliverSparkWriter: boolean;
    showOliverParaphraser: boolean;
    showOliverContactAgent: boolean;
  }>();

  private readonly INSIGHTAGENT = "INSIGHTAGENT";
  private readonly BRAINSTORMAGENT = "BRAINSTORMAGENT";
  private readonly SPARKWRITERAGENT = "SPARKWRITERAGENT";
  private readonly PARAPHRASERAGENT = "PARAPHRASERAGENT";
  private readonly CONTACTAGENT = "CONTACTAGENT";

  constructor(public referenceService:ReferenceService,
    public chatGptSettingsService:ChatGptSettingsService,public properties:Properties,
    public authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.getSettings();
  }

  getSettings(){
    this.chatGptSettingsLoader = true;
    this.chatGptSettingsService.getChatGptSettingsByLoggedInUserId().subscribe(
      response=>{
        this.chatGptIntegrationSettingsDto = response.data;
        this.chatGptIntegrationEnabledPreviousState = this.chatGptIntegrationSettingsDto.chatGptIntegrationEnabled;
        this.showOliverInsights = this.chatGptIntegrationSettingsDto.showOliverInsights;
        this.showBrainstormWithOliver = this.chatGptIntegrationSettingsDto.showBrainstormWithOliver;
        this.showOliverSparkWriter = this.chatGptIntegrationSettingsDto.showOliverSparkWriter;
        this.showOliverParaphraser = this.chatGptIntegrationSettingsDto.showOliverParaphraser;
        this.showOliverContactAgent = this.chatGptIntegrationSettingsDto.showOliverContactAgent;
        this.chatGptSettingsLoader = false;
      },error=>{
        this.customResponse = new CustomResponse('ERROR',this.properties.serverErrorMessage,true);
        this.chatGptSettingsLoader = false;
      });
  }

  updateSettings(){
    this.customResponse = new CustomResponse();
    this.updateButtonName = 'Updating...';
    this.disableUpdateButton = true;
    this.chatGptSettingsLoader = !this.isFromOliverSettingsModalPopup ? true : this.chatGptSettingsLoader;
    this.checkCanUpdateOliverAgentAccessSettings();
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
            if (!this.isFromOliverSettingsModalPopup) {
              this.customResponse = new CustomResponse('SUCCESS',"Settings updated successfully.",true);
            }
            this.getSettings();
          }
          this.updateOliverFlags.emit({
            showOliverInsights: this.chatGptIntegrationSettingsDto.showOliverInsights,
            showBrainstormWithOliver: this.chatGptIntegrationSettingsDto.showBrainstormWithOliver,
            showOliverSparkWriter: this.chatGptIntegrationSettingsDto.showOliverSparkWriter,
            showOliverParaphraser: this.chatGptIntegrationSettingsDto.showOliverParaphraser,
            showOliverContactAgent: this.chatGptIntegrationSettingsDto.showOliverContactAgent
          });
        }else{
          this.customResponse = new CustomResponse('ERROR',response.message,true);
        }
        this.chatGptSettingsLoader = false;
        this.updateButtonName = 'Update';
        this.disableUpdateButton = false;
        if (!this.isFromOliverSettingsModalPopup) {
          this.referenceService.scrollSmoothToTop();
        }
      },error=>{
        this.updateButtonName = 'Update';
        this.disableUpdateButton = false;
        this.chatGptSettingsLoader = false;
        let message = this.referenceService.getApiErrorMessage(error);
        this.customResponse = new CustomResponse('ERROR',message,true);
        if (!this.isFromOliverSettingsModalPopup) {
          this.referenceService.scrollSmoothToTop();
        }
      });
  }

  private checkCanUpdateOliverAgentAccessSettings() {
    this.chatGptIntegrationSettingsDto.updateOliverAgentSettings = this.authenticationService.module.adminOrSuperVisor
      && (this.authenticationService.oliverInsightsEnabled || this.authenticationService.brainstormWithOliverEnabled || this.authenticationService.oliverSparkWriterEnabled
        || this.authenticationService.oliverParaphraserEnabled || this.authenticationService.oliverContactAgentEnabled) && (this.authenticationService.vanityURLEnabled ? this.authenticationService.module.loggedInThroughOwnVanityUrl : true);
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

  updateCheckBox(event: any, agentType: string) {
    const isChecked = event.target.checked;
    if (agentType === this.INSIGHTAGENT) {
      this.chatGptIntegrationSettingsDto.showOliverInsights = isChecked;
    } else if (agentType === this.BRAINSTORMAGENT) {
      this.chatGptIntegrationSettingsDto.showBrainstormWithOliver = isChecked;
    } else if (agentType === this.SPARKWRITERAGENT) {
      this.chatGptIntegrationSettingsDto.showOliverSparkWriter = isChecked;
    } else if (agentType === this.PARAPHRASERAGENT) {
      this.chatGptIntegrationSettingsDto.showOliverParaphraser = isChecked;
    } else if (agentType === this.CONTACTAGENT) {
      this.chatGptIntegrationSettingsDto.showOliverContactAgent = isChecked;
    }
  }

}
