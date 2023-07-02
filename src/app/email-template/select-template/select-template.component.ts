import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { ReferenceService } from '../../core/services/reference.service';
import { EmailTemplateService } from '../services/email-template.service';
import { EmailTemplate } from '../models/email-template';
import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { CampaignAccess } from 'app/campaigns/models/campaign-access';
import { CustomResponse } from '../../common/models/custom-response';
import { MarketoEmailTemplate } from '../models/marketo-email-template';
import { HubSpotService } from 'app/core/services/hubspot.service';
import { UtilService } from '../../core/services/util.service';

declare var $,swal: any;
@Component({
    selector: 'app-select-template',
    templateUrl: './select-template.component.html',
    styleUrls: ['./select-template.component.css'],
    providers: [EmailTemplate, HttpRequestLoader, CampaignAccess],
})
export class SelectTemplateComponent implements OnInit, OnDestroy {

    public allEmailTemplates: Array<EmailTemplate> = new Array<EmailTemplate>();
    public filteredEmailTemplates: Array<EmailTemplate> = new Array<EmailTemplate>();
    public templateSearchKey: string = "";
    templateFilter: any = { name: '' };
    selectedTemplateTypeIndex: number = 0;
    httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();

    /**MARKETO */
    loading: boolean;
    clientId: string;
    secretId: string;
    marketoInstance: string;
    clientIdClass: string;
    marketoInstanceClass: string;
    secretIdClass: string;
    isValidEmail: boolean;
    clentIdError: boolean;
    secretIdError: boolean;
    marketoInstanceError: boolean;
    isModelFormValid: boolean;
    templateError: any;
    templateSuccessMsg: any
    showMarketoForm: boolean;
    marketoEmailTemplates: EmailTemplate[] = [];
    selectedTemplates: number[] = [];
    selectAllTemplates = false;
    isSaveMarketoTemplatesButtonState = false;
    isSaveHubSpotTemplatesButtonState = false;
    customResponse: CustomResponse = new CustomResponse();
    importLoading: boolean;
    hubSpotEmailTemplates: EmailTemplate[] = [];
    basicTemplates = [32, 33, 34, 35, 36, 37, 38, 39, 40, 307, 325, 359, 360];
    selectedThirdPartyIntegration: string;
    uploadBaseUrl = "/home/emailtemplates/upload/";
    customUploadRegularUrl = this.uploadBaseUrl+"custom";
    customUploadVieoUrl = this.customUploadRegularUrl+"v";
    marketoUploadUrl = this.uploadBaseUrl+"marketo";
    hubspotUploadUrl = this.uploadBaseUrl+"hubspot";
    campaignAccess: CampaignAccess = new CampaignAccess();
    loggedInAsSuperAdmin = false;
    isMarketingCompany = false;
    /**** user guide ********/
    mergeTagForGuide:any;
    constructor(private emailTemplateService: EmailTemplateService,
        private router: Router, private authenticationService: AuthenticationService,
        private logger: XtremandLogger, public refService: ReferenceService, private hubSpotService: HubSpotService,private utilService:UtilService) {
            this.loggedInAsSuperAdmin = this.utilService.isLoggedInFromAdminPortal();

    }
    ngOnInit() {
        try {
           // this.getUserGuideMergeTags();
            this.listDefaultTemplates();
        }
        catch (error) {
            this.logger.error(this.refService.errorPrepender + " ngOnInit():", error);
        }
    }

    listDefaultTemplates() {
        this.refService.loading(this.httpRequestLoader, true);
        this.emailTemplateService.listDefaultTemplates(this.authenticationService.user.id)
            .subscribe(
                (response: any) => {
                    let emailTemplates = response.data.emailTemplates;
                    this.allEmailTemplates = emailTemplates ;
                    this.campaignAccess = response.data.campaignAccess;
                    this.isMarketingCompany = response.data.isMarketingCompany;
                    this.allEmailTemplates = emailTemplates;
                    this.filteredEmailTemplates = emailTemplates;
                    this.refService.loading(this.httpRequestLoader, false);
                },
                (error: string) => {
                    this.logger.error(this.refService.errorPrepender + " listDefaultTemplates():" + error);
                    this.refService.showServerError(this.httpRequestLoader);
                },
                () => this.logger.info("Finished listDefaultTemplates()")
            );
    }

