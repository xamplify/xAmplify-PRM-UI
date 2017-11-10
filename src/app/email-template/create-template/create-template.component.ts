import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmailTemplateService } from '../services/email-template.service';
import { User } from '../../core/models/user';
import {EmailTemplate} from '../models/email-template';
import { Logger } from 'angular2-logger/core';
import { EmailTemplateType } from '../../email-template/models/email-template-type';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
declare var BeePlugin,swal,$,Promise:any;

@Component({
  selector: 'app-create-template',
  templateUrl: './create-template.component.html',
  styleUrls: ['./create-template.component.css'],
  providers :[EmailTemplate]
})
export class CreateTemplateComponent implements OnInit {
	
    isLoading:boolean = false;
    constructor(private emailTemplateService:EmailTemplateService,
                private emailTemplate:EmailTemplate,private router:Router, private logger :XtremandLogger,
                private authenticationService:AuthenticationService,private refService:ReferenceService) {
		console.log(emailTemplateService.emailTemplate);
		let loggedInUserId = this.authenticationService.getUserId();
	    var names:any = [];
		let self = this;
        emailTemplateService.getAvailableNames(loggedInUserId).subscribe(
            ( data: any ) => {
	              names = data;
            },
            error => {
                this.logger.error("error in getAvailableNames("+loggedInUserId+")", error);
            },
            () =>  this.logger.info("Finished getAvailableNames()")
        );
	    
	    
	    var request = function(method, url, data, type, callback) {
	        var req = new XMLHttpRequest();
	        req.onreadystatechange = function() {
	          if (req.readyState === 4 && req.status === 200) {
	            var response = JSON.parse(req.responseText);
	            callback(response);
	          }
	        };

	        req.open(method, url, true);
	        if (data && type) {
	          if(type === 'multipart/form-data') {
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

	      var title = "Add Template Name";
	      var templateName = "";
	      if(emailTemplateService.emailTemplate!=undefined){
	          var isDefaultTemplate = emailTemplateService.emailTemplate.defaultTemplate;
	          if(!isDefaultTemplate){
	              templateName = emailTemplateService.emailTemplate.name;
	              title = "Update Template Name";
	          }
	      }else{
	          this.router.navigate(["/home/emailtemplates/select"]);
	      }
	      
	      var save = function(jsonContent:string, htmlContent:string) {
	          emailTemplate = new EmailTemplate();
              emailTemplate.body = htmlContent;
              emailTemplate.jsonBody = jsonContent;
	          if(emailTemplateService.emailTemplate.beeVideoTemplate){
	              if(jsonContent.indexOf("xtremand-video.gif")<0){
	                 swal("Please Add Default .gif ","","error");
	                 return false;
	              }
	          }
	          if(!isDefaultTemplate){
	              var buttons = $('<div>')
                  .append(' <div class="form-group"><input class="form-control" type="text" value="'+templateName+'" id="templateNameId" maxLength="200"><span class="help-block" id="templateNameSpanError" style="color:#a94442"></span></div><br>')
	              .append(createButton('Save As', function() {
	                 saveTemplate();
	              })).append(createButton('Update', function() {
	                 console.log('Update'); 
	                 self.isLoading  = true;
	                 swal.close();
	                 emailTemplate.name = $.trim($('#templateNameId').val());
	                 emailTemplate.id = emailTemplateService.emailTemplate.id;
                     emailTemplateService.update(emailTemplate) .subscribe(
                             data => {
                                 self.isLoading = false;
                                 refService.isUpdated = true;
                                 router.navigate(["/home/emailtemplates/manage"]);
                                 
                             },
                             error => {
                                 self.isLoading = false;
                                 self.logger.errorPage(error)
                                 },
                             () => console.log( "Email Template Updated" )
                             );
	              })).append(createButton('Cancel', function() {
	                 swal.close();
	                 console.log('Cancel');
	              }));
	              swal({
	                title: title,
	                html: buttons,
	                showConfirmButton: false,
	                showCancelButton: false
	              });
	          }else{
	              var buttons = $('<div>')
	              .append(' <div class="form-group"><input class="form-control" type="text" value="'+templateName+'" id="templateNameId" maxLength="200"><span class="help-block" id="templateNameSpanError" style="color:#a94442"></span></div><br>')
	              .append(createButton('Save', function() {
	                  saveTemplate();
	              })).append(createButton('Cancel', function() {
	                 swal.close();
	                 console.log('Cancel');
	              }));
	              swal({
	                title: title,
	                html: buttons,
	                showConfirmButton: false,
	                showCancelButton: false
	              });
	          }
	          $('#templateNameId').on('input',function(event){
	             let value = $.trim(event.target.value);
	              if(value.length>0){
	                  console.log(names);
	                  if(!(emailTemplateService.emailTemplate.defaultTemplate)){
                          if(names.indexOf(value.toLocaleLowerCase())>-1 && emailTemplateService.emailTemplate.name.toLowerCase()!=value.toLowerCase()){
                              $('#save,#update,#save-as').attr('disabled','disabled');
                              $('#templateNameSpanError').text('Duplicate Name');
                          }else if(value.toLocaleLowerCase()==emailTemplateService.emailTemplate.name.toLocaleLowerCase()){
                              $('#save,#save-as').attr('disabled','disabled');
                          }
                          else{
                              $('#templateNameSpanError').empty();
                              $('#save,#update,#save-as').removeAttr('disabled');
                          }
                      }else{
                          if(names.indexOf(value.toLocaleLowerCase())>-1){
                              $('#save,#update,#save-as').attr('disabled','disabled');
                              $('#templateNameSpanError').text('Duplicate Name');
                              console.log(value);
                          }else{
                              $('#templateNameSpanError').empty();
                              $('#save,#update,#save-as').removeAttr('disabled');
                          }
                      }
	                 
	               }else{
	                   $('#save,#update,#save-as').attr('disabled','disabled');
	               }
	          });
	          
	          
	      };//End Of Save Method
	    
	      function saveTemplate(){
              self.isLoading = true;
              swal.close();
	          emailTemplate.user = new User();
              emailTemplate.user.userId = loggedInUserId;
              emailTemplate.userDefined = true;
              emailTemplate.name = $.trim($('#templateNameId').val());
              emailTemplate.beeRegularTemplate = emailTemplateService.emailTemplate.beeRegularTemplate;
              emailTemplate.beeVideoTemplate = emailTemplateService.emailTemplate.beeVideoTemplate;
              emailTemplate.desc = emailTemplateService.emailTemplate.name;//Type Of Email Template
              emailTemplate.subject = emailTemplateService.emailTemplate.subject;//Image Path
              if(emailTemplateService.emailTemplate.subject.indexOf('basic')>-1){
                  emailTemplate.type = EmailTemplateType.BASIC;
              }else if(emailTemplateService.emailTemplate.subject.indexOf('rich')>-1){
                  emailTemplate.type = EmailTemplateType.RICH;
              }else if(emailTemplateService.emailTemplate.subject.indexOf('Upload')>-1){
                  emailTemplate.type = EmailTemplateType.UPLOADED;
              }
              console.log(emailTemplate.name);
              emailTemplateService.save(emailTemplate) .subscribe(
                      data => {
                          self.isLoading = false;
                          refService.isCreated = true;
                          router.navigate(["/home/emailtemplates/manage"]);
                      },
                      error => {
                          self.isLoading = false;
                          self.logger.errorPage(error)
                          },
                      () => console.log( "Email Template Saved" )
                      );
             
	      }
	      
	      function createButton(text, cb) {
	          if(text=="Save"){
	              return $('<input type="submit" class="btn btn-primary" value="'+text+'" id="save" disabled="disabled">').on('click', cb);
	          }else if(text=="Save As"){
	              return $('<input type="submit" class="btn btn-primary" value="'+text+'" id="save-as" disabled="disabled">').on('click', cb);
	          }else if(text=="Update"){
	              return $('<input type="submit" class="btn btn-primary" value="'+text+'" id="update">').on('click', cb);
	          }
	          else{
	              return $('<input type="submit" class="btn btn-primary" value="'+text+'">').on('click', cb);
	          }
	      }

          var mergeTags = [{
              name: 'First Name',
              value: '{{firstName}}'
	         }, {
                  name: 'Last Name',
                  value: '{{lastName}}'
	         },{
                 name: 'Full Name',
                 value: '{{fullName}}'
	         }
	         ,{
                 name: 'Email Id',
                 value: '{{emailId}}'
             }
	         ,{
                 name: 'Company Name',
                 value: '{{companyName}}'
             }];
	      var beeUserId = "bee-"+loggedInUserId;
	      var beeConfig = {  
	        uid: beeUserId,
	        container: 'bee-plugin-container',
	        autosave: 15, 
	        language: 'en-US',
	        mergeTags: mergeTags,
	        onSave: function(jsonFile, htmlFile) { 
	            save(jsonFile, htmlFile);
	        },
	        onSaveAsTemplate: function(jsonFile) { // + thumbnail? 
	          //save('newsletter-template.json', jsonFile);
	        },
	        onAutoSave: function(jsonFile) { // + thumbnail? 
	          console.log(new Date().toISOString() + ' autosaving...');
	          window.localStorage.setItem('newsletter.autosave', jsonFile);
	        },
	        onSend: function(htmlFile) {
	          //write your send test function here
	          console.log(htmlFile);
	        },
	        onError: function(errorMessage) { 
	          console.log('onError ', errorMessage);
	        }
	      };

	      var bee = null;
	      request(
	        'POST', 
	        'https://auth.getbee.io/apiauth',
	        'grant_type=password&client_id=6639d69f-523f-44ca-b809-a00daa26b367&client_secret=XnD77klwAeUFvYS66CbHMd107DMS441Etg9cCOVc63LTYko8NHa',
	        'application/x-www-form-urlencoded',
	        function(token:any) {
	          BeePlugin.create(token, beeConfig, function(beePluginInstance:any) {
	            bee = beePluginInstance;
	            request(
	              'GET', 
	              'https://rsrc.getbee.io/api/templates/m-bee',
	              null,
	              null,
	              function(template:any) {
	                  console.log("Template is ready");
	                  console.log(emailTemplateService.emailTemplate);
	                  if(emailTemplateService.emailTemplate!=undefined){
	                      var body = emailTemplateService.emailTemplate.jsonBody;
	                      var jsonBody = JSON.parse(body);
	                      bee.load(jsonBody);
	                      console.log("Template Loaded");
	                      bee.start(jsonBody);
	                      console.log("Template Started");
	                  }else{
	                      bee.start(template);
	                  }
	               
	              });
	          });
	        });
	      
    	}//End Of Constructor

  ngOnInit() {
  }

}
