import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../core/services/authentication.service';
@Component({
  selector: 'app-detailed-dashboard',
  templateUrl: './detailed-dashboard.component.html',
  styleUrls: ['./detailed-dashboard.component.css']
})
export class DetailedDashboardComponent implements OnInit {
logedInCustomerCompanyName = "";
  constructor(public authenticationService:AuthenticationService) { }

  ngOnInit() {
	const currentUser = localStorage.getItem( 'currentUser' );
    if(currentUser!=undefined){
      this.logedInCustomerCompanyName = JSON.parse( currentUser )['logedInCustomerCompanyNeme'];
    }
  }

}