    hideEventTemplates(data: any) {
        const allData = [];
        for (let i = 0; i < data.length; i++) { if (!data[i].name.includes('Event')) { allData.push(data[i]); } }
        return allData;
    }

    ngOnDestroy() {
        //  this.emailTemplateService.emailTemplate = new EmailTemplate();
    }

    showAllTemplates(index: number) {
        this.filteredEmailTemplates = new Array<EmailTemplate>();
        this.filteredEmailTemplates = this.allEmailTemplates;
        this.selectedTemplateTypeIndex = index;
    }


    showRegularTemplates() {
        try {
            this.filteredEmailTemplates = new Array<EmailTemplate>();
            for (var i = 0; i < this.allEmailTemplates.length; i++) {
                var isBeeRegularTemplate = this.allEmailTemplates[i].beeRegularTemplate;
                if (isBeeRegularTemplate) {
                    this.filteredEmailTemplates.push(this.allEmailTemplates[i]);
                }
            }
            this.logger.debug("Showing Regular Templates size of" + this.filteredEmailTemplates.length);
        } catch (error) {
            var cause = "Error in showRegularTemplates() in selectTemplatesComponent";
            this.logger.error(cause + ":" + error);
        }
    }

    showEventTemplates(index: number) {
        try {
            this.selectedTemplateTypeIndex = index;
            this.mergeTagForGuide = 'design_event_template';
            this.filteredEmailTemplates = new Array<EmailTemplate>();
            for (var i = 0; i < this.allEmailTemplates.length; i++) {
                var isBeeEventTemplate = this.allEmailTemplates[i].beeEventTemplate;
                if (isBeeEventTemplate) {
                    this.filteredEmailTemplates.push(this.allEmailTemplates[i]);
                }
            }
            this.logger.debug("Showing EventTemplates Templates size of" + this.filteredEmailTemplates.length);
        } catch (error) {
            var cause = "Error in showEventTemplates() in selectTemplatesComponent";
            this.logger.error(cause + ":" + error);
        }
    }

    showEventCoBrandingTemplates(index: number) {
        try {
            this.selectedTemplateTypeIndex = index;
            this.filteredEmailTemplates = new Array<EmailTemplate>();
            for (var i = 0; i < this.allEmailTemplates.length; i++) {
                var beeEventCoBrandingTemplate = this.allEmailTemplates[i].beeEventCoBrandingTemplate;
                if (beeEventCoBrandingTemplate) {
                    this.filteredEmailTemplates.push(this.allEmailTemplates[i]);
                }
            }
            this.logger.debug("Showing EventTemplates Templates size of" + this.filteredEmailTemplates.length);
        } catch (error) {
            var cause = "Error in showEventTemplates() in selectTemplatesComponent";
            this.logger.error(cause + ":" + error);
        }
    }


    showVideoTemplates() {
        try {
            this.filteredEmailTemplates = new Array<EmailTemplate>();
            for (var i = 0; i < this.allEmailTemplates.length; i++) {
                var isBeeVideoTemplate = this.allEmailTemplates[i].beeVideoTemplate;
                if (isBeeVideoTemplate) {
                    this.filteredEmailTemplates.push(this.allEmailTemplates[i]);
                }
            }
            this.logger.debug("Showing Video Templates size of" + this.filteredEmailTemplates.length);
        } catch (error) {
            var cause = "Error in showVideoTemplates() in selectTemplatesComponent";
            this.logger.error(cause + ":" + error);
        }
    }

    showUploadTemplates(index: number) {
        try {
            this.filteredEmailTemplates = new Array<EmailTemplate>();
            this.selectedTemplateTypeIndex = index;
            for (var i = 0; i < this.allEmailTemplates.length; i++) {
                var name = this.allEmailTemplates[i].name;
                if (name.indexOf("Upload") > -1) {
                    this.filteredEmailTemplates.push(this.allEmailTemplates[i]);
                }
            }
            this.logger.debug("Showing Upload Templates size of: " + this.filteredEmailTemplates.length);
            this.logger.debug(this.filteredEmailTemplates);
        } catch (error) {
            var cause = "Error in showUploadTemplates() in selectTemplatesComponent";
            this.logger.error(cause + ":" + error);
        }
    }

