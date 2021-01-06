import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'app/core/services/authentication.service';

@Component({
	selector: 'app-vanity-add-contacts',
	templateUrl: './vanity-add-contacts.component.html',
	styleUrls: ['./vanity-add-contacts.component.css']
})
export class VanityAddContactsComponent implements OnInit {

	constructor(private router: Router, private route: ActivatedRoute, private authenticationService: AuthenticationService) { }

	ngOnInit() {
		let providerName = this.route.snapshot.params['socialProvider'];
		let currentUser = this.route.snapshot.params['currentUser'];
		let currentUser1 = this.route.snapshot.params['url'];
		const decodedData = window.atob(currentUser);
		localStorage.setItem('currentUser', decodedData);
		localStorage.setItem('vanityUrlFilter', 'true');
		this.authenticationService.access_token = JSON.parse(decodedData)['accessToken'];
		if (currentUser1 != null) {
			window.location.href = "" + currentUser1;
		} else {
			let url = providerName + "/login";
			this.router.navigate([url]);
		}


	}

}
