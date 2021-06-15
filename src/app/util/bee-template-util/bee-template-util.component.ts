import { Component, OnInit,Input,EventEmitter,Output } from '@angular/core';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { SenderMergeTag } from '../../core/models/sender-merge-tag';
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";
import { Router } from '@angular/router';

declare var BeePlugin,swal,$:any;

@Component({
	selector: 'app-bee-template-util',
	templateUrl: './bee-template-util.component.html',
	styleUrls: ['./bee-template-util.component.css']
})
export class BeeTemplateUtilComponent implements OnInit {

	loading = false;
	@Input() defaultJsonBody: any;
	@Input() vendorCompanyLogoPath:any;
	@Input() partnerCompanyLogoPath:any;
	loggedInUserId: number;
	loggedInUserCompanyId: any;
	@Output() notifyParentComponent = new EventEmitter();
	isPartnerView: boolean;
	senderMergeTag:SenderMergeTag = new SenderMergeTag();

	constructor(private referenceService:ReferenceService,private authenticationService:AuthenticationService,private router:Router,private xtremandLogger:XtremandLogger) {
		this.loggedInUserId = this.authenticationService.getUserId();
	 }

	ngOnInit() {
		this.loading =  true;
		this.isPartnerView = this.router.url.indexOf('/editp')>-1;
		this.getCompanyId();
	}