    showBasicTemplates(index: number) {
        try {
            this.filteredEmailTemplates = new Array<EmailTemplate>();
            this.selectedTemplateTypeIndex = index;
            for (var i = 0; i < this.allEmailTemplates.length; i++) {
                var isBeeRegularTemplate = this.allEmailTemplates[i].beeRegularTemplate;
                if (isBeeRegularTemplate) {
                    if (this.allEmailTemplates[i].name.indexOf('Basic') > -1) {
                        this.filteredEmailTemplates.push(this.allEmailTemplates[i]);
                    }
                }
            }
            this.logger.debug("Showing Basic Templates size of" + this.filteredEmailTemplates.length);
        } catch (error) {
            var cause = "Error in showBasicTemplates() in selectTemplatesComponent";
            this.logger.error(cause + ":" + error);
        }
    }

    showRichTemplates(index: number) {
        try {
            //this.getUserGuideMergeTags();
            this.filteredEmailTemplates = new Array<EmailTemplate>();
            this.selectedTemplateTypeIndex = index;
            this.mergeTagForGuide = 'design_email_template';
            for (var i = 0; i < this.allEmailTemplates.length; i++) {
                var isBeeRegularTemplate = this.allEmailTemplates[i].beeRegularTemplate;
                if (isBeeRegularTemplate) {
                    this.filteredEmailTemplates.push(this.allEmailTemplates[i]);
                }
            }
            this.logger.debug("Showing Rich Templates size of" + this.filteredEmailTemplates.length);
        } catch (error) {
            var cause = "Error in showRichTemplates() in selectTemplatesComponent";
            this.logger.error(cause + ":" + error);
        }

    }

    showBasicVideoTemplates(index: number) {
        try {
            this.filteredEmailTemplates = new Array<EmailTemplate>();
            this.selectedTemplateTypeIndex = index;
            for (var i = 0; i < this.allEmailTemplates.length; i++) {
                var isBeeVideoTemplate = this.allEmailTemplates[i].beeVideoTemplate;
                if (isBeeVideoTemplate) {
                    if (this.allEmailTemplates[i].name.indexOf('Basic') > -1) {
                        this.filteredEmailTemplates.push(this.allEmailTemplates[i]);
                    }
                }
            }
            this.logger.debug("Showing Basic Video Templates size of" + this.filteredEmailTemplates.length);
        } catch (error) {
            var cause = "Error in showBasicVideoTemplates() in selectTemplatesComponent";
            this.logger.error(cause + ":" + error);
        }

    }

    showRichVideoTemplates(index: number) {
        try {
            this.filteredEmailTemplates = new Array<EmailTemplate>();
            this.selectedTemplateTypeIndex = index;
            this.mergeTagForGuide = 'design_video_template';
            for (var i = 0; i < this.allEmailTemplates.length; i++) {
                var isBeeVideoTemplate = this.allEmailTemplates[i].beeVideoTemplate;
                if (isBeeVideoTemplate) {
                    this.filteredEmailTemplates.push(this.allEmailTemplates[i]);
                }
            }
            this.logger.debug("Showing Rich Video Templates size of" + this.filteredEmailTemplates.length);
        } catch (error) {
            var cause = "Error in showRichVideoTemplates() in selectTemplatesComponent";
            this.logger.error(cause + ":" + error);
        }


    }

    showRegularCoBrandingTemplates(index: number) {
        try {
            this.filteredEmailTemplates = new Array<EmailTemplate>();
            this.selectedTemplateTypeIndex = index;
            console.log(this.allEmailTemplates);
            for (var i = 0; i < this.allEmailTemplates.length; i++) {
                var isRegularCoBrandingTemplate = this.allEmailTemplates[i].regularCoBrandingTemplate;
                if (isRegularCoBrandingTemplate) {
                    this.filteredEmailTemplates.push(this.allEmailTemplates[i]);
                }
            }
            this.logger.debug("Showing showRegularCoBrandingTemplates size of" + this.filteredEmailTemplates.length);
        } catch (error) {
            var cause = "Error in showRegularCoBrandingTemplates() in selectTemplatesComponent";
            this.logger.error(cause + ":" + error);
        }
    }

