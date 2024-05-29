import { Component, OnInit, OnDestroy,HostListener } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { EmailTemplateService } from '../services/email-template.service';
import { User } from '../../core/models/user';
import { SenderMergeTag } from '../../core/models/sender-merge-tag';
import { EmailTemplate } from '../models/email-template';
import { EmailTemplateType } from '../../email-template/models/email-template-type';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Pagination } from '../../core/models/pagination';
import { FormService } from '../../forms/services/form.service';
import { SortOption } from '../../core/models/sort-option';
import { CustomResponse } from '../../common/models/custom-response';
import { ComponentCanDeactivate } from 'app/component-can-deactivate';
import { ModulesDisplayType } from 'app/util/models/modules-display-type';
import { Properties } from 'app/common/models/properties';

declare var BeePlugin:any, swal:any, $: any;

@Component({
    selector: 'app-create-template',
    templateUrl: './create-template.component.html',
    styleUrls: ['./create-template.component.css'],
    providers: [EmailTemplate, FormService, Pagination, SortOption,Properties]
})
export class CreateTemplateComponent implements OnInit, ComponentCanDeactivate,OnDestroy {
    senderMergeTag: SenderMergeTag = new SenderMergeTag();
    loggedInUserId = 0;
    companyProfileImages: string[] = [];
    categoryNames: any;
    emailTemplate: EmailTemplate = new EmailTemplate();
    clickedButtonName = "";
    videoGif = "xtremand-video.gif";
    coBraningImage = "co-branding.png";
    eventTitle = "{{event_title}}";
    eventDescription = "{{event_description}}";
    eventStartTime = "{{event_start_time}}";
    eventEndTime = "{{event_end_time}}";
    eventLocation = "{{event_address}}";
    loadTemplate = false;
    isAdd: boolean;
    isMinTimeOver: boolean = false;
    pagination: Pagination = new Pagination();
    formsError: boolean = false;
    customResponse: CustomResponse = new CustomResponse();
    categoryId: number = 0;
    manageRouterLink = "/home/emailtemplates/manage";
    mergeTagsInput: any = {};
    showForms: boolean = false;
    updateAndRedirectClicked = false;
    saveAsOrSaveAndRedirectClicked = false;
    isReloaded: boolean = false;
    viewType = "";
    folderViewType = "";
    modulesDisplayType = new ModulesDisplayType();
    skipConfirmAlert = false;
    ngxLoading = false;
    errorMessage = "";
    names = [];
    isDefaultTemplate = false;
    buttonClicked = false;
    saveLoader = false;
    isSaveAsButtonDisabled = true;
    invalidTemplateName = false;
    properties:Properties = new Properties();
    constructor(public emailTemplateService: EmailTemplateService, private router: Router, private logger: XtremandLogger,
        private authenticationService: AuthenticationService, public refService: ReferenceService, private location: Location, 
        private route: ActivatedRoute) {
        this.ngxLoading = true;
        this.loadBeeContainer(emailTemplateService, authenticationService,true);
    }

