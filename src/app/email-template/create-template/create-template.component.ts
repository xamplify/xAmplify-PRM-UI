import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
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
declare var BeePlugin, swal, $: any;

@Component({
    selector: 'app-create-template',
    templateUrl: './create-template.component.html',
    styleUrls: ['./create-template.component.css'],
    providers: [EmailTemplate, HttpRequestLoader, FormService, Pagination, SortOption]
})
export class CreateTemplateComponent implements OnInit, OnDestroy {
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
    eventLocation = "{{address}}";
    loadTemplate = false;
    isAdd: boolean;
    isMinTimeOver: boolean = false;
    pagination: Pagination = new Pagination();
    formsError: boolean = false;
    customResponse: CustomResponse = new CustomResponse();
    categoryId: number = 0;
    manageRouterLink = "/home/emailtemplates/manage";
    mergeTagsInput: any = {};
    constructor(public emailTemplateService: EmailTemplateService, private router: Router, private logger: XtremandLogger,
        private authenticationService: AuthenticationService, public refService: ReferenceService, private location: Location, private route: ActivatedRoute) {
        this.categoryId = this.route.snapshot.params['categoryId'];
        if (this.categoryId > 0) {
            this.manageRouterLink += "/" + this.categoryId;
        }
        if (emailTemplateService.emailTemplate != undefined) {
            this.mergeTagsInput['isEvent'] = emailTemplateService.emailTemplate.beeEventTemplate || emailTemplateService.emailTemplate.beeEventCoBrandingTemplate;
            var names: any = [];
            let self = this;
            self.loggedInUserId = this.authenticationService.getUserId();

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
                if (emailTemplateService.emailTemplate.regularCoBrandingTemplate || emailTemplateService.emailTemplate.videoCoBrandingTemplate || emailTemplateService.emailTemplate.beeEventCoBrandingTemplate) {
                    if (jsonContent.indexOf(self.coBraningImage) < 0) {
                        swal("", "Whoops! We're unable to save this template because you deleted the co-branding logo. You'll need to select a new email template and start over.", "error");
                        return false;
                    }
                }
                if (!isDefaultTemplate) {
                    var buttons = $('<div>')
                        .append(' <div class="form-group"><input class="form-control" type="text" value="' + templateName + '" id="templateNameId" maxLength="200"><span class="help-block" id="templateNameSpanError" style="color:#a94442"></span></div><br>');
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
                        self.refService.startLoader(self.httpRequestLoader);
                        swal.close();
                        self.emailTemplate.draft = false;
                        self.updateEmailTemplate(self.emailTemplate, emailTemplateService, false);
                    })).append(self.createButton('Cancel', function () {
                        self.clickedButtonName = "CANCEL";
                        swal.close();
                        console.log('Cancel');
                    }));