    showVideoCoBrandingTemplates(index: number) {
        try {
            this.filteredEmailTemplates = new Array<EmailTemplate>();
            this.selectedTemplateTypeIndex = index;
            for (var i = 0; i < this.allEmailTemplates.length; i++) {
                var isVideoCoBrandingTemplate = this.allEmailTemplates[i].videoCoBrandingTemplate;
                if (isVideoCoBrandingTemplate) {
                    this.filteredEmailTemplates.push(this.allEmailTemplates[i]);
                }
            }
            this.logger.debug("Showing showVideoCoBrandingTemplates size of" + this.filteredEmailTemplates.length);
        } catch (error) {
            var cause = "Error in showVideoCoBrandingTemplates() in selectTemplatesComponent";
            this.logger.error(cause + ":" + error);
        }
    }

    showCampaignDefaultTemplates(index: number) {
        try {
            this.filteredEmailTemplates = new Array<EmailTemplate>();
            this.selectedTemplateTypeIndex = index;
            for (var i = 0; i < this.allEmailTemplates.length; i++) {
                var isCampaignDefault = this.allEmailTemplates[i].campaignDefault;
                if (isCampaignDefault) {
                    this.filteredEmailTemplates.push(this.allEmailTemplates[i]);
                }
            }
            this.logger.debug("Showing showCampaignDefaultTemplates size of" + this.filteredEmailTemplates.length);
        } catch (error) {
            var cause = "Error in showCampaignDefaultTemplates() in selectTemplatesComponent";
            this.logger.error(cause + ":" + error);
        }
    }


    showTemplateById(template: any) {
        if (template.id != undefined) {
            this.emailTemplateService.getById(template.id)
                .subscribe(
                    (data: any) => {
                        if(this.authenticationService.module.isAgencyCompany){
                            data.jsonBody = data.jsonBody.replace("https://xamp.io/vod/replace-company-logo.png", this.authenticationService.v_companyLogoImagePath);
                        }else{
                            if (this.refService.companyProfileImage != undefined) {
                                data.jsonBody = data.jsonBody.replace("https://xamp.io/vod/replace-company-logo.png", this.authenticationService.MEDIA_URL + this.refService.companyProfileImage);
                            }
                        }

                        
                        this.emailTemplateService.emailTemplate = data;
                        this.emailTemplateService.isNewTemplate = true;
                        this.router.navigate(["/home/emailtemplates/create"]);
                    },
                    (error: string) => {
                        this.logger.error(this.refService.errorPrepender + " showTemplateById():" + error);
                        this.refService.showServerError(this.httpRequestLoader);
                    },
                    () => this.logger.info("Got Email Template")
                );
        } else if (template.name === 'Upload Regular Template') {
            //This is normal template
            this.router.navigate([this.customUploadRegularUrl]);
        } else if (template.name === 'Upload Video Template') {
            //This is video template
            this.router.navigate([this.customUploadVieoUrl]);
        }
    }

    showPreview(emailTemplate: EmailTemplate) {
        let body = emailTemplate.body;
        let emailTemplateName = emailTemplate.name;
        if (emailTemplateName.length > 50) {
            emailTemplateName = emailTemplateName.substring(0, 50) + "...";
        }
        $("#htmlContent").empty();
        $("#email-template-title").empty();
        $("#email-template-title").append(emailTemplateName);
        $('#email-template-title').prop('title', emailTemplate.name);
        $("#htmlContent").append(body);
        $('.modal .modal-body').css('overflow-y', 'auto');
        // $('.modal .modal-body').css('max-height', $(window).height() * 0.75);
        $("#show_email_template_preivew").modal('show');
    }