    private loadBeeContainer(emailTemplateService: EmailTemplateService, authenticationService: AuthenticationService,isLoadedFromConstructor:boolean) {
        this.refService.scrollSmoothToTop();
        this.skipConfirmAlert = false;
        let url = this.refService.getCurrentRouteUrl();
        this.isAdd = url.indexOf("create")>-1;
        this.categoryId = this.route.snapshot.params['categoryId'];
        this.viewType = this.route.snapshot.params['viewType'];
        this.folderViewType = this.route.snapshot.params['folderViewType'];
        if (emailTemplateService.emailTemplate != undefined) {
            if(this.emailTemplateService.isTemplateSaved && !this.isAdd){
                this.customResponse = new CustomResponse('SUCCESS','Template created successfully',true);
            }
            this.mergeTagsInput['isEvent'] = emailTemplateService.emailTemplate.beeEventTemplate || emailTemplateService.emailTemplate.beeEventCoBrandingTemplate;
            let self = this;
            self.loggedInUserId = this.authenticationService.getUserId();
            this.showForms = this.emailTemplateService.emailTemplate.surveyTemplate || this.emailTemplateService.emailTemplate.surveyCoBrandingTemplate;
           
            /***Template Names API****/
            self.findNames(emailTemplateService, self);

            /***Company Profile Images API****/
            self.findCompanyProfileImages(emailTemplateService, self);

            /***Category Names****/
            self.findCategoryNames(authenticationService, self);

            /***Send Request To Bee Container */
            var request = self.sendRequestToBee(self);

            if (emailTemplateService.emailTemplate == undefined) {
                this.router.navigate(["/home/emailtemplates/select"]);
            } 
           var save = self.openSaveModalPopUp(self, emailTemplateService);

            let mergeTags = [];
            let event = this.emailTemplateService.emailTemplate.beeEventTemplate || this.emailTemplateService.emailTemplate.beeEventCoBrandingTemplate;
            mergeTags = this.refService.addMergeTags(mergeTags, false, event);

            if (self.refService.companyId != undefined && self.refService.companyId > 0) {
                var beeUserId = "bee-" + self.refService.companyId;
                var roleHash = self.authenticationService.vendorRoleHash;
                var beeConfig = {
                    uid: beeUserId,
                    container: 'bee-plugin-container',
                    autosave: 15,
                    language: this.authenticationService.beeLanguageCode,
                    mergeTags: mergeTags,
                    roleHash: roleHash,
                    onSave: function (jsonFile, htmlFile) {
                        save(jsonFile, htmlFile);
                    },
                    onSaveAsTemplate: function (jsonFile) {
                    },
                    onAutoSave: function (jsonFile) {
                        window.localStorage.setItem('newsletter.autosave', jsonFile);
                        self.emailTemplate.jsonBody = jsonFile;
                        self.isMinTimeOver = true;
                    },
                    onSend: function (htmlFile) {
                    },
                    onError: function (errorMessage: string) {
                        self.refService.showSweetAlertErrorMessage("Unable to load bee template:" + errorMessage);
                    }
                };//End Of beeConfig
                self.loadBeeContainerWithClientIdAndClientSecret(request, authenticationService, beeConfig, emailTemplateService, self);
            } else {
                swal("Please Contact Admin!", "No CompanyId Found", "error");
                self.ngxLoading = false;
            }
        } else {
            this.isReloaded = true;
            this.navigateBack();
        }
    }

