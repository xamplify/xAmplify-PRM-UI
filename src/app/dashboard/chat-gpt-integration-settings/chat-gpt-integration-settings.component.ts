import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-gpt-integration-settings',
  templateUrl: './chat-gpt-integration-settings.component.html',
  styleUrls: ['./chat-gpt-integration-settings.component.css']
})
export class ChatGptIntegrationSettingsComponent implements OnInit {

  description = "To enable ChatGPT integration in xAmplify, access the settings, enter your API key, and activate the relevant options. To disable it, simply toggle the setting off and remove the API key if desired";

  constructor() { }

  ngOnInit() {
  }

}
