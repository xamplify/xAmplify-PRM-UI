import { Component, OnInit } from '@angular/core';
import { CallActionSwitch } from '../../videos/models/call-action-switch';

@Component({
  selector: 'app-agency-dashboard',
  templateUrl: './agency-dashboard.component.html',
  styleUrls: ['./agency-dashboard.component.css'],
  providers: [CallActionSwitch],
})
export class AgencyDashboardComponent implements OnInit {

  constructor(public callActionSwitch: CallActionSwitch) { }

  ngOnInit() {
  }

}
