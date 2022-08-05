import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-agency-dashboard',
  templateUrl: './agency-dashboard.component.html',
  styleUrls: ['./agency-dashboard.component.css']
})
export class AgencyDashboardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    alert("In Agency Dashboard");
  }

}
