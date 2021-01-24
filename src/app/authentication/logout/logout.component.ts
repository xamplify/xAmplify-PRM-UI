import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import {Router} from '@angular/router';
@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private authenticationService:AuthenticationService,private router: Router) { }

  ngOnInit() {
    this.authenticationService.reloadLoginPage = true;
    if(this.router.url.indexOf('logout')>-1){
      this.authenticationService.serviceStoppedMessage = 'Service Unavailable Error.';
      this.authenticationService.logout();
    }else{
      this.authenticationService.revokeAccessToken();
    }

  }

}
