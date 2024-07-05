import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SocialConnection } from '../../../social/models/social-connection';
import { SocialService } from '../../services/social.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { ReferenceService } from '../../../core/services/reference.service';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
import { EnvService } from 'app/env.service';
declare var $: any;
@Component({
    selector: 'app-social-callback',
    templateUrl: './social-callback.component.html',
    styleUrls: ['./social-callback.component.css']
})
export class SocialCallbackComponent implements OnInit {
    providerName: string;
    socialConnection: SocialConnection = new SocialConnection();
    error: string;
    isLoggedInVanityUrl = "";
    loggedInUserIdFromParentWindow = 0;
    //xnfr-256
    SERVER_URL: any;
    APP_URL: any;
    constructor(private router: Router, private route: ActivatedRoute, private socialService: SocialService,
        private authenticationService: AuthenticationService, public envService: EnvService,
        private refService: ReferenceService, private vanityUrlService: VanityURLService) {
        this.SERVER_URL = this.envService.SERVER_URL;
        this.APP_URL = this.envService.CLIENT_URL;
    }

    callback(providerName: string) {
        let client_id: string;
        let client_secret: string;
        let parentWindowUserId = 0;
        let vanityUrlDomain = "";
        this.isLoggedInVanityUrl = localStorage.getItem('vanityUrlFilter');
        if (this.isLoggedInVanityUrl == "true") {
            parentWindowUserId = parseInt(localStorage.getItem('parentWindowUserId'));
            vanityUrlDomain = localStorage.getItem('vanityUrlDomain');
        } else {
            parentWindowUserId = 0;
        }
        this.route.queryParams.subscribe(
            (param: any) => {
                this.socialService.callback(providerName, parentWindowUserId, this.isLoggedInVanityUrl, param)
                    .subscribe(
                        result => {
                            this.socialConnection = result;
                            if (this.isLoggedInVanityUrl == "true") {
                                localStorage.removeItem('parentWindowUserId');
                                localStorage.removeItem('vanityUrlDomain');
                                localStorage.removeItem('vanityUrlFilter');

                                if (localStorage.getItem('loginPage') == 'true') {
                                    localStorage.removeItem('loginPage');
                                    let trargetWindow = window.opener;
                                    var obj = {
                                        emailId: result["emailId"],
                                        providerName: providerName
                                    }
                                    trargetWindow.postMessage(obj, "*");
                                    let url = "";
                                    if (vanityUrlDomain.indexOf('172') > -1 || vanityUrlDomain.indexOf('192') > -1) {
                                        url = "http://" + vanityUrlDomain + ":4200/login";
                                    } else {
                                        url = "https://" + vanityUrlDomain + "/login";
                                    }
                                    self.close();
                                } else {
                                    localStorage.removeItem('loginPage');
                                    let url = "";
                                    if (vanityUrlDomain.indexOf('192') > -1) {
                                        url = "http://" + vanityUrlDomain + ":4200/home/social/manage/" + this.providerName;
                                    } else {
                                        url = "https://" + vanityUrlDomain + "/home/social/manage/" + this.providerName;
                                    }
                                    this.refService.closeChildWindowAndRefreshParentWindow(url);
                                }

                            } else {
                                if (localStorage.getItem('currentUser')) {
                                    this.redirect();
                                } else {
                                    this.refService.userName = result["emailId"];
                                    if (providerName === "salesforce") {
                                        client_id = "3MVG9ZL0ppGP5UrD8Ne7RAUL7u6QpApHOZv3EY_qRFttg9c1L2GtSyEqiM8yU8tT3kolxyXZ7FOZfp1V_xQ4l";
                                        client_secret = "8542957351694434668";
                                    } else if (providerName === "google") {
                                        client_id = "1026586663522-tv2c457u9h9bj4ikc47u29g321dkjg6m.apps.googleusercontent.com";
                                        client_secret = "yKAddi6F_xkiERVCnWna3bXT";
                                    } else if (providerName === "facebook") {
                                        client_id = "1348853938538956";
                                        client_secret = "69202865ccc82e3cf43a5aa097c4e7bf";
                                    } else if (providerName === "twitter") {
                                        client_id = "J60F2OG6jZOEK33xK3MtiU4zI";
                                        client_secret = "d3xQ5hPlPZtQdeMkNAjlejXFvwRrPSalwbpyApncxi49Pf4lFi";
                                    } else if (providerName === "linkedin") {
                                        client_id = "81ujzv3pcekn3t";
                                        client_secret = "bfdJ4u0j6izlWSyd";
                                    } else if (providerName === "microsoftsso") {
                                        if (this.SERVER_URL == "https://xamp.io/" && this.APP_URL == "https://xamplify.io/") {
                                            console.log("production keys are used");
                                            client_id = this.envService.microsoftProdClientId;
                                            client_secret = this.envService.microsoftProdClientSecret;
                                        } else if (this.SERVER_URL == "https://aravindu.com/" && this.APP_URL == "https://xamplify.co/") {
                                            console.log("QA keys are used");
                                            client_id = this.envService.microsoftQAClientId;
                                            client_secret = this.envService.microsoftQAClientSecret;
                                        } else {
                                            console.log("dev keys are used");
                                            client_id = this.envService.microsoftDevClientId;
                                            client_secret = this.envService.microsoftDevClientSecret;
                                        }
                                    } else if (providerName === "oauthsso") {
                                        client_id = "my-trusted-client";
                                        client_secret = "";
                                    }

                                    const authorization = 'Basic' + btoa(client_id + ':');
                                    const body = 'client_id=' + client_id + '&client_secret=' + client_secret + '&grant_type=client_credentials';

                                    this.authenticationService.login(authorization, body, this.refService.userName)
                                        .subscribe(result => {
                                            console.log("result: " + this.authenticationService.user);
                                            if (this.authenticationService.user) {
                                                const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                                                if (currentUser.hasCompany) {
                                                    this.redirect();
                                                } else {
                                                    this.router.navigate(['/home/dashboard/add-company-profile']);
                                                }
                                            } else {
                                                this.router.navigate(['/logout']);
                                            }
                                        },
                                            error => {                                                
                                                this.error = error;
                                            },
                                            () => console.log('login() Complete'));
                                    return false;

                                }
                            }

                        },
                        error => {
                            this.error = error;
                        },
                        () => console.log('login() Complete'));
            });


        return false;

    }

    redirect() {
        if (!this.socialConnection.existingUser && this.socialConnection.source !== 'GOOGLE') {
            let url = "/home/social/manage/" + this.providerName;
            this.router.navigate([url]);
        }
        else {
            let url = "/home/dashboard/default";
            this.router.navigate([url]);
        }
    }

    ngOnInit() {
        try {
            this.error = null;
            this.providerName = this.route.snapshot.params['social'];
            this.callback(this.providerName);
        }
        catch (error) {
            this.error = error;
        }
    }

    closeWindow() {
        if (this.isLoggedInVanityUrl == "true") {
            this.refService.closeChildWindowOnError();
        } else {
            this.router.navigate(['/']);
        }

    }
}
