import { Component, OnInit } from '@angular/core';
import { DealRegistration } from '../deal-registraton';
import { CountryNames } from 'app/common/models/country-names';
import { ReferenceService } from 'app/core/services/reference.service';
import { AuthenticationService } from 'app/core/services/authentication.service';

@Component({
  selector: 'app-deal-registration',
  templateUrl: './deal-registration.component.html',
  styleUrls: ['./deal-registration.component.css'],
  providers:[CountryNames]
})
export class DealRegistrationComponent implements OnInit {

  dealRegistration: DealRegistration;
  constructor(public authenticationService:AuthenticationService ,public countryNames:CountryNames, public referenceService:ReferenceService) {
    this.dealRegistration =  new DealRegistration();
  }

  ngOnInit() {
  }

}
