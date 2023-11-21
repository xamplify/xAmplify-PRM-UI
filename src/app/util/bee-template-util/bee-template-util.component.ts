import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { SenderMergeTag } from '../../core/models/sender-merge-tag';
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";
import { Router } from '@angular/router';
import { CustomLoginTemplate } from 'app/email-template/models/custom-login-template';

declare var BeePlugin: any, swal:any;

@Component({
	selector: 'app-bee-template-util',
	templateUrl: './bee-template-util.component.html',
	styleUrls: ['./bee-template-util.component.css']
})
export class BeeTemplateUtilComponent implements OnInit {

	loading = false;
	@Input() beeContainerInput: any;
	loggedInUserId: number;
	loggedInUserCompanyId: any;
	@Output() notifyParentComponent = new EventEmitter();
	isPartnerView: boolean;
	senderMergeTag: SenderMergeTag = new SenderMergeTag();
	vendorCompanyLogoPath = "";
	partnerCompanyLogoPath = "";
	defaultJsonBody = "";
	module = "";
	mergeTagsInput: any = {};
	mergeTagsLoader = true;
	id:number = 0;
	/****XBI-1685******/
	videoGif = "xtremand-video.gif";
    coBraningImage = "co-branding.png";
	isCoBrandingTemplate = false;
	isVideoTemplate = false;
	/****XBI-1685******/
	/***********  XNFR-233 *********/
	customLoginTemplate:CustomLoginTemplate = new CustomLoginTemplate()
	/***********  XNFR-233 *********/
	constructor(private referenceService: ReferenceService, private authenticationService: AuthenticationService, private router: Router, private xtremandLogger: XtremandLogger) {
		this.loggedInUserId = this.authenticationService.getUserId();
	}

	ngOnInit() {
		this.loading = true;
		if (this.beeContainerInput != undefined) {
			this.defaultJsonBody = this.beeContainerInput['jsonBody'];
			this.vendorCompanyLogoPath = this.beeContainerInput['vendorCompanyLogoPath'];
			this.partnerCompanyLogoPath = this.beeContainerInput['partnerCompanyLogoPath'];
			this.module = this.beeContainerInput['module'];
			this.id = this.beeContainerInput['id'];
			this.mergeTagsInput['isEvent'] = this.beeContainerInput['isEvent'];
			/****XBI-1685******/
			this.isCoBrandingTemplate = this.beeContainerInput['anyCoBrandingTemplate'];
			this.isVideoTemplate = this.beeContainerInput['isVideoTemplate'];
			/****XBI-1685******/
			this.isPartnerView = this.router.url.indexOf('/editp') > -1;
			this.getCompanyId();
		} else {
			this.goBack();
		}
	}

	getCompanyId() {
		this.referenceService.getCompanyIdByUserId(this.loggedInUserId).subscribe(
			(result: any) => {
				if (result !== "") {
					this.loggedInUserCompanyId = result;
				} else {
					this.loading = false;
					this.referenceService.showSweetAlertErrorMessage('Company Id Not Found');
					this.router.navigate(["/home/dashboard"]);
				}
			}, (error: any) => {
				this.xtremandLogger.log(error);
				this.xtremandLogger.errorPage(error);
			},
			() => {
				if (this.loggedInUserCompanyId != undefined && this.loggedInUserCompanyId > 0) {
					this.mergeTagsLoader = false;
					this.loadContainer();
				}
			}
		);
	}