    clearValues() {
        this.clientId = '';
        this.secretId = '';
        this.marketoInstance = '';
        this.clientIdClass = "form-group";
        this.secretIdClass = "form-group";
        this.marketoInstanceClass = "form-group";

    }
    checkMarketoCredentials(state=false) {
        this.importLoading = true;
        this.emailTemplateService.checkMarketoCredentials(this.authenticationService.getUserId()).subscribe(response => {
            if (response.statusCode == 8000) {
                this.showMarketoForm = false;
                this.getMarketoEmailTemplates();
                this.templateError = false;
            }else if(state) {
                $("#templateRetrieve").modal('show');
                this.templateError = false;
                 this.importLoading = false;
            }
        }, error => {
            this.templateError = error;
            $("#templateRetrieve").modal('show');
            this.importLoading = false;
        })
    }
    getTemplatesFromMarketo() {
        this.importLoading = true;
        this.clearValues();
        this.checkMarketoCredentials(true);
    }
    getMarketoEmailTemplates(): any {
        this.importLoading = true;
        this.selectedTemplateTypeIndex = 11;
        this.selectAllTemplates = false;
        this.isSaveHubSpotTemplatesButtonState = false;
        $("#templateRetrieve").modal('hide');
        this.emailTemplateService.getMarketoEmailTemplates(this.authenticationService.getUserId())
        .subscribe(response => {
            this.marketoEmailTemplates = response.data;
            this.marketoEmailTemplates.map(template => {
                template.marketoTemplate = true;
                template.body = template.content;
                template.subject = "assets/images/bee-template/imported-marketo.jpg";
            });
            this.showMarketoTemplates();
        },
            (error: string) => {
                this.logger.error(this.refService.errorPrepender + " :" + error);
                this.refService.showServerError(this.httpRequestLoader);
            },
            () => this.logger.info("Got  Templates"))
    }
    showMarketoEmailtemplatePreview(emailTemplateId: number): any {
        this.emailTemplateService.getMarketoEmailTemplatePreview(this.authenticationService.getUserId(), emailTemplateId).subscribe(response => {
            console.log(response);
            this.showMarketoTemplatePreview(response.data[0]);
        },
            (error: string) => {
                this.logger.error(this.refService.errorPrepender + ":" + error);
                this.refService.showServerError(this.httpRequestLoader);
            },
            () => this.logger.info("Got Email Template Preview"))
    }

    showMarketoTemplatePreview(emailTemplate: MarketoEmailTemplate) {
        this.showMarketoForm = false;
        let body = emailTemplate.content;
        //let emailTemplateName = emailTemplate.name;
        // if (emailTemplateName.length > 50)
        // {
        //     emailTemplateName = emailTemplateName.substring(0, 50) + "...";
        // }
        $("#htmlContent").empty();
        $("#email-template-title").empty();
        //$("#email-template-title").append(emailTemplateName);
        $('#email-template-title').prop('title', emailTemplate.name);
        $("#htmlContent").append(body);
        $('.modal .modal-body').css('overflow-y', 'auto');
        // $('.modal .modal-body').css('max-height', $(window).height() * 0.75);
        $("#show_email_template_preivew").modal('show');
    }
    validateModelForm(fieldId: any) {
        var errorClass = "form-group has-error has-feedback";
        var successClass = "form-group has-success has-feedback";

        if (fieldId == 'email') {
            if (this.clientId.length > 0) {
                this.clientIdClass = successClass;
                this.clentIdError = false;
            } else {
                this.clientIdClass = errorClass;
                this.clentIdError = true;
            }
        } else if (fieldId == 'pwd') {
            if (this.secretId.length > 0) {
                this.secretIdClass = successClass;
                this.secretIdError = false;
            } else {
                this.secretIdClass = errorClass;
                this.secretIdError = true;
            }
        } else if (fieldId == 'instance') {
            if (this.marketoInstance.length > 0) {
                this.marketoInstanceClass = successClass;
                this.marketoInstanceError = false;
            } else {
                this.marketoInstanceClass = errorClass;
                this.marketoInstanceError = false;
            }
        }
        this.toggleSubmitButtonState();
    }

