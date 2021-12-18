import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { environment } from 'environments/environment';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { FormService } from '../../forms/services/form.service';
import { SortOption } from '../../core/models/sort-option';
import { CustomResponse } from '../../common/models/custom-response';
import { UtilService } from '../../core/services/util.service';
import { PreviewPopupComponent } from '../../forms/preview-popup/preview-popup.component';
/*************Landing Page***************/
import { LandingPageService } from '../services/landing-page.service';
import { LandingPage } from '../models/landing-page';
declare var BeePlugin, swal, $: any;
@Component({
    selector: 'app-add-landing-page',
    templateUrl: './add-landing-page.component.html',
    styleUrls: ['./add-landing-page.component.css'],
    providers: [LandingPage, HttpRequestLoader, FormService, Pagination, SortOption]
})
export class AddLandingPageComponent implements OnInit, OnDestroy {
    httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
    formsLoader: HttpRequestLoader = new HttpRequestLoader();
    landingPage: LandingPage = new LandingPage();
    ngxloading = false;
    loggedInUserId = 0;
    clickedButtonName = "";
    isAdd: boolean;
    isMinTimeOver: boolean = false;
    pagination: Pagination = new Pagination();
    formsError: boolean = false;
    customResponse: CustomResponse = new CustomResponse();
    name = "";
    id = 0;
    defaultLandingPage = false;
    loadLandingPage = false;
    coBraningImage = "co-branding.png";
    categoryId: number = 0;
    @ViewChild('previewPopUpComponent') previewPopUpComponent: PreviewPopupComponent;
    categoryNames: any;
    routerLink = "/home/pages/manage";
    loggedInAsSuperAdmin = false;
    mergeTagsInput: any = {};
    constructor(private landingPageService: LandingPageService, private router: Router, private logger: XtremandLogger,
        private authenticationService: AuthenticationService, public referenceService: ReferenceService, private location: Location,
        public pagerService: PagerService, public sortOption: SortOption, public utilService: UtilService, private route: ActivatedRoute) {
        this.id = this.landingPageService.id;
        this.loggedInAsSuperAdmin = this.referenceService.getCurrentRouteUrl().indexOf("saveAsDefault")>-1;
        this.mergeTagsInput['page'] = true;
        let categoryId = this.route.snapshot.params['categoryId'];
        if (categoryId > 0) {
            this.routerLink += "/" + categoryId;
        }
        if (this.id!=undefined && this.id > 0) {
            var names: any = [];
            let self = this;
            var pageType = "";
            if (this.loggedInAsSuperAdmin) {
                self.loggedInUserId = 1;
            } else {
                self.loggedInUserId = this.authenticationService.getUserId();
            }
            this.referenceService.loading(this.httpRequestLoader, true);
            if (!this.loggedInAsSuperAdmin) {
                landingPageService.getAvailableNames(self.loggedInUserId).subscribe(
                    (data: any) => { names = data; },
                    error => {
                        this.logger.error("error in getAvailableNames(" + self.loggedInUserId + ")", error);
                    });
                authenticationService.getCategoryNamesByUserId(self.loggedInUserId).subscribe(
                    (data: any) => {
                        self.categoryNames = data.data;
                    },
                    error => { this.logger.error("error in getCategoryNamesByUserId(" + self.loggedInUserId + ")", error); },
                    () => this.logger.info("Finished getCategoryNamesByUserId()"));
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
                            if (self.landingPage.coBranded) {
                                if (jsonContent.indexOf(self.coBraningImage) < 0) {
                                    swal("", "Whoops! We're unable to save this page because you deleted the co-branding logo. You'll need to select a new page and start over.", "error");
                                    return false;
                                }
                            }

                            if (!defaultLandingPage) {
                                self.name = landingPageName;
                                var buttons = $('<div><div id="bee-save-buton-loader"></div>')
                                    .append(' <div class="form-group"><input class="form-control" type="text" value="' + landingPageName + '" id="templateNameId" maxLength="200"><span class="help-block" id="templateNameSpanError" style="color:#a94442"></span></div><br>');
                                let dropDown = '<div class="form-group">';
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
                                    self.saveLandingPage(false);
                                })).append(self.createButton('Update', function () {
                                    let selectedPageType = $('#pageType option:selected').val();
                                    if (self.landingPage.type == selectedPageType) {
                                        $('#pageTypeSpanError').empty();
                                        self.ngxloading = true;
                                        self.clickedButtonName = "UPDATE";
                                        // self.referenceService.startLoader( self.httpRequestLoader );
                                        //swal.close();
                                        $("#bee-save-buton-loader").addClass("button-loader"); 
                                        self.updateLandingPage(false);
                                    } else {
                                        $('#pageTypeSpanError').text('Page Type cannot be changed');
                                    }

                                })).append(self.createButton('Cancel', function () {
                                    self.clickedButtonName = "CANCEL";
                                    swal.close();
                                    console.log('Cancel');
                                }));
                                swal({ title: title, html: buttons, showConfirmButton: false, showCancelButton: false, allowOutsideClick: false });
                            } else {
                                var buttons = $('<div><div id="bee-save-buton-loader"></div>')
                                    .append(' <div class="form-group"><input class="form-control" type="text" value="' + landingPageName + '" id="templateNameId" maxLength="200">' +
                                        '<span class="help-block" id="templateNameSpanError" style="color:#a94442"></span></div><br>');

                                if (!self.loggedInAsSuperAdmin) {
                                    let dropDown = '<div class="form-group">';
                                    dropDown += '<label style="color: #575757;font-size: 17px; font-weight: 500;">Select Page Type</label>';
                                    dropDown += '<select class="form-control" id="pageType">';
                                    dropDown += '<option value="PRIVATE">PRIVATE</option>';
                                    dropDown += '<option value="PUBLIC">PUBLIC</option>';
                                    dropDown += '</select>';
                                    dropDown += '<span class="help-block" id="pageTypeSpanError" style="color:#a94442"></span>';
                                    dropDown += '</div><br>';
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

                                buttons.append(self.createButton('Save', function () {
                                    self.clickedButtonName = "SAVE";
                                    self.saveLandingPage(false);
                                })).append(self.createButton('Cancel', function () {
                                    self.clickedButtonName = "CANCEL";
                                    swal.close();
                                }));
                                swal({
                                    title: title,
                                    html: buttons,
                                    showConfirmButton: false,
                                    showCancelButton: false,
                                    allowOutsideClick: false
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
                                            $('#save,#update,#save-as').attr('disabled', 'disabled');
                                            $('#templateNameSpanError').text('Duplicate Name');
                                        } else if (value.toLocaleLowerCase() == landingPage.name.toLocaleLowerCase()) {
                                            $('#templateNameSpanError').empty();
                                            $('#save,#save-as').attr('disabled', 'disabled');
                                            $('#update').removeAttr('disabled');
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


                        }
                        let mergeTags = this.referenceService.addPageMergeTags();
                        if (this.referenceService.companyId != undefined && this.referenceService.companyId > 0) {
                            var beeUserId = self.loggedInAsSuperAdmin ? "bee-1" : "bee-" + this.referenceService.companyId;
                            var beeConfig = {
                                uid: beeUserId,
                                container: 'bee-plugin-container',
                                autosave: 15,
                                mergeTags: mergeTags,
                                preventClose: true,
                                //language: 'en-US',
                                language: this.authenticationService.beeLanguageCode,
                                onSave: function (jsonFile, htmlFile) {
                                    save(jsonFile, htmlFile);
                                },
                                onSaveAsTemplate: function (jsonFile) { // + thumbnail?
                                },
                                onAutoSave: function (jsonFile) { // + thumbnail?
                                    self.landingPage.jsonBody = jsonFile;
                                    self.isMinTimeOver = true;
                                },
                                onSend: function (htmlFile) {

                                },
                                onError: function (errorMessage) {
                                    swal("", "Unable to load bee template:" + errorMessage, "error");
                                    self.location.back();//Navigating to previous router url
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
                                                self.loadLandingPage = true;
                                            });
                                    });
                                });
                        }
                    } else {
                        swal("Please Contact Admin!", "No CompanyId Found", "error");
                    }
                    this.referenceService.loading(this.httpRequestLoader, false);
                },
                (error: any) => { this.logger.errorPage(error); });
        } else {
            this.location.back();//Navigating to previous router url
        }

    }


    saveLandingPage(isOnDestroy: boolean) {
        $("#bee-save-buton-loader").addClass("button-loader"); 
        $('#templateNameSpanError').text('');
        this.landingPage.name = this.name;
        this.landingPage.userId = this.loggedInUserId;
        this.landingPage.companyProfileName = this.authenticationService.companyProfileName;
        if (!this.loggedInAsSuperAdmin) {
            this.landingPage.type = $('#pageType option:selected').val();
            this.landingPage.categoryId = $.trim($('#page-folder-dropdown option:selected').val());
            this.updateCompanyLogo(this.landingPage);
        }
        this.landingPageService.save(this.landingPage, this.loggedInAsSuperAdmin,this.id).subscribe(
            data => {
                $("#bee-save-buton-loader").removeClass("button-loader"); 
                if (this.loggedInAsSuperAdmin) {
                    this.referenceService.showSweetAlertProceesor(this.landingPage.name + " Created Successfully");
                   let self = this;
                    setTimeout(function(){
                        self.referenceService.goToRouter("/home/pages/select");
                    }, 1500);
                } else {
                    this.goToManageAfterSave(data, isOnDestroy);
                }
            },
            error => {
                $("#bee-save-buton-loader").removeClass("button-loader"); 
                let statusCode = JSON.parse(error['status']);
                if (statusCode == 409) {
                    let errorResponse = JSON.parse(error['_body']);
                    let message = errorResponse['message'];
                    $('#templateNameSpanError').text(message);
                } else {
                    this.referenceService.stopLoader(this.httpRequestLoader);
                    this.logger.errorPage(error);
                }
            });
    }

    goToManageAfterSave(data, isOnDestroy) {
        if (data.access) {
            this.referenceService.stopLoader(this.httpRequestLoader);
            if (!isOnDestroy) {
                this.referenceService.isCreated = true;
                this.navigateToManageSection();
            } else {
                this.landingPageService.goToManage();
            }
        } else {
            this.authenticationService.forceToLogout();
        }
    }

    navigateToManageSection() {
        let categoryId = this.route.snapshot.params['categoryId'];
        if (categoryId > 0) {
            this.router.navigate(["/home/pages/manage/" + categoryId]);
        } else {
            this.router.navigate(["/home/pages/manage"]);
        }
    }


    updateLandingPage(isDestroy: boolean) {
        this.landingPage.name = this.name;
        this.landingPage.id = this.id;
        this.landingPage.userId = this.loggedInUserId;
        this.landingPage.categoryId = $.trim($('#page-folder-dropdown option:selected').val());
        this.landingPage.companyProfileName = this.authenticationService.companyProfileName;
        this.updateCompanyLogo(this.landingPage);
        this.landingPageService.update(this.landingPage).subscribe(
            data => {
                $("#bee-save-buton-loader").removeClass("button-loader"); 
                if (data.access) {
                    this.ngxloading = false;
                    this.referenceService.stopLoader(this.httpRequestLoader);
                    if (!isDestroy) {
                        this.referenceService.isUpdated = true;
                        this.navigateToManageSection();
                    } else {
                        this.landingPageService.goToManage();
                    }
                } else {
                    this.authenticationService.forceToLogout();
                }
            },
            error => {
                $("#bee-save-buton-loader").removeClass("button-loader"); 
                swal.close();
                this.ngxloading = false;
                this.referenceService.stopLoader(this.httpRequestLoader);
                if (error.status == 400) {
                    let message = JSON.parse(error['_body']).message;
                    swal(message, "", "error");
                } else {
                    this.logger.errorPage(error);
                }
            });


    }

    updateCompanyLogo(landingPage: LandingPage) {
        landingPage.jsonBody = landingPage.jsonBody.replace(this.authenticationService.MEDIA_URL + this.referenceService.companyProfileImage, "https://xamp.io/vod/replace-company-logo.png");
        if (landingPage.htmlBody != undefined) {
            landingPage.htmlBody = landingPage.htmlBody.replace(this.authenticationService.MEDIA_URL + this.referenceService.companyProfileImage, "https://xamp.io/vod/replace-company-logo.png");
        }
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

    ngOnInit() { }
    ngOnDestroy() {
        swal.close();
        /* let isButtonClicked = this.clickedButtonName!="SAVE" && this.clickedButtonName!="SAVE_AS" &&  this.clickedButtonName!="UPDATE";
         if(isButtonClicked  &&this.loggedInUserId>0 && this.landingPage.jsonBody!=undefined && this.isMinTimeOver){
             this.showSweetAlert();
         }*/
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
            self.saveLandingPage(true);
        }, function (dismiss) {

        })
    }

}