    private loadBeeContainerWithClientIdAndClientSecret(request: (method: any, url: any, data: any, type: any, callback: any) => void, authenticationService: AuthenticationService, beeConfig: {
        uid: string; container: string; autosave: number;
        language: string; mergeTags: any[]; roleHash: string; onSave: (jsonFile: any, htmlFile: any) => void; onSaveAsTemplate: (jsonFile: any) => void; onAutoSave: (jsonFile: any) => void; onSend: (htmlFile: any) => void; onError: (errorMessage: string) => void;
        }, emailTemplateService: EmailTemplateService, self: this) {
        var bee = null;
        request(
            'POST',
            'https://auth.getbee.io/apiauth',
            'grant_type=password&client_id=' + authenticationService.clientId + '&client_secret=' + authenticationService.clientSecret + '',
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
                            if (emailTemplateService.emailTemplate != undefined) {
                                var body = emailTemplateService.emailTemplate.jsonBody;
                                $.each(self.companyProfileImages, function (_index: number, value: any) {
                                    body = body.replace(value, self.authenticationService.MEDIA_URL + self.refService.companyProfileImage);
                                });
                                body = body.replace("https://xamp.io/vod/replace-company-logo.png", self.authenticationService.MEDIA_URL + self.refService.companyProfileImage);
                                self.emailTemplate.jsonBody = body;
                                var jsonBody = JSON.parse(body);
                                bee.load(jsonBody);
                                bee.start(jsonBody);
                                self.refService.updateBeeIframeContainerHeight();
                            } else {
                                bee.start(template);
                            }
                            self.loadTemplate = true;
                            self.ngxLoading = false;
                        });
                });
            });
    }

    private findNames(emailTemplateService: EmailTemplateService, self: this) {
        emailTemplateService.getAvailableNames(self.loggedInUserId).subscribe(
            (data: any) => {
                this.names = data;
            },
            error => {
                this.skipConfirmAlert = true;
                this.logger.error("error in getAvailableNames(" + self.loggedInUserId + ")", error);
            },
            () => this.logger.info("Finished getAvailableNames()"));
    }

    private findCompanyProfileImages(emailTemplateService: EmailTemplateService, self: this) {
        emailTemplateService.getAllCompanyProfileImages(self.loggedInUserId).subscribe(
            (data: any) => {
                self.companyProfileImages = data;
            },
            error => {
                this.skipConfirmAlert = true;
                this.logger.error("error in getAllCompanyProfileImages(" + self.loggedInUserId + ")", error);
            },
            () => this.logger.info("Finished getAllCompanyProfileImages()"));
    }

    private findCategoryNames(authenticationService: AuthenticationService, self: this) {
        authenticationService.getCategoryNamesByUserId(self.loggedInUserId).subscribe(
            (data: any) => {
                self.categoryNames = data.data;
            },
            error => {
                this.skipConfirmAlert = true;
                this.logger.error("error in getCategoryNamesByUserId(" + self.loggedInUserId + ")", error);
            },
            () => this.logger.info("Finished getCategoryNamesByUserId()"));
    }

    private sendRequestToBee(self: this) {
        return function (method, url, data, type, callback) {
            var req = new XMLHttpRequest();
            req.onreadystatechange = function () {
                if (req.readyState === 4 && req.status === 200) {
                    var response = JSON.parse(req.responseText);
                    callback(response);
                } else if (req.readyState === 4 && req.status !== 200) {
                    self.refService.showSweetAlertErrorMessage("Unable to load Bee container.Please try reloading the page/check your internet connection.");
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
    }

    private openSaveModalPopUp(self: this, emailTemplateService: EmailTemplateService) {
        return function (jsonContent: string, htmlContent: string) {
            self.customResponse = new CustomResponse();
            self.errorMessage = "";
            self.emailTemplateService.isTemplateSaved = false;
            self.buttonClicked = false;
            self.emailTemplate = new EmailTemplate();
            self.addTemplateName(emailTemplateService, self);
            self.addCategoryId(self);
            self.emailTemplate.body = htmlContent;
            self.emailTemplate.jsonBody = jsonContent;
            if (emailTemplateService.emailTemplate.beeVideoTemplate || emailTemplateService.emailTemplate.videoCoBrandingTemplate) {
                if (jsonContent.indexOf(self.videoGif) < 0) {
                    swal("", "Whoops! We're unable to save this template because you deleted the default gif. You'll need to select a new email template and start over.", "error");
                    return false;
                }
            }
            if (emailTemplateService.emailTemplate.regularCoBrandingTemplate || emailTemplateService.emailTemplate.videoCoBrandingTemplate || emailTemplateService.emailTemplate.beeEventCoBrandingTemplate || emailTemplateService.emailTemplate.surveyCoBrandingTemplate) {
                if (jsonContent.indexOf(self.coBraningImage) < 0) {
                    swal("", "Whoops! We're unable to save this template because you deleted the co-branding logo. You'll need to select a new email template and start over.", "error");
                    return false;
                }
            }
            let emailTemplateName = self.refService.getTrimmedData(self.emailTemplate.name);
            self.invalidTemplateName = emailTemplateName.length==0;
            if(self.emailTemplateService.isEditingDefaultTemplate && !self.emailTemplateService.emailTemplate.userDefined){
                self.ngxLoading = true;
                self.updateDefaultEmailTemplateJsonBody(self.emailTemplate);
            }else{
                self.refService.showModalPopup("save-template-popup");
            }
            
        };
    }
    updateDefaultEmailTemplateJsonBody(emailTemplate: EmailTemplate) {
        this.customResponse = new CustomResponse();
        emailTemplate.id = this.emailTemplateService.emailTemplate.id;
        this.updateCompanyLogo(emailTemplate);
        this.emailTemplateService.updateDefaultEmailTemplateJsonBody(emailTemplate).subscribe(
            response=>{
                this.customResponse = new CustomResponse('SUCCESS', response.message, true);
                this.refService.scrollSmoothToTop();
                this.ngxLoading = false;
            },error=>{
                this.ngxLoading = false;
                this.refService.showSweetAlertServerErrorMessage();
            });
    }

    private addTemplateName(emailTemplateService: EmailTemplateService, self: this) {
        if (emailTemplateService.emailTemplate != undefined) {
            self.isDefaultTemplate = emailTemplateService.emailTemplate.defaultTemplate;
            if (!self.isDefaultTemplate) {
                self.emailTemplate.name = emailTemplateService.emailTemplate.name;
            }
        }
    }

    private addCategoryId(self: this) {
        if (self.isAdd) {
            let categoryIds = self.categoryNames.map(function (a: any) { return a.id; });
            if (self.isAdd || self.emailTemplate.categoryId == undefined || self.emailTemplate.categoryId == 0) {
                self.emailTemplate.categoryId = categoryIds[0];
            }
        } else {
            self.emailTemplate.categoryId = self.emailTemplateService.emailTemplate.categoryId;
        }
    }

    saveEmailTemplate(emailTemplate: EmailTemplate, emailTemplateService: EmailTemplateService, loggedInUserId: number, saveAsOrSaveAndRedirectClicked: boolean) {
        this.saveLoader = true;
        this.saveAsOrSaveAndRedirectClicked = saveAsOrSaveAndRedirectClicked;
        this.refService.goToTop();
        emailTemplate.user = new User();
        emailTemplate.user.userId = loggedInUserId;
        emailTemplate.userDefined = true;
        emailTemplate.name = $.trim(this.emailTemplate.name);
        emailTemplate.beeRegularTemplate = emailTemplateService.emailTemplate.beeRegularTemplate;
        emailTemplate.beeVideoTemplate = emailTemplateService.emailTemplate.beeVideoTemplate;
        emailTemplate.desc = emailTemplateService.emailTemplate.name;//Type Of Email Template
        emailTemplate.subject = emailTemplateService.emailTemplate.subject;//Image Path
        emailTemplate.regularCoBrandingTemplate = emailTemplateService.emailTemplate.regularCoBrandingTemplate;
        emailTemplate.videoCoBrandingTemplate = emailTemplateService.emailTemplate.videoCoBrandingTemplate;
        emailTemplate.beeEventTemplate = emailTemplateService.emailTemplate.beeEventTemplate;
        emailTemplate.beeEventCoBrandingTemplate = emailTemplateService.emailTemplate.beeEventCoBrandingTemplate;
        emailTemplate.surveyTemplate = emailTemplateService.emailTemplate.surveyTemplate;
        emailTemplate.surveyCoBrandingTemplate = emailTemplateService.emailTemplate.surveyCoBrandingTemplate;
        let isCoBrandingTemplate = emailTemplate.regularCoBrandingTemplate || emailTemplate.videoCoBrandingTemplate
            || emailTemplate.beeEventCoBrandingTemplate || emailTemplate.surveyCoBrandingTemplate;
        if (emailTemplateService.emailTemplate.subject.indexOf('basic') > -1 && !isCoBrandingTemplate) {
            emailTemplate.type = EmailTemplateType.BASIC;
        } else if (emailTemplateService.emailTemplate.subject.indexOf('rich') > -1 && !isCoBrandingTemplate) {
            emailTemplate.type = EmailTemplateType.RICH;
        } else if (emailTemplateService.emailTemplate.subject.indexOf('Upload') > -1 && !isCoBrandingTemplate) {
            emailTemplate.type = EmailTemplateType.UPLOADED;
        } else if (emailTemplate.regularCoBrandingTemplate) {
            emailTemplate.type = EmailTemplateType.REGULAR_CO_BRANDING;
        } else if (emailTemplate.videoCoBrandingTemplate) {
            emailTemplate.type = EmailTemplateType.VIDEO_CO_BRANDING;
        } else if (emailTemplate.beeEventCoBrandingTemplate) {
            emailTemplate.type = EmailTemplateType.EVENT_CO_BRANDING;
        } else if (emailTemplate.surveyCoBrandingTemplate) {
            emailTemplate.type = EmailTemplateType.SURVEY_CO_BRANDING;
        }
        this.updateCompanyLogo(emailTemplate);
        emailTemplateService.save(emailTemplate).subscribe(
            data => {
                if (data.access) {
                    if (data.statusCode == 702) {   
                        if(saveAsOrSaveAndRedirectClicked){
                            this.refService.addCreateOrUpdateSuccessMessage("Template created successfully");
                            this.closeModalPopup();
                            this.navigateToManageSection();
                        }else{
                            this.closeModalPopup();
                            let createdEmailTemplateId = data.data;
                            this.emailTemplateService.getById(createdEmailTemplateId).subscribe(
                                (data: EmailTemplate)=>{
                                    this.emailTemplateService.isNewTemplate = false;
                                    this.emailTemplateService.emailTemplate = data;
                                    this.emailTemplateService.isTemplateSaved = true;
                                    this.skipConfirmAlert = true;
                                    this.router.navigate(["/home/emailtemplates/edit"]);
                                },error=>{
                                    this.skipConfirmAlert = true;
                                    this.ngxLoading = false;
                                    this.closeModalPopup();
                                    this.logger.errorPage(error);
                            });
                        }                                     
                       
                    } else if (data.statusCode == 500) {
                        this.customResponse = new CustomResponse('ERROR', data.message, true);
                        this.ngxLoading = false;
                        this.saveLoader = false;
                        this.buttonClicked = false;
                        this.closeModalPopup();
                    }                    
                } else {
                    this.saveLoader = false;
                    this.buttonClicked = false;
                    this.closeModalPopup();
                    this.authenticationService.forceToLogout();
                }
            },
            error => {
                this.closeModalPopupAndStopLoaders(error);
            }
        );
    }

    private closeModalPopupAndStopLoaders(error: any) {
        this.saveLoader = false;
        this.skipConfirmAlert = true;
        this.closeModalPopup();
        this.ngxLoading = false;
        this.logger.errorPage(error);
    }

    updateEmailTemplate(isUpdateAndRedirect: boolean) {
        this.saveLoader = true;
        let emailTemplate = this.emailTemplate;
        let emailTemplateService = this.emailTemplateService;
        emailTemplate.draft = false;
        this.updateAndRedirectClicked = isUpdateAndRedirect;
        this.customResponse = new CustomResponse();
        this.refService.goToTop();
        emailTemplate.id = emailTemplateService.emailTemplate.id;
        emailTemplate.user = new User();
        emailTemplate.user.userId = this.loggedInUserId;
        this.updateCompanyLogo(emailTemplate);
        emailTemplate.surveyTemplate = emailTemplateService.emailTemplate.surveyTemplate;
        emailTemplate.surveyCoBrandingTemplate = emailTemplateService.emailTemplate.surveyCoBrandingTemplate;
        emailTemplateService.update(emailTemplate).subscribe(
            data => {
                if (data.access) {
                    if (data.statusCode == 702 || data.statusCode == 703) {
                        if(isUpdateAndRedirect){
                            this.refService.addCreateOrUpdateSuccessMessage("Template updated successfully");
                            this.closeModalPopup();
                            this.navigateToManageSection();
                        }else{
                            this.customResponse = new CustomResponse('SUCCESS', "Template updated successfully", true);
                            this.ngxLoading = true;
                            this.closeModalPopup();
                            this.emailTemplateService.emailTemplate.name = emailTemplate.name;
                            this.emailTemplateService.emailTemplate.categoryId = emailTemplate.categoryId;
                            this.emailTemplateService.emailTemplate.jsonBody = emailTemplate.jsonBody;
                            this.emailTemplateService.emailTemplate.body = emailTemplate.body;
                            this.loadBeeContainer(this.emailTemplateService,this.authenticationService,false);
                        }
                    } else if (data.statusCode == 500) {
                        this.customResponse = new CustomResponse('ERROR', data.message, true);
                        this.ngxLoading = false;
                        this.saveLoader = false;
                        this.buttonClicked = false;
                        this.closeModalPopup();
                    }    
                } else {
                    this.saveLoader = false;
                    this.buttonClicked = false;
                    this.closeModalPopup();
                    this.authenticationService.forceToLogout();
                }
            },
            error => {
                this.closeModalPopupAndStopLoaders(error);
            }
        );
    }

    navigateToManageSection() {
        this.refService.navigateToManageEmailTemplatesByViewType(this.folderViewType,this.viewType,this.categoryId);
    }

    updateCompanyLogo(emailTemplate: EmailTemplate) {
        emailTemplate.jsonBody = emailTemplate.jsonBody.replace(this.authenticationService.MEDIA_URL + this.refService.companyProfileImage, "https://xamp.io/vod/replace-company-logo.png");
        if (emailTemplate.body != undefined) {
            emailTemplate.body = emailTemplate.body.replace(this.authenticationService.MEDIA_URL + this.refService.companyProfileImage, "https://xamp.io/vod/replace-company-logo.png");
        }
    }

    ngOnInit() {  }
    ngOnDestroy() {
        this.emailTemplateService.isNewTemplate = false;
    }

    saveTemplate(isSaveAndRedirectButtonClicked:boolean) {
        this.emailTemplate.draft = false;
        this.saveEmailTemplate(this.emailTemplate, this.emailTemplateService, this.loggedInUserId, isSaveAndRedirectButtonClicked);
    }

  

    navigateBack(){
        let url = this.refService.getCurrentRouteUrl();
        let isCreateUrl = url.indexOf("create")>-1;
        if(isCreateUrl){
            this.router.navigate(["/home/emailtemplates/select"]);
        }else{
            this.navigateToManageSection();
        }
    }

    @HostListener('window:beforeunload')
    canDeactivate(): Observable<boolean> | boolean {
        this.authenticationService.stopLoaders();
        this.ngxLoading = false;
        let isInvalidEditPage = this.emailTemplateService.emailTemplate==undefined;
        return this.skipConfirmAlert ||  this.saveAsOrSaveAndRedirectClicked || this.updateAndRedirectClicked || isInvalidEditPage || this.authenticationService.module.logoutButtonClicked || this.isReloaded;
    }

    validateNames(){
        let name = this.refService.getTrimmedData(this.emailTemplate.name);
        let isNotEmptyName = name.length>0;
        this.errorMessage = "";
        if(isNotEmptyName){
            this.invalidTemplateName = false;
            let isDuplicateName = false;
            if(!this.emailTemplateService.emailTemplate.defaultTemplate){
                isDuplicateName = this.names.indexOf(name.toLocaleLowerCase()) > -1 && this.emailTemplateService.emailTemplate.name.toLocaleLowerCase() != name.toLowerCase();
            }else{
                isDuplicateName = this.names.indexOf(name.toLocaleLowerCase()) > -1;
            }
            let isNameNotUpdated = name.toLocaleLowerCase() == this.emailTemplateService.emailTemplate.name.toLocaleLowerCase();
            this.isSaveAsButtonDisabled = isNameNotUpdated;
            this.errorMessage = isDuplicateName ? 'Duplicate Name':'';
        }else{
            this.errorMessage = "Please Enter Name";
        }
    }

    closeModalPopup(){
        this.saveLoader = false;
        this.refService.closeModalPopup("save-template-popup");
    }
}