                    swal({ title: title, html: buttons, showConfirmButton: false, showCancelButton: false });
                } else {
                    var buttons = $('<div>')
                        .append(' <div class="form-group"><input class="form-control" type="text" value="' + templateName + '" id="templateNameId" maxLength="200"><span class="help-block" id="templateNameSpanError" style="color:#a94442"></span></div><br>');
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
                    if (value.length > 0) {
                        if (!(emailTemplateService.emailTemplate.defaultTemplate)) {
                            if (names.indexOf(value.toLocaleLowerCase()) > -1 && emailTemplateService.emailTemplate.name.toLowerCase() != value.toLowerCase()) {
                                $('#save,#update,#save-as').attr('disabled', 'disabled');
                                $('#templateNameSpanError').text('Duplicate Name');
                            } else if (value.toLocaleLowerCase() == emailTemplateService.emailTemplate.name.toLocaleLowerCase()) {
                                $('#save,#save-as').attr('disabled', 'disabled');
                            }
                            else {
                                $('#templateNameSpanError').empty();
                                $('#save,#update,#save-as').removeAttr('disabled');
                            }
                        } else {
                            if (names.indexOf(value.toLocaleLowerCase()) > -1) {
                                $('#save,#update,#save-as').attr('disabled', 'disabled');
                                $('#templateNameSpanError').text('Duplicate Name');
                            } else {
                                $('#templateNameSpanError').empty();
                                $('#save,#update,#save-as').removeAttr('disabled');
                            }
                        }
                    } else {
                        $('#save,#update,#save-as').attr('disabled', 'disabled');
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
                        console.log(new Date().toISOString() + ' autosaving...');
                        window.localStorage.setItem('newsletter.autosave', jsonFile);
                        self.emailTemplate.jsonBody = jsonFile;
                        self.isMinTimeOver = true;
                    },
                    onSend: function (htmlFile) {
                        //write your send test function here
                        console.log(htmlFile);
                    },
                    onError: function (errorMessage) {
                        swal("", "Unable to load bee template:" + errorMessage, "error");
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
                                'GET',
                                'https://rsrc.getbee.io/api/templates/m-bee',
                                null,
                                null,
                                function (template: any) {
                                    if (emailTemplateService.emailTemplate != undefined) {
                                        var body = emailTemplateService.emailTemplate.jsonBody;
                                        $.each(self.companyProfileImages, function (index, value) {
                                            body = body.replace(value, self.authenticationService.MEDIA_URL + self.refService.companyProfileImage);
                                        });
                                        body = body.replace("https://xamp.io/vod/replace-company-logo.png", self.authenticationService.MEDIA_URL + self.refService.companyProfileImage);
                                        self.emailTemplate.jsonBody = body;
                                        var jsonBody = JSON.parse(body);
                                        bee.load(jsonBody);
                                        bee.start(jsonBody);
                                    } else {
                                        bee.start(template);
                                    }
                                    self.loadTemplate = true;
                                });
                        });
                    });
            } else {
                swal("Please Contact Admin!", "No CompanyId Found", "error");
            }
        } else {
            this.location.back();//Navigating to previous router url
        }
    }//End Of Constructor

    saveEmailTemplate(emailTemplate: EmailTemplate, emailTemplateService: EmailTemplateService, loggedInUserId: number, isOnDestroy: boolean) {
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
        emailTemplate.categoryId = $.trim($('#category-dropdown option:selected').val());
        let isCoBrandingTemplate = emailTemplate.regularCoBrandingTemplate || emailTemplate.videoCoBrandingTemplate || emailTemplate.beeEventCoBrandingTemplate;
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
        }
        this.updateCompanyLogo(emailTemplate);
        emailTemplateService.save(emailTemplate).subscribe(
            data => {
                if (data.access) {
                    this.refService.stopLoader(this.httpRequestLoader);
                    if (!isOnDestroy) {
                        this.refService.isCreated = true;
                        this.navigateToManageSection();
                    } else {
                        this.emailTemplateService.goToManage();
                    }
                } else {
                    this.authenticationService.forceToLogout();
                }


            },
            error => {
                this.refService.stopLoader(this.httpRequestLoader);
                this.logger.errorPage(error);
            },
            () => console.log("Email Template Saved")
        );
    }

    updateEmailTemplate(emailTemplate: EmailTemplate, emailTemplateService: EmailTemplateService, isOnDestroy: boolean) {
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
        emailTemplateService.update(emailTemplate).subscribe(
            data => {
                if (data.access) {
                    this.refService.stopLoader(this.httpRequestLoader);
                    if (!isOnDestroy) {
                        this.refService.isUpdated = true;
                        this.navigateToManageSection();

                    } else {
                        this.emailTemplateService.goToManage();
                    }
                } else {
                    this.authenticationService.forceToLogout();
                }
            },
            error => {
                this.refService.stopLoader(this.httpRequestLoader);
                this.logger.errorPage(error)
            },
            () => console.log("Email Template Updated")
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

    ngOnInit() {
    }
    ngOnDestroy() {
        this.emailTemplateService.isNewTemplate = false;
        swal.close();
        let isButtonClicked = this.clickedButtonName != "SAVE" && this.clickedButtonName != "SAVE_AS" && this.clickedButtonName != "UPDATE";
        if (this.router.url != "/login" && isButtonClicked && this.emailTemplateService.emailTemplate != undefined && this.loggedInUserId > 0 && this.emailTemplate.jsonBody != undefined && this.isMinTimeOver) {
            let isDefaultTemplate = this.emailTemplateService.emailTemplate.defaultTemplate;
            let isUserDefined = this.emailTemplateService.emailTemplate.userDefined;
            let isDraft = this.emailTemplateService.emailTemplate.draft;
            if (!isDefaultTemplate && isUserDefined) {
                if (isDraft) {
                    this.isAdd = false;
                    this.emailTemplate.draft = true;
                    this.showSweetAlert();
                }
            }
            else {
                this.isAdd = true;
                this.showSweetAlert();
            }
        }
    }

    showSweetAlert() {
        let self = this;
        swal({
            title: 'Are you sure?',
            text: "You have unchanged data",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#54a7e9',
            cancelButtonColor: '#999',
            confirmButtonText: 'Yes, Save it!',
            cancelButtonText: "No",
            allowOutsideClick: false
        }).then(function () {
            if (self.isAdd) {
                self.emailTemplate.draft = true;
                self.saveEmailTemplate(self.emailTemplate, self.emailTemplateService, self.loggedInUserId, true);
            } else {
                self.updateEmailTemplate(self.emailTemplate, self.emailTemplateService, true);
            }
        }, function (dismiss) {

        })
    }


    saveTemplate() {
        this.refService.startLoader(this.httpRequestLoader);
        this.emailTemplate.draft = false;
        this.saveEmailTemplate(this.emailTemplate, this.emailTemplateService, this.loggedInUserId, false);
        swal.close();
    }

    createButton(text, cb) {
        if (text == "Save") {
            return $('<input type="submit" class="btn btn-primary" value="' + text + '" id="save" disabled="disabled">').on('click', cb);
        } else if (text == "Save As") {
            return $('<input type="submit" class="btn btn-primary" value="' + text + '" id="save-as" disabled="disabled">').on('click', cb);
        } else if (text == "Update") {
            return $('<input type="submit" class="btn btn-primary" value="' + text + '" id="update">').on('click', cb);
        }
        else {
            return $('<input type="submit" class="btn btn-primary" value="' + text + '">').on('click', cb);
        }
    }

}
