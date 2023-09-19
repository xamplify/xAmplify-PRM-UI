import { Component, OnInit,Input,Output } from '@angular/core';
import { EmailTemplateService } from 'app/email-template/services/email-template.service';
import { User } from 'app/core/models/user';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { SenderMergeTag } from '../../core/models/sender-merge-tag';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { CustomResponse } from '../../common/models/custom-response';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
import { VanityEmailTempalte } from 'app/email-template/models/vanity-email-template';
import { Properties } from 'app/common/models/properties';

declare var BeePlugin,swal,$:any;

@Component({
  selector: 'app-xamplify-default-templates',
  templateUrl: './xamplify-default-templates.component.html',
  styleUrls: ['./xamplify-default-templates.component.css'],
  providers :[HttpRequestLoader,Properties]
})
export class XamplifyDefaultTemplatesComponent implements OnInit {
  loggedInUserId:number = 0;
  @Input() xamplifyDefaultTemplate:VanityEmailTempalte;
  customResponse: CustomResponse = new CustomResponse();
  loading = false;
  senderMergeTag:SenderMergeTag = new SenderMergeTag();

  constructor(private vanityUrlService:VanityURLService,private authenticationService:AuthenticationService,private referenceService:ReferenceService, private properties: Properties) {
    this.loggedInUserId = this.authenticationService.getUserId();
   }

  ngOnInit() {
     this.editTemplate();
  
  }

