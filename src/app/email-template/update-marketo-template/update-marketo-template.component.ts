import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { EmailTemplateService } from '../services/email-template.service';
import { UserService } from '../../core/services/user.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { EmailTemplate } from '../models/email-template';
import { ReferenceService } from '../../core/services/reference.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { CallActionSwitch } from '../../videos/models/call-action-switch';
import { User } from '../../core/models/user';
declare var Metronic, Layout, Demo, TableManaged, $, CKEDITOR: any, swal: any;

@Component({
    selector: 'app-update-marketo-template',
    templateUrl: './update-marketo-template.component.html',
    styleUrls: ['./update-marketo-template.component.css'],
    providers: [EmailTemplate, HttpRequestLoader, CallActionSwitch]
})
export class UpdateMarketoTemplateComponent implements OnInit
{

    public duplicateTemplateName: boolean = false;
    public invalidTemplateName: boolean = false;
    public isTemplateName: boolean = false;
    public disable: boolean;
    model: any = {};
    public availableTemplateNames: Array<string>;
    videoTag: string = "";
    isVideoTagError: boolean = false;
    videoTagsError: string = "";
    emailOpenTrackingUrl: string = "<div id=\"bottomDiv\"><img src=\"<emailOpenImgURL>\" class='backup_picture' style='display:none'></div>";
    clickedButtonName: string = "";
    updateButton: string = "UPDATE";
    httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
    isValidType: boolean;
    coBrandingLogo: boolean = false;
    mycontent: string;
    emailTemplateTypes = ["VIDEO", "REGULAR"];
    thirdPartyEmailTemplate: string;
    constructor(public emailTemplateService: EmailTemplateService, private userService: UserService,
        private router: Router, private emailTemplate: EmailTemplate, private logger: XtremandLogger,
        private authenticationService: AuthenticationService, public refService: ReferenceService,
        public callActionSwitch: CallActionSwitch)
    {
        logger.debug("updateTemplateComponent() Loaded");
        CKEDITOR.config.allowedContent = true;
        // CKEDITOR.appendTo('editorSpace', {
        //     on: {
        //         instanceReady: function (ev)
        //         {
        //             this.dataProcessor.writer.lineBreakChars = '';
        //             this.dataProcessor.writer.setRules('p', {
        //                 indent: true,
        //                 breakBeforeOpen: false,
        //                 breakAfterOpen: false,
        //                 breakBeforeClose: false,
        //                 breakAfterClose: false
        //             });
        //         }
        //     }
        // })
        if (this.emailTemplateService.emailTemplate == undefined)
        {
            this.router.navigate(["/home/emailtemplates/select"]);
        }
        emailTemplateService.getAvailableNames(this.authenticationService.getUserId()).subscribe(
            (data: any) =>
            {
                this.availableTemplateNames = data;
                this.videoTag = "<a href='<SocialUbuntuURL>'>\n   <img src='<SocialUbuntuImgURL>'/> \n </a> \n";

                if (emailTemplateService.emailTemplate != undefined)
                {
                    console.log(emailTemplateService.emailTemplate)
                    let body = emailTemplateService.emailTemplate.body.replace(this.emailOpenTrackingUrl, "");
                    this.model.content = body;
                    if (!emailTemplateService.emailTemplate.draft){
                        this.isValidType = true;
                        this.model.isRegularUpload = emailTemplateService.emailTemplate.regularTemplate;
                        if( this.model.isRegularUpload)
                            this.coBrandingLogo = emailTemplateService.emailTemplate.regularCoBrandingTemplate;
                        else
                            this.coBrandingLogo = emailTemplateService.emailTemplate.videoCoBrandingTemplate;
                    }else{
                        this.model.isRegularUpload = "REGULAR";
                    }
                    this.model.draft = emailTemplateService.emailTemplate.draft;
                    this.mycontent = this.model.content;
                    this.model.templateName = emailTemplateService.emailTemplate.name;
                   

                }
            },
            (error: any) => logger.error(error),
            () => logger.debug("Got List Of Available Email Template Names in uploadEmailTemplateComponent constructor")
        );


    }


    checkUpdatedAvailableNames(value: any)
    {
        if (value.trim().length > 0)
        {
            this.invalidTemplateName = false;
            $("#templateName").attr('style', 'border-left: 5px solid #42A948');
            if (this.availableTemplateNames.indexOf(value.toLocaleLowerCase().trim()) > -1 && this.emailTemplateService.emailTemplate.name.toLowerCase() != value.toLowerCase().trim())
            {
                this.duplicateTemplateName = true;
                $("#templateName").attr('style', 'border-left: 5px solid #a94442');
            } else
            {
                $("#templateName").attr('style', 'border-left: 5px solid #42A948');
                this.duplicateTemplateName = false;
            }
        } else
        {
            $("#templateName").attr('style', 'border-left: 5px solid #a94442');
            this.invalidTemplateName = true;
        }
    }
    validateType()
    {
        let fieldValue = $("#isRegularUpload").val();

        if (fieldValue != null && fieldValue != undefined && fieldValue.length > 0 && fieldValue != "Select Type")
        {

            this.isValidType = true;

            $("#isRegularUpload").attr('style', 'border-left: 5px solid #42A948');
        } else
        {

            this.isValidType = false;

            $("#isRegularUpload").attr('style', 'border-left: 5px solid #a94442');

        }

    }


    update()
    {
        this.clickedButtonName = this.updateButton;
        this.updateHtmlTemplate(false);
    }

