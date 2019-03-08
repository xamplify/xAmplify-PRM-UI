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
    console.log("service unavailable component");
    // Observable.interval(1000 * 60).subscribe(x => {
    //  this.getUserByUserName(this.authenticationService.user.username);
    // });
  }

  getUserByUserName( userName: string ) {
  try{
     if(userName) {
      this.authenticationService.getUserByUserName( userName ).subscribe(
        data => { this.router.navigate(['/home/dashboard']); },
        error => { console.log( error ); this.router.navigate(['/su'])});
     }
    }catch(error){ console.log('error'+error);
     if(localStorage.getItem('currentUser')) { } else { this.router.navigate(['/login'])}
  }}
  }