	getCompanyId() {
		this.referenceService.getCompanyIdByUserId(this.loggedInUserId).subscribe(
		  (result: any) => {
			if (result !== "") { 
			  this.loggedInUserCompanyId = result;
			}else{
			  this.loading = false;
			  this.referenceService.showSweetAlertErrorMessage('Company Id Not Found');
			  this.router.navigate(["/home/dashboard"]);
			}
		  }, (error: any) => {
			 this.xtremandLogger.log(error);
			 this.xtremandLogger.errorPage(error);
			 },
		  () => {
			if(this.loggedInUserCompanyId!=undefined && this.loggedInUserCompanyId>0){
				this.loading = false;
				this.loadContainer();
			}
		  }
		);
	  }
	
	
	loadContainer(){
		let defaultJsonBody =this.defaultJsonBody;
		let self = this;
		if(defaultJsonBody!=undefined){
			var request = function (method, url, data, type, callback) {
				var req = new XMLHttpRequest();
				req.onreadystatechange = function () {
				  if (req.readyState === 4 && req.status === 200) {
					var response = JSON.parse(req.responseText);
					callback(response);
				  } else if (req.readyState === 4 && req.status !== 200) {
					console.error('Access denied, invalid credentials. Please check you entered a valid client_id and client_secret.');
					self.referenceService.showSweetAlertErrorMessage("Please check your internet connection");
					self.referenceService.goToRouter("/home/dam");
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
				let input = {};
				if(self.isPartnerView){
					let updatedJsonContent = jsonContent.replace(self.vendorCompanyLogoPath, "https://xamp.io/vod/replace-company-logo.png").replace(self.partnerCompanyLogoPath,"https://xamp.io/vod/images/co-branding.png");
					let updatedHtmlContent = "";
					if (htmlContent!= undefined) {
						updatedHtmlContent = htmlContent.replace(self.vendorCompanyLogoPath, "https://xamp.io/vod/replace-company-logo.png").replace(self.partnerCompanyLogoPath,"https://xamp.io/vod/images/co-branding.png");
					}
					input['jsonContent'] = updatedJsonContent;
					input['htmlContent'] = updatedHtmlContent;
				}else{
					let updatedJsonContent = jsonContent.replace(self.authenticationService.MEDIA_URL + self.referenceService.companyProfileImage, "https://xamp.io/vod/replace-company-logo.png");
					let updatedHtmlContent = "";
					if (htmlContent!= undefined) {
						updatedHtmlContent = htmlContent.replace(self.authenticationService.MEDIA_URL + self.referenceService.companyProfileImage, "https://xamp.io/vod/replace-company-logo.png");
					}
					input['jsonContent'] = updatedJsonContent;
					input['htmlContent'] = updatedHtmlContent;
				}
				self.notifyParentComponent.emit(input);
				self.loading = false;
			  };
		
			  var mergeTags = [
				{ name: 'First Name', value: '{{firstName}}' },
				{ name: 'Last Name', value: '{{lastName}}' },
				{ name: 'Full Name', value: '{{fullName}}' },
				{ name: 'Email Id', value: '{{emailId}}' },
				{name: 'Company Name', value: '{{companyName}}' }
				];
				mergeTags.push( { name: 'Sender First Name', value: this.senderMergeTag.senderFirstName } );
				mergeTags.push( { name: 'Sender Last Name', value: this.senderMergeTag.senderLastName } );
				mergeTags.push( { name: 'Sender Full Name', value: this.senderMergeTag.senderFullName } );
				mergeTags.push( { name: 'Sender Title', value: this.senderMergeTag.senderTitle } );
				mergeTags.push( { name: 'Sender Email Id',  value: this.senderMergeTag.senderEmailId } );
				mergeTags.push( { name: 'Sender Contact Number',value: this.senderMergeTag.senderContactNumber } );
				mergeTags.push( { name: 'Sender Company', value: this.senderMergeTag.senderCompany } );
				mergeTags.push( { name: 'Sender Company Url', value: this.senderMergeTag.senderCompanyUrl} );
				mergeTags.push( { name: 'Sender Company Contact Number', value: this.senderMergeTag.senderCompanyContactNumber } );
				mergeTags.push( { name: 'Sender About Us (Partner)', value: this.senderMergeTag.aboutUs } );
				mergeTags.push({ name: 'Sender Privacy Policy', value: this.senderMergeTag.privacyPolicy });
		        mergeTags.push({ name: 'Unsubscribe Link', value: this.senderMergeTag.unsubscribeLink });
		
			  var beeUserId = "bee-"+self.loggedInUserCompanyId;
			  let roleHash = self.authenticationService.vendorRoleHash;
			  if(self.isPartnerView){
				roleHash = self.authenticationService.partnerRoleHash;
			  }	
			  var beeConfig = {
				  uid: beeUserId,
				  container: 'xamplify-bee-template-container',
				  autosave: 15,
				  //language: 'en-US',
				  language:this.authenticationService.beeLanguageCode,
				  mergeTags: mergeTags,
				  preventClose: true,
				  roleHash: roleHash,
				  onSave: function( jsonFile, htmlFile ) {
					  self.loading = true;
					  save( jsonFile, htmlFile );
				  },
				  onSaveAsTemplate: function( jsonFile ) { // + thumbnail?
					  //save('newsletter-template.json', jsonFile);
				  },
				  onAutoSave: function( jsonFile ) { // + thumbnail?
					  console.log( new Date().toISOString() + ' autosaving...' );
					  window.localStorage.setItem( 'newsletter.autosave', jsonFile );
					  
				  },
				  onSend: function( htmlFile ) {
					  //write your send test function here
					  console.log( htmlFile );
				  },
				  onError: function( errorMessage ) {
				  }
			  };
		
			  var bee = null;
			  request(
				  'POST',
				  'https://auth.getbee.io/apiauth',
				  'grant_type=password&client_id=' + this.authenticationService.clientId + '&client_secret=' + this.authenticationService.clientSecret + '',
				  'application/x-www-form-urlencoded',
				  function( token: any ) {
					  BeePlugin.create( token, beeConfig, function( beePluginInstance: any ) {
						  bee = beePluginInstance;
						  request(
							  'GET',
							  'https://rsrc.getbee.io/api/templates/m-bee',
							  null,
							  null,
							  function( template: any ) {
								  if(defaultJsonBody!=undefined){
									var body = defaultJsonBody;
									if(self.isPartnerView){
										body = body.replace( "https://xamp.io/vod/replace-company-logo.png", self.vendorCompanyLogoPath);
										body = body.replace( "https://xamp.io/vod/images/co-branding.png", self.partnerCompanyLogoPath );
									}else{
										body = body.replace( "https://xamp.io/vod/replace-company-logo.png", self.authenticationService.MEDIA_URL + self.referenceService.companyProfileImage );
									}
									defaultJsonBody = body;
									var jsonBody = JSON.parse( body );
									bee.load( jsonBody );
									bee.start( jsonBody );
								  }else{
									this.referenceService.showSweetAlert( "", "Unable to load the template", "error" );
									self.loading = false;
								  }
							  } );
					  } );
				  } );
			
		}else{
			this.loading =false;
			this.referenceService.showSweetAlertErrorMessage("Input data not found for loading container.Please try aftersometime");
			this.referenceService.goToRouter("/home/dashboard");
		}
	}
	

	
	

}
