import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ContactService } from '../services/contact.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';


@Component({
	selector: 'app-vanity-synchronize-contacts',
	templateUrl: './vanity-synchronize-contacts.component.html',
	styleUrls: ['./vanity-synchronize-contacts.component.css']
})
export class VanitySynchronizeContactsComponent implements OnInit {

	constructor(private router: Router, private route: ActivatedRoute, public contactService: ContactService, public xtremandLogger: XtremandLogger) { }

	public storeLogin: any;
	ngOnInit() {
		let providerName = this.route.snapshot.params['socialProvider'];
		let vanityUserId = this.route.snapshot.params['vanityUserId'];
		let vanityUserAlias = this.route.snapshot.params['vanityUserAlias'];
		localStorage.setItem('vanityUserAlias', vanityUserAlias);
		let vanityCurrentModule = this.route.snapshot.params['currentModule'];
		localStorage.setItem('vanityCurrentModule', vanityCurrentModule);
		localStorage.setItem('vanityUserId', vanityUserId);
		localStorage.setItem('vanityUrlFilter', 'true');
		
		if (vanityCurrentModule != null && providerName == 'google') {
			this.contactService.googleVanityLogin(vanityCurrentModule)
				.subscribe(
					data => {
						this.storeLogin = data;
						console.log(data);
						if (this.storeLogin.message != undefined && this.storeLogin.message == "AUTHENTICATION SUCCESSFUL FOR SOCIAL CRM") {
							console.log("AddContactComponent googleContacts() Authentication Success");
						} else {
							localStorage.setItem("userAlias", data.userAlias);
							localStorage.setItem("currentModule", data.module);
							localStorage.setItem("statusCode", data.statusCode);
							localStorage.setItem('vanityUrlFilter', 'true');
							console.log(data.redirectUrl);
							console.log(data.userAlias);
							window.location.href = "" + data.redirectUrl;
						}
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
		}else if(vanityCurrentModule != null && providerName == 'salesforce'){
				this.contactService.salesforceVanityLogin(vanityCurrentModule)
				.subscribe(
					data => {
						this.storeLogin = data;
						console.log(data);
						if (this.storeLogin.message != undefined && this.storeLogin.message == "AUTHENTICATION SUCCESSFUL FOR SOCIAL CRM") {
							console.log("AddContactComponent salesforce() Authentication Success");
						} else {
							localStorage.setItem("userAlias", data.userAlias);
							localStorage.setItem("currentModule", data.module);
							localStorage.setItem('vanityUrlFilter', 'true');
							console.log(data.redirectUrl);
							console.log(data.userAlias);
							var x = screen.width / 2 - 700 / 2;
							var y = screen.height / 2 - 450 / 2;
							window.location.href = "" + data.redirectUrl;
						}
					},
					(error: any) => {
						this.xtremandLogger.error(error);
					},
					() => this.xtremandLogger.log("addContactComponent salesforceContacts() login finished.")
				);
		}
		
		
		 else {
			let url = providerName + "/login";
			this.router.navigate([url]);
		}
	}

}