	loadContainer() {
		let defaultJsonBody = this.defaultJsonBody;
		let self = this;
		if (defaultJsonBody != undefined) {
			var request = function (method: any, url: any, data: any, type: any, callback: any) {
				self.loading = true;
				var req = new XMLHttpRequest();
				req.onreadystatechange = function () {
					if (req.readyState === 4 && req.status === 200) {
						self.loading = false;
						var response = JSON.parse(req.responseText);
						callback(response);
					} else if (req.readyState === 4 && req.status !== 200) {
						self.loading = false;
						self.referenceService.showSweetAlertErrorMessage("Unable to load Bee container.Please try reloading the page/check your internet connection.");
					}
				};
				req.open(method, url, true);
				if (data && type) {
					if (type === 'multipart/form-data') {
						var formData = new FormData();
						for (var key in data) {
							formData.append(key, data[key]);
						}
						data = formData;
					}
					else {
						req.setRequestHeader('Content-type', type);
					}
				}
				req.send(data);
			};

			var save = function (jsonContent: string, htmlContent: string) {
				if(self.module=="dam"){
					self.saveContentForDam(jsonContent, htmlContent);
				}else if(self.module=="emailTemplates" || self.module=="pages"){
					/****XBI-1685******/
					if(self.module=="emailTemplates"){
						if (self.isVideoTemplate) {
							if (jsonContent.indexOf(self.videoGif) < 0) {
								swal("", "Whoops! We're unable to save this template because you deleted the default gif. You'll need to select a new email template and start over.", "error");
								self.loading = false;
								return false;
							}
						}
						if (self.isCoBrandingTemplate) {
							if (jsonContent.indexOf(self.coBraningImage) < 0) {
								swal("", "Whoops! We're unable to save this template because you deleted the co-branding logo. You'll need to select a new email template and start over.", "error");
								self.loading = false;
								return false;
							}
						}
					}
					/****XBI-1685******/
					self.updateJsonAndHtmlContentAndSendDataBack(jsonContent,htmlContent);
				} else if(self.module == "configuration") {
					self.customLoginTemplate = self.beeContainerInput["customLognTemplate"];
                    self.saveOrUpdateCustomLoginTemplate(jsonContent, htmlContent)
					this.loading = false;
				}
			};



			let mergeTags = [];
			if(this.module=="pages"){
				mergeTags = this.referenceService.addPageMergeTags();
			}else{
				mergeTags = this.referenceService.addMergeTags(mergeTags, false, this.mergeTagsInput['isEvent']);
			}
			var beeUserId = "bee-" + self.loggedInUserCompanyId;
			let roleHash = self.authenticationService.vendorRoleHash;
			if (self.isPartnerView) {
				roleHash = self.authenticationService.partnerRoleHash;
			}
			var beeConfig = {
				uid: beeUserId,
				container: 'xamplify-bee-template-container',
				autosave: 15,
				language: this.authenticationService.beeLanguageCode,
				mergeTags: mergeTags,
				preventClose: true,
				roleHash: roleHash,
				onSave: function (jsonFile, htmlFile) {
					self.loading = true;
					save(jsonFile, htmlFile);
				},
				onSaveAsTemplate: function (jsonFile) { // + thumbnail?
					//save('newsletter-template.json', jsonFile);
				},
				onAutoSave: function (jsonFile) { // + thumbnail?
					console.log(new Date().toISOString() + ' autosaving...');
					window.localStorage.setItem('newsletter.autosave', jsonFile);

				},
				onSend: function (htmlFile) {
					//write your send test function here
					console.log(htmlFile);
				},
				onError: function (errorMessage) {
					self.referenceService.showSweetAlertErrorMessage(errorMessage);
				}
			};

			var bee = null;
			request(
				'POST',
				'https://auth.getbee.io/apiauth',
				'grant_type=password&client_id=' + this.authenticationService.clientId + '&client_secret=' + this.authenticationService.clientSecret + '',
				'application/x-www-form-urlencoded',
				function (token: any) {
					BeePlugin.create(token, beeConfig, function (beePluginInstance: any) {
						bee = beePluginInstance;
						request(
							self.authenticationService.beeRequestType,
                            self.authenticationService.beeHostApi,
							null,
							null,
							function (template: any) {
								if (defaultJsonBody != undefined) {
									var body = self.replaceImagesForDam(defaultJsonBody);
									defaultJsonBody = body;
									var jsonBody = JSON.parse(body);
									bee.load(jsonBody);
									bee.start(jsonBody);
								} else {
									this.referenceService.showSweetAlert("", "Unable to load the template", "error");
									self.loading = false;
								}
							});
					});
				});
		} else {
			this.goBack();
		}
	}

	goBack() {
		this.loading = false;
		this.referenceService.showSweetAlertErrorMessage("Input data not found for loading container.Please try aftersometime");
		//this.referenceService.goToRouter("/home/dashboard");
	}

	replaceImagesForDam(body: any) {
		if (this.isPartnerView) {
			body = body.replace("https://xamp.io/vod/replace-company-logo.png", this.vendorCompanyLogoPath);
			body = body.replace("https://xamp.io/vod/images/co-branding.png", this.partnerCompanyLogoPath);
		} else {
			body = body.replace("https://xamp.io/vod/replace-company-logo.png", this.authenticationService.MEDIA_URL + this.referenceService.companyProfileImage);
		}
		return body;
	}

    saveOrUpdateCustomLoginTemplate(jsonContent: string, htmlContent: string){
		let input = {};
		let updatedJsonContent = jsonContent.replace(this.authenticationService.MEDIA_URL + this.referenceService.companyProfileImage, "https://xamp.io/vod/replace-company-logo.png");
		let updatedHtmlContent = htmlContent.replace(this.authenticationService.MEDIA_URL + this.referenceService.companyProfileImage, "https://xamp.io/vod/replace-company-logo.png");
		input['jsonContent'] = updatedJsonContent;
		input['htmlContent'] = updatedHtmlContent;
		this.notifyParentComponent.emit(input);
		this.loading = false;
	}
	saveContentForDam(jsonContent: string, htmlContent: string) {
		let input = {};
		if (this.isPartnerView) {
			let updatedJsonContent = jsonContent.replace(this.vendorCompanyLogoPath, "https://xamp.io/vod/replace-company-logo.png").replace(this.partnerCompanyLogoPath, "https://xamp.io/vod/images/co-branding.png");
			let updatedHtmlContent = "";
			if (htmlContent != undefined) {
				updatedHtmlContent = htmlContent.replace(this.vendorCompanyLogoPath, "https://xamp.io/vod/replace-company-logo.png").replace(this.partnerCompanyLogoPath, "https://xamp.io/vod/images/co-branding.png");
			}
			input['jsonContent'] = updatedJsonContent;
			input['htmlContent'] = updatedHtmlContent;
		} else {
			this.updateJsonAndHtmlContent(jsonContent, htmlContent, input);
		}
		this.notifyParentComponent.emit(input);
		this.loading = false;

	}

	updateJsonAndHtmlContent(jsonContent: string, htmlContent: string, input: any) {
		let updatedJsonContent = jsonContent.replace(this.authenticationService.MEDIA_URL + this.referenceService.companyProfileImage, "https://xamp.io/vod/replace-company-logo.png");
		let updatedHtmlContent = "";
		if (htmlContent != undefined) {
			updatedHtmlContent = htmlContent.replace(this.authenticationService.MEDIA_URL + this.referenceService.companyProfileImage, "https://xamp.io/vod/replace-company-logo.png");
		}
		input['jsonContent'] = updatedJsonContent;
		input['htmlContent'] = updatedHtmlContent;
	}

	updateJsonAndHtmlContentAndSendDataBack(jsonContent: string, htmlContent: string){
		let input = {};
		this.updateJsonAndHtmlContent(jsonContent, htmlContent,input);
		input['id'] = this.id;
		input['module'] = this.module;
		this.notifyParentComponent.emit(input);
		this.loading = false;
	}


}
