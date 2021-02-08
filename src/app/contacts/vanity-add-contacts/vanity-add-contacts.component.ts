import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'app/core/services/authentication.service';

@Component({
	selector: 'app-vanity-add-contacts',
	templateUrl: './vanity-add-contacts.component.html',
	styleUrls: ['./vanity-add-contacts.component.css']
})
export class VanityAddContactsComponent implements OnInit {

	constructor(private router: Router, private route: ActivatedRoute) { }

	ngOnInit() {
		let providerName = this.route.snapshot.params['socialProvider'];
		let urlFromParentWindow = this.route.snapshot.params['redirectURL'];
		let redirectURL = window.atob(urlFromParentWindow);
		let vanityUserId = this.route.snapshot.params['vanityUserId'];
		localStorage.setItem('vanityUserId', vanityUserId);
		let vanityUserAlias = this.route.snapshot.params['vanityUserAlias'];
		localStorage.setItem('vanityUserAlias', vanityUserAlias);
		let vanityCurrentModule = this.route.snapshot.params['currentModule'];
		localStorage.setItem('vanityCurrentModule', vanityCurrentModule);
		localStorage.setItem('vanityUrlFilter', 'true');
		if (redirectURL.search('https') != -1) {
			window.location.href = "" + redirectURL;
		} else {
			let url = providerName + "/login";
			this.router.navigate([url]);
		}
	}

}
