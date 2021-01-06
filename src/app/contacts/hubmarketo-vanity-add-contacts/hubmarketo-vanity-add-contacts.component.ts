import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'app/core/services/authentication.service';

@Component({
  selector: 'app-hubmarketo-vanity-add-contacts',
  templateUrl: './hubmarketo-vanity-add-contacts.component.html',
  styleUrls: ['./hubmarketo-vanity-add-contacts.component.css']
})
export class HubmarketoVanityAddContactsComponent implements OnInit {

	constructor(private router: Router, private route: ActivatedRoute, private authenticationService: AuthenticationService) { }

  ngOnInit() {
		let providerName = this.route.snapshot.params['socialProvider'];
		let currentUser = this.route.snapshot.params['currentUser'];
		let encodedHubSpotRedirectURL = this.route.snapshot.params['hubSpotRedirectURL'];
		const decodedData = window.atob(currentUser);
		const redirectURL = window.atob(encodedHubSpotRedirectURL);
		localStorage.setItem('currentUser', decodedData);
		localStorage.setItem('vanityUrlFilter', 'true');
		this.authenticationService.access_token = JSON.parse(decodedData)['accessToken'];
		
		if (providerName == 'hubspot' && redirectURL !== undefined && redirectURL !== '') {
			window.location.href = redirectURL;
		}
		else if (providerName == 'salesforce' && redirectURL !== undefined && redirectURL !== '') {
			window.location.href = redirectURL;
		}
  }

}
