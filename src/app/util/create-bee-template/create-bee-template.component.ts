import { Component, OnInit,Input,Output } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { EmailTemplateService } from 'app/email-template/services/email-template.service';
import { User } from 'app/core/models/user';
import { EmailTemplate} from '../../email-template/models/email-template';
import { EmailTemplateType } from '../../email-template/models/email-template-type';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { SenderMergeTag } from '../../core/models/sender-merge-tag';
import { HttpRequestLoader } from '../../core/models/http-request-loader';

declare var BeePlugin,swal,$:any;

@Component({
  selector: 'app-create-bee-template',
  templateUrl: './create-bee-template.component.html',
  styleUrls: ['./create-bee-template.component.css'],
  providers :[EmailTemplate,HttpRequestLoader]

})
export class CreateBeeTemplateComponent implements OnInit {
  

  ngOnInit() {
    
  }
  constructor(private authenticationService:AuthenticationService){
  }

  sendEmailTemplate(emailTemplate: EmailTemplate) {
	
    console.log(emailTemplate);
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
  
    var save = function (filename, content) {
     alert("sav");
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
  
    function userInput(message, sample) {
      return function handler(resolve, reject) {
        var data = prompt(message, JSON.stringify(sample))
        return (data == null || data == '')
          ? reject()
          : resolve(JSON.parse(data))
      }
    }
  
    var beeConfig = {
      uid: 'bee-245',
      container: 'bee-plugin-container',
      autosave: 15,
      language: 'en-US',
      trackChanges: true,
      specialLinks: specialLinks,
      mergeTags: mergeTags,
      mergeContents: mergeContents,
      contentDialog: {
        specialLinks: {
          label: 'Add a custom Special Link',
          handler: userInput('Enter the deep link:', {
            type: 'custom',
            label: 'external special link',
            link: 'http://www.example.com'
          })
        },
        mergeTags: {
          label: 'Add custom tag 2',
          handler: userInput('Enter the merge tag:', {
            name: 'name',
            value: '[name]'
          })
        },
        mergeContents: {
          label: 'Choose a custom merge content',
          handler: userInput('Enter the merge content:', {
            name: 'my custom content',
            value: '{my-custom-content}'
          })
        },
        rowDisplayConditions: {
          label: 'Open builder',
          handler: userInput('Enter the row display condition:', {
            type: 'People',
            label: 'Person is a developer',
            description: 'Check if a person is a developer',
            before: "{if job == 'developer'}",
            after: '{endif}'
          })
        },
      },
      onChange: function (jsonFile, response) {
        console.log('json', jsonFile);
        console.log('response', response);
      },
      onSave: function (jsonFile, htmlFile) {
        save('newsletter.html', htmlFile);
      },
      onSaveAsTemplate: function (jsonFile) { // + thumbnail? 
        save('newsletter-template.json', jsonFile);
      },
      onAutoSave: function (jsonFile) { // + thumbnail? 
        console.log(new Date().toISOString() + ' autosaving...');
        window.localStorage.setItem('newsletter.autosave', jsonFile);
      },
      onSend: function (htmlFile) {
        //write your send test function here
      },
      onError: function (errorMessage) {
        console.log('onError ', errorMessage);
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
                      bee.start( template );
                    } );
            } );
        } );

}
}