  editTemplate(){
   let self = this;
    let emailTemplate = this.xamplifyDefaultTemplate;
    console.log(emailTemplate);
    if(emailTemplate.jsonBody!=undefined){
      var request = function (method, url, data, type, callback) {
        var req = new XMLHttpRequest();
        req.onreadystatechange = function () {
          if (req.readyState === 4 && req.status === 200) {
            var response = JSON.parse(req.responseText);
            callback(response);
          } else if (req.readyState === 4 && req.status !== 200) {
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
        emailTemplate.jsonBody = jsonContent;
        emailTemplate.htmlBody = htmlContent;
        emailTemplate.userId = self.loggedInUserId;
        if(!emailTemplate.subject){
          swal( "", "Whoops! We are unable to save this template because subject line is empty", "error" );
          return false;
        }
      if (jsonContent.indexOf("_CUSTOMER_FULL_NAME") < 0 && "JOIN_VENDOR_COMPANY"!=emailTemplate['typeInString']) {
          swal( "", "Whoops! We are unable to save this template because you deleted '_CUSTOMER_FULL_NAME' tag.", "error" );
          return false;
      }
      if("JOIN_VENDOR_COMPANY"==emailTemplate['typeInString'] && jsonContent.indexOf("{{PARTNER_NAME}}") < 0){
        swal( "", "Whoops! We are unable to save this template because you deleted '{{PARTNER_NAME}}' tag.", "error" );
        return false;
      }
      if("TRACK_PUBLISH"==emailTemplate['typeInString'] && jsonContent.indexOf("track_title") < 0){
        swal( "", "Whoops! We are unable to save this template because you deleted 'Track Title' tag.", "error" );
        return false;
      }
      if("PLAYBOOK_PUBLISH"==emailTemplate['typeInString'] && jsonContent.indexOf("playbook_title") < 0){
        swal( "", "Whoops! We are unable to save this template because you deleted 'playbook_title' tag.", "error" );
        return false;
      }
      if("ASSET_PUBLISH"==emailTemplate['typeInString'] && jsonContent.indexOf("Asset_name") < 0){
        swal( "", "Whoops! We are unable to save this template because you deleted 'Asset_name' tag.", "error" );
        return false;
      }
      if("SHARE_LEAD"==emailTemplate['typeInString'] && jsonContent.indexOf("shareLeadListName") < 0){
        swal( "", "Whoops! We are unable to save this template because you deleted 'shareLeadListName' tag.", "error" );
        return false;
      }
      if(("TRACK_PUBLISH"==emailTemplate['typeInString'] || "PLAYBOOK_PUBLISH"==emailTemplate['typeInString']) && jsonContent.indexOf("published_date") < 0){
        swal( "", "Whoops! We are unable to save this template because you deleted 'published_date' tag.", "error" );
        return false;
      }
      if(("ASSET_PUBLISH"==emailTemplate['typeInString'] || "SHARE_LEAD"==emailTemplate['typeInString']) && jsonContent.indexOf("shared_date") < 0){
        swal( "", "Whoops! We are unable to save this template because you deleted 'shared_date' tag.", "error" );
        return false;
      }
      if(("TRACK_PUBLISH"==emailTemplate['typeInString'] || "PLAYBOOK_PUBLISH"==emailTemplate['typeInString'] || "ASSET_PUBLISH"==emailTemplate['typeInString'] || "SHARE_LEAD"==emailTemplate['typeInString']) && jsonContent.indexOf('Vendor_company_name') < 0){
        swal( "", "Whoops! We are unable to save this template because you deleted 'Vendor_company_name' tag.", "error" );
        return false;
      }
      if(jsonContent.indexOf("<Vanity_Company_Logo_Href>") < 0){
        swal( "", "Whoops! We are unable to save this template because you deleted 'Vanity_Company_Logo_Href' tag.", "error" );
        return false;
      }
      let emailTemplateType = emailTemplate.typeInString;
      if(jsonContent.indexOf("<<LoginLink>>")<0 && "JOIN_MY_TEAM"==emailTemplateType){
        swal( "", "Whoops! We are unable to save this template because you deleted 'LoginLink' tag.", "error" );
        return false;
      }

      if(jsonContent.indexOf("<login_url>")<0 && "JOIN_VENDOR_COMPANY"==emailTemplateType){
        swal( "", "Whoops! We are unable to save this template because you deleted 'login_url' tag.", "error" );
        return false;
      }

      if("FORGOT_PASSWORD"==emailTemplateType){
        var count = (jsonContent.match(/<Vanity_Company_Logo_Href>/g) || []).length;
        let errorMessage = "";
        if(jsonContent.indexOf('_TEMPORARY_PASSWORD')<0){
          errorMessage=  "Whoops! We are unable to save this template because you deleted '_TEMPORARY_PASSWORD' tag.";
          swal( "", errorMessage, "error" );
          return false;
        }else if(count<2){
          errorMessage = "Whoops! We are unable to save this template because you deleted 'Vanity_Company_Logo_Href' tag.";
          swal( "", errorMessage, "error" );
          return false;
        }
       
      }
      if("ACCOUNT_ACTIVATION"==emailTemplateType && jsonContent.indexOf('<VerifyEmailLink>')<0){
        swal( "", "Whoops! We are unable to save this template because you deleted 'VerifyEmailLink' tag.", "error" );
        return false;
      }
        self.updateTemplate(emailTemplate);
      };
      
      let emailTemplateType = emailTemplate.typeInString

      if("FORGOT_PASSWORD"==emailTemplateType || "ACCOUNT_ACTIVATION"==emailTemplateType || "JOIN_VENDOR_COMPANY"==emailTemplateType || "JOIN_MY_TEAM"==emailTemplateType){
        var mergeTags = [{ name: 'Sendor First Name', value: '{{firstName}}' },
        { name: 'Sendor Last Name', value: '{{lastName}}' },
        { name: 'Sendor Full Name', value: '{{fullName}}' },
        { name: 'Sendor Email Id', value: '{{emailId}}' },
        ];
      }
     if("TRACK_PUBLISH"==emailTemplateType){
        mergeTags = [{ name: 'Sendor First Name', value: '{{firstName}}' },
        { name: 'Sendor Last Name', value: '{{lastName}}' },
        { name: 'Sendor Full Name', value: '{{fullName}}' },
        { name: 'Sendor Email Id', value: '{{emailId}}' },
        { name: 'Sendor Company Name', value: 'Vendor_company_name' },
        { name: 'Customer Full Name', value: '_CUSTOMER_FULL_NAME' },
        { name: 'Learning Track Title', value: 'track_title' },
        { name: 'Published On', value: 'published_date' },
        ];
      }
      if("PLAYBOOK_PUBLISH"==emailTemplateType){
        mergeTags = [{ name: 'Sendor First Name', value: '{{firstName}}' },
        { name: 'Sendor Last Name', value: '{{lastName}}' },
        { name: 'Sendor Full Name', value: '{{fullName}}' },
        { name: 'Sendor Email Id', value: '{{emailId}}' },
        { name: 'Sendor Company Name', value: 'Vendor_company_name' },
        { name: 'Customer Full Name', value: '_CUSTOMER_FULL_NAME' },
        { name: 'Playbook Title', value: 'playbook_title' },
        { name: 'Published On', value: 'published_date' },
        ];
      }
      if("ASSET_PUBLISH"==emailTemplateType){
        mergeTags = [{ name: 'Sendor First Name', value: '{{firstName}}' },
        { name: 'Sendor Last Name', value: '{{lastName}}' },
        { name: 'Sendor Full Name', value: '{{fullName}}' },
        { name: 'Sendor Email Id', value: '{{emailId}}' },
        { name: 'Sendor Company Name', value: 'Vendor_company_name' },
        { name: 'Customer Full Name', value: '_CUSTOMER_FULL_NAME' },
        { name: 'Asset Name', value: 'Asset_name' },
        { name: 'Shared On', value: 'shared_date' },
        ];
      }
      if("SHARE_LEAD"==emailTemplateType){
        mergeTags =[{ name: 'Sendor First Name', value: '{{firstName}}' },
        { name: 'Sendor Last Name', value: '{{lastName}}' },
        { name: 'Sendor Full Name', value: '{{fullName}}' },
        { name: 'Sendor Email Id', value: '{{emailId}}' },
        { name: 'Sendor Company Name', value: 'Vendor_company_name' },
        { name: 'Customer Full Name', value: '_CUSTOMER_FULL_NAME' },
        { name: 'Share-Lead List Name', value: 'shareLeadListName' },
        { name: 'Shared On', value: 'shared_date' },
        ];
      }
      if("ONE_CLICK_LAUNCH"==emailTemplateType){
        mergeTags =[{ name: 'Sender First Name', value: '{{firstName}}' },
        { name: 'Sender Last Name', value: '{{lastName}}' },
        { name: 'Sender Full Name', value: '{{fullName}}' },
        { name: 'Sender Email Id', value: '{{emailId}}' },
        { name: 'Sender Company Name', value: '{{senderCompanyName}}' },
        { name: 'Customer Full Name', value: '{{customerFullName}}' },
        { name: 'Campaign Name', value: '{{campaignName}}' },
        { name: 'Campaign Type', value: '{{campaignType}}' },
        ];
      }
      if("PAGE_CAMPAIGN_PARTNER"==emailTemplateType){
        mergeTags =[{ name: 'Sender First Name', value: '{{firstName}}' },
        { name: 'Sender Last Name', value: '{{lastName}}' },
        { name: 'Sender Full Name', value: '{{fullName}}' },
        { name: 'Sender Email Id', value: '{{emailId}}' },
        { name: 'Sender Company Name', value: '{{senderCompanyName}}' },
        { name: 'Customer Full Name', value: '{{customerFullName}}' },
        { name: 'Page Name', value: '{{pageName}}' },
        { name: 'Shared On', value: '{{sharedDate}}' },
        ];
      }
      if("PAGE_CAMPAIGN_CONTACT"==emailTemplateType){
        mergeTags =[{ name: 'Sender First Name', value: '{{firstName}}' },
        { name: 'Sender Last Name', value: '{{lastName}}' },
        { name: 'Sender Full Name', value: '{{fullName}}' },
        { name: 'Sender Email Id', value: '{{emailId}}' },
        { name: 'Sender Company Name', value: '{{senderCompanyName}}' },
        { name: 'Customer Full Name', value: '{{customerFullName}}' },
        ];
      }
      if("SOCIAL_CAMPAIGN"==emailTemplateType){
        mergeTags =[{ name: 'Sender First Name', value: '{{firstName}}' },
        { name: 'Sender Last Name', value: '{{lastName}}' },
        { name: 'Sender Full Name', value: '{{fullName}}' },
        { name: 'Sender Email Id', value: '{{emailId}}' },
        { name: 'Sender Company Name', value: '{{senderCompanyName}}' },
        { name: 'Customer Full Name', value: '{{customerFullName}}' },
        { name: 'Social Status Content', value: '{{socialStatusContent}}' },
        ];
      }
      var beeUserId = "bee-"+emailTemplate.companyId;
      var roleHash = self.authenticationService.vendorRoleHash;
      var beeConfig = {
          uid: beeUserId,
          container: 'xamplify-default-template-bee-container',
          autosave: 15,
          //language: 'en-US',
          language:this.authenticationService.beeLanguageCode,
          mergeTags: mergeTags,
          preventClose: true,
          roleHash: roleHash,
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
                      self.authenticationService.beeRequestType,
                      self.authenticationService.beeHostApi,
                      null,
                      null,
                      function( template: any ) {
                          if(emailTemplate!=undefined){
                            var body = emailTemplate.jsonBody;
                            body = body.replace( "https://xamp.io/vod/replace-company-logo.png", self.authenticationService.MEDIA_URL + self.referenceService.companyProfileImage );
                            emailTemplate.jsonBody = body;
                            var jsonBody = JSON.parse( body );
                            bee.load( jsonBody );
                            bee.start( jsonBody );
                          }else{
                            this.referenceService.showSweetAlert( "", "Unable to load the template", "error" );
                          }
                      } );
              } );
          } );


    }else{
      this.referenceService.showSweetAlert( "", "Please try after sometime.", "error" );
    }

  }


  updateTemplate(emailTemplate:VanityEmailTempalte){
    this.loading = true;
    this.customResponse = new CustomResponse();
    this.replaceToDefaultLogos(emailTemplate);
    this.vanityUrlService.saveOrUpdateEmailTemplate(emailTemplate).subscribe(result => {
      this.referenceService.goToTop();
      this.loading = false;
      if(result.statusCode === 200){
        this.customResponse = new CustomResponse('SUCCESS', this.properties.VANITY_URL_ET_SUCCESS_TEXT, true);
      }else{
        this.customResponse = new CustomResponse('ERROR', result.message, true);
      }
    }, error => {
      this.loading = false;
      this.customResponse = new CustomResponse('ERROR', this.properties.VANITY_URL_EMAIL_TEMPLATE_ERROR_TEXT, true)
    });

  }

  
replaceToDefaultLogos(emailTemplate:VanityEmailTempalte){
  if(emailTemplate.jsonBody!=undefined){
    emailTemplate.jsonBody = emailTemplate.jsonBody.replace(this.authenticationService.MEDIA_URL + this.referenceService.companyProfileImage,"https://xamp.io/vod/replace-company-logo.png");
  }
  if (emailTemplate.htmlBody != undefined) {
    emailTemplate.htmlBody = emailTemplate.htmlBody.replace(this.authenticationService.MEDIA_URL + this.referenceService.companyProfileImage, "https://xamp.io/vod/replace-company-logo.png");
  }
 
}

}
