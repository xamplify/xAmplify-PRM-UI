import { Component, OnInit } from '@angular/core';
import { ReferenceService } from '../../core/services/reference.service';
import { CallActionSwitch } from '../../videos/models/call-action-switch';
@Component({
  selector: 'app-event-campaign',
  templateUrl: './event-campaign.component.html',
  styleUrls: ['./event-campaign.component.css'],
  providers: [CallActionSwitch]
})
export class EventCampaignComponent implements OnInit {

  constructor(public callActionSwitch: CallActionSwitch,
    public referenceService: ReferenceService) { }

  ngOnInit() {
  }

}
