import { Component, OnInit, OnDestroy, ViewChild,HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { EmailTemplateService } from '../services/email-template.service';
import { User } from '../../core/models/user';
import { SenderMergeTag } from '../../core/models/sender-merge-tag';
import { EmailTemplate } from '../models/email-template';
import { EmailTemplateType } from '../../email-template/models/email-template-type';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Pagination } from '../../core/models/pagination';
import { FormService } from '../../forms/services/form.service';
import { SortOption } from '../../core/models/sort-option';
import { CustomResponse } from '../../common/models/custom-response';
import { ComponentCanDeactivate } from 'app/component-can-deactivate';
import { Observable } from 'rxjs/Observable';

declare var BeePlugin:any, swal:any, $: any;

@Component({
    selector: 'app-create-template',
    templateUrl: './create-template.component.html',
    styleUrls: ['./create-template.component.css'],
    providers: [EmailTemplate, HttpRequestLoader, FormService, Pagination, SortOption]
})
export class CreateTemplateComponent implements OnInit, ComponentCanDeactivate,OnDestroy {
    httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
    formsLoader: HttpRequestLoader = new HttpRequestLoader();
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
    saveOrUpdateButtonClicked = false;
    tempName = "";
    tempCategoryId = 0;
    constructor(public emailTemplateService: EmailTemplateService, private router: Router, private logger: XtremandLogger,
        private authenticationService: AuthenticationService, public refService: ReferenceService, private location: Location, 
        private route: ActivatedRoute) {
        this.refService.scrollSmoothToTop();
        this.refService.startLoader(this.httpRequestLoader);
        let url = this.refService.getCurrentRouteUrl();
        this.isAdd = url.indexOf("create")>-1;
        this.categoryId = this.route.snapshot.params['categoryId'];
        if (this.categoryId > 0) {
            this.manageRouterLink += "/" + this.categoryId;
        }
        if (emailTemplateService.emailTemplate != undefined) {
            this.mergeTagsInput['isEvent'] = emailTemplateService.emailTemplate.beeEventTemplate || emailTemplateService.emailTemplate.beeEventCoBrandingTemplate;
            var names: any = [];
            let self = this;
            self.loggedInUserId = this.authenticationService.getUserId();
            this.showForms = this.emailTemplateService.emailTemplate.surveyTemplate || this.emailTemplateService.emailTemplate.surveyCoBrandingTemplate;

            emailTemplateService.getAvailableNames(self.loggedInUserId).subscribe(
                (data: any) => {
                    names = data;
                },
                error => { this.logger.error("error in getAvailableNames(" + self.loggedInUserId + ")", error); },
                () => this.logger.info("Finished getAvailableNames()"));

            emailTemplateService.getAllCompanyProfileImages(self.loggedInUserId).subscribe(
                (data: any) => {
                    self.companyProfileImages = data;
                },
                error => { this.logger.error("error in getAllCompanyProfileImages(" + self.loggedInUserId + ")", error); },
                () => this.logger.info("Finished getAllCompanyProfileImages()"));


            authenticationService.getCategoryNamesByUserId(self.loggedInUserId).subscribe(
                (data: any) => {
                    self.categoryNames = data.data;
                },
                error => { this.logger.error("error in getCategoryNamesByUserId(" + self.loggedInUserId + ")", error); },
                () => this.logger.info("Finished getCategoryNamesByUserId()"));


            var request = function (method, url, data, type, callback) {
                var req = new XMLHttpRequest();
                req.onreadystatechange = function () {
                    if (req.readyState === 4 && req.status === 200) {
                        var response = JSON.parse(req.responseText);
                        callback(response);
                    }else if (req.readyState === 4 && req.status !== 200) {
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

            var title = "Add Template Name";
            var templateName = "";
            if (emailTemplateService.emailTemplate != undefined) {
                var isDefaultTemplate = emailTemplateService.emailTemplate.defaultTemplate;
                if (!isDefaultTemplate) {
                    templateName = emailTemplateService.emailTemplate.name;
                    title = "Update Template Name";
                }
            } else {
                this.router.navigate(["/home/emailtemplates/select"]);
            }

            var save = function (jsonContent: string, htmlContent: string) {
                self.emailTemplate = new EmailTemplate();
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
                if (!isDefaultTemplate) {
                    var buttons = $('<div><div id="bee-save-buton-loader"></div>')
                        .append(' <div class="form-group"><input class="form-control" autocomplete="off" type="text" value="' + templateName + '" id="templateNameId"><span class="help-block" id="templateNameSpanError" style="color: red !important;"></span></div><br>');
                    var dropDown = '<div class="form-group">';
                    dropDown += '<label style="color: #575757;font-size: 17px; font-weight: 500;">Select a folder</label>';
                    dropDown += '<select class="form-control" id="category-dropdown">';
                    $.each(self.categoryNames, function (_index: number, category: any) {
                        let categoryId = category.id;
                        if (self.emailTemplateService.emailTemplate.categoryId == categoryId) {
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
                        self.saveTemplate();
                    })).append(self.createButton('Update', function () {
                        self.clickedButtonName = "UPDATE";
                        self.emailTemplate.draft = false;
                        self.updateEmailTemplate(self.emailTemplate, emailTemplateService, false);
                    })).append(self.createButton('Update & Redirect', function () {
                        self.clickedButtonName = "UPDATE_AND_CLOSE";
                        self.emailTemplate.draft = false;
                        self.updateEmailTemplate(self.emailTemplate, emailTemplateService, true);
                    }))
                    .append(self.createButton('Cancel', function () {
                        self.clickedButtonName = "CANCEL";
                        swal.close();
                    }));


                    swal({ title: title, html: buttons, showConfirmButton: false, showCancelButton: false });
                } else {
                    var buttons = $('<div><div id="bee-save-buton-loader"></div>')
                        .append(' <div class="form-group"><input class="form-control" autocomplete="off" type="text" value="' + templateName + '" id="templateNameId"><span class="help-block" id="templateNameSpanError" style="color:#a94442"></span></div><br>');
                    var dropDown = '<div class="form-group">';
                    dropDown += '<label style="color: #575757;font-size: 17px; font-weight: 500;">Select a folder</label>';
                    dropDown += '<select class="form-control" id="category-dropdown">';
                    $.each(self.categoryNames, function (_index: number, category: any) {
                        dropDown += '<option value=' + category.id + '>' + category.name + '</option>';
                    });
                    dropDown += '</select>';
                    dropDown += '</div><br>';
                    buttons.append(dropDown);

                    buttons.append(self.createButton('Save', function () {
                        self.clickedButtonName = "SAVE";
                        self.saveTemplate();
                    })).append(self.createButton('Cancel', function () {
                        self.clickedButtonName = "CANCEL";
                        swal.close();
                    }));
                    swal({
                        title: title,
                        html: buttons,
                        showConfirmButton: false,
                        showCancelButton: false
                    });
                }
                $('#templateNameId').on('input', function (event) {
                    let value = $.trim(event.target.value);
                    $('#templateNameSpanError').empty();
                    if (value.length > 0) {
                        if (!(emailTemplateService.emailTemplate.defaultTemplate)) {
                            if (names.indexOf(value.toLocaleLowerCase()) > -1 && emailTemplateService.emailTemplate.name.toLowerCase() != value.toLowerCase()) {
                                $('#save,#update,#save-as,#update-and-close').attr('disabled', 'disabled');
                                $('#templateNameSpanError').text('Duplicate Name');
                            } else if (value.toLocaleLowerCase() == emailTemplateService.emailTemplate.name.toLocaleLowerCase()) {
                                $('#save,#save-as').attr('disabled', 'disabled');
                            }
                            else {
                                $('#templateNameSpanError').empty();
                                $('#save,#update,#save-as,#update-and-close').removeAttr('disabled');
                            }
                        } else {
                            if (names.indexOf(value.toLocaleLowerCase()) > -1) {
                                $('#save,#update,#save-as,#update-and-close').attr('disabled', 'disabled');
                                $('#templateNameSpanError').text('Duplicate Name');
                            } else {
                                $('#templateNameSpanError').empty();
                                $('#save,#update,#save-as,#update-and-close').removeAttr('disabled');
                            }
                        }
                    } else {
                        $('#save,#update,#save-as,#update-and-close').attr('disabled', 'disabled');
                    }
                });
            };//End Of Save Method


            let mergeTags = [];
            let event = this.emailTemplateService.emailTemplate.beeEventTemplate || this.emailTemplateService.emailTemplate.beeEventCoBrandingTemplate;
            mergeTags = this.refService.addMergeTags(mergeTags,false,event);
            
            if (self.refService.companyId != undefined && self.refService.companyId > 0) {
                var beeUserId = "bee-" + self.refService.companyId;
                var roleHash = self.authenticationService.vendorRoleHash;
                var beeConfig = {
                    uid: beeUserId,
                    container: 'bee-plugin-container',
                    autosave: 15,
                    //language: 'en-US',
                    language: this.authenticationService.beeLanguageCode,
                    mergeTags: mergeTags,
                    roleHash: roleHash,
                    onSave: function (jsonFile, htmlFile) {
                        save(jsonFile, htmlFile);
                    },
                    onSaveAsTemplate: function (jsonFile) { // + thumbnail?
                        //save('newsletter-template.json', jsonFile);
                    },
                    onAutoSave: function (jsonFile) { // + thumbnail?
                        window.localStorage.setItem('newsletter.autosave', jsonFile);
                        self.emailTemplate.jsonBody = jsonFile;
                        self.isMinTimeOver = true;
                    },
                    onSend: function (htmlFile) {
                    },
                    onError: function (errorMessage:string) {
                        self.refService.showSweetAlertErrorMessage("Unable to load bee template:" + errorMessage);
                    }
                };

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
                                        $.each(self.companyProfileImages, function (_index:number, value:any) {
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
                                    self.refService.stopLoader(self.httpRequestLoader);
                                });
                        });
                    });
            } else {
                swal("Please Contact Admin!", "No CompanyId Found", "error");
                self.refService.stopLoader(self.httpRequestLoader);
            }
        } else {
            this.location.back();//Navigating to previous router url
        }
    }//End Of Constructor

    saveEmailTemplate(emailTemplate: EmailTemplate, emailTemplateService: EmailTemplateService, loggedInUserId: number, isOnDestroy: boolean) {
        this.refService.goToTop();
        $("#bee-save-buton-loader").addClass("button-loader"); 
        emailTemplate.user = new User();
        emailTemplate.user.userId = loggedInUserId;
        emailTemplate.userDefined = true;
        emailTemplate.name = $.trim($('#templateNameId').val());
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

        emailTemplate.categoryId = $.trim($('#category-dropdown option:selected').val());
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
                $("#bee-save-buton-loader").removeClass("button-loader"); 
                swal.close();
                if (data.access) {
                    if (data.statusCode == 702) {                                               
                        if (!isOnDestroy) {
                            this.refService.isCreated = true;
                            this.navigateToManageSection();
                        } else {
                            this.emailTemplateService.goToManage();
                        }
                    } else if (data.statusCode == 500) {
                        this.customResponse = new CustomResponse('ERROR', data.message, true);
                    }                    
                } else {
                    this.authenticationService.forceToLogout();
                }
            },
            error => {
                $("#bee-save-buton-loader").removeClass("button-loader"); 
                swal.close();
                this.refService.stopLoader(this.httpRequestLoader);
                this.logger.errorPage(error);
            }
        );
    }

    updateEmailTemplate(emailTemplate: EmailTemplate, emailTemplateService: EmailTemplateService, isUpdateAndClose: boolean) {
        this.saveOrUpdateButtonClicked = true;
        this.customResponse = new CustomResponse();
        this.refService.goToTop();
        $("#bee-save-buton-loader").addClass("button-loader"); 
        let enteredEmailTemplateName = $.trim($('#templateNameId').val());
        if (enteredEmailTemplateName.length == 0) {
            emailTemplate.name = emailTemplateService.emailTemplate.name;
        } else {
            emailTemplate.name = $.trim($('#templateNameId').val());
        }
        emailTemplate.id = emailTemplateService.emailTemplate.id;
        emailTemplate.user = new User();
        emailTemplate.user.userId = this.loggedInUserId;
        this.updateCompanyLogo(emailTemplate);
        emailTemplate.categoryId = $.trim($('#category-dropdown option:selected').val());
        emailTemplate.surveyTemplate = emailTemplateService.emailTemplate.surveyTemplate;
        emailTemplate.surveyCoBrandingTemplate = emailTemplateService.emailTemplate.surveyCoBrandingTemplate;
        emailTemplateService.update(emailTemplate).subscribe(
            data => {
                $("#bee-save-buton-loader").removeClass("button-loader"); 
                swal.close();
                if (data.access) {
                    if (data.statusCode == 702 || data.statusCode == 703) {
                        if(isUpdateAndClose){
                            this.refService.isUpdated = true;
                            this.navigateToManageSection();
                        }else{
                            this.tempName = emailTemplate.name;
                            this.tempCategoryId = emailTemplate.categoryId;
                            this.customResponse = new CustomResponse('SUCCESS', "Template updated successfully", true);
                        }
                    } else if (data.statusCode == 500) {
                        this.customResponse = new CustomResponse('ERROR', data.message, true);
                    }    
                } else {
                    this.authenticationService.forceToLogout();
                }
            },
            error => {
                $("#bee-save-buton-loader").removeClass("button-loader"); 
                swal.close();
                this.logger.errorPage(error)
            }
        );
    }

    navigateToManageSection() {
        let categoryId = this.route.snapshot.params['categoryId'];
        if (categoryId > 0) {
            this.router.navigate(["/home/emailtemplates/manage/" + categoryId]);
        } else {
            this.router.navigate(["/home/emailtemplates/manage"]);
        }
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

   


    saveTemplate() {
        this.emailTemplate.draft = false;
        this.saveOrUpdateButtonClicked = true;
        this.saveEmailTemplate(this.emailTemplate, this.emailTemplateService, this.loggedInUserId, false);
    }

    createButton(text, cb) {
        let buttonClass = this.isAdd ? "btn btn-primary":"btn btn-sm btn-primary";
        let cancelButtonClass = this.isAdd ? "btn Btn-Gray":"btn btn-sm Btn-Gray";
        let cancelButtonSettings = this.isAdd ? 'class="'+cancelButtonClass+'"' : 'class="'+cancelButtonClass+'" style="margin-right: -35px !important;"';
        if (text == "Save") {
            return $('<input type="submit" class="'+buttonClass+'"  value="' + text + '" id="save" disabled="disabled">').on('click', cb);
        } else if (text == "Save As") {
            return $('<input type="submit" class="'+buttonClass+'" style="margin-left: -33px !important" value="' + text + '" id="save-as" disabled="disabled">').on('click', cb);
        } else if (text == "Update") {
            return $('<input type="submit" class="'+buttonClass+'" value="' + text + '" id="update">').on('click', cb);
        }else if (text == "Update & Redirect") {
            return $('<input type="submit" class="'+buttonClass+'" value="' + text + '" id="update-and-close">').on('click', cb);
        }else {
            return $('<input type="submit" '+cancelButtonSettings+' value="' + text + '">').on('click', cb);
        }
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
        let isInvalidEditPage = !this.isAdd && this.emailTemplateService.emailTemplate==undefined;
        return this.saveOrUpdateButtonClicked || isInvalidEditPage || this.authenticationService.module.logoutButtonClicked ;
    }
}
