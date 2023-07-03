import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { CampaignService } from '../services/campaign.service';


@Component({
  selector: 'app-add-campaign',
  templateUrl: './add-campaign.component.html',
  styleUrls: ['./add-campaign.component.css']
})
export class AddCampaignComponent implements OnInit {

  constructor(public referenceService:ReferenceService,public authenticationService:AuthenticationService,public campaignService:CampaignService) { }

  ngOnInit() {
  }

}
