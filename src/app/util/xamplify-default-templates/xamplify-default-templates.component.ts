import { Component, OnInit,Input,Output, EventEmitter, HostListener } from '@angular/core';
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
import { LandingPage } from 'app/landing-pages/models/landing-page';
import { LandingPageService } from 'app/landing-pages/services/landing-page.service';
import { ModulesDisplayType } from '../models/modules-display-type';
import { Observable } from 'rxjs';
import { VendorLogoDetails } from 'app/landing-pages/models/vendor-logo-details';
import { LandingPageType } from 'app/landing-pages/models/landing-page-type.enum';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
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
  @Input() 
  customResponse: CustomResponse = new CustomResponse();
  loading = false;
  senderMergeTag:SenderMergeTag = new SenderMergeTag();
  @Input() vendorJourney:boolean = false;
  @Input() isMasterLandingPages:boolean = false;
  @Input() landingPage:LandingPage;
  @Output() redirect = new EventEmitter();
  @Input() vendorLogoDetails:VendorLogoDetails[];
  @Input() sharedVendorLogoDetails:VendorLogoDetails[];
  @Input() loggedInUserCompanyId:number;
  @Input() openInNewTabChecked: boolean = false;
  @Output() landingPageOpenInNewTabChecked = new EventEmitter();
  @Input() welcomePages:boolean = false;
  @Input() isPartnerJourneyPages:boolean = false;
  @Input() isVendorMarketplacePages:boolean = false;

  clickedButtonName = "";
  isAdd: boolean;
  name = "";
  id = 0;

  loggedInAsSuperAdmin = false;
  mergeTagsInput: any = {};
  categoryNames: any;
  isMinTimeOver: boolean = false;
  defaultLandingPage = false;
  loadLandingPage = false;
  coBraningImage = "co-branding.png";
  openLinksInNewTabCheckBoxId = "openLinksInNewTab-page-links";
  skipConfirmAlert = false;
  isSaveAndRedirectButtonClicked = false;
  viewType = "";
  folderViewType = "";
  modulesDisplayType = new ModulesDisplayType();
  updateAndRedirectClicked = false;
  categoryId: number = 0;
  vanitySubjectLines: any[] = [];
  isSubjectDuplicate: boolean = false;
  categoriesAndCompaniesImage  = "https://xamplify.s3.amazonaws.com/images/deafult-master-lading-page.jpg";
  googleMapsImage= "https://xamplify.s3.amazonaws.com/dev/images/bee-1305/f-7f38af0f-f5ed-4ee6-a6f6-c4d9909ceb4e-94151676035396555.jpeg";
  constructor(private vanityUrlService:VanityURLService,private authenticationService:AuthenticationService,private referenceService:ReferenceService, private properties: Properties,private logger: XtremandLogger,
    private landingPageService: LandingPageService) {
    this.loggedInUserId = this.authenticationService.getUserId();
    if(landingPageService.vendorJourney || landingPageService.isMasterLandingPages || landingPageService.welcomePages ||landingPageService.isPartnerJourneyPages || landingPageService.isVendorMarketplacePages ){
      this.findPageDataAndLoadBeeContainer(landingPageService, authenticationService);
    }
   }

  ngOnInit() {
    if(!this.vendorJourney && !this.isMasterLandingPages && !this.welcomePages && !this.isPartnerJourneyPages && !this.isVendorMarketplacePages){
      this.editTemplate();
      this.getAllTemplatesDuplicates();
    }
  }
  getAllTemplatesDuplicates() {
    this.vanityUrlService.getAllTemplatesDuplicates()
    .subscribe(
        response => {
            this.vanitySubjectLines = response.data;
        },
        error => { this.logger.errorPage(error) },
        () => { this.logger.info("Completed getAllTemplatesDuplicates()") }
    );
}
  checkForDuplicates(newSubject: string, existingName: string, id: number) {
    const normalizedNewSubject = this.referenceService.getTrimmedData(newSubject).toLowerCase();
    const normalizedExistingName = this.referenceService.getTrimmedData(existingName).toLowerCase();
    if (normalizedNewSubject === normalizedExistingName) {
      this.isSubjectDuplicate = false;
    } else {
      if (this.vanitySubjectLines != null && this.vanitySubjectLines != undefined && this.vanitySubjectLines.length > 0) {
        this.vanitySubjectLines[0].forEach((subjects: any) => {
          if (id === subjects[0] && subjects[1].trim().toLowerCase() === normalizedNewSubject) {
            this.isSubjectDuplicate = false;
          }
          else {
            if (subjects[1].trim().toLowerCase() === normalizedNewSubject) {
              this.isSubjectDuplicate = true;
            }
          }
        })
        this.vanitySubjectLines[1].forEach((name: any) => {
          if (name.trim().toLowerCase() === normalizedNewSubject) {
            this.isSubjectDuplicate = true;
          }
        })
      } else {
        this.logger.error("Vanity Subject Lines Not Loaded");
        this.logger.error(this.vanitySubjectLines);
      }
    }
    return this.isSubjectDuplicate;
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
        const emailTemplateType = emailTemplate.typeInString;
        const requiredTagsMap = {
          "ADD_LEAD": [
            '{{partnerModuleCustomName}}',
            '{{partnerName}}',
            '{{partnerCompany}}',
            '{{leadName}}',
            '{{leadCompany}}',
            '{{leadAssociatedCampaign}}',
            '{{leadStage}}',
            '{{leadComment}}',
          ],
          "ADD_DEAL": [
            '{{partnerModuleCustomName}}',
            '{{partnerName}}',
            '{{partnerCompany}}',
            '{{leadName}}',
            '{{leadCompany}}',
            '{{dealName}}',
            '{{dealAmount}}',
            '{{dealStage}}',
            '{{dealComment}}',
          ],
          "FORM_COMPLETED": [
            '{{formName}}',
          ],
          "ADD_SELF_LEAD": [
            '{{createdByName}}',
            '{{createdByCompanyName}}',
            '{{leadName}}',
            '{{leadCompany}}',
            '{{leadAssociatedCampaign}}',
            '{{leadStage}}',
            '{{leadComment}}',
            '{{companyName}}',
          ],
          "UPDATE_SELF_LEAD": [
            '{{createdByName}}',
            '{{createdByCompanyName}}',
            '{{leadName}}',
            '{{leadCompany}}',
            '{{leadAssociatedCampaign}}',
            '{{leadStage}}',
            '{{leadComment}}',
            '{{companyName}}',
          ],
          "ADD_SELF_DEAL": [
            '{{createdByName}}',
            '{{createdByCompanyName}}',
            '{{leadName}}',
            '{{leadCompany}}',
            '{{dealName}}',
            '{{dealAmount}}',
            '{{dealStage}}',
            '{{dealComment}}',
            '{{companyName}}',
          ],
          "UPDATE_SELF_DEAL": [
            '{{createdByName}}',
            '{{createdByCompanyName}}',
            '{{leadName}}',
            '{{leadCompany}}',
            '{{dealName}}',
            '{{dealAmount}}',
            '{{dealStage}}',
            '{{dealComment}}',
            '{{companyName}}',
          ],
          "PRM_ADD_LEAD": [
            '{{partnerModuleCustomName}}',
            '{{partnerName}}',
            '{{partnerCompany}}',
            '{{leadName}}',
            '{{leadCompany}}',
            '{{leadStage}}',
            '{{leadComment}}',
          ],
          "PRM_UPDATED": [
            '{{partnerModuleCustomName}}',
            '{{partnerName}}',
            '{{partnerCompany}}',
            '{{leadName}}',
            '{{leadCompany}}',
            '{{leadStage}}',
            '{{leadComment}}',
          ],
          "LEAD_UPDATE": [
            '{{partnerModuleCustomName}}',
            '{{partnerName}}',
            '{{partnerCompany}}',
            '{{leadName}}',
            '{{leadCompany}}',
            '{{leadAssociatedCampaign}}',
            '{{leadStage}}',
            '{{leadComment}}',
          ],
          "DEAL_UPDATE": [
            '{{partnerModuleCustomName}}',
            '{{partnerName}}',
            '{{partnerCompany}}',
            '{{leadName}}',
            '{{leadCompany}}',
            '{{dealName}}',
            '{{dealAmount}}',
            '{{dealStage}}',
            '{{dealComment}}',
          ],
          "PARTNER_REMAINDER": [
            '{{VENDOR_FULL_NAME}}',
            '{{VENDOR_COMPANY_NAME}}',
          ],
          "COMPANY_PROFILE_INCOMPLETE": [
            '{{senderFullName}}',
          ],
          "JOIN_VERSA_TEAM": [
            '{{senderFullName}}',
          ],
          "UNLOCK_MDF_FUNDING": [
            '{{campaignName}}',
            '{{mdfKey}}',
            '{{mdfKeySearchLink}}',
            '{{campaignAnalyticsLink}}'
          ],
          "TEAM_MEMBER_PORTAL": [
            '{{VENDOR_FULL_NAME}}',
            '{{VENDOR_COMPANY_NAME}}',
          ],
          "PRM_PARTNER_ADD_LEAD": [
            '{{createdByName}}',
            '{{createdForCompanyName}}',
            '{{leadName}}',
            '{{leadCompany}}',
            '{{leadStage}}',
            '{{leadComment}}',
            '{{companyName}}',
          ],
          "PRM_PARTNER_UPDATE_LEAD": [
            '{{createdByName}}',
            '{{createdForCompanyName}}',
            '{{leadName}}',
            '{{leadCompany}}',
            '{{leadStage}}',
            '{{leadComment}}',
            '{{companyName}}',
          ],
          "PARTNER_ADD_LEAD": [
            '{{createdByName}}',
            '{{createdForCompanyName}}',
            '{{leadName}}',
            '{{leadCompany}}',
            '{{leadAssociatedCampaign}}',
            '{{leadStage}}',
            '{{leadComment}}',
            '{{companyName}}',
          ],
          "PARTNER_UPDATE_LEAD": [
            '{{createdByName}}',
            '{{createdForCompanyName}}',
            '{{leadName}}',
            '{{leadCompany}}',
            '{{leadAssociatedCampaign}}',
            '{{leadStage}}',
            '{{leadComment}}',
            '{{companyName}}',
          ],
          "PARTNER_ADD_DEAL": [
            '{{createdByName}}',
            '{{createdForCompanyName}}',
            '{{leadName}}',
            '{{leadCompany}}',
            '{{dealName}}',
            '{{dealAmount}}',
            '{{dealStage}}',
            '{{dealComment}}',
            '{{companyName}}',
          ],
          "PARTNER_UPDATE_DEAL": [
            '{{createdByName}}',
            '{{createdForCompanyName}}',
            '{{leadName}}',
            '{{leadCompany}}',
            '{{dealName}}',
            '{{dealAmount}}',
            '{{dealStage}}',
            '{{dealComment}}',
            '{{companyName}}',
          ],
        };
    
        const requiredTags = requiredTagsMap[emailTemplateType] || [];
    
        const validationChecks = [
          {
            condition: () => !self.vendorJourney && !self.isMasterLandingPages && !self.welcomePages && !self.isPartnerJourneyPages && !self.isVendorMarketplacePages,
            checks: [
              { condition: () => !$.trim(emailTemplate.subject), message: "Whoops! We are unable to save this template because subject line is empty." },
              { condition: () => ["JOIN_MY_TEAM", "FORGOT_PASSWORD", "ACCOUNT_ACTIVATION", "PARTNER_REMAINDER", "COMPANY_PROFILE_INCOMPLETE", "JOIN_VERSA_TEAM"].includes(emailTemplateType) && !jsonContent.includes("_CUSTOMER_FULL_NAME"), message: "Whoops! We are unable to save this template because you deleted '_CUSTOMER_FULL_NAME' tag." },
              { condition: () => ["TRACK_PUBLISH", "PLAYBOOK_PUBLISH", "ASSET_PUBLISH", "SHARE_LEAD", "ONE_CLICK_LAUNCH", "PAGE_CAMPAIGN_PARTNER", "PAGE_CAMPAIGN_CONTACT", "SOCIAL_CAMPAIGN", "TO_SOCIAL_CAMPAIGN", "ADD_LEAD", "ADD_DEAL", "LEAD_UPDATE", "DEAL_UPDATE", "FORM_COMPLETED", "ADD_SELF_LEAD", "ADD_SELF_DEAL", "UPDATE_SELF_LEAD", "UPDATE_SELF_DEAL", "PRM_ADD_LEAD", "PRM_UPDATED","LEAD_APPROVE","LEAD_REJECT","PRM_LEAD_APPROVE", "PRM_LEAD_REJECT","TEAM_MEMBER_PORTAL", "PRM_PARTNER_ADD_LEAD", "PRM_PARTNER_UPDATE_LEAD", "PARTNER_ADD_DEAL", "PARTNER_UPDATE_DEAL", "PARTNER_ADD_LEAD", "PARTNER_UPDATE_LEAD", "PARTNER_ADD_DEAL", "PARTNER_UPDATE_DEAL", "PARTNER_SIGNATURE_ENABLED", "PARTNER_SIGNATURE_PENDING" ].includes(emailTemplateType) && !jsonContent.includes('{{customerFullName}}'), message: "Whoops! We are unable to save this template because you deleted '{{customerFullName}}' tag." },
              { condition: () => emailTemplateType === "JOIN_VENDOR_COMPANY" && !jsonContent.includes("{{PARTNER_NAME}}"), message: "Whoops! We are unable to save this template because you deleted '{{PARTNER_NAME}}' tag." },
              { condition: () => (emailTemplateType === "JOIN_VENDOR_COMPANY" || "JOIN_MY_TEAM"==emailTemplateType) && !jsonContent.includes("{{senderFullName}}"), message: "Whoops! We are unable to save this template because you deleted '{{senderFullName}}' tag." },
              { condition: () => emailTemplateType === "JOIN_VENDOR_COMPANY" && !jsonContent.includes("{{VENDOR_COMPANY_NAME}}"), message: "Whoops! We are unable to save this template because you deleted '{{VENDOR_COMPANY_NAME}}' tag." },
              { condition: () => emailTemplateType === "TRACK_PUBLISH" && !jsonContent.includes("{{trackTitle}}"), message: "Whoops! We are unable to save this template because you deleted '{{trackTitle}}' tag." },
              { condition: () => emailTemplateType === "PLAYBOOK_PUBLISH" && !jsonContent.includes("{{playbookTitle}}"), message: "Whoops! We are unable to save this template because you deleted '{{playbookTitle}}' tag." },
              { condition: () => (emailTemplateType === "ASSET_PUBLISH" || "PARTNER_SIGNATURE_ENABLED"==emailTemplateType || emailTemplateType === "PARTNER_SIGNATURE_PENDING") && !jsonContent.includes("{{assetName}}"), message: "Whoops! We are unable to save this template because you deleted '{{assetName}}' tag." },
              { condition: () => emailTemplateType === "SHARE_LEAD" && !jsonContent.includes("{{shareLeadListName}}"), message: "Whoops! We are unable to save this template because you deleted '{{shareLeadListName}}' tag." },
              { condition: () => emailTemplateType === "ONE_CLICK_LAUNCH" && !jsonContent.includes("{{campaignName}}"), message: "Whoops! We are unable to save this template because you deleted '{{campaignName}}' tag." },
              { condition: () => emailTemplateType === "ONE_CLICK_LAUNCH" && !jsonContent.includes("{{campaignType}}"), message: "Whoops! We are unable to save this template because you deleted '{{campaignType}}' tag." },
              { condition: () => emailTemplateType === "PAGE_CAMPAIGN_PARTNER" && !jsonContent.includes("{{pageName}}"), message: "Whoops! We are unable to save this template because you deleted '{{pageName}}' tag." },
              { condition: () => emailTemplateType === "JOIN_PRM_COMPANY" && !jsonContent.includes("{{PARTNER_NAME}}"), message: "Whoops! We are unable to save this template because you deleted '{{PARTNER_NAME}}' tag." },
              { condition: () => emailTemplateType === "JOIN_PRM_COMPANY" && !jsonContent.includes("{{senderFullName}}"), message: "Whoops! We are unable to save this template because you deleted '{{senderFullName}}' tag." },
              { condition: () => emailTemplateType === "JOIN_PRM_COMPANY" && !jsonContent.includes("{{VENDOR_COMPANY_NAME}}"), message: "Whoops! We are unable to save this template because you deleted '{{VENDOR_COMPANY_NAME}}' tag." },
              { condition: () => ["TRACK_PUBLISH", "PLAYBOOK_PUBLISH"].includes(emailTemplateType) && !jsonContent.includes("{{publishedDate}}"), message: "Whoops! We are unable to save this template because you deleted '{{publishedDate}}' tag." },
              { condition: () => ["ASSET_PUBLISH", "SHARE_LEAD", "PAGE_CAMPAIGN_PARTNER", "PARTNER_SIGNATURE_ENABLED", "PARTNER_SIGNATURE_PENDING"].includes(emailTemplateType) && !jsonContent.includes("{{sharedDate}}"), message: "Whoops! We are unable to save this template because you deleted '{{sharedDate}}' tag." },
              { condition: () => ["SOCIAL_CAMPAIGN", "TO_SOCIAL_CAMPAIGN"].includes(emailTemplateType) && !jsonContent.includes("{{socialStatusContent}}"), message: "Whoops! We are unable to save this template because you deleted '{{socialStatusContent}}' tag." },
              { condition: () => ["TRACK_PUBLISH", "PLAYBOOK_PUBLISH", "ASSET_PUBLISH", "SHARE_LEAD", "ONE_CLICK_LAUNCH", "PAGE_CAMPAIGN_PARTNER", "PAGE_CAMPAIGN_CONTACT", "SOCIAL_CAMPAIGN", "TO_SOCIAL_CAMPAIGN", "PARTNER_SIGNATURE_ENABLED", "PARTNER_SIGNATURE_PENDING"].includes(emailTemplateType) && !jsonContent.includes('{{senderCompanyName}}'), message: "Whoops! We are unable to save this template because you deleted '{{senderCompanyName}}' tag." },
              { condition: () => emailTemplateType === "FORM_COMPLETED" && !jsonContent.includes("{{formTable}}"), message: "Whoops! We are unable to save this template because you deleted '{{formTable}}' tag." },
              { condition: () => jsonContent.indexOf("<Vanity_Company_Logo_Href>") < 0, message: "Whoops! We are unable to save this template because you deleted 'Vanity_Company_Logo_Href' tag." },
              ...requiredTags.map(tag => ({
                condition: () => !jsonContent.includes(tag),
                message: `Whoops! We are unable to save this template because you deleted '${tag}' tag.`
              })),
              { condition: () => jsonContent.indexOf("<<LoginLink>>") < 0 && emailTemplateType === "JOIN_MY_TEAM", message: "Whoops! We are unable to save this template because you deleted 'LoginLink' tag." },
              { condition: () => jsonContent.indexOf("<login_url>") < 0 && (emailTemplateType === "JOIN_VENDOR_COMPANY" ||  emailTemplateType === "FORGOT_PASSWORD" || emailTemplateType === "JOIN_PRM_COMPANY"), message: "Whoops! We are unable to save this template because you deleted 'login_url' tag." },
              { condition: () => jsonContent.indexOf("login_url") < 0 && (emailTemplateType === "COMPANY_PROFILE_INCOMPLETE" ||  emailTemplateType === "TEAM_MEMBER_PORTAL"), message: "Whoops! We are unable to save this template because you deleted 'login_url' tag." },
              { condition: () => jsonContent.indexOf("pageLink") < 0 && ["SOCIAL_CAMPAIGN", "PAGE_CAMPAIGN_CONTACT", "ADD_DEAL", "DEAL_UPDATE"].includes(emailTemplateType), message: "Whoops! We are unable to save this template because you deleted 'Button' tag." },
              { condition: () => jsonContent.indexOf("pageLink") < 0 && ["PARTNER_ADD_DEAL", "PARTNER_UPDATE_DEAL"].includes(emailTemplateType), message: "Whoops! We are unable to save this template because you deleted 'Button' tag." },
              { condition: () => emailTemplateType === "FORGOT_PASSWORD" && jsonContent.indexOf('_TEMPORARY_PASSWORD') < 0, message: "Whoops! We are unable to save this template because you deleted '_TEMPORARY_PASSWORD' tag." },
              { condition: () => emailTemplateType === "FORGOT_PASSWORD" && (jsonContent.match("<Vanity_Company_Logo_Href>") || []).length < 1, message: "Whoops! We are unable to save this template because you deleted 'Vanity_Company_Logo_Href' tag." },
              { condition: () => emailTemplateType === "ACCOUNT_ACTIVATION" && jsonContent.indexOf('<VerifyEmailLink>') < 0, message: "Whoops! We are unable to save this template because you deleted 'VerifyEmailLink' tag." },
              { condition: () => emailTemplateType === "JOIN_VERSA_TEAM" && !jsonContent.includes('LoginLink'), message: "Whoops! We are unable to save this template because you deleted 'RegisterLink' tag." },
              { condition: () => emailTemplateType === "JOIN_VERSA_TEAM" && !jsonContent.includes('Registration_Document'), message: "Whoops! We are unable to save this template because you deleted 'Registration_Document' tag." },
              { condition: () => emailTemplateType === "JOIN_VERSA_TEAM" && !jsonContent.includes('Request_Account'), message: "Whoops! We are unable to save this template because you deleted 'Request_Account' tag." },
              { condition: () => emailTemplateType === self.properties.UNLOCK_MDF_FUNDING && !jsonContent.includes('{{campaignName}}'), message: "Whoops! We are unable to save this template because you deleted '{{campaignName}}' tag." },
              { condition: () => emailTemplateType === self.properties.UNLOCK_MDF_FUNDING && !jsonContent.includes('{{campaignAnalyticsLink}}'), message: "Whoops! We are unable to save this template because you deleted '{{campaignAnalyticsLink}}' tag." },
              { condition: () => ["LEAD_APPROVE", "LEAD_REJECT", "PRM_LEAD_APPROVE", "PRM_LEAD_REJECT"].includes(emailTemplateType) && !jsonContent.includes('{{leadName}}'), message: "Whoops! We are unable to save this template because you deleted '{{leadName}}' tag." },
              { condition: () => ["LEAD_APPROVE", "LEAD_REJECT"].includes(emailTemplateType) && !jsonContent.includes('{{leadAssociatedCampaign}}'), message: "Whoops! We are unable to save this template because you deleted '{{leadAssociatedCampaign}}' tag." },
              { condition: () => ["LEAD_APPROVE", "LEAD_REJECT", "PRM_LEAD_APPROVE", "PRM_LEAD_REJECT"].includes(emailTemplateType) && !jsonContent.includes('{{leadComment}}'), message: "Whoops! We are unable to save this template because you deleted '{{leadComment}}' tag." },
              { condition: () => ["LEAD_APPROVE", "LEAD_REJECT", "PRM_LEAD_APPROVE", "PRM_LEAD_REJECT"].includes(emailTemplateType) && !jsonContent.includes('{{VENDOR_COMPANY_NAME}}'), message: "Whoops! We are unable to save this template because you deleted '{{VENDOR_COMPANY_NAME}}' tag." },
              { condition: () => ["LEAD_APPROVE", "LEAD_REJECT", "PRM_LEAD_APPROVE", "PRM_LEAD_REJECT"].includes(emailTemplateType) && !jsonContent.includes('{{leadStage}}'), message: "Whoops! We are unable to save this template because you deleted '{{leadStage}}' tag." },
              { condition: () => emailTemplateType === self.properties.UNLOCK_MDF_FUNDING && !jsonContent.includes('{{mdfKey}}'), message: "Whoops! We are unable to save this template because you deleted '{{mdfKey}}' tag." },
              { condition: () => emailTemplateType === self.properties.UNLOCK_MDF_FUNDING && !jsonContent.includes('{{mdfKeySearchLink}}'), message: "Whoops! We are unable to save this template because you deleted '{{mdfKeySearchLink}}' tag." },
              { condition: () => ["LEAD_APPROVE", "LEAD_REJECT", "PRM_LEAD_APPROVE", "PRM_LEAD_REJECT"].includes(emailTemplateType) && !jsonContent.includes('{{leadCompany}}'), message: "Whoops! We are unable to save this template because you deleted '{{leadCompany}}' tag." },
            ]
          },
        ];
    
        for (let group of validationChecks) {
            if (group.condition()) {
                for (let check of group.checks) {
                    if (check.condition()) {
                        swal("", check.message, "error");
                        return false;
                    }
                }
            }
        }
    
        self.updateTemplate(emailTemplate);
    };
    let emailTemplateType = emailTemplate.typeInString

      if ("FORGOT_PASSWORD" == emailTemplateType) {
        var mergeTags = [{ name: 'Sender First Name', value: '{{firstName}}' },
        { name: 'Sender Last Name', value: '{{lastName}}' },
        { name: 'Sender Email Id', value: '{{emailId}}' },
        { name: 'Sender Full Name', value: '{{fullName}}' },
        { name: 'Sender Partner Name', value: '{{PARTNER_NAME}}' },
        ];
      }
      if ("ACCOUNT_ACTIVATION" == emailTemplateType || "JOIN_VENDOR_COMPANY" == emailTemplateType || "JOIN_PRM_COMPANY" == emailTemplateType) {
        var mergeTags = [{ name: 'Sender First Name', value: '{{firstName}}' },
        { name: 'Sender Last Name', value: '{{lastName}}' },
        { name: 'Sender Email Id', value: '{{emailId}}' },
        { name: 'Partner Name', value: '{{PARTNER_NAME}}' },
        { name: 'Sender Full Name', value: '{{senderFullName}}' },
        { name: 'Sender Company Name', value: '{{VENDOR_COMPANY_NAME}}' },
        ];
      }
      if ("TRACK_PUBLISH" == emailTemplateType) {
        mergeTags = [{ name: 'Sender First Name', value: '{{firstName}}' },
        { name: 'Sender Last Name', value: '{{lastName}}' },
        { name: 'Sender Full Name', value: '{{fullName}}' },
        { name: 'Sender Email Id', value: '{{emailId}}' },
        { name: 'Sender Company Name', value: '{{senderCompanyName}}' },
        { name: 'Customer Full Name', value: '{{customerFullName}}' },
        { name: 'Learning Track Title', value: '{{trackTitle}}' },
        { name: 'Published On', value: '{{publishedDate}}' },
        ];
      }
      if ("PLAYBOOK_PUBLISH" == emailTemplateType) {
        mergeTags = [{ name: 'Sender First Name', value: '{{firstName}}' },
        { name: 'Sender Last Name', value: '{{lastName}}' },
        { name: 'Sender Full Name', value: '{{fullName}}' },
        { name: 'Sender Email Id', value: '{{emailId}}' },
        { name: 'Sender Company Name', value: '{{senderCompanyName}}' },
        { name: 'Customer Full Name', value: '{{customerFullName}}' },
        { name: 'Playbook Title', value: '{{playbookTitle}}' },
        { name: 'Published On', value: '{{publishedDate}}' },
        ];
      }
      if ("ASSET_PUBLISH" == emailTemplateType || "PARTNER_SIGNATURE_ENABLED" == emailTemplateType || "PARTNER_SIGNATURE_PENDING" == emailTemplateType) {
        mergeTags = [{ name: 'Sender First Name', value: '{{firstName}}' },
        { name: 'Sender Last Name', value: '{{lastName}}' },
        { name: 'Sender Full Name', value: '{{fullName}}' },
        { name: 'Sender Email Id', value: '{{emailId}}' },
        { name: 'Sender Company Name', value: '{{senderCompanyName}}' },
        { name: 'Customer Full Name', value: '{{customerFullName}}' },
        { name: 'Asset Name', value: '{{assetName}}' },
        { name: 'Shared On', value: '{{sharedDate}}' },
        ];
      }
      if ("SHARE_LEAD" == emailTemplateType) {
        mergeTags = [{ name: 'Sender First Name', value: '{{firstName}}' },
        { name: 'Sender Last Name', value: '{{lastName}}' },
        { name: 'Sender Full Name', value: '{{fullName}}' },
        { name: 'Sender Email Id', value: '{{emailId}}' },
        { name: 'Sender Company Name', value: '{{senderCompanyName}}' },
        { name: 'Customer Full Name', value: '{{customerFullName}}' },
        { name: 'Share-Lead List Name', value: '{{shareLeadListName}}' },
        { name: 'Shared On', value: '{{sharedDate}}' },
        ];
      }
      if ("ONE_CLICK_LAUNCH" == emailTemplateType) {
        mergeTags = [{ name: 'Sender First Name', value: '{{firstName}}' },
        { name: 'Sender Last Name', value: '{{lastName}}' },
        { name: 'Sender Full Name', value: '{{fullName}}' },
        { name: 'Sender Email Id', value: '{{emailId}}' },
        { name: 'Sender Company Name', value: '{{senderCompanyName}}' },
        { name: 'Customer Full Name', value: '{{customerFullName}}' },
        { name: 'Campaign Name', value: '{{campaignName}}' },
        { name: 'Campaign Type', value: '{{campaignType}}' },
        ];
      }
      if ("PAGE_CAMPAIGN_PARTNER" == emailTemplateType) {
        mergeTags = [{ name: 'Sender First Name', value: '{{firstName}}' },
        { name: 'Sender Last Name', value: '{{lastName}}' },
        { name: 'Sender Full Name', value: '{{fullName}}' },
        { name: 'Sender Email Id', value: '{{emailId}}' },
        { name: 'Sender Company Name', value: '{{senderCompanyName}}' },
        { name: 'Customer Full Name', value: '{{customerFullName}}' },
        { name: 'Page Name', value: '{{pageName}}' },
        { name: 'Shared On', value: '{{sharedDate}}' },
        ];
      }
      if ("PAGE_CAMPAIGN_CONTACT" == emailTemplateType) {
        mergeTags = [{ name: 'Sender First Name', value: '{{firstName}}' },
        { name: 'Sender Last Name', value: '{{lastName}}' },
        { name: 'Sender Full Name', value: '{{fullName}}' },
        { name: 'Sender Email Id', value: '{{emailId}}' },
        { name: 'Sender Company Name', value: '{{senderCompanyName}}' },
        { name: 'Customer Full Name', value: '{{customerFullName}}' },
        ];
      }
      if ("SOCIAL_CAMPAIGN" == emailTemplateType || "TO_SOCIAL_CAMPAIGN" == emailTemplateType) {
        mergeTags = [{ name: 'Sender First Name', value: '{{firstName}}' },
        { name: 'Sender Last Name', value: '{{lastName}}' },
        { name: 'Sender Full Name', value: '{{fullName}}' },
        { name: 'Sender Email Id', value: '{{emailId}}' },
        { name: 'Sender Company Name', value: '{{senderCompanyName}}' },
        { name: 'Customer Full Name', value: '{{customerFullName}}' },
        { name: 'Social Status Content', value: '{{socialStatusContent}}' },
        ];
      }
      if ("ADD_LEAD" == emailTemplateType || "LEAD_UPDATE" == emailTemplateType) {
        mergeTags = [{ name: 'Customer Full Name', value: '{{customerFullName}}' },
        { name: 'Partner Module Custom Name', value: '{{partnerModuleCustomName}}' },
        { name: 'Partner Name', value: '{{partnerName}}' },
        { name: 'Partner Company', value: '{{partnerCompany}}' },
        { name: 'Lead Name', value: '{{leadName}}' },
        { name: 'Lead Company', value: '{{leadCompany}}' },
        { name: 'Associated Lead Campaign', value: '{{leadAssociatedCampaign}}' },
        { name: 'Lead Stage', value: '{{leadStage}}' },
        { name: 'Lead Comment', value: '{{leadComment}}' },
        ];
      }
      if ("ADD_DEAL" == emailTemplateType || "DEAL_UPDATE" == emailTemplateType) {
        mergeTags = [{ name: 'Customer Full Name', value: '{{customerFullName}}' },
        { name: 'Partner Module Custom Name', value: '{{partnerModuleCustomName}}' },
        { name: 'Partner Name', value: '{{partnerName}}' },
        { name: 'Partner Company', value: '{{partnerCompany}}' },
        { name: 'Lead Name', value: '{{leadName}}' },
        { name: 'Lead Company', value: '{{leadCompany}}' },
        { name: 'Deal Name', value: '{{dealName}}' },
        { name: 'Deal Amount', value: '{{dealAmount}}' },
        { name: 'Deal Stage', value: '{{dealStage}}' },
        { name: 'Deal Comment', value: '{{dealComment}}' },
        ];
      }
      if ("FORM_COMPLETED" == emailTemplateType) {
        mergeTags = [{ name: 'Customer Full Name', value: '{{customerFullName}}' },
        { name: 'Form Name', value: '{{formName}}' },
        { name: 'Form Table', value: '{{formTable}}' },
        { name: 'Sender Company Name', value: '{{senderCompanyName}}' },

        ];
      }
      if ("PRM_ADD_LEAD" == emailTemplateType || "PRM_UPDATED" == emailTemplateType) {
        mergeTags = [{ name: 'Customer Full Name', value: '{{customerFullName}}' },
        { name: 'Partner Module Custom Name', value: '{{partnerModuleCustomName}}' },
        { name: 'Partner Name', value: '{{partnerName}}' },
        { name: 'Partner Company', value: '{{partnerCompany}}' },
        { name: 'Lead Name', value: '{{leadName}}' },
        { name: 'Lead Company', value: '{{leadCompany}}' },
        { name: 'Lead Stage', value: '{{leadStage}}' },
        { name: 'Lead Comment', value: '{{leadComment}}' },
        ];
      }
      if ("ADD_SELF_LEAD" == emailTemplateType || "UPDATE_SELF_LEAD" == emailTemplateType) {
        mergeTags = [{ name: 'Customer Full Name', value: '{{customerFullName}}' },
        { name: 'Created By Name', value: '{{createdByName}}' },
        { name: 'Created By Company', value: '{{createdByCompanyName}}' },
        { name: 'Associated Lead Campaign', value: '{{leadAssociatedCampaign}}' },
        { name: 'Lead Name', value: '{{leadName}}' },
        { name: 'Lead Company', value: '{{leadCompany}}' },
        { name: 'Lead Stage', value: '{{leadStage}}' },
        { name: 'Company Name', value: '{{companyName}}' },
        { name: 'Lead Comment', value: '{{leadComment}}' },
        ];
      }
      if ("ADD_SELF_DEAL" == emailTemplateType || "UPDATE_SELF_DEAL" == emailTemplateType) {
        mergeTags = [{ name: 'Customer Full Name', value: '{{customerFullName}}' },
        { name: 'Created By Name', value: '{{createdByName}}' },
        { name: 'Created By Company', value: '{{createdByCompanyName}}' },
        { name: 'Lead Name', value: '{{leadName}}' },
        { name: 'Lead Company', value: '{{leadCompany}}' },
        { name: 'Deal Name', value: '{{dealName}}' },
        { name: 'Deal Amount', value: '{{dealAmount}}' },
        { name: 'Deal Stage', value: '{{dealStage}}' },
        { name: 'Company Name', value: '{{companyName}}' },
        { name: 'Deal Comment', value: '{{dealComment}}' },
        ];
      }
      if ("PARTNER_REMAINDER" == emailTemplateType) {
        mergeTags = [{ name: 'Customer Full Name', value: '{{_CUSTOMER_FULL_NAME}}' },
        { name: 'Vendor Full Name', value: '{{VENDOR_FULL_NAME}}' },
        { name: 'Vendor Company Name', value: '{{VENDOR_COMPANY_NAME}}' },
        ];
      }
      if ("COMPANY_PROFILE_INCOMPLETE" == emailTemplateType) {
        mergeTags = [{ name: 'Customer Full Name', value: '{{_CUSTOMER_FULL_NAME}}' },
        { name: 'Sender Full Name', value: '{{senderFullName}}' },
        ];
      }
      if ("JOIN_VERSA_TEAM" == emailTemplateType || "JOIN_MY_TEAM" == emailTemplateType) {
        mergeTags = [{ name: 'Sender Full Name', value: '{{senderFullName}}' },];
      }

      if (self.properties.UNLOCK_MDF_FUNDING == emailTemplateType) {
        mergeTags = [{ name: 'Campaign Details', value: '{{campaignName}}' }];
      }
      if (["LEAD_APPROVE", "LEAD_REJECT", "PRM_LEAD_APPROVE", "PRM_LEAD_REJECT"].includes(emailTemplateType)) {
        mergeTags = [{ name: 'Lead Name', value: '{{leadName}}' },
          { name: 'Lead Company', value: '{{leadCompany}}' },
        { name: 'Lead Comment', value: '{{leadComment}}' },
        { name: 'Vendor Company Name', value: '{{VENDOR_COMPANY_NAME}}' },
        { name: 'Lead Stage', value: '{{leadStage}}' },
        { name: 'Customer Full Name', value: '{{customerFullName}}' },
        { name: 'Sender Full Name', value: '{{senderFullName}}' }
        ];
      }
      if (["LEAD_REJECT", "LEAD_APPROVE"].includes(emailTemplateType)) {
        mergeTags.push({ name: 'Lead Associated Campaign', value: '{{leadAssociatedCampaign}}' });
      }
      if (["TEAM_MEMBER_PORTAL"].includes(emailTemplateType)) {
        mergeTags = [{ name: 'Customer Full Name', value: '{{customerFullName}}' },
          { name: 'Vendor Full Name', value: '{{VENDOR_FULL_NAME}}' },
          { name: 'Vendor Company Name', value: '{{VENDOR_COMPANY_NAME}}' },
        ];
        }
        if ("PRM_PARTNER_ADD_LEAD" == emailTemplateType || "PRM_PARTNER_UPDATE_LEAD" == emailTemplateType) {
          mergeTags = [{ name: 'Customer Full Name', value: '{{customerFullName}}' },
            { name: 'Created By Name', value: '{{createdByName}}' },
            { name: 'Created For Company', value: '{{createdForCompanyName}}' },
          { name: 'Lead Name', value: '{{leadName}}' },
          { name: 'Lead Company', value: '{{leadCompany}}' },
          { name: 'Lead Stage', value: '{{leadStage}}' },
          { name: 'Lead Comment', value: '{{leadComment}}' },
          { name: 'Company Name', value: '{{companyName}}' },
          ];
        }
        if ("PARTNER_ADD_DEAL" == emailTemplateType || "PARTNER_UPDATE_DEAL" == emailTemplateType) {
          mergeTags = [{ name: 'Customer Full Name', value: '{{customerFullName}}' },
            { name: 'Created By Name', value: '{{createdByName}}' },
            { name: 'Created For Company', value: '{{createdForCompanyName}}' },
            { name: 'Lead Name', value: '{{leadName}}' },
            { name: 'Lead Company', value: '{{leadCompany}}' },
            { name: 'Deal Name', value: '{{dealName}}' },
            { name: 'Deal Amount', value: '{{dealAmount}}' },
            { name: 'Deal Stage', value: '{{dealStage}}' },
            { name: 'Deal Comment', value: '{{dealComment}}' },
            { name: 'Company Name', value: '{{companyName}}' },
          ];
        }
        if ("PARTNER_ADD_LEAD" == emailTemplateType || "PARTNER_UPDATE_LEAD" == emailTemplateType) {
          mergeTags = [{ name: 'Customer Full Name', value: '{{customerFullName}}' },
            { name: 'Created By Name', value: '{{createdByName}}' },
            { name: 'Created For Company', value: '{{createdForCompanyName}}' },
          { name: 'Lead Name', value: '{{leadName}}' },
          { name: 'Lead Company', value: '{{leadCompany}}' },
          { name: 'Associated Campaign', value: '{{leadAssociatedCampaign}}' },
          { name: 'Lead Stage', value: '{{leadStage}}' },
          { name: 'Lead Comment', value: '{{leadComment}}' },
          { name: 'Company Name', value: '{{companyName}}' },
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
    this.customResponse = new CustomResponse('', '', false);
    const existingName = emailTemplate.name;
    const newSubject = emailTemplate.subject;
    this.checkForDuplicates(newSubject, existingName, emailTemplate.id);
    if (this.isSubjectDuplicate) {
      this.loading = false;
      this.customResponse = new CustomResponse('ERROR', this.properties.DUPLICATE_SUBJECT_ERROR_TEXT, true);
      this.isSubjectDuplicate = false;
      return;
     } 
     else {
      this.customResponse = new CustomResponse('', '', false);
    }
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
 
//------------

private findPageDataAndLoadBeeContainer(landingPageService: LandingPageService, authenticationService: AuthenticationService) {
  this.referenceService.goToTop();
  this.id = this.landingPageService.id;
  this.loggedInAsSuperAdmin = this.referenceService.getCurrentRouteUrl().indexOf("saveAsDefault") > -1;
  this.mergeTagsInput['page'] = true;
  if (this.id != undefined && this.id > 0) {
      var names: any = [];
      let self = this;
      var pageType = "";
      if (this.loggedInAsSuperAdmin) {
          self.loggedInUserId = 1;
      } else {
          self.loggedInUserId = this.authenticationService.getUserId();
      }
      if (!this.loggedInAsSuperAdmin) {
        landingPageService.getAvailableNames(self.loggedInUserId, false,landingPageService.landingPageSource ).subscribe(
              (data: any) => { names = data; },
              error => {
                //  this.logger.error("error in getAvailableNames(" + self.loggedInUserId + ")", error);
              });
          authenticationService.getCategoryNamesByUserId(self.loggedInUserId).subscribe(
              (data: any) => {
                  self.categoryNames = data.data;
              },
              error => { //this.logger.error("error in getCategoryNamesByUserId(" + self.loggedInUserId + ")", error); },
              //() => this.logger.info("Finished getCategoryNamesByUserId()")
      });
      }

      this.landingPageService.getById(this.id).subscribe(
          (response: any) => {
              if (response.statusCode == 200) {
                  let landingPage = response.data;
                  let defaultLandingPage = landingPage.defaultLandingPage;
                  this.defaultLandingPage = defaultLandingPage;
                  this.landingPage = new LandingPage();
                  this.landingPage.thumbnailPath = landingPage.thumbnailPath;
                  this.landingPage.coBranded = landingPage.coBranded;
                  this.landingPage.type = landingPage.type;
                  this.landingPage.categoryId = landingPage.categoryId;
                  this.landingPage.openLinksInNewTab = landingPage.openLinksInNewTab;
                  if(landingPage.sourceInString == 'VENDOR_JOURNEY' || landingPage.sourceInString == 'MASTER_PARTNER_PAGE'
                    ||landingPage.sourceInString == 'WELCOME_PAGE' || landingPage.sourceInString == 'PARTNER_JOURNEY_PAGE'
                    || landingPage.sourceInString == 'VENDOR_MARKETPLACE_PAGE'){
                    this.landingPage.sourceInString = landingPage.sourceInString;
                  }
                  this.openInNewTabChecked = this.landingPage.openLinksInNewTab;
                  this.landingPageOpenInNewTabChecked.emit()
                  $('#' + this.openLinksInNewTabCheckBoxId).prop("checked", this.landingPage.openLinksInNewTab);
                  var request = function (method, url, data, type, callback) {
                      var req = new XMLHttpRequest();
                      req.onreadystatechange = function () {
                          if (req.readyState === 4 && req.status === 200) {
                              var response = JSON.parse(req.responseText);
                              callback(response);
                          } else if (req.readyState === 4 && req.status !== 200) {
                              //self.ngxloading = false;
                              self.referenceService.showSweetAlertErrorMessage("Unable to load Bee container.Please try reloading the page/check your internet connection.");
                          }
                      };
                      req.open(method, url, true);
                      if (data && type) {
                          if (type === 'multipart/form-data') {
                              var formData = new FormData();
                              for (var key in data) { formData.append(key, data[key]); }
                              data = formData;
                          }
                          else { req.setRequestHeader('Content-type', type); }
                      }
                      req.send(data);
                  };
                  var title = "Add Page Name";
                  var landingPageName = "";
                  if (!defaultLandingPage) {
                      landingPageName = landingPage.name;
                      pageType = landingPage.type;
                      title = "Update Page Name";
                  }
                  var save = function (jsonContent: string, htmlContent: string) {
                      self.landingPage.htmlBody = htmlContent;
                      self.landingPage.jsonBody = jsonContent;

                      if(self.isMasterLandingPages || self.isVendorMarketplacePages){
                        if(self.authenticationService.module.isAnyAdminOrSupervisor && !self.isVendorMarketplacePages ){
                          for(let logoDetails of self.vendorLogoDetails){
                            logoDetails.selected = self.sharedVendorLogoDetails
                            .filter(company=> company.companyId == logoDetails.companyId)[0].teamMembers
                            .filter(member=>member.partnerId == logoDetails.partnerId)[0].selected;
                            logoDetails.categoryIds = self.sharedVendorLogoDetails
                            .filter(company=> company.companyId == logoDetails.companyId)[0].teamMembers
                            .filter(member=>member.partnerId == logoDetails.partnerId)[0].categoryIds;
                          }
                        }
                        let message = self.isMasterLandingPages? "Whoops! We're unable to save this page because you haven't selected the vendor details. Click on the Pick Your Vendors button to choose vendors.":
                        "Whoops! We're unable to save this page because you haven't selected the partner details. Click on the Pick Your Partners button to choose partners."
                        if((self.vendorLogoDetails.length == 0 || self.vendorLogoDetails == null  ||(self.vendorLogoDetails != null && self.vendorLogoDetails.length != 0 && self.vendorLogoDetails.every(logo=>(!logo.selected))))){
                          swal("", message, "error");
                          return false;
                        }
                      }
                      if (self.landingPage.coBranded) {
                          if (jsonContent.indexOf(self.coBraningImage) < 0) {
                              swal("", "Whoops! We're unable to save this page because you deleted the co-branding logo. You'll need to select a new page and start over.", "error");
                              return false;
                          }
                      }
                      if(self.isVendorMarketplacePages && (jsonContent.indexOf(self.categoriesAndCompaniesImage) < 0 
                       && jsonContent.indexOf(self.googleMapsImage) < 0)){
                        swal("", "Whoops! We're unable to save this page because you deleted the Company Tiles Logo and Google Maps Logo. You'll need to select a new page and start over.", "error");
                        return false;
                      }

                      if (!defaultLandingPage) {
                          self.name = landingPageName;
                          var buttons = $('<div><div id="bee-save-buton-loader"></div>')
                              .append(' <div class="form-group"><input class="form-control" type="text" value="' + landingPageName + '" id="templateNameId" maxLength="200" autocomplete="off"><span class="help-block" id="templateNameSpanError" style="color:#a94442"></span></div><br>');
                          let dropDown = '';
                          if (!self.authenticationService.module.isMarketingCompany && !self.vendorJourney && !self.isMasterLandingPages && !self.welcomePages && !self.isPartnerJourneyPages && !self.isVendorMarketplacePages) {
                              /**********Public/Private************** */
                              dropDown += '<div class="form-group">';
                              dropDown += '<label style="color: #575757;font-size: 17px; font-weight: 500;">Select Page Type</label>';
                              dropDown += '<select class="form-control" id="pageType">';
                              if (pageType == "PRIVATE") {
                                  dropDown += '<option value="PRIVATE" selected>PRIVATE</option>';
                                  dropDown += '<option value="PUBLIC">PUBLIC</option>';
                              } else {
                                  dropDown += '<option value="PUBLIC" selected>PUBLIC</option>';
                                  dropDown += '<option value="PRIVATE">PRIVATE</option>';
                              }
                              dropDown += '</select>';
                              dropDown += '<span class="help-block" id="pageTypeSpanError" style="color:#a94442"></span>';
                              dropDown += '</div><br>';
                          }
                          /**********Folder List************** */
                          dropDown += '<div class="form-group">';
                          dropDown += '<label style="color: #575757;font-size: 17px; font-weight: 500;">Select a folder</label>';
                          dropDown += '<select class="form-control" id="page-folder-dropdown">';
                          $.each(self.categoryNames, function (_index: number, category: any) {
                              let categoryId = category.id;
                              if (self.landingPage.categoryId == categoryId) {
                                  dropDown += '<option value=' + category.id + ' selected>' + category.name + '</option>';
                              } else {
                                  dropDown += '<option value=' + category.id + '>' + category.name + '</option>';
                              }
                          });
                          dropDown += '</select>';
                          dropDown += '</div><br>';
                          buttons.append(dropDown);

                          buttons.append(self.createButton('Save As', function () {
                              self.clickedButtonName = "SAVE_AS";
                              self.saveLandingPage(true);
                          })).append(self.createButton('Update', function () {
                              let selectedPageType = $('#pageType option:selected').val();
                              if (self.landingPage.type == selectedPageType || selectedPageType == undefined) {
                                  $('#pageTypeSpanError').empty();
                                  //self.ngxloading = true;
                                  self.clickedButtonName = "UPDATE";
                                  $("#bee-save-buton-loader").addClass("button-loader");
                                  self.updateLandingPage(false);
                              } else {
                                  $('#pageTypeSpanError').text('Page Type cannot be changed');
                              }

                          })).append(self.createButton('Update & Redirect', function () {
                              let selectedPageType = $('#pageType option:selected').val();
                              if (self.landingPage.type == selectedPageType || selectedPageType == undefined) {
                                  $('#pageTypeSpanError').empty();
                                  //self.ngxloading = true;
                                  self.clickedButtonName = "UPDATE_AND_REDIRECT";
                                  $("#bee-save-buton-loader").addClass("button-loader");
                                  self.updateLandingPage(true);
                              } else {
                                  $('#pageTypeSpanError').text('Page Type cannot be changed');
                              }
                          })).
                          append(self.createButton('Cancel', function () {
                              self.clickedButtonName = "CANCEL";
                              swal.close();
                          }));
                          swal({ title: title, html: buttons, showConfirmButton: false, showCancelButton: false, allowOutsideClick: false,allowEscapeKey: false });
                      } else {
                          var buttons = $('<div><div id="bee-save-buton-loader"></div>')
                              .append(' <div class="form-group"><input class="form-control" type="text" value="' + landingPageName + '" id="templateNameId" maxLength="200"  autocomplete="off">' +
                                  '<span class="help-block" id="templateNameSpanError" style="color:#a94442"></span></div><br>');
                          if (!self.loggedInAsSuperAdmin) {
                              let dropDown = '';
                              if (!self.authenticationService.module.isMarketingCompany && !self.vendorJourney && !self.isMasterLandingPages && !self.welcomePages && !self.isPartnerJourneyPages && !self.isVendorMarketplacePages) {
                                  dropDown += '<div class="form-group">';
                                  dropDown += '<label style="color: #575757;font-size: 17px; font-weight: 500;">Select Page Type</label>';
                                  dropDown += '<select class="form-control" id="pageType">';
                                  dropDown += '<option value="PRIVATE">PRIVATE</option>';
                                  dropDown += '<option value="PUBLIC">PUBLIC</option>';
                                  dropDown += '</select>';
                                  dropDown += '<span class="help-block" id="pageTypeSpanError" style="color:#a94442"></span>';
                                  dropDown += '</div><br>';
                              }
                              /**********Folder List************** */
                              dropDown += '<div class="form-group">';
                              dropDown += '<label style="color: #575757;font-size: 17px; font-weight: 500;">Select a folder</label>';
                              dropDown += '<select class="form-control" id="page-folder-dropdown">';
                              $.each(self.categoryNames, function (_index: number, category: any) {
                                  dropDown += '<option value=' + category.id + '>' + category.name + '</option>';
                              });
                              dropDown += '</select>';
                              dropDown += '</div><br>';
                              buttons.append(dropDown);
                          }

                          let url = self.referenceService.getCurrentRouteUrl();
                              let saveAsDefaultUrl = url.indexOf("saveAsDefault")>-1;
                              if(!saveAsDefaultUrl){
                                  buttons.append(self.createButton('Save', function () {
                                      self.clickedButtonName = "SAVE";
                                      self.saveLandingPage(false);
                                  }));
                              }

                          buttons.append(self.createButton('Save & Redirect', function () {
                              self.clickedButtonName = "SAVE_AND_REDIRECT";
                              self.saveLandingPage(true);
                          })).append(self.createButton('Cancel', function () {
                              self.clickedButtonName = "CANCEL";
                              swal.close();
                          }));
                          swal({
                              title: title,
                              html: buttons,
                              showConfirmButton: false,
                              showCancelButton: false,
                              allowOutsideClick: false,
                              allowEscapeKey: false 
                          });
                      }

                      $('#pageType').on('change', function (event) {
                          $('#pageTypeSpanError').empty();
                      });

                      $('#templateNameId').on('input', function (event) {
                          let value = $.trim(event.target.value);
                          self.name = value;
                          if (value.length > 0) {
                              if (!defaultLandingPage) {
                                  if (names.indexOf(value.toLocaleLowerCase()) > -1 && landingPage.name.toLocaleLowerCase() != value.toLocaleLowerCase()) {
                                      $('#save,#update,#save-as,#update-and-close,#save-and-redirect').attr('disabled', 'disabled');
                                      $('#templateNameSpanError').text('Duplicate Name');
                                  } else if (value.toLocaleLowerCase() == landingPage.name.toLocaleLowerCase()) {
                                      $('#templateNameSpanError').empty();
                                      $('#save,#save-as,#save-and-redirect,#update,#update-and-close').attr('disabled', 'disabled');
                                      $('#update,#update-and-close').removeAttr('disabled');
                                  }
                                  else {
                                      $('#templateNameSpanError').empty();
                                      $('#save,#update,#save-as,#save-and-redirect,#update-and-close').removeAttr('disabled');
                                  }
                              } else {
                                  if (names.indexOf(value.toLocaleLowerCase()) > -1) {
                                      $('#save,#update,#save-as,#update-and-close,#save-and-redirect').attr('disabled', 'disabled');
                                      $('#templateNameSpanError').text('Duplicate Name');
                                  } else {
                                      $('#templateNameSpanError').empty();
                                      $('#save,#update,#save-as,#update-and-close,#save-and-redirect').removeAttr('disabled');
                                  }
                              }
                          } else {
                              $('#save,#update,#save-as,#update-and-close,#save-and-redirect').attr('disabled', 'disabled');
                          }
                      });

                  };
                  let mergeTags = this.referenceService.addPageMergeTags();
                  if (this.referenceService.companyId != undefined && this.referenceService.companyId > 0) {
                      var beeUserId = self.loggedInAsSuperAdmin ? "bee-1" : "bee-" + this.referenceService.companyId;
                      var beeConfig = {
                          uid: beeUserId,
                          container: 'xamplify-default-template-bee-container',
                          autosave: 15,
                          mergeTags: mergeTags,
                          preventClose: true,
                          //language: 'en-US',
                          language: this.authenticationService.beeLanguageCode,
                          onSave: function (jsonFile, htmlFile) {
                              save(jsonFile, htmlFile);
                          },
                          onSaveAsTemplate: function (jsonFile) {
                          },
                          onAutoSave: function (jsonFile) {
                              self.landingPage.jsonBody = jsonFile;
                              self.isMinTimeOver = true;
                          },
                          onSend: function (htmlFile) {
                          },
                          onError: function (errorMessage) {
                              self.referenceService.showSweetAlertErrorMessage("Unable to load bee template:" + errorMessage);
                              //self.ngxloading = false;
                          }
                      };

                      var bee = null;
                      request(
                          'POST',
                          'https://auth.getbee.io/apiauth',
                          'grant_type=password&client_id=' + authenticationService.beePageClientId + '&client_secret=' + authenticationService.beePageClientSecret + '',
                          'application/x-www-form-urlencoded',
                          function (token: any) {
                              BeePlugin.create(token, beeConfig, function (beePluginInstance: any) {
                                  bee = beePluginInstance;
                                  request(
                                      authenticationService.beeRequestType,
                                      authenticationService.beeHostApi,
                                      null,
                                      null,
                                      function (template: any) {
                                          var body = landingPage.jsonBody;
                                          if (self.referenceService.companyProfileImage != undefined && !self.loggedInAsSuperAdmin) {
                                              body = body.replace("https://xamp.io/vod/replace-company-logo.png", self.authenticationService.MEDIA_URL + self.referenceService.companyProfileImage);
                                          }
                                          var jsonBody = JSON.parse(body);
                                          bee.load(jsonBody);
                                          bee.start(jsonBody);
                                          self.referenceService.updateBeeIframeContainerHeight();
                                          self.loadLandingPage = true;
                                          //self.ngxloading = false;
                                      });
                              });
                          });
                  }
              } else {
                  swal("Please Contact Admin!", "No CompanyId Found", "error");
                  //this.ngxloading = false;
              }
          },
          (error: any) => {
              this.skipConfirmAlert = true;
              swal.close();
              //this.logger.errorPage(error);
          });
  } else {
      this.skipConfirmAlert =true;
      this.navigateToManageSection();
  }
}

saveLandingPage(isSaveAndRedirectButtonClicked: boolean) {
  this.isSaveAndRedirectButtonClicked = isSaveAndRedirectButtonClicked;
  this.customResponse = new CustomResponse();
  $("#bee-save-buton-loader").addClass("button-loader"); 
  $('#templateNameSpanError').text('');
  this.landingPage.name = this.name;
  this.landingPage.userId = this.loggedInUserId;
  this.landingPage.companyProfileName = this.authenticationService.companyProfileName;
  this.landingPage.hasVendorJourney = this.vendorJourney || this.isMasterLandingPages ;
  this.landingPage.previousLandingPageId = this.id;
  this.landingPage.vendorLogoDetails = this.vendorLogoDetails.filter(vendor=>vendor.selected);
  if(this.landingPage.hasVendorJourney || this.welcomePages || this.isPartnerJourneyPages || this.isVendorMarketplacePages){
    this.landingPage.openLinksInNewTab = this.openInNewTabChecked;
    this.landingPage.type = LandingPageType.PUBLIC;
  }
  if (!this.loggedInAsSuperAdmin) {
      if(!this.vendorJourney && !this.isMasterLandingPages && !this.welcomePages && !this.isPartnerJourneyPages && !this.isVendorMarketplacePages){
        this.landingPage.type = $('#pageType option:selected').val();
      }
      this.landingPage.categoryId = $.trim($('#page-folder-dropdown option:selected').val());
      this.updateCompanyLogo(this.landingPage);
      
    }
  this.landingPageService.save(this.landingPage, this.loggedInAsSuperAdmin,this.id).subscribe(
      data => {
          swal.close();
          $("#bee-save-buton-loader").removeClass("button-loader"); 
          if (this.loggedInAsSuperAdmin) {
              this.skipConfirmAlert = true;
             this.referenceService.showSweetAlertProceesor(this.landingPage.name + " Created Successfully");
             let self = this;
              setTimeout(function(){
                this.navigateToManageSection();
              }, 1500);
          } else {
              this.goToManageAfterSave(data, isSaveAndRedirectButtonClicked);
          }
      },
      error => {
          $("#bee-save-buton-loader").removeClass("button-loader"); 
          let statusCode = JSON.parse(error['status']);
          if (error.status == 400) {
            let message = JSON.parse(error['_body']).message;
            swal(message, "", "error");
          }else if (statusCode == 409) {
              let errorResponse = JSON.parse(error['_body']);
              let message = errorResponse['message'];
              $('#templateNameSpanError').text(message);
          } else {
              this.skipConfirmAlert = true;
              //this.logger.errorPage(error);
          }
      });
}

goToManageAfterSave(data:any, isSaveAndRedirectButtonClicked:boolean) {
  if (data.access) {
      if (isSaveAndRedirectButtonClicked) {
          this.referenceService.addCreateOrUpdateSuccessMessage("Page created successfully");
            this.navigateToManageSection();
      } else {
          //this.ngxloading = true;
          this.customResponse = new CustomResponse('SUCCESS',"Page created successfully",true);
          let map = data.map;
          let createdPageId = map['landingPageId'];
          this.landingPageService.id = createdPageId;
          this.findPageDataAndLoadBeeContainer(this.landingPageService,this.authenticationService);
      }
  } else {
      this.skipConfirmAlert = true;
      this.authenticationService.forceToLogout();
  }
}

navigateToManageSection() {
  this.redirect.emit();
}


updateLandingPage(updateAndRedirectClicked: boolean) {
  this.updateAndRedirectClicked = updateAndRedirectClicked;
  this.customResponse = new CustomResponse();
  this.landingPage.name = this.name;
  this.landingPage.id = this.id;
  this.landingPage.userId = this.loggedInUserId;
  this.landingPage.categoryId = $.trim($('#page-folder-dropdown option:selected').val());
  this.landingPage.companyProfileName = this.authenticationService.companyProfileName;
  this.landingPage.hasVendorJourney = this.vendorJourney || this.isMasterLandingPages;
  this.landingPage.welcomePages = this.welcomePages;
  this.landingPage.partnerJourneyPages = this.isPartnerJourneyPages;
  this.landingPage.vendorMarketPlacePage = this.isVendorMarketplacePages;
  if(this.landingPage.hasVendorJourney || this.welcomePages || this.isPartnerJourneyPages || this.isVendorMarketplacePages){
    this.landingPage.openLinksInNewTab = this.openInNewTabChecked;
  }
  this.landingPage.vendorLogoDetails = this.vendorLogoDetails.filter(vendor=>vendor.selected);
  this.updateCompanyLogo(this.landingPage);
  this.landingPageService.update(this.landingPage).subscribe(
      data => {
          swal.close();
          $("#bee-save-buton-loader").removeClass("button-loader"); 
          if (data.access) {
              if (updateAndRedirectClicked) {
                  this.referenceService.addCreateOrUpdateSuccessMessage("Page updated successfully");
                  this.navigateToManageSection();
              } else {
                  this.customResponse = new CustomResponse('SUCCESS', "Page updated successfully", true);
                  //this.ngxloading = true;
                  this.findPageDataAndLoadBeeContainer(this.landingPageService,this.authenticationService);
              }
          } else {
              this.skipConfirmAlert = true; 
              this.authenticationService.forceToLogout();
          }
      },
      error => {
          swal.close();
          $("#bee-save-buton-loader").removeClass("button-loader"); 
          //this.ngxloading = false;
          if (error.status == 400) {
              let message = JSON.parse(error['_body']).message;
              swal(message, "", "error");
          } else {
              this.skipConfirmAlert = true;
              //this.logger.errorPage(error);
          }
      });


}

updateCompanyLogo(landingPage: LandingPage) {
  landingPage.jsonBody = landingPage.jsonBody.replace(this.authenticationService.MEDIA_URL + this.referenceService.companyProfileImage, "https://xamp.io/vod/replace-company-logo.png");
  if (landingPage.htmlBody != undefined) {
      landingPage.htmlBody = landingPage.htmlBody.replace(this.authenticationService.MEDIA_URL + this.referenceService.companyProfileImage, "https://xamp.io/vod/replace-company-logo.png");
  }
}


createButton(text:string, cb:any) {
  let buttonClass = this.isAdd ? "btn btn-primary":"btn btn-sm btn-primary";
  let cancelButtonClass = this.isAdd ? "btn Btn-Gray":"btn btn-sm Btn-Gray";
  let cancelButtonSettings = this.isAdd ? 'class="'+cancelButtonClass+'"' : 'class="'+cancelButtonClass+'" style="margin-right: -35px !important;"';
  if (text == "Save") {
      return $('<input type="submit" class="'+buttonClass+'"  value="' + text + '" id="save" disabled="disabled">').on('click', cb);
  }else if(text == "Save & Redirect"){
      return $('<input type="submit" class="'+buttonClass+'"  value="' + text + '" id="save-and-redirect" disabled="disabled">').on('click', cb);
  }else if (text == "Save As") {
      return $('<input type="submit" class="'+buttonClass+'" style="margin-left: -33px !important" value="' + text + '" id="save-as" disabled="disabled">').on('click', cb);
  } else if (text == "Update") {
      return $('<input type="submit" class="'+buttonClass+'" value="' + text + '" id="update">').on('click', cb);
  }else if (text == "Update & Redirect") {
      return $('<input type="submit" class="'+buttonClass+'" value="' + text + '" id="update-and-close">').on('click', cb);
  }else {
      return $('<input type="submit" '+cancelButtonSettings+' value="' + text + '">').on('click', cb);
  }
}

@HostListener('window:beforeunload')
    canDeactivate(): Observable<boolean> | boolean {
        this.authenticationService.stopLoaders();
        let isInvalidEditPage = this.landingPageService.id==undefined || this.landingPageService.id==0;
        return this.skipConfirmAlert ||  this.isSaveAndRedirectButtonClicked || this.updateAndRedirectClicked || isInvalidEditPage || this.authenticationService.module.logoutButtonClicked;
    }

}
