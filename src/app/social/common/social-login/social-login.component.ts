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
	parentWindowUserId: number;
	isPartner: boolean;
	module: string;
	checkingContactTypeName: string;
	assignLeads: boolean = false;
	public storeLogin: any;

	constructor(private router: Router, private route: ActivatedRoute, private socialService: SocialService,
		public contactService: ContactService, public xtremandLogger: XtremandLogger, public authenticationService: AuthenticationService
	) {
	}
	/* if blocks for google and sales force are added by ajay to call backend apis to get required redirect urls for authentication */
	login(providerName: string) {
		alert('in social-login.component.ts first login block')
		if (providerName == 'google') {
			let currentModule = "";
			if (this.assignLeads) {
				currentModule = 'leads';
			} else {
				currentModule = 'contacts';
			}
			this.parentWindowUserId = this.authenticationService.getUserId();
			this.contactService.googleLogin(currentModule)
				.subscribe(
					data => {
						this.storeLogin = data;
						console.log(data);
						localStorage.setItem("userAlias", data.userAlias);
						localStorage.setItem("currentModule", data.module);
						console.log(data.redirectUrl);
						console.log(data.userAlias);
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

		} else if (providerName == 'salesforce') {
			alert('in social-login.component.ts salesforce elseif block')
			let currentModule = "";
			if (this.assignLeads) {
				currentModule = 'leads'
			} else {
				currentModule = 'contacts'
			}
			this.contactService.salesforceLogin(currentModule)
				.subscribe(
					data => {
						this.storeLogin = data;
						console.log(data);
						localStorage.setItem("userAlias", data.userAlias)
						localStorage.setItem("currentModule", data.module)
						console.log(data.redirectUrl);
						console.log(data.userAlias);
						window.location.href = "" + data.redirectUrl;

					},
					(error: any) => {
						this.xtremandLogger.error(error);
					},
					() => this.xtremandLogger.log("addContactComponent salesforceContacts() login finished.")
				);
		}

		else {
			alert('in social-login.component.ts last else block social serverice login ')
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
		alert('in social-login.component.ts ngoninit')
		try {
			const providerName = this.route.snapshot.params['social'];
			this.login(providerName);
		}
		catch (err) {
			console.log(err);
		}
	}


}
