import { Component, Input, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { ChatGptSettingsService } from 'app/dashboard/chat-gpt-settings.service';
import { CustomResponse } from '../models/custom-response';
import { Properties } from '../models/properties';
declare var $:any;
@Component({
  selector: 'app-chat-gpt-modal',
  templateUrl: './chat-gpt-modal.component.html',
  styleUrls: ['./chat-gpt-modal.component.css'],
  providers:[Properties]
})
export class ChatGptModalComponent implements OnInit {
  @Input() isChatGptIconDisplayed:boolean;
  @Input() isShowingRouteLoadIndicator:boolean;
  @Input() showLoaderForAuthGuard:boolean;
  inputText="";
  isValidInputText = false;
  chatGptGeneratedText = "";
  isTextLoading = false;
  isCopyButtonDisplayed = false;
  customResponse:CustomResponse = new CustomResponse();
  constructor(public authenticationService:AuthenticationService,private chatGptSettingsService:ChatGptSettingsService,
    private referenceService:ReferenceService,public properties:Properties) { 
    
  }

  ngOnInit() {
  }


  validateInputText(){
    let trimmedText = this.referenceService.getTrimmedData(this.inputText);
    this.isValidInputText = trimmedText!=undefined && trimmedText.length>0;
  }

 
  generateChatGPTText(){
    this.customResponse = new CustomResponse();
    this.isTextLoading = true;
    this.chatGptGeneratedText = '';
    this.chatGptSettingsService.generateText(this.inputText).subscribe(
      response=>{
        let statusCode = response.statusCode;
        let data = response.data;
        if(statusCode==200){
          let chatGptGeneratedText = data['apiResponse']['choices'][0]['message']['content'];
          this.chatGptGeneratedText = this.referenceService.getTrimmedData(chatGptGeneratedText);
          this.isCopyButtonDisplayed = this.chatGptGeneratedText.length>0;
        }else if(statusCode==400){
          this.chatGptGeneratedText = response.message;
        }else{
          let errorMessage = data['apiResponse']['error']['message'];
          this.customResponse = new CustomResponse('ERROR',errorMessage,true);
        }
        this.isTextLoading = false;
      },error=>{
          this.isTextLoading = false;
          this.customResponse = new CustomResponse('ERROR',this.properties.serverErrorMessage,true);
      });
  }

  copyChatGPTText(chatGptGeneratedTextInput: any){
    $('#copied-chat-gpt-text-message').hide();
    chatGptGeneratedTextInput.select();
    document.execCommand('copy');
    chatGptGeneratedTextInput.setSelectionRange(0, 0);
    $('#copied-chat-gpt-text-message').show(500);
  }

  resetValues(){
    this.inputText = "";
    this.isValidInputText = false;
    this.chatGptGeneratedText = "";
    this.isCopyButtonDisplayed = false;
    this.customResponse = new CustomResponse();
    $('#copied-chat-gpt-text-message').hide();
  }

 
}
