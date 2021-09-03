import { Component, OnInit } from '@angular/core';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from 'app/core/services/authentication.service';

@Component({
  selector: 'app-unauthorized-page',
  templateUrl: './unauthorized-page.component.html',
  styleUrls: ['./unauthorized-page.component.css']
})
export class UnauthorizedPageComponent implements OnInit {

  constructor(public referenceService:ReferenceService,public authenticationService:AuthenticationService) { }

  ngOnInit() {
    this.authenticationService.unauthorized = true;
    this.authenticationService.revokeAccessToken();
  }

  login(){
    this.authenticationService.reloadLoginPage = true;
    this.referenceService.goToRouter('/login');
  }

}