    validateEmail(emailId: string) {

        var regex = /^[A-Za-z0-9]+(\.[_A-Za-z0-9]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$/;
        if (regex.test(emailId)) {
            return true;

        } else {
            return false;

        }
    }
    setSelectedTemplates(event: any) {
      this.selectedTemplates;
      this.saveMarketoTemplatesButtonState();
      let selectedTemps = this.filteredEmailTemplates.filter(i=>i.isSelectedMarketoTemplate);
      if(selectedTemps.length == this.filteredEmailTemplates.length){
        this.selectAllTemplates = true;
      }else {
        this.selectAllTemplates = false;
      }
    }
    selectAll(event: any) {
        if (event) {
            if (this.selectedTemplateTypeIndex === 11) {
                this.filteredEmailTemplates.map(template => template.isSelectedMarketoTemplate = true);
            }
            else if (this.selectedTemplateTypeIndex === 12) {
                this.filteredEmailTemplates.map(template => template.isSelectedHubSpotTemplate = true);
            }
        }
        else {
            if (this.selectedTemplateTypeIndex === 11) {
                this.filteredEmailTemplates.map(template => template.isSelectedMarketoTemplate = false);
            }
            else if (this.selectedTemplateTypeIndex === 12) {
                this.filteredEmailTemplates.map(template => template.isSelectedHubSpotTemplate = false);
            }
        }
        this.saveMarketoTemplatesButtonState();
        this.saveHubSpotTemplatesButtonState();
    }
    saveMarketoTemplatesButtonState() {
        let count = 0;
        this.filteredEmailTemplates.forEach(template => {
            if (template.isSelectedMarketoTemplate) {
                count++;
            }
        });
        if (count > 0)
            this.isSaveMarketoTemplatesButtonState = true;
        else
            this.isSaveMarketoTemplatesButtonState = false;
        if(count == this.filteredEmailTemplates.length){
            this.selectAllTemplates = true;
        }else{
            this.selectAllTemplates = false;
        }

    }

    importMarketotemplates() {
        this.importLoading = true;
        let body = [];
        this.filteredEmailTemplates.forEach(template => {
            if (template.isSelectedMarketoTemplate) {
                let obj = {
                    id: template.id,
                    name: template.name,
                    description: template.desc
                }
                body.push(obj);
            }

        });
        this.emailTemplateService.importMarketoEmailTemplates(this.authenticationService.getUserId(), body).
        subscribe(response => {
            this.customResponse = new CustomResponse('SUCCESS', response.message, true);
            this.selectAllTemplates = false;
            this.filteredEmailTemplates.map(template => template.isSelectedMarketoTemplate = false);
            this.importLoading = false;
            this.saveMarketoTemplatesButtonState();
        },
            (error: string) => {
                this.logger.error(this.refService.errorPrepender + ":" + error);
                this.logger.errorPage(error);
            },
            () => this.logger.info("Imported Templates"))
    }
    toggleSubmitButtonState() {
        if (!this.clentIdError && !this.secretIdError && !this.marketoInstanceError)
            this.isModelFormValid = true;
        else
            this.isModelFormValid = false;

    }
    closeModal() {
        $("#templateRetrieve").modal('hide');
    }
    submitRetrieTemplates() {
        this.loading = true;
        const obj = {
            userId: this.authenticationService.getUserId(),
            instanceUrl: this.marketoInstance,
            clientId: this.clientId,
            clientSecret: this.secretId
        }

        this.emailTemplateService.saveMarketoCredentials(obj).subscribe(response => {
            if (response.statusCode == 8003) {
                this.showMarketoForm = false;
                // this.checkMarketoCredentials();
                this.templateError = false;
                this.templateSuccessMsg = response.message;
                this.loading = false;
                this.checkMarketoCredentials();
            } else {

                $("#templateRetrieve").modal('show');
                this.templateError = response.message;
                this.templateSuccessMsg = false;
                this.loading = false;
            }
        }, error => this.templateError = error
        )

    }
    edit(emailTemplate: EmailTemplate) {
        this.emailTemplateService.getMarketoEmailTemplatePreview(this.authenticationService.getUserId(), emailTemplate.id).subscribe(response => {
            this.emailTemplateService.emailTemplate = response.data[0];
            this.emailTemplateService.emailTemplate.name = emailTemplate.name;
            this.emailTemplateService.emailTemplate.body = response.data[0].content;
            this.emailTemplateService.emailTemplate.marketoTemplate = true;
            this.emailTemplateService.emailTemplate.createdBy = this.authenticationService.getUserId().toString();
           // this.router.navigate(["/home/emailtemplates/marketo/upload"]); 
           this.router.navigate([this.marketoUploadUrl]);
        })
    }

    showMarketoTemplates() {
        try {
            this.filteredEmailTemplates = new Array<EmailTemplate>();
            for (var i = 0; i < this.marketoEmailTemplates.length; i++) {
                var isMarketoTemplate = this.marketoEmailTemplates[i].marketoTemplate;
                if (isMarketoTemplate) {
                    this.filteredEmailTemplates.push(this.marketoEmailTemplates[i]);
                }
            }
            this.logger.debug("Showing Marketo Templates size of" + this.filteredEmailTemplates.length);
            this.importLoading = false;
        } catch (error) {
            var cause = "Error in marketoEmailTemplate() in selectTemplatesComponent";
            this.logger.error(cause + ":" + error);
        }
    }

    //   HubSpot Templates Implementation

    getTemplatesFromHubSpot() {
        this.importLoading = true;
        this.selectAllTemplates = false;
        this.selectedTemplateTypeIndex = 12;
        this.selectedThirdPartyIntegration = "hubspot";
        this.filteredEmailTemplates = new Array<EmailTemplate>();
        this.hubSpotService.getHubSpotTemplates().subscribe(data => {
            let response = data.data;
            this.hubSpotEmailTemplates = response.templates;
            if (response.templates !== undefined && response.templates.length !== 0) {
                this.hubSpotEmailTemplates.map(template => {
                    template.hubSpotTemplate = true;
                    template.body = template.content;
                    template.subject = "assets/images/bee-template/imported-hubspot.jpg";
                });
                
                for (var i = 0; i < response.templates.length; i++) {
                    var isHubSpotTemplate = this.hubSpotEmailTemplates[i].hubSpotTemplate;
                    if (isHubSpotTemplate) {
                        this.filteredEmailTemplates.push(this.hubSpotEmailTemplates[i]);
                    }
                }
            }
            else {
                if (!response.isAuthorize && response.redirectUrl !== undefined && response.redirectUrl !== '') {
                    window.location.href = response.redirectUrl;
                }
            }
            this.importLoading = false;
        });
    }

    showHubSpotEmailtemplatePreview(emailTemplateId: number): any {
        this.hubSpotService.getHubSpotTemplateById(emailTemplateId).subscribe(data => {
            this.showMarketoForm = false;
            let response = data.data;
            if (response.template !== undefined && response.template !== '') {
                let body = response.template.content;
                $("#htmlContent").empty();
                $("#email-template-title").empty();
                $('#email-template-title').prop('title', response.template.name);
                $("#htmlContent").append(body);
                $('.modal .modal-body').css('overflow-y', 'auto');
                $("#show_email_template_preivew").modal('show');
            }
        },
            (error: string) => {
                this.logger.error(this.refService.errorPrepender + ":" + error);
                this.refService.showServerError(this.httpRequestLoader);
            },
            () => this.logger.info("Got Email Template Preview"))
    }

    selectedHubSpotTemplate(event: any) {
        if (!event.isSelectedHubSpotTemplate) {
            this.selectAllTemplates = false;
        }
        
        this.saveHubSpotTemplatesButtonState();
    }

    saveHubSpotTemplatesButtonState() {
        let count = 0;
        this.filteredEmailTemplates.forEach(template => {
            if (template.isSelectedHubSpotTemplate) {
                count++;
            }
        });
        if (count > 0)
            this.isSaveHubSpotTemplatesButtonState = true;
        else {
            this.isSaveHubSpotTemplatesButtonState = false;
        }
        
       if(count == this.filteredEmailTemplates.length){
        this.selectAllTemplates = true;
      }else {
        this.selectAllTemplates = false;
      }
    }

    importHubSpotTemplates() {
        this.importLoading = true;
        let templatesList = [];
        let mainObj: any;
        if (this.selectedThirdPartyIntegration === "hubspot" && this.selectAllTemplates) {
            mainObj = {
                type: this.selectedThirdPartyIntegration,
                userId: this.authenticationService.getUserId(),
            }
        } else {
            this.filteredEmailTemplates.forEach(template => {
                if (template.isSelectedHubSpotTemplate) {
                    let templateObj = {
                        id: template.id
                    }
                    templatesList.push(templateObj);
                }
            });
            mainObj = {
                type: this.selectedThirdPartyIntegration,
                userId: this.authenticationService.getUserId(),
                templates: templatesList
            }
        }
        this.hubSpotService.importHubSpotTemplates(mainObj).subscribe(response => {
            this.customResponse = new CustomResponse('SUCCESS', response.message, true);
            this.selectAllTemplates = false;
            this.filteredEmailTemplates.map(template => template.isSelectedHubSpotTemplate = false);
            this.importLoading = false;
            this.saveHubSpotTemplatesButtonState();
        },
            (error: string) => {
                this.logger.error(this.refService.errorPrepender + ":" + error);
                this.refService.showServerError(this.httpRequestLoader);
                this.importLoading = false;
            },
            () => this.logger.info("Imported HubSpot Templates"));
    }

    createTemplate(emailTemplateId: number) {
        this.hubSpotService.getHubSpotTemplateById(emailTemplateId).subscribe(data => {
            this.showMarketoForm = false;
            let response = data.data;
            if (response.template !== undefined && response.template !== '') {
                let body = response.template.content;
                this.emailTemplateService.emailTemplate = response.template;
                this.emailTemplateService.emailTemplate.name = response.template.name;
                this.emailTemplateService.emailTemplate.body = body;
                this.emailTemplateService.emailTemplate.hubSpotTemplate = true;
                this.emailTemplateService.emailTemplate.createdBy = this.authenticationService.getUserId().toString();
                //this.router.navigate(["/home/emailtemplates/" + this.selectedThirdPartyIntegration + "/upload"]);
                this.router.navigate([this.hubspotUploadUrl]);
            }
        },
            (error: string) => {
                this.logger.error(this.refService.errorPrepender + ":" + error);
                this.refService.showServerError(this.httpRequestLoader);
            });
    }

    confirmDeleteEmailTemplate(template:any){
        let id = template['id'];
        if(id!=undefined && id>0){
            let name = template['name'];
            let self = this;
			swal({
				title: 'Are you sure?',
				text: "You won't be able to undo this action!",
				type: 'warning',
				showCancelButton: true,
				swalConfirmButtonColor: '#54a7e9',
				swalCancelButtonColor: '#999',
				confirmButtonText: 'Yes, delete it!'

			}).then(function() {
				self.deleteDefaultTemplate(id, name);
			}, function(dismiss: any) {
				console.log('you clicked on option' + dismiss);
			});
        }else{
            this.refService.showSweetAlertErrorMessage("This is not a template.So you cannot delete it.");
        }
    }

    deleteDefaultTemplate(id:number,name:string){
        this.importLoading = true;
        this.authenticationService.deleteDefaultTemplate(id).subscribe(
            response=>{
                this.refService.goToTop();
                this.importLoading = false;
                this.refService.showSweetAlertSuccessMessage(name+" deleted successfully");
                this.listDefaultTemplates();
                this.templateFilter.name = '';
            },error=>{
                this.refService.goToTop();
                this.importLoading = false;
                this.refService.showSweetAlertServerErrorMessage();
            }
        );
    }

    saveAsDefaultTemplate(template:any){
        let id = template['id'];
        if(id!=undefined && id>0){
            if (template.id != undefined) {
                this.emailTemplateService.getById(template.id)
                    .subscribe(
                        (data: any) => {
                            this.emailTemplateService.emailTemplate = data;
                            this.emailTemplateService.isNewTemplate = true;
                            this.router.navigate(["/home/emailtemplates/saveAs"]);
                        },
                        (error: string) => {
                            this.logger.error(this.refService.errorPrepender + " showTemplateById():" + error);
                            this.refService.showServerError(this.httpRequestLoader);
                        },
                        () => this.logger.info("Got Email Template")
                    );
            }
        }else{
            this.refService.showSweetAlertErrorMessage("This is not a template.So you cannot save it.");
        }
    }

    showSurveyTemplates(index: number) {
        try {
          
            this.filteredEmailTemplates = new Array<EmailTemplate>();
            this.selectedTemplateTypeIndex = index;
            /******** user guide ******/
            this.mergeTagForGuide = 'design_survey_template';
            console.log(this.allEmailTemplates);
            for (var i = 0; i < this.allEmailTemplates.length; i++) {
                var isSurveyTemplate = false;
                if (index == 13) {
                    isSurveyTemplate = this.allEmailTemplates[i].surveyTemplate;
                } else if (index == 14) {
                    isSurveyTemplate = this.allEmailTemplates[i].surveyCoBrandingTemplate;
                }                
                if (isSurveyTemplate) {
                    this.filteredEmailTemplates.push(this.allEmailTemplates[i]);
                }
            }
            this.logger.debug("Showing showSurveyTemplates size of" + this.filteredEmailTemplates.length);
        } catch (error) {
            var cause = "Error in showSurveyTemplates() in selectTemplatesComponent";
            this.logger.error(cause + ":" + error);
        }
    }
  getUserGuideMergeTags(selectedTemplateTypeIndex){
    if (selectedTemplateTypeIndex == 2) {
        this.mergeTagForGuide = "design_email_template";
    } else if (selectedTemplateTypeIndex == 4) {
        this.mergeTagForGuide = "design_video_template";
    } else if (selectedTemplateTypeIndex == 9) {
        this.mergeTagForGuide = "design_event_template";
    } else if (selectedTemplateTypeIndex == 13) {
        this.mergeTagForGuide = "design_survey_template";
    }
  }

    
}
