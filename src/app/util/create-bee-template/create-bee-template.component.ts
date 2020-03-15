import { Component, OnInit,Input,Output } from '@angular/core';
import { EmailTemplateService } from 'app/email-template/services/email-template.service';
import { User } from 'app/core/models/user';
import { EmailTemplate} from '../../email-template/models/email-template';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { SenderMergeTag } from '../../core/models/sender-merge-tag';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { CustomResponse } from '../../common/models/custom-response';

declare var BeePlugin,swal,$:any;

@Component({
  selector: 'app-create-bee-template',
  templateUrl: './create-bee-template.component.html',
  styleUrls: ['./create-bee-template.component.css'],
  providers :[EmailTemplate,HttpRequestLoader]

})
export class CreateBeeTemplateComponent implements OnInit {
    partnerTemplateLoader: boolean;
    loggedInUserId:number = 0;
    @Input() partnerEmailTemplate:EmailTemplate;
    customResponse: CustomResponse = new CustomResponse();
    loading = false;
  ngOnInit() {
    this.editPartnerTemplate()
    
  }
  constructor(private authenticationService:AuthenticationService,private referenceService:ReferenceService,private emailTemplateService:EmailTemplateService){
      this.loggedInUserId = this.authenticationService.getUserId();
}

editPartnerTemplate() {
	let emailTemplate = this.partnerEmailTemplate;
  if(emailTemplate.jsonBody!=undefined){
        var request = function (method, url, data, type, callback) {
            var req = new XMLHttpRequest();
            req.onreadystatechange = function () {
              if (req.readyState === 4 && req.status === 200) {
                var response = JSON.parse(req.responseText);
                callback(response);
              } else if (req.readyState === 4 && req.status !== 200) {
                console.error('Access denied, invalid credentials. Please check you entered a valid client_id and client_secret.');
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

          let self = this;
          var save = function (jsonContent: string, htmlContent: string) {
            self.partnerTemplateLoader = true;
            emailTemplate.jsonBody = jsonContent;
            emailTemplate.body = htmlContent;
            emailTemplate.user = new User();
            emailTemplate.user.userId = self.loggedInUserId;
            self.updatePartnerTemplate(emailTemplate);
          };


          var beeUserId = "bee-370";
          var beeConfig = {
              uid: beeUserId,
              container: 'partner-template-bee-container',
              autosave: 15,
              language: 'en-US',
              onSave: function( jsonFile, htmlFile ) {
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
                              if(emailTemplate!=undefined){
                                var body = emailTemplate.jsonBody;
                                emailTemplate.jsonBody = body;
                                var jsonBody = JSON.parse( body );
                                bee.load( jsonBody );
                                bee.start( jsonBody );
                              }else{
                                alert("Unable to load the template");
                              }
                          } );
                  } );
              } );
}else{
	this.referenceService.showSweetAlert( "", "This template cannot be edited.", "error" )
}



}


updatePartnerTemplate(emailTemplate:EmailTemplate){
  this.customResponse = new CustomResponse();
  this.loading = true;
    this.emailTemplateService.updatePartnerTemplate(emailTemplate).
    subscribe(
        data => {
            this.loading = false;
            this.customResponse = new CustomResponse('SUCCESS','Template updated successfully',true);
        },
        error => {
            this.loading = false;
            this.referenceService.showSweetAlertErrorMessage(error);
            },
        () => console.log( "Email Template Updated" )
        );
}

}
