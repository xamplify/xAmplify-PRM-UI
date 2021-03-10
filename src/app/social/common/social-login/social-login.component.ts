import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SocialService } from '../../services/social.service';
import { ContactService } from 'app/contacts/services/contact.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
//import { AddContactsComponent } from 'app/contacts/add-contacts/add-contacts.component';


@Component({
	selector: 'app-social-login',
	templateUrl: './social-login.component.html',
	styleUrls: ['./social-login.component.css']
})
export class SocialLoginComponent implements OnInit {
	error: string;
	isPartner: boolean;
	module: string;
	checkingContactTypeName: string;
	assignLeads: boolean = false;
	public storeLogin: any;
	isLoggedInVanityUrl: any;

	constructor(private router: Router, private route: ActivatedRoute, private socialService: SocialService,
		public contactService: ContactService, public xtremandLogger: XtremandLogger, public authenticationService: AuthenticationService) {
			this.isLoggedInVanityUrl = localStorage.getItem('vanityUrlFilter');
		}
	login(providerName: string) {
		if (providerName == 'google' && this.isLoggedInVanityUrl == 'true') {
			let currentModule = localStorage.getItem('vanityCurrentModule');
			/*let currentModule = "";
			if (this.assignLeads) {
				currentModule = 'leads';
			} else {
				currentModule = 'contacts';
			}*/
			
			this.contactService.googleVanityLogin(currentModule)
				.subscribe(
					data => {
						this.storeLogin = data;
						localStorage.setItem("userAlias", data.userAlias);
						localStorage.setItem("currentModule", data.module);
						window.location.href = "" + data.redirectUrl;
					},
					(error: any) => {
						this.xtremandLogger.error(error);
						if (error._body.includes("JSONObject") && error._body.includes("access_token") && error._body.includes("not found.")) {
							this.xtremandLogger.errorMessage = 'authentication was not successful, you might have changed the password of social account or other reasons, please unlink your account and reconnect it.';
						}
						this.xtremandLogger.errorPage(error);
					},
					() => this.xtremandLogger.log("AddContactsComponent() googleContacts() finished.")
				);

		}
		else if (providerName == 'salesforce' && this.isLoggedInVanityUrl == 'true') {
			let currentModule = "";
			if (this.assignLeads) {
				currentModule = 'leads'
			} else {
				currentModule = 'contacts'
			}
			this.contactService.salesforceVanityLogin(currentModule)
				.subscribe(
					data => {
						localStorage.setItem("userAlias", data.userAlias)
						localStorage.setItem("currentModule", data.module)
						window.location.href = "" + data.redirectUrl;
					},
					(error: any) => {
						this.xtremandLogger.error(error);
					},
					() => this.xtremandLogger.log("addContactComponent salesforceContacts() login finished.")
				);
		}
		
		else if (providerName == 'zoho' && this.isLoggedInVanityUrl == 'true') {
			let currentModule = "";
			if (this.assignLeads) {
				currentModule = 'leads'
			} else {
				currentModule = 'contacts'
			}
			this.contactService.checkingZohoVanityAuthentication(currentModule)
				.subscribe(
					data => {
						localStorage.setItem("userAlias", data.userAlias)
						localStorage.setItem("currentModule", data.module)
						window.location.href = "" + data.redirectUrl;
					},
					(error: any) => {
						this.xtremandLogger.error(error);
					},
					() => this.xtremandLogger.log("addContactComponent salesforceContacts() login finished.")
				);
		}

		else {
			this.socialService.login(providerName)
				.subscribe(
					result => {
						console.log('redirect url: ' + result);
						window.location.href = '' + result;
					},
					error => {
						console.log(error);
						this.error = error;
					},
					() => console.log('login() Complete'));

		}
	}

	ngOnInit() {
		try {
			const providerName = this.route.snapshot.params['social'];
			this.login(providerName);
		}
		catch (err) {
			console.log(err);
		}
	}


}