    updateHtmlTemplate(isOnDestroy: boolean)
    {
        this.refService.startLoader(this.httpRequestLoader);
        this.emailTemplate.id = this.emailTemplateService.emailTemplate.id;
        this.emailTemplate.name = this.model.templateName;
        this.emailTemplate.createdBy = this.emailTemplateService.emailTemplate.createdBy;
        this.emailTemplate.onDestroy = isOnDestroy;
        this.emailTemplate.draft = isOnDestroy;
        this.emailTemplate.user = new User();
        this.emailTemplate.user.userId = this.authenticationService.getUserId();


        if (this.model.isRegularUpload == "REGULAR")
        {
            this.emailTemplate.regularTemplate = true;
            this.emailTemplate.desc = "Regular Template";
            this.emailTemplate.subject = "assets/images/normal-email-template.png";
            this.emailTemplate.regularCoBrandingTemplate = this.coBrandingLogo;
        } else
        {
            this.emailTemplate.videoTemplate = true;
            this.emailTemplate.desc = "Video Template";
            this.emailTemplate.subject = "assets/images/video-email-template.png";
            this.emailTemplate.videoCoBrandingTemplate = this.coBrandingLogo;
        }

        for (var instanceName in CKEDITOR.instances)
        {
            CKEDITOR.instances[instanceName].updateElement();
            this.emailTemplate.body = this.mycontent;
        }
        if ($.trim(this.emailTemplate.body).length > 0)
        {
            console.log(this.emailTemplate);
            if (this.thirdPartyEmailTemplate === "HubSpot") {
                this.updateEmailTemplate(isOnDestroy, this.emailTemplate);
            }
            else if (this.thirdPartyEmailTemplate === "Marketo") {
                this.emailTemplateService.updateMarketoEmailTemplate(this.emailTemplate)
                .subscribe(
                    (data: any) =>
                    {
                        this.refService.stopLoader(this.httpRequestLoader);
                        if (!isOnDestroy)
                        {
                            if (data.statusCode == 8013)
                            {
                                this.refService.isUpdated = true;
                                this.emailTemplateService.emailTemplate = new EmailTemplate();
                                this.router.navigate(["/home/emailtemplates/manage"]);
                            } else
                            {
                                this.clickedButtonName = "";
                                this.isVideoTagError = true;
                                this.videoTagsError = data.message;
                            }
                        }
                    },
                    (error: string) =>
                    {
                        this.refService.stopLoader(this.httpRequestLoader);
                        this.logger.errorPage(error);
                    },
                    () => this.logger.info("Finished updateHtmlTemplate()")
                );
            }            
        }
    }

    setCoBrandingLogo(event)
    {
        console.log(event)

        this.coBrandingLogo = event;
        let body = this.getCkEditorData();
        if (event)
        {
            if (body.indexOf(this.refService.coBrandingImageTag) < 0)
            {
                this.model.content = this.refService.coBrandingTag.concat(this.model.content);
            }
        } else
        {
            this.model.content = this.model.content.replace(this.refService.coBrandingImageTag, "").
                replace("<p>< /></p>", "").
                replace("< />", "").replace("<p>&lt;&gt;</p>", "").replace("<>", "");

            // .replace("&lt; style=&quot;background-color:black&quot; /&gt;","");
        }

    }

    setVideoGif(event)
    {

        let body = this.getCkEditorData();
        if (event == 'VIDEO')
        {

            if (body.indexOf(this.videoTag) < 0)
            {
                this.model.content = "<img src=\"https://aravindu.com/vod/images/xtremand-video.gif\" />".concat(body);
            }

        } else
        {

            this.model.content = body.replace("<img src=\"https://aravindu.com/vod/images/xtremand-video.gif\" />", "").
                replace("<p>< /></p>", "").
                replace("< />", "").replace("<p>&lt;&gt;</p>", "").replace("<>", "");


        }

    }
    getCkEditorData()
    {
        let body = "";
        for (var instanceName in CKEDITOR.instances)
        {
            CKEDITOR.instances[instanceName].updateElement();
            body = CKEDITOR.instances[instanceName].getData();
        }
        return body;
    }
    ngOnInit()
    {
        try
        {
            if (this.router.url.includes("hubspot")) {
                this.thirdPartyEmailTemplate = "HubSpot";
              }
              else if (this.router.url.includes("marketo")) {
                this.thirdPartyEmailTemplate = "Marketo";
              }
        } catch (errr) { }
    }


    ngOnDestroy()
    {
        if (this.emailTemplateService.emailTemplate != undefined && this.clickedButtonName != this.updateButton)
        {

            swal( {
                title: 'Are you sure?',
                text: "You want to discard the changes!",
                type: 'warning',
                showCancelButton: true,
                swalConfirmButtonColor: '#54a7e9',
                swalCancelButtonColor: '#999',
                confirmButtonText: 'Discard !'

            }).then( function() {
                this.updateHtmlTemplate(true);
            }, function( dismiss: any ) {
                console.log( 'you clicked on option' + dismiss );
            });
            
        }

    }

    updateEmailTemplate(isOnDestroy: boolean, emailTemplate: EmailTemplate){
        if (this.thirdPartyEmailTemplate === "HubSpot") {
            this.emailTemplateService.update(this.emailTemplate)
            .subscribe(
            (data: any) => {
                this.refService.stopLoader(this.httpRequestLoader);
                if(!isOnDestroy){
                    if(data.statusCode==703){
                        this.refService.isUpdated = true;
                        this.emailTemplateService.emailTemplate = new EmailTemplate();
                        this.router.navigate(["/home/emailtemplates/manage"]);
                    }else{
                        this.clickedButtonName = "";
                        this.isVideoTagError = true;
                        this.videoTagsError = data.message;
                    }
                }else{
                    this.emailTemplateService.goToManage();
                }

            },
            (error: string) => {
                this.refService.stopLoader(this.httpRequestLoader);
                this.logger.errorPage(error);
            },
            () => this.logger.info("Finished updateHtmlTemplate()")
            );
        }
    }
}
