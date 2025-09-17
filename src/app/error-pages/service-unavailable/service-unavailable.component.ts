import { Component, OnInit } from '@angular/core';
import { ReferenceService } from '../../core/services/reference.service';
import { Observable } from 'rxjs/Rx';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-service-unavailable',
  templateUrl: './service-unavailable.component.html',
  styleUrls: ['./service-unavailable.component.css']
})
export class ServiceUnavailableComponent implements OnInit {

  constructor(public referenceService:ReferenceService, public authenticationService:AuthenticationService, public router:Router) { }

  ngOnInit() {
    this.authenticationService.logout();
    
  }

  logout(){
    this.authenticationService.logout();
  }

  }
