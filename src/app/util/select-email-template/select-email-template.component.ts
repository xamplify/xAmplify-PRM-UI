import { Component, OnInit } from '@angular/core';
import { CampaignService } from 'app/campaigns/services/campaign.service';


@Component({
  selector: 'app-select-email-template',
  templateUrl: './select-email-template.component.html',
  styleUrls: ['./select-email-template.component.css']
})
export class SelectEmailTemplateComponent implements OnInit {

  constructor(private campaignService:CampaignService) { }

  ngOnInit() {

  }

  



}
