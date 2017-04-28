import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { EmailTemplateService } from '../services/email-template.service';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user';
import {EmailTemplate} from '../models/email-template';
import { Logger } from 'angular2-logger/core';

declare var BeePlugin,swal,Promise:any;

@Component({
  selector: 'app-create-template',
  templateUrl: './create-template.component.html',
  styleUrls: ['./create-template.component.css'],
  providers :[EmailTemplate]
})
export class CreateTemplateComponent implements OnInit {
	constructor(private emailTemplateService:EmailTemplateService, private userService:UserService,
	private emailTemplate:EmailTemplate,private router:Router, private logger :Logger) {
		
		this.logger.log(emailTemplateService.emailTemplate);
	    var names:any = [];
	    emailTemplateService.getAvailableNames(this.userService.loggedInUserData.id) .subscribe(
	            (data:any) => {
	               names = data;
	            },
	            error => console.log( error ),
	            () => console.log( "Got List Of Available Email Template Names")
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

	      var title = "Please Give Template Name";
	      var templateName = "";
	      var isDefaultTemplate = emailTemplateService.emailTemplate.defaultTemplate;
	      if(!isDefaultTemplate){
	          templateName = emailTemplateService.emailTemplate.name;
	          title = "Please Update Template Name";
	      }
	      
	      
	      var save = function(jsonContent:string, htmlContent:string) {
	          if(emailTemplateService.emailTemplate.beeVideoTemplate){
	              if(jsonContent.indexOf("xtremandVideoFile.gif")<0){
	                 swal("Please Add Default .gif ","","error");
	                 return false;
	              }
	          }
	          
	          swal({
	              title: title,
	              input: 'text',
	              inputValue:templateName,
	              inputAutoTrim:true,
	              showCancelButton: true,
	              confirmButtonText: 'Submit',
	              showLoaderOnConfirm: true,
	              preConfirm: function (text:string) {
	                return new Promise(function (resolve, reject) {
	                    if(text==""){
	                        reject('Please Enter Name');
	                        return false;
	                    }
	                    if(!(emailTemplateService.emailTemplate.defaultTemplate)){
	                        if(names.indexOf(text.toLowerCase())>-1 && emailTemplateService.emailTemplate.name.toLowerCase()!=text.toLowerCase()){
	                            reject('This name is already taken.')
	                        }else{
	                            resolve();
	                        }
	                    }else{
	                        if(names.indexOf(text.toLocaleLowerCase())>-1){
	                            reject('This name is already taken.')
	                        }else{
	                            resolve()
	                        }
	                    }
	                    
	                    
	                })
	              },
	              allowOutsideClick: false
	            }).then(function (text:string) {
	              emailTemplate = new EmailTemplate();
	              emailTemplate.body = htmlContent;
	              emailTemplate.name = text;
	              emailTemplate.jsonBody = jsonContent;
	              if(!(emailTemplateService.emailTemplate.defaultTemplate)){
	                  emailTemplate.id = emailTemplateService.emailTemplate.id;
	                  emailTemplateService.update(emailTemplate) .subscribe(
	                          data => {
	                              
	                              swal({
	                                  title: 'Template Updated Successfully',
	                                  type: 'success',
	                                  confirmButtonColor: '#3085d6',
	                                  allowOutsideClick: false,
	                                }).then(function () {
	                                    router.navigate(["/home/emailtemplate/manageTemplates"]);
	                                })
	                              
	                          },
	                          error => console.log( error ),
	                          () => console.log( "Email Template Updated" )
	                          );
	                 
	              }else{
	                  emailTemplate.user = new User();
	                  emailTemplate.user.userId = userService.loggedInUserData.id;
	                  emailTemplate.userDefined = true;
	                  emailTemplate.beeRegularTemplate = emailTemplateService.emailTemplate.beeRegularTemplate;
	                  emailTemplate.beeVideoTemplate = emailTemplateService.emailTemplate.beeVideoTemplate;
	                  emailTemplate.desc = emailTemplateService.emailTemplate.name;//Type Of Email Template
	                  emailTemplate.subject = emailTemplateService.emailTemplate.body;//Image Path
	                  emailTemplateService.save(emailTemplate) .subscribe(
	                          data => {
	                              
	                              swal({
	                                  title: 'Template Saved Successfully',
	                                  type: 'success',
	                                  confirmButtonColor: '#3085d6',
	                                  allowOutsideClick: false,
	                                }).then(function () {
	                                    router.navigate(["/home/emailtemplate/manageTemplates"]);
	                                })
	                              
	                              //swal("Email Template Saved Successfully", "", "success")
	                          },
	                          error => console.log( error ),
	                          () => console.log( "Email Template Saved" )
	                          );
	              }
	              
	              
	            })
	      };

	      var specialLinks = [{
	          type: 'unsubscribe',
	          label: 'SpecialLink.Unsubscribe',
	          link: 'http://[unsubscribe]/'
	      }, {
	          type: 'subscribe',
	          label: 'SpecialLink.Subscribe',
	          link: 'http://[subscribe]/'
	      }];

	      var mergeTags = [{
	        name: 'tag 1',
	        value: '[tag1]'
	      }, {
	        name: 'tag 2',
	        value: '[tag2]'
	      }];

	      var mergeContents = [{
	        name: 'content 1',
	        value: '[content1]'
	      }, {
	        name: 'content 2',
	        value: '[content1]'
	      }];

	      var beeConfig = {  
	        uid: 'test1-clientside',
	        container: 'bee-plugin-container',
	        autosave: 15, 
	        language: 'en-US',
	        specialLinks: specialLinks,
	        mergeTags: mergeTags,
	        mergeContents: mergeContents,
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
    	}

  ngOnInit() {
  }

}
