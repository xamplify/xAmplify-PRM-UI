import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';

@Component({
  selector: 'app-domain-error',
  templateUrl: './domain-error.component.html',
  styleUrls: ['./domain-error.component.css']
})
export class DomainErrorComponent implements OnInit {
  
  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {    
  }

}
