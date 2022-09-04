import { Component, OnInit } from '@angular/core';
import { ReferenceService } from 'app/core/services/reference.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AzugaService } from '../service/azuga.service';
@Component({
  selector: 'app-devices-info',
  templateUrl: './devices-info.component.html',
  styleUrls: ['./devices-info.component.css']
})
export class DevicesInfoComponent implements OnInit {

  constructor(public azugaService:AzugaService,public referenceService:ReferenceService,public authenticationService:AuthenticationService) {
    alert("here");
   }

  ngOnInit() {
  }

}
