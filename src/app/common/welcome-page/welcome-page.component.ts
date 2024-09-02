import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
declare var $:any;
@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css']
})
export class WelcomePageComponent implements OnInit {

  constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService) { }

  ngOnInit() {
    this.referenceService.clearHeadScriptFiles();
    $("#xamplify-index-head").append("<link rel='stylesheet' href='/assets/js/indexjscss/welcome-page.css' type='text/css'>");

  }

}
