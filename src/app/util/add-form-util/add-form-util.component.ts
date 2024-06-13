import { Component, OnInit, OnDestroy, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomResponse } from '../../common/models/custom-response';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { FormService } from 'app/forms/services/form.service';
import { ColumnInfo } from 'app/forms/models/column-info';
import { DefaultFormChoice } from 'app/forms/models/default-form-choice';
import { FormOption } from 'app/forms/models/form-option';
import { Form } from 'app/forms/models/form';
import { FormType } from 'app/forms/models/form-type.enum';
import { PreviewPopupComponent } from 'app/forms/preview-popup/preview-popup.component';
import { Router } from '@angular/router';
import { DragulaService } from 'ng2-dragula';
import { CallActionSwitch } from '../../videos/models/call-action-switch';
import { VideoUtilService } from '../../videos/services/video-util.service';
import { ImageCropperComponent } from 'ng2-img-cropper';
import { UtilService } from 'app/core/services/util.service';
import { Pagination } from '../../core/models/pagination';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { EmailTemplateService } from '../../email-template/services/email-template.service';
import { SocialPagerService } from '../../contacts/services/social-pager.service';
import { ActionsDescription } from '../../common/models/actions-description';
import { DomSanitizer } from '@angular/platform-browser';
import { ContentManagement } from 'app/videos/models/content-management';
import { ImageCroppedEvent } from '../../common/image-cropper/interfaces/image-cropped-event.interface';
import { EnvService } from 'app/env.service'
import { RegularExpressions } from 'app/common/models/regular-expressions';
import * as htmlToImage from 'html-to-image';
import { FormSubType } from 'app/forms/models/form-sub-type.enum';
import { Properties } from '../../common/models/properties';

declare var $: any, swal: any, CKEDITOR: any;


@Component({
    selector: 'app-add-form-util',
    templateUrl: './add-form-util.component.html',
    styleUrls: ['./add-form-util.component.css', '../../dashboard/company-profile/edit-company-profile/edit-company-profile.component.css', '../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css'],
    providers: [RegularExpressions, FormService, CallActionSwitch, HttpRequestLoader, SocialPagerService, Pagination, ActionsDescription, ContentManagement, Properties]

})
export class AddFormUtilComponent implements OnInit, OnDestroy {
    ngxloading = false;
    logoErrorMessage = "";
    formType: FormType = FormType.XAMPLIFY_FORM;
    httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
    allItems = [];
    defaultColumns = [
        { 'labelName': 'Email', 'labelType': 'email' },
        { 'labelName': 'First Name', 'labelType': 'text' },
        { 'labelName': 'Last Name', 'labelType': 'text' },
        { 'labelName': 'Mobile Number', 'labelType': 'text' },
        { 'labelName': 'Date', 'labelType': 'date' },
        { 'labelName': 'Price', 'labelType': 'price' },
        { 'labelName': 'Upload', 'labelType': 'upload' },
        { 'labelName': 'Country', 'labelType': 'country' }
    ];
    customFields = [
        { 'labelName': 'Single Line Text Field', 'labelType': 'text', 'value': 'Field' },
        { 'labelName': 'Multi Line Text Field', 'labelType': 'textarea', 'value': 'Field' },
        { 'labelName': 'Radio Buttons', 'labelType': 'radio', 'value': 'Field' },
        { 'labelName': 'Checkboxes', 'labelType': 'checkbox', 'value': 'Field' },
        { 'labelName': 'Drop-down menu', 'labelType': 'select', 'value': 'Field' },
        { 'labelName': 'Quiz', 'labelType': 'quiz_radio', 'value': 'Field' }
    ];
    formTitle = "Add Form Details";
    form: Form = new Form();
    formNameClass = "valid-form-name form-name-wrap";
    columnInfos: Array<ColumnInfo> = new Array<ColumnInfo>();
    columnInfo: ColumnInfo = new ColumnInfo();
    selectedColumn: ColumnInfo = new ColumnInfo();
    isColumnClicked = false;
    customResponse: CustomResponse = new CustomResponse();
    isValidForm = true;
    borderErrorClass = "default-fieldset border-error";
    borderSuccessClass = "default-fieldset";
    duplicateOrEmptyLabelErrorMessage = "Empty/duplicate field lables are not allowed";
    requiredMessage = "Please Enter the Form Name";
    duplicateLabelMessage = "Already exists";
    minimumOneColumn = "Your form should contain at least one required field";
    quizFieldRequiredErrorMessage = "Your form should contain atleast one quiz field as required"
    emailFieldRequiredErrorMessage = "Your quiz form should contain atleast one email field as required"
    formErrorClass = "form-group form-error";
    defaultFormClass = "form-group";
    formNameErrorMessage = "";
    formButtonValueErrorMessage = "";
    names: any = [];
    isAdd = true;
    editForm = false;
    portletBody = 'portlet-body';
    portletBodyBlur = 'portlet-body';
    buttonName = "Save";
    existingFormName = "";
    isFullScreenView = false;
    toolTip = "Maximize";
    @ViewChild('previewPopUpComponent') previewPopUpComponent: PreviewPopupComponent;
    loggedInUserId: number;
    categoryNames: any;
    routerLink: string = "/home/forms/manage";
    //backgroundControllerColor: string;
    //labelControllerColor: string;
    //buttonBackgroundControllerColor: string;
    //buttonValueControllerColor: string;
    //titleControllerColor: string;
    //borderControllerColor: string;
    //pageBackgroundControllerColor: string;
    backgroundColor: string;
    labelColor: string;
    buttonBackgroundColor: string;
    buttonValueColor: string;
    titleColor: string;
    borderColor: string;
    pageBgColor: string;
    pageBackgroundColor: string;
    isValidBackgroundColor = true;
    isValidLabelColor = true;
    isValidButtonBackgroundColor = true;
    isValidButtonValueColor = true;
    isValidTitleColor = true;
    isValidBorderColor = true;
    isValidPageBackgroundColor = true;
    valueRange: number;
    charactersLeft = 1000;
    cropRounded = false;
    @ViewChild(ImageCropperComponent) cropper: ImageCropperComponent;
    errorUploadCropper = false;
    fileSizeError = false;
    loadingcrop = false;
    fileObj: any;
    backgroundImageFileObj: any;
    companyLogoFileObj: any;
    //squareData: any;
    imageChangedEvent: any = '';
    backgroundImageChangedEvent: any = '';
    companyLogoChangedEvent: any = '';
    croppedImage: any = '';
    croppedBackgroundImage: any = '';
    croppedCompanyLogoImage: any = '';
    showCropper = false;
    squareCropperSettings: any;
    companyLogoImageUrlPath = "";
    list: any[] = [];
    searchList: any;
    sortList: any;
    paginatedList: any;
    exisitingFileNames: string[] = [];
    pager: any = {};
    pagedItems: any[];
    pageSize = 6;
    selectedFileIds = [];
    selectedFiles = [];
    pageNumber: any;
    numberPerPage = [{ 'name': '6', 'value': 6 }, { 'name': '12', 'value': 12 }, { 'name': '24', 'value': 24 }, { 'name': '48', 'value': 48 },
    { 'name': 'All', 'value': 0 }];
    companyLogoPath: string;
    formBackgroundImagePath: string;
    popupOpenedFor: string;
    name = 'ng2-ckeditor';
    ckeConfig: any;
    @ViewChild("myckeditor") ckeditor: any;
    loading = false;
    priceTypes: Array<string>;
    logoError = false;
    formsError = false;
    awsFileKeys: string[] = [];
    formBackgroundImage = "";
    @Input() isMdfForm: boolean;
    @Input() selectedForm: any;
    @Input() selectedDefaultFormId: number;
    formHeader = "CREATE FORM";
    siteKey = "";
    formSubmissionUrlErrorMessage = "";
    colorCodeErrorMessage = 'Enter a valid color code';
    defaultAnswerErrorMessage = "Quiz question without default answer is not allowed";
    isSaveAs = false;
    thumbnailFileObj: any;
    loggedInAsSuperAdmin = false;
    isCreateDefaultForm = false;
    showQuizField = true;
    descriptionColor: string;
    isValidDescriptionColor = true;
    desigPopup = false;
    isHideFormInfo: boolean = false;
    editShowform = false;
    customResponseForFormUpdate: CustomResponse = new CustomResponse();
    existingOpenLinkInNewTabValue: boolean = false;
    isTableLoaded: boolean = true;
    /***XNFR-423***/
    countryNames = [];
    /***XNFR-433***/
    @Input() isCopyForm: boolean = false;

     /** XNFR-424 **/
     rowInfos = [];
     //rowInfosDuplicate = [];
     selectedRow: any;
     totalRows: number = 0;
     totalColumns: number = 0;
     isRowClicked: boolean = false;
     rowIndexForAdd: number;
     columnIndexForAdd: number;
     customResponseForNewFeature: CustomResponse = new CustomResponse();
    /** XNFR-424 ENDS **/
    /** XNFR-522 **/
    @Input() isVendorOrMasterLandingPage:boolean = false;
    @Output() goBack:EventEmitter<any> = new EventEmitter();
    constructor(public regularExpressions: RegularExpressions, public logger: XtremandLogger, public envService: EnvService, public referenceService: ReferenceService, public videoUtilService: VideoUtilService, private emailTemplateService: EmailTemplateService,
        public pagination: Pagination, public actionsDescription: ActionsDescription, public socialPagerService: SocialPagerService, public authenticationService: AuthenticationService, public formService: FormService,
        private router: Router, private dragulaService: DragulaService, public callActionSwitch: CallActionSwitch, public route: ActivatedRoute,
        public utilService: UtilService, public sanitizer: DomSanitizer, private contentManagement: ContentManagement, public properties: Properties) {
        this.loggedInAsSuperAdmin = this.utilService.isLoggedInFromAdminPortal();
        this.loggedInUserId = this.authenticationService.getUserId();
        let categoryId = this.route.snapshot.params['categoryId'];
        if (categoryId > 0) {
            this.routerLink += "/" + categoryId;
        }

        /** XNFR-424 **/
        this.dragulaService.setOptions('form-columns', {
            revertOnSpill: true,
            accepts: (el, target, source, sibling) => {
                let targetChildCount = 0;
                targetChildCount = target.childElementCount;
                if ((target === source) || (sibling === null && targetChildCount < 3) || (sibling !== null && !sibling.classList.contains('no-drag')))
                    return true;
                else
                    return false;
            },
        });
        /** XNFR-424 ENDS **/
        this.dragulaService.dragend.subscribe((el) => {
            this.checkAndRemoveEmptyRows();
        });
        this.siteKey = this.envService.captchaSiteKey;
        this.customResponseForFormUpdate = new CustomResponse('INFO', 'The form cannot be updated because it has been associated to a track. Please remove the association, come back here and try again to update. However, the "Save As" button allows you to make a copy of the form.', true);
        this.customResponseForNewFeature = new CustomResponse('INFO', 'You can add a maximum of three fields in a row.', true);
    }

    ngOnInit() {
        this.isCreateDefaultForm = this.loggedInAsSuperAdmin && (this.selectedDefaultFormId == undefined || this.selectedDefaultFormId < 1) && this.selectedForm === undefined;
        if (this.selectedForm === undefined && !this.isCopyForm) {
            if (this.router.url.indexOf("/home/forms/edit") > -1) {
                this.navigateToManageSection();
            }
        }
        if (this.selectedForm !== undefined && !this.isCopyForm) {
            this.isAdd = false;
            this.formTitle = "Edit Form Details";
            this.buttonName = "Update";
            this.existingFormName = this.selectedForm.name.toLowerCase();
            this.form = this.selectedForm;
            this.setExistingFormData();
        } else if (this.selectedDefaultFormId !== undefined && this.selectedDefaultFormId > 0 && !this.isCopyForm) {
            this.isAdd = true;
            this.isHideFormInfo = true;
            $('#add-form-name-modal').modal('show');
            this.getById(this.selectedDefaultFormId);
        } else if (this.isCopyForm){
            this.isAdd = true;
            this.isHideFormInfo = true;
            this.isSaveAs = true;
            this.ngxloading = true;
            this.getById(this.selectedDefaultFormId);
            $('#add-form-name-modal').modal('show');
        }else {
            this.listDefaultColumns();
            this.highlightByLength(1, 1);
        }
        this.cropperSettings();
        this.pageNumber = this.numberPerPage[0];

        this.listPriceTypes();
        if (this.isMdfForm) {
            this.formHeader = "EDIT MDF FORM";
            this.showQuizField = false;
            this.removeBlurClass();
        } else {
            if (this.router.url.indexOf('edit') > -1) {
                this.formHeader = "EDIT FORM";
            } else {
                this.formHeader = "CREATE FORM";
            }
            this.listCategories();
            if (this.selectedDefaultFormId === undefined || this.selectedDefaultFormId < 1) {
                this.listFormNames();
            }
            if (this.isAdd && (this.selectedDefaultFormId === undefined || this.selectedDefaultFormId < 1)) {
                this.getCompanyLogo();
            } else {
                this.removeBlurClass();
            }
        }
        /****XNFR-423****/
        this.getCountryNames();


    }

    setShowQuizField() {
        if (this.form.formSubType != undefined) {
            if (this.form.formSubType.toString() === FormSubType[FormSubType.SURVEY]) {
                this.showQuizField = false;
            }
        } else {
            this.showQuizField = false;
        }
    }

    getCompanyLogo() {
        this.ngxloading = true;
        this.formService.getCompanyLogo(this.loggedInUserId).subscribe(
            data => {
                this.form.companyLogo = data;
                this.companyLogoImageUrlPath = data;
                if (this.selectedDefaultFormId !== undefined && this.selectedDefaultFormId > 0) {
                    this.validateFormNames(this.form.name);
                }
                $('#add-form-name-modal').modal('show');
                this.ngxloading = false;
            },
            error => {
                if (this.selectedDefaultFormId !== undefined && this.selectedDefaultFormId > 0) {
                    this.validateFormNames(this.existingFormName);
                }
                this.ngxloading = false;
                $('#add-form-name-modal').modal('show');
            });
    }

    setExistingFormData() {
        if (this.form.showCompanyLogo === undefined || this.form.showCompanyLogo === null) {
            this.form.showCompanyLogo = false;
        }
        if (this.form.showFooter === undefined || this.form.showFooter === null) {
            this.form.showFooter = false;
        }
        if (this.form.showCaptcha === undefined || this.form.showCaptcha === null) {
            this.form.showCaptcha = false;
        }
        if (this.form.backgroundColor) {
            this.backgroundColor = this.form.backgroundColor;
        }
        if (this.form.labelColor) {
            this.labelColor = this.form.labelColor;
        }
        if (this.form.buttonColor) {
            this.buttonBackgroundColor = this.form.buttonColor;
        }
        if (this.form.buttonValueColor) {
            this.buttonValueColor = this.form.buttonValueColor;
        }
        if (this.form.titleColor) {
            this.titleColor = this.form.titleColor;
        }
        if (this.form.borderColor) {
            this.borderColor = this.form.borderColor;
        }
        if (this.form.pageBackgroundColor) {
            this.pageBgColor = this.form.pageBackgroundColor;
        }
        if (!this.form.buttonValue) {
            this.form.buttonValue = "Submit";
        }
        if (this.form.showBackgroundImage) {
            this.formBackgroundImage = this.form.backgroundImage;
            this.pageBackgroundColor = "";
        } else {
            this.pageBackgroundColor = this.form.pageBackgroundColor;
            this.formBackgroundImage = "";
        }
        if (this.form.showTitleHeader === undefined || this.form.showTitleHeader === null) {
            this.form.showTitleHeader = true;
        }
        if (this.form.descriptionColor) {
            this.descriptionColor = this.form.descriptionColor;
        }
        this.existingOpenLinkInNewTabValue = this.form.openLinkInNewTab;
        if (this.form.quizForm) {
            this.form.openLinkInNewTab = true;
        }
        this.form.isValid = true;
        this.form.isFormButtonValueValid = true;
        this.form.isValidFormSubmissionUrl = true;
        this.form.isValidColorCode = true;
        this.listExistingColumns(this.form.formLabelDTORows);
        this.characterSize();
        this.highlightByLength(1, 1);
        this.setShowQuizField();
        this.setCustomCssValues();
    }

    getById(id: number) {
        this.listFormNames();
        this.ngxloading = true;
        let formInput: Form = new Form();
        formInput.id = id;
        formInput.userId = this.authenticationService.getUserId();
        let companyProfileName = this.authenticationService.companyProfileName;
        if (companyProfileName !== undefined && companyProfileName !== "") {
            formInput.vendorCompanyProfileName = companyProfileName;
            formInput.vanityUrlFilter = true;
        }
        this.formService.getById(formInput)
            .subscribe(
                (data: any) => {
                    if (data.statusCode === 200) {
                        this.form = data.data;
                        if (this.selectedDefaultFormId !== undefined && this.selectedDefaultFormId > 0) {
                            this.setExistingFormData();
                            this.getCompanyLogo();
                            this.form.id = null;
                        }
                        if (this.isCopyForm) {
                            this.form.name = this.form.name + '-copy';
                        }
                    } else {
                        this.ngxloading = false;
                        swal("Please Contact Admin!", data.message, "error");
                    }
                },
                (error: string) => {
                    this.ngxloading = false;
                    this.logger.errorPage(error);
                    this.referenceService.showServerError(this.httpRequestLoader);
                }
            );
    }

    listPriceTypes() {
        this.formService.getPriceTypes().subscribe(
            (response: any) => {
                this.priceTypes = response.data;
                console.log(response.data)
            },
            error => {
                this.logger.errorPage(error);
            });
    }

    listCategories() {
        this.authenticationService.getCategoryNamesByUserId(this.loggedInUserId).subscribe(
            (data: any) => {
                this.categoryNames = data.data;
                let categoryIds = this.categoryNames.map(function (a: any) { return a.id; });
                if (this.isAdd && !this.isCopyForm) {
                    //this.form.categoryId = categoryIds[0];
                    this.selectCategory(categoryIds[0]);
                }

            },
            error => { this.logger.error("error in getCategoryNamesByUserId(" + this.loggedInUserId + ")", error); },
            () => this.logger.info("Finished listCategories()"));
    }

    /** XNFR-424 **/
    listExistingColumns(list) {
        const self = this;
        $.each(list, function (rowIndex: number, formLabelDTORow: any) {
            let rowInfoPerRow: Array<ColumnInfo> = new Array<ColumnInfo>();
            $.each(formLabelDTORow.formLabelDTOs, function (columnIndex: number, column: any) {
                if (column.labelType == 'quiz_radio') {
                    //column.labelType = "quiz"
                    column.choices = column.radioButtonChoices;
                    //column.choiceType = "radio";
                } else if (column.labelType == 'quiz_checkbox') {
                    //column.labelType = "quiz"
                    column.choices = column.checkBoxChoices;
                    //column.choiceType = "checkbox";
                }
                self.totalColumns++;
                const columnInfo = self.setColumns(column, false, self.totalColumns);
                rowInfoPerRow.push(columnInfo);
            });
            self.totalRows++;
            const rowInfo = self.setRowInfo(rowInfoPerRow, self.totalRows);
            self.rowInfos.push(rowInfo);
        });
    }

 	/** XNFR-424 **/
    listDefaultColumns() {
        const self = this;
        $.each(this.defaultColumns, function (rowIndex: number, column: any) {
            let rowInfoPerRow: Array<ColumnInfo> = new Array<ColumnInfo>();
            self.totalColumns++;
            const columnInfo = self.setColumns(column, false, self.totalColumns);
            rowInfoPerRow.push(columnInfo);
            self.totalRows++;
            const rowInfo = self.setRowInfo(rowInfoPerRow, self.totalRows);
            self.rowInfos.push(rowInfo);
        });
    }

    listFormNames() {
        let userId: number;
        if (this.isCreateDefaultForm) {
            userId = 1;
        } else {
            userId = this.loggedInUserId;
        }
        this.formService.listFormNames(userId)
            .subscribe(
                data => {
                    this.names = data;
                },
                error => {
                    this.logger.errorPage(error);
                },
                () => this.logger.info("Finished listFormNames()")
            );
    }

    closeModal() {
        if (this.form.isValid && this.editShowform == false) {
            this.removeBlurClass();
            this.navigateBack();
        }
        else if (this.editShowform == true) {
            this.removeBlurClass();
        }
        else {
            this.addBlurClass();
            this.navigateBack();
        }
        $('#add-form-name-modal').modal('hide');

    }

    unBlurDiv() {
        $('#add-form-parent-div').removeClass(this.portletBodyBlur);
        $('#add-form-parent-div').addClass(this.portletBody);

        if (this.isCreateDefaultForm && this.form.isSurvey) {
            this.form.formSubType = FormSubType.SURVEY;
            this.showQuizField = false;
        }
        /***XNFR-433***/
        if (this.isCopyForm) {
            this.validateForm();
        } else {
            this.isHideFormInfo = false;
            $('#add-form-name-modal').modal('hide');
            $('#add-form-designs').modal('hide');
        }
    }
    showAddForm() {
        $('#add-form-name-modal').modal('show');
        this.editShowform = true;
        //this.addBlurClass();
    }


    removeBlurClass() {
        $('#add-form-parent-div').removeClass(this.portletBodyBlur);
        $('#add-form-parent-div').addClass(this.portletBody);
    }
    addBlurClass() {
        $('#add-form-parent-div').removeClass(this.portletBody);
        $('#add-form-parent-div').addClass(this.portletBodyBlur);
    }

    validateFormNames(formName: string) {
        if ($.trim(formName).length > 0) {
            const activeMasterPartnerList = $.trim(this.properties.activeMasterPartnerList.toLowerCase().replace(/\s/g, ''));
            const inActiveMasterPartnerList = $.trim(this.properties.inActiveMasterPartnerList.toLowerCase().replace(/\s/g, ''));
            const name = $.trim(formName.toLowerCase().replace(/\s/g, ''));
            if (name == activeMasterPartnerList || name == inActiveMasterPartnerList) {
                this.addFormNameErrorMessage("This name cannot be used");
            } else if (this.names.indexOf($.trim(formName).toLowerCase()) > -1 &&
                $.trim(formName).toLowerCase() != this.existingFormName) {
                this.addFormNameErrorMessage(this.duplicateLabelMessage);
            } else {
                this.removeFormNameErrorClass();
            }
        } else {
            this.addFormNameErrorMessage(this.requiredMessage);
        }
    }

    sumbitOnEnter(event: any) {
        if (event.keyCode == 13 && this.form.isValid) {
            this.unBlurDiv();
        }
    }



    removeFormNameErrorClass() {
        $('#formNameDiv').removeClass(this.formErrorClass);
        $('#formNameDiv').addClass(this.defaultFormClass);
        this.form.isValid = true;
        this.formNameClass = "valid-form-name form-name-wrap";
    }

    highlightByLength(rowLength: number, columnLength: number) {
        if (rowLength > 0 && columnLength > 0) {
            this.selectedRow = this.rowInfos[rowLength - 1];
            this.selectedColumn = this.selectedRow.formLabelDTOs[columnLength - 1];
            this.isRowClicked = true;
            this.isColumnClicked = true;
        }
    }

    addColumn(column: any, isDefaultColumn: boolean) {
        let columnInfos: Array<ColumnInfo> = new Array<ColumnInfo>();
        if(this.columnIndexForAdd === undefined && this.rowIndexForAdd === undefined){
            columnInfos = undefined;
        } else {
            columnInfos = this.rowInfos[this.rowIndexForAdd].formLabelDTOs;
        }
        if(columnInfos === undefined || columnInfos.length < 3){
            if (column.labelType === 'quiz_radio' || column.labelType === 'quiz_checkbox') {
                if (!this.form.quizForm) {
                    this.existingOpenLinkInNewTabValue = this.form.openLinkInNewTab;
                }
                this.form.quizForm = true;
                this.form.openLinkInNewTab = true;
            }
            this.columnInfo = new ColumnInfo();
            this.totalColumns++;
            this.columnInfo = this.setColumns(column, isDefaultColumn, this.totalColumns);
            if(columnInfos === undefined){
                let rowInfoPerRow: Array<ColumnInfo> = new Array<ColumnInfo>();
                rowInfoPerRow.push(this.columnInfo);
                this.totalRows++;
                const rowInfo = this.setRowInfo(rowInfoPerRow, this.totalRows);
                this.rowInfos.push(rowInfo);
                this.referenceService.scrollToBottomByDivId('create-from-div');
            } else {
                this.highLightSelectedColumn(this.columnInfo, this.rowIndexForAdd, this.columnIndexForAdd);
                columnInfos.splice(this.columnIndexForAdd + 1, 0, this.columnInfo);
                this.rowInfos[this.rowIndexForAdd].formLabelDTOs = columnInfos;
                this.closeFormFieldsModal();
            }
        } else {
            this.customResponse = new CustomResponse('ERROR', 'Only 3 fields can be added for each row.', true);
            this.closeFormFieldsModal();
            this.referenceService.goToTop();
        }
    }


    setColumns(column: any, isDefaultColumn: boolean, columnIndex: number) {
        const columnInfo = new ColumnInfo();
        //let length = this.allItems.length;
        //length = length + 1;
        columnInfo.divId = "column-" + columnIndex;
        columnInfo.defaultColumn = column.defaultColumn;
        if (column.value !== undefined) {
            const field = column.value;
            columnInfo.labelName = field + "-" + columnIndex;
            columnInfo.placeHolder = field + "-" + columnIndex;
        } else {
            columnInfo.labelName = column.labelName
            columnInfo.placeHolder = column.labelName;
            if (column.labelType == 'price' && column.priceType != undefined) {
                columnInfo.priceType = column.priceType;
                columnInfo.priceSymbol = column.priceSymbol;
            }
        }
        if (column.required != undefined) {
            columnInfo.required = column.required;
        } else {
            columnInfo.required = false;
        }
        if (!this.isAdd && column.id != undefined) {
            columnInfo.id = column.id;
            columnInfo.placeHolder = column.placeHolder;
        }
        if (this.isAdd && (this.selectedDefaultFormId !== undefined && this.selectedDefaultFormId > 0)) {
            columnInfo.placeHolder = column.placeHolder;
        }
        columnInfo.labelId = this.referenceService.replaceAllSpacesWithUnderScore(columnInfo.labelName);
        columnInfo.hiddenLabelId = this.referenceService.replaceAllSpacesWithEmpty(columnInfo.labelName);
        columnInfo.labelType = column.labelType;
        columnInfo.isDefaultColumn = isDefaultColumn;
        if (columnInfo.labelType === 'radio') {
            if ((this.isAdd && (this.selectedDefaultFormId === undefined || this.selectedDefaultFormId < 1)) || column.radioButtonChoices == undefined) {
                columnInfo.radioButtonChoices = this.addDefaultOptions(columnInfo);
                columnInfo.allRadioButtonChoicesCount = columnInfo.radioButtonChoices.length + 1;
            } else {
                columnInfo.radioButtonChoices = column.radioButtonChoices;
                columnInfo.allRadioButtonChoicesCount = column.radioButtonChoices.length + 1;
            }
        } else if (columnInfo.labelType === 'checkbox') {
            if ((this.isAdd && (this.selectedDefaultFormId === undefined || this.selectedDefaultFormId < 1)) || column.checkBoxChoices == undefined) {
                columnInfo.checkBoxChoices = this.addDefaultOptions(columnInfo);
                columnInfo.allCheckBoxChoicesCount = columnInfo.checkBoxChoices.length + 1;
            } else {
                columnInfo.checkBoxChoices = column.checkBoxChoices;
                columnInfo.allCheckBoxChoicesCount = column.checkBoxChoices.length + 1;
            }
        } else if (columnInfo.labelType === 'select') {
            if ((this.isAdd && (this.selectedDefaultFormId === undefined || this.selectedDefaultFormId < 1)) || column.dropDownChoices == undefined) {
                columnInfo.dropDownChoices = this.addDefaultOptions(columnInfo);
                columnInfo.allDropDownChoicesCount = columnInfo.dropDownChoices.length + 1;
            } else {
                columnInfo.dropDownChoices = column.dropDownChoices;
                columnInfo.allDropDownChoicesCount = column.dropDownChoices.length + 1;
            }

        } else if (columnInfo.labelType === 'quiz_radio' || columnInfo.labelType === 'quiz_checkbox') {
            if ((this.isAdd && (this.selectedDefaultFormId === undefined || this.selectedDefaultFormId < 1)) || column.choices == undefined) {
                columnInfo.choices = this.addDefaultOptions(columnInfo);
                columnInfo.allChoicesCount = columnInfo.choices.length + 1;
            } else {
                columnInfo.choices = column.choices;
                columnInfo.allChoicesCount = column.choices.length + 1;
                //columnInfo.choiceType = column.choiceType;
            }
        }
        if (column.description !== undefined) {
            columnInfo.description = column.description;
            this.descriptionCharacterSize(columnInfo);
        }
        this.allItems.push(columnInfo.divId);
        return columnInfo;
    }

    addDefaultOptions(columnInfo: ColumnInfo) {
        const defaultFormChoice = new DefaultFormChoice();
        for (let i = 1; i <= 2; i++) {
            defaultFormChoice.defaultChoices.push(this.constructChoice(i, false));
        }
        return defaultFormChoice.defaultChoices;
    }
    constructChoice(index: number, defaultColumn: boolean) {
        const formOption = new FormOption();
        formOption.name = 'Choice ' + index;
        formOption.labelId = 'choice-' + index;
        formOption.hiddenLabelId = this.referenceService.replaceAllSpacesWithEmpty(formOption.name);
        formOption.errorMessage = "";
        formOption.defaultColumn = defaultColumn;
        return formOption;
    }
    /********On clicking create form  column div***********/
    highLightSelectedColumn(columnInfo: ColumnInfo, rowIndex: number, columnIndex: number) {
        if (rowIndex >= 0 && columnIndex >= 0) {
            this.selectedRow = this.rowInfos[rowIndex];
            this.isRowClicked = true;
            this.selectedColumn = columnInfo;
            this.isColumnClicked = true;
        }
    }
    /***Remove Column from create form***********/
    removeColumn(columnInfo: ColumnInfo, rowIndex: number, columnIndex: number) {
        let columnInfos = this.rowInfos[rowIndex].formLabelDTOs;
        this.rowInfos[rowIndex].formLabelDTOs = this.referenceService.removeObjectFromArrayList(columnInfos, columnInfo.divId, 'divId');
        $('#' + columnInfo.divId).remove();
        this.checkAndRemoveEmptyRows();
        this.isRowClicked = false;
        this.isColumnClicked = false;
        // this.highlightByLength(this.columnInfos.length);
        this.checkForQuizFields(this.rowInfos);
    }

    /*********Add Radio Buttons*********/
    addChoice(columnInfo: ColumnInfo, index: number) {
        if (columnInfo.labelType === 'radio') {
            columnInfo.radioButtonErrorMessage = "";
            const count = columnInfo.allRadioButtonChoicesCount;
            const formOption = this.constructChoice(count, false);
            columnInfo.radioButtonChoices.push(formOption);
            columnInfo.allRadioButtonChoicesCount++;
        } else if (columnInfo.labelType === 'checkbox') {
            columnInfo.checkBoxErrorMessage = "";
            const count = columnInfo.allCheckBoxChoicesCount;
            columnInfo.checkBoxChoices.push(this.constructChoice(count, false));
            columnInfo.allCheckBoxChoicesCount++;
        } else if (columnInfo.labelType === 'quiz_radio' || columnInfo.labelType === 'quiz_checkbox') {
            columnInfo.choiceErrorMessage = "";
            const count = columnInfo.allChoicesCount;
            const formOption = this.constructChoice(count, false);
            columnInfo.choices.push(formOption);
            columnInfo.allChoicesCount++;
        } else {
            columnInfo.dropDownErrorMessage = "";
            const count = columnInfo.allDropDownChoicesCount;
            columnInfo.dropDownChoices.push(this.constructChoice(count, false));
            columnInfo.allDropDownChoicesCount++;
        }
        this.referenceService.scrollToBottomByDivId('edit-from-div');
        this.referenceService.scrollToBottomByDivId('create-from-div');
    }


    removeChoice(columnInfo: ColumnInfo, index: number, choice: FormOption) {
        if (columnInfo.labelType === 'radio') {
            this.removeRadioButtonChoice(columnInfo, index, choice);
        } else if (columnInfo.labelType === "quiz_radio" || columnInfo.labelType === "quiz_checkbox") {
            this.removeQuizChoice(columnInfo, index, choice);
        } else if (columnInfo.labelType === "checkbox") {
            this.removeCheckBoxChoice(columnInfo, index, choice);
        } else if (columnInfo.labelType === "select") {
            this.removeDropDownChoice(columnInfo, index, choice);
        }
    }

    removeQuizChoice(columnInfo: ColumnInfo, index: number, choice: FormOption) {
        if (columnInfo.choices.length === 2) {
            columnInfo.choiceErrorMessage = "Minimum two options required";
        } else {
            columnInfo.choiceErrorMessage = "";
            console.log(choice.labelId);
            columnInfo.choices = this.referenceService.removeObjectFromArrayList(columnInfo.choices, choice.labelId, 'labelId');
        }
        console.log(columnInfo.choices);
    }

    removeRadioButtonChoice(columnInfo: ColumnInfo, index: number, choice: FormOption) {
        if (columnInfo.radioButtonChoices.length === 2) {
            columnInfo.radioButtonErrorMessage = "Minimum two options required";
        } else {
            columnInfo.radioButtonErrorMessage = "";
            console.log(choice.labelId);
            columnInfo.radioButtonChoices = this.referenceService.removeObjectFromArrayList(columnInfo.radioButtonChoices, choice.labelId, 'labelId');
        }
        console.log(columnInfo.radioButtonChoices);
    }

    removeCheckBoxChoice(columnInfo: ColumnInfo, index: number, choice: FormOption) {
        if (columnInfo.checkBoxChoices.length === 1) {
            columnInfo.checkBoxErrorMessage = "Minimum one option required";
        } else {
            columnInfo.checkBoxErrorMessage = "";
            columnInfo.checkBoxChoices = this.referenceService.removeObjectFromArrayList(columnInfo.checkBoxChoices, choice.labelId, 'labelId');

        }
    }

    selectedChoice(columnInfo: ColumnInfo, id: string, key: string, isCorrect: boolean) {
        let choices = columnInfo.choices;
        choices = $.grep(choices, function (data, index) {
            if (data[key] == id) {
                data.correct = isCorrect;
            } else if (columnInfo.labelType === 'quiz_radio' && isCorrect) {
                data.correct = false;
            }
        });
    }

    removeDropDownChoice(columnInfo: ColumnInfo, index: number, choice: FormOption) {
        if (columnInfo.dropDownChoices.length === 2) {
            columnInfo.dropDownErrorMessage = "Minimum two options required";
        } else {
            columnInfo.dropDownErrorMessage = "";
            columnInfo.dropDownChoices = this.referenceService.removeObjectFromArrayList(columnInfo.dropDownChoices, choice.labelId, 'labelId');
        }

    }


    /*********Update Hidden Label Id For Label Name****************/
    updateHiddenLabelId(columnInfo: ColumnInfo) {
        const labelName = $.trim(columnInfo.labelName);
        columnInfo.labelId = this.referenceService.replaceAllSpacesWithUnderScore(labelName);
        const hiddenLabelId = this.referenceService.replaceAllSpacesWithEmpty(labelName);
        columnInfo.hiddenLabelId = hiddenLabelId;
    }

    /********Update Hidden Label Id For Choice Input*******************/
    updateHiddenLabelIdForChoice(choice: FormOption) {
        const labelName = $.trim(choice.name);
        choice.labelId = this.referenceService.replaceAllSpacesWithUnderScore(labelName);
        const hiddenLabelId = this.referenceService.replaceAllSpacesWithEmpty(labelName);
        choice.hiddenLabelId = hiddenLabelId;
    }

    changeStatus(event: any, columnInfo: ColumnInfo) {
        columnInfo.required = event;
    }


    updatePriceSymbol(columnInfo: ColumnInfo, type: string) {
        let symbol = "";
        if (type == 'Rupee') {
            symbol = "₹"
        } else if (type == 'Dollar') {
            symbol = "$"
        } else if (type == 'Yen') {
            symbol = "¥"
        } else if (type == 'Pound') {
            symbol = "£"
        } else if (type == 'Euro') {
            symbol = "€"
        }
        columnInfo.priceSymbol = symbol;
    }

    changeQuizChoiceType(columnInfo: ColumnInfo) {
        let choices = columnInfo.choices;
        $.each(choices, function (index: number, value: FormOption) {
            value.correct = false;
        });
    }

    /****************Validate Form*****************/
    validateForm() {
        this.ngxloading = true;
        this.form.quizForm = false;
        this.removeErrorMessage();
        if (this.rowInfos.length > 0) {
            let requiredFieldsLength = 0;
            let quizFieldsCount = 0;
            let requiredQuizFieldsLength = 0;
            let requiredEmailFieldCount = 0;
            $.each(this.rowInfos, function (index, rowInfo) {
                const requiredFieldsLengthRowWise = rowInfo.formLabelDTOs.filter((item) => item.required === true).length;
                const quizFieldsCountRowWise = rowInfo.formLabelDTOs.filter((item) => item.labelType === 'quiz_radio' || item.labelType === 'quiz_checkbox' === true).length;
                const requiredQuizFieldsLengthRowWise = rowInfo.formLabelDTOs.filter((item) => (item.required) && (item.labelType === 'quiz_radio' || item.labelType === 'quiz_checkbox') === true).length
                const requiredEmailFieldCountRowWise = rowInfo.formLabelDTOs.filter((item) => item.labelType === 'email' && item.required === true).length;
                requiredFieldsLength = requiredFieldsLength + requiredFieldsLengthRowWise;
                quizFieldsCount = quizFieldsCount + quizFieldsCountRowWise;
                requiredQuizFieldsLength = requiredQuizFieldsLength + requiredQuizFieldsLengthRowWise;
                requiredEmailFieldCount = requiredEmailFieldCount + requiredEmailFieldCountRowWise;
            });
            if (requiredFieldsLength >= 1 && (quizFieldsCount <= 0 || (quizFieldsCount > 0 && requiredQuizFieldsLength > 0 && requiredEmailFieldCount > 0))) {
                const self = this;
                let columnInfosList: Array<ColumnInfo> = new Array<ColumnInfo>();
                this.rowInfos.forEach((rowInfo) => {
                    columnInfosList.push(...rowInfo.formLabelDTOs)
                });
                let duplicateFieldLabels = this.referenceService.returnDuplicates(columnInfosList.map(function (a) { return a.hiddenLabelId; }));
                $.each(this.rowInfos, function(index, rowInfo) {
                    $.each(rowInfo.formLabelDTOs, function (index, columnInfo) {
                        $('#' + columnInfo.divId).removeClass(self.borderErrorClass);
                        $('#' + columnInfo.divId).addClass(self.borderSuccessClass);
                        columnInfo.editFormChoiceDivClass = self.borderSuccessClass;
                        columnInfo.editFormLabelDivClass = self.borderSuccessClass;
                        const labelName = $.trim(columnInfo.labelName);
                        /*********Validate Empty Label Names********************/
                        self.validateEmptyLabelNames(columnInfo, labelName);
                        /**********Validate Empty Choice Values For Radio Button/DropDown/CheckBox********************/
                        self.validateChoices(columnInfo);
                        /*********Validate Duplicate Label Names********************/
                        self.validateDuplicateFieldLabels(duplicateFieldLabels, columnInfo);
                        /******validate Duplicate Radio Button/DropDown/CheckBox**************/
                        self.validateDuplicateChoiceLables(columnInfo);
                        /******validate Quiz Choices**************/
                        if (columnInfo.labelType === 'quiz_radio' || columnInfo.labelType === 'quiz_checkbox') {
                            self.validateQuizChoices(columnInfo);
                        }
    
                    });
                })
                let invalidLabelDivCount = 0;
                let invalidChoicesDivCount = 0;
                let invalidQuizChoicesDivCount = 0;
                $.each(this.rowInfos, function (index, rowInfo) {
                    const invalidLabelDivCountRowWise = rowInfo.formLabelDTOs.filter((item) => item.editFormLabelDivClass === self.borderErrorClass).length;
                    const invalidChoicesDivCountRowWise = rowInfo.formLabelDTOs.filter((item) => item.editFormChoiceDivClass === self.borderErrorClass).length;
                    const invalidQuizChoicesDivCountRowWise = rowInfo.formLabelDTOs.filter((item) => item.editQuizChoiceDivClass === self.borderErrorClass).length;
                    invalidLabelDivCount = invalidLabelDivCount + invalidLabelDivCountRowWise;
                    invalidChoicesDivCount = invalidChoicesDivCount + invalidChoicesDivCountRowWise;
                    invalidQuizChoicesDivCount = invalidQuizChoicesDivCount + invalidQuizChoicesDivCountRowWise;
                });
                const totalCount = invalidLabelDivCount + invalidChoicesDivCount + invalidQuizChoicesDivCount;
                if (totalCount == 0 && this.form.isValid) {
                    this.saveOrUpdateForm();
                } else {
                    let message = "";
                    if (invalidLabelDivCount != 0 || invalidChoicesDivCount != 0) {
                        message = message + this.duplicateOrEmptyLabelErrorMessage;
                    }
                    if (invalidQuizChoicesDivCount != 0) {
                        if (message) {
                            message = message + '<br>' + this.defaultAnswerErrorMessage;
                        } else {
                            message = message + this.defaultAnswerErrorMessage;
                        }
                    }
                    this.addErrorMessage(message);
                }
            } else {
                let message = "";
                if (requiredFieldsLength < 1 && quizFieldsCount <= 0) {
                    message = message + this.minimumOneColumn;
                }
                if (quizFieldsCount > 0 && (requiredQuizFieldsLength <= 0 || requiredEmailFieldCount <= 0)) {
                    if (requiredQuizFieldsLength <= 0) {
                        if (message) {
                            message = message + '<br>' + this.quizFieldRequiredErrorMessage;
                        } else {
                            message = message + this.quizFieldRequiredErrorMessage;
                        }
                    }
                    if (requiredEmailFieldCount <= 0) {
                        if (message) {
                            message = message + '<br>' + this.emailFieldRequiredErrorMessage;
                        } else {
                            message = message + this.emailFieldRequiredErrorMessage;
                        }
                    }
                }
                this.addErrorMessage(message);
            }

        } else {
            this.addErrorMessage(this.minimumOneColumn);
        }
        this.referenceService.goToTop();
    }

    validateQuizChoices(columnInfo: ColumnInfo) {
        this.form.quizForm = true;
        let list = columnInfo.choices;
        if (columnInfo.labelType === "quiz_radio") {
            columnInfo.radioButtonChoices = list;
        } else if (columnInfo.labelType === "quiz_checkbox") {
            columnInfo.checkBoxChoices = list;
        }
        let selectedChoicesCount = 0;
        $.each(list, function (index: number, value: FormOption) {
            if (value.correct === true) {
                selectedChoicesCount++;
            }
        });
        this.addOrRemoveQuizChoiceError(selectedChoicesCount, columnInfo);
        const duplicateChoicesLength = this.referenceService.returnDuplicates(list.map(function (a) { return a.hiddenLabelId; })).length;
        if (duplicateChoicesLength > 0) {
            this.addOrRemoveChoiceErrorBorder(duplicateChoicesLength, columnInfo);
        }
    }

    validateDuplicateChoiceLables(columnInfo: ColumnInfo) {
        let list = Array<FormOption>();
        if (columnInfo.labelType === "radio") {
            list = columnInfo.radioButtonChoices;
        } else if (columnInfo.labelType === "checkbox") {
            list = columnInfo.checkBoxChoices;
        } else if (columnInfo.labelType === "select") {
            list = columnInfo.dropDownChoices;
        }
        const duplicateChoicesLength = this.referenceService.returnDuplicates(list.map(function (a) { return a.hiddenLabelId; })).length;
        if (duplicateChoicesLength > 0) {
            this.addOrRemoveChoiceErrorBorder(duplicateChoicesLength, columnInfo);
        }
    }


    /********Validate Empty Label Names*******************/
    validateEmptyLabelNames(columnInfo: ColumnInfo, labelName: string) {
        /******If type is radio/checkbox/dropdown then check for choices count also*****************/
        if (labelName.length === 0) {
            $('#' + columnInfo.divId).addClass(this.borderErrorClass);
            columnInfo.editFormLabelDivClass = this.borderErrorClass;
        } else {
            $('#' + columnInfo.divId).addClass(this.borderSuccessClass);
            columnInfo.editFormLabelDivClass = this.borderSuccessClass;
        }
    }


    /**********Validate Empty Choice Values For Radio Button/DropDown/CheckBox********************/
    validateChoices(columnInfo: ColumnInfo) {
        let list = Array<FormOption>();
        if (columnInfo.labelType === 'radio') {
            list = columnInfo.radioButtonChoices;
        } else if (columnInfo.labelType === 'checkbox') {
            list = columnInfo.checkBoxChoices;
        } else if (columnInfo.labelType === 'select') {
            list = columnInfo.dropDownChoices;
        }
        this.validateByType(columnInfo, columnInfo.labelType, list);
    }


    validateByType(columnInfo: ColumnInfo, type: string, list: Array<FormOption>) {
        const self = this;
        $.each(list, function (index: number, value: FormOption) {
            const name = $.trim(value.name);
            self.validateChoiceNames(columnInfo, name, value);
        });
        const validChoicesCount = list.filter((item) => item.isValid === false).length;
        this.addOrRemoveChoiceErrorBorder(validChoicesCount, columnInfo);
    }

    addOrRemoveQuizChoiceError(count: number, columnInfo: ColumnInfo) {
        if (count == 0) {
            columnInfo.editQuizChoiceDivClass = this.borderErrorClass;
            $('#' + columnInfo.divId).addClass(this.borderErrorClass);
        } else {
            columnInfo.editQuizChoiceDivClass = this.borderSuccessClass;
            $('#' + columnInfo.divId).addClass(this.borderSuccessClass);
        }
    }

    addOrRemoveChoiceErrorBorder(count: number, columnInfo: ColumnInfo) {
        if (count > 0) {
            columnInfo.editFormChoiceDivClass = this.borderErrorClass;
            $('#' + columnInfo.divId).addClass(this.borderErrorClass);
        } else {
            columnInfo.editFormChoiceDivClass = this.borderSuccessClass;
            $('#' + columnInfo.divId).addClass(this.borderSuccessClass);
        }
    }

    validateChoiceNames(columnInfo: ColumnInfo, labelName: string, radioButton: FormOption) {
        if (labelName.length === 0) {
            radioButton.isValid = false;
        } else {
            radioButton.isValid = true;
        }
    }


    validateDuplicateFieldLabels(duplicateFieldLabels: Array<string>, columnInfo: ColumnInfo) {
        if (duplicateFieldLabels.indexOf(columnInfo.hiddenLabelId) > -1) {
            $('#' + columnInfo.divId).addClass(this.borderErrorClass);
            columnInfo.editFormLabelDivClass = this.borderErrorClass;
        }
    }



    /***********Add Error Message************/
    addErrorMessage(message: string) {
        this.customResponse = new CustomResponse('ERROR', message, true);
        this.isValidForm = false;
        this.ngxloading = false;

    }

    /*********** Remove Error Message************/
    removeErrorMessage() {
        this.isValidForm = true;
        this.customResponse = new CustomResponse();
    }


    private addFormNameErrorMessage(errorMessage: string) {
        this.form.isValid = false;
        $('#formNameDiv').addClass(this.formErrorClass);
        this.formNameErrorMessage = errorMessage;
        this.formNameClass = "invalid-form-name form-name-wrap";
    }


    private showSweetAlert(errorMessage: string) {
        swal(errorMessage, "", "error");
    }

    saveOrUpdateForm() {
        this.form.formLabelDTORows = this.rowInfos;

        this.form.createdBy = this.authenticationService.getUserId();
        if (CKEDITOR != undefined) {
            for (var instanceName in CKEDITOR.instances) {
                CKEDITOR.instances[instanceName].updateElement();
                this.form.footer = CKEDITOR.instances[instanceName].getData();
            }
        }

        if (!this.form.companyLogo) {
            this.form.companyLogo = this.companyLogoImageUrlPath;
        }
        if (this.form.formSubType != undefined) {
            if (this.form.quizForm) {
                this.form.formSubType = FormSubType.QUIZ;
            } else if (this.form.formSubType.toString() === FormSubType[FormSubType.QUIZ]) {
                this.form.formSubType = FormSubType.REGULAR;
            }
        } else {
            this.form.formSubType = FormSubType.REGULAR;
        }
        /***XNFR-433***/
        if (this.isCopyForm) {
            this.callSaveOrUpdateAPI();
        } else {
            let self = this;
            htmlToImage.toBlob(document.getElementById('create-from-div'))
                .then(function (blob) {
                    self.thumbnailFileObj = self.utilService.blobToFile(blob);
                    self.callSaveOrUpdateAPI();
                });
        }

        // const content = document.getElementById('create-from-div');
        // htmlToImage.toCanvas(content)
        // .then(function (canvas) {
        //     const ctx = canvas.getContext('2d');
        //     ctx.fillStyle = 'white'; 
        //     ctx.fillRect(0, 0, canvas.width, canvas.height);
        //     ctx.drawImage(canvas, 0, 0);
        //     canvas.toBlob(function(blob) {
        //     }, 'image/jpeg');
        // })
        // .catch(function (error) {
        //     console.error('Error:', error);
        //   });
    }

    save(form: Form) {
        if (this.isCreateDefaultForm) {
            form.formType = FormType.XAMPLIFY_DEFAULT_FORM;
            form.saveAsDefaultForm = true;
            form.createdBy = 1;
        } else {
            form.formType = this.formType;
            form.saveAsDefaultForm = false;
        }
        let formData: FormData = new FormData();
        if (this.thumbnailFileObj == undefined || this.thumbnailFileObj == null) {
            formData.append("thumbnailImage", null);
        } else {
            formData.append("thumbnailImage", this.thumbnailFileObj, 'thumbnail.jpeg');
        }
        this.formService.saveForm(form, formData)
            .subscribe(
                (result: any) => {
                    if (result.access) {
                        if (result.statusCode === 100) {
                            this.showSweetAlert("Form name already exists");
                        } else if (result.statusCode === 400) {
                            this.customResponse = new CustomResponse('ERROR', result.message, true);
                        } else {
                            this.referenceService.isCreated = true;
                            this.referenceService.isCopyForm = this.isCopyForm;
                            this.router.navigate(["/home/forms/manage"]);
                        }
                    } else {
                        this.authenticationService.forceToLogout();
                    }
                    this.ngxloading = false;
                },
                (error: string) => {
                    this.ngxloading = false;
                    let message = JSON.parse(error['_body']).message;
                    if (message == "duplicate name") {
                        this.customResponse = new CustomResponse('ERROR', "Formname Already Exists", true);
                    } else {
                        this.customResponse = new CustomResponse('ERROR', this.referenceService.serverErrorMessage, true);
                    }
                });
    }


    update(form: Form) {
        let formData: FormData = new FormData();
        if (this.thumbnailFileObj == undefined || this.thumbnailFileObj == null) {
            formData.append("thumbnailImage", null);
        } else {
            formData.append("thumbnailImage", this.thumbnailFileObj, 'thumbnail.jpeg');
        }
        this.formService.updateForm(form, formData)
            .subscribe(
                (result: any) => {
                    if (result.access) {
                        if (result.statusCode === 100) {
                            this.showSweetAlert(this.duplicateLabelMessage);
                        } else if (result.statusCode === 400) {
                            this.customResponse = new CustomResponse('ERROR', result.message, true);
                        } else {
                            this.referenceService.isUpdated = true;
                            if(this.isVendorOrMasterLandingPage){
                                this.goBack.emit()
                                this.ngxloading = false;
                                return;
                            }
                            this.navigateToManageSection();
                        }
                    } else {
                        this.authenticationService.forceToLogout();
                    }
                    this.ngxloading = false;
                },
                (error: string) => {
                    this.ngxloading = false;
                    let message = JSON.parse(error['_body']).message;
                    if (message == "duplicate name") {
                        this.customResponse = new CustomResponse('ERROR', "Formname Already Exists", true);
                    } else {
                        this.customResponse = new CustomResponse('ERROR', this.referenceService.serverErrorMessage, true);
                    }
                });

    }


    expandForm() {
        this.isFullScreenView = !this.isFullScreenView;
        if (this.isFullScreenView) {
            this.maximizeForm();
        } else {
            this.minimizeForm();
        }
    }

    maximizeForm() {
        //$("#custom-fields-div").css("display", "none");
        $("#edit-fields-div").css("display", "none");
        $('#complete-form-div').removeClass("col-md-8");
        $('#complete-form-div').addClass("col-md-12");
        this.toolTip = "Minimize";
    }

    minimizeForm() {
        // $("#custom-fields-div").css("display", "block");
        $("#edit-fields-div").css("display", "block");
        $('#complete-form-div').removeClass("col-md-12");
        $('#complete-form-div').addClass("col-md-8");
        this.toolTip = "Maximize";
    }

    previewForm() {
        this.previewPopUpComponent.formPreviewBeforeSave(this.rowInfos, this.form);
    }

    ngOnDestroy() {
        this.selectedDefaultFormId = 0;
        this.selectedForm = undefined;
        this.dragulaService.destroy('form-columns');
        this.minimizeForm();
        $('#add-form-name-modal').modal('hide');
        $('#add-form-designs').modal('hide');
        $('#add-form-fields').modal('hide');
        $('#cropbackgroundImage').modal('hide');
        $('#yourImages').modal('hide');
        swal.close();

    }

    navigateBack() {
        if(this.isVendorOrMasterLandingPage){
            this.goBack.emit();
        }
        else if (this.isMdfForm) {
            this.referenceService.goToRouter("/home/mdf/details");
        } else {
            if (this.isAdd && !this.isCopyForm) {
                this.router.navigate(["/home/forms/select"]);
            } else {
                this.navigateToManageSection();
            }
        }

    }

    selectCategory(event) {
        this.form.categoryId = event;
    }

    navigateToManageSection() {
        if (this.isMdfForm) {
            this.ngxloading = false;
            this.customResponse = new CustomResponse('SUCCESS', 'Form Updated Successfully', true);
        } else {
            let categoryId = this.route.snapshot.params['categoryId'];
            if (categoryId > 0) {
                this.router.navigate(["/home/forms/manage/" + categoryId]);
            } else {
                this.router.navigate(["/home/forms/manage"]);
            }
        }

    }

    changeControllerColor(event: any, form: Form, type: string) {
        try {
            const rgba = this.videoUtilService.transparancyControllBarColor(event, this.valueRange);
            $('.video-js .vjs-control-bar').css('cssText', 'background-color:' + rgba + '!important');
            if (type === "backgroundColor") {
                this.backgroundColor = event;
                form.backgroundColor = event;
                this.isValidBackgroundColor = true;
            } else if (type === "labelColor") {
                this.labelColor = event;
                form.labelColor = event;
                this.isValidLabelColor = true;
            } else if (type === "buttonColor") {
                this.buttonBackgroundColor = event;
                form.buttonColor = event
                this.isValidButtonBackgroundColor = true;
            } else if (type === "buttonValueColor") {
                this.buttonValueColor = event;
                form.buttonValueColor = event;
                this.isValidButtonValueColor = true;
            } else if (type === "titleColor") {
                this.titleColor = event;
                form.titleColor = event;
                this.isValidTitleColor = true;
            } else if (type === "borderColor") {
                this.borderColor = event;
                form.borderColor = event;
                this.isValidBorderColor = true;
            } else if (type === "pageBackgroundColor") {
                this.pageBgColor = event;
                form.pageBackgroundColor = event;
                this.pageBackgroundColor = event;
                this.isValidPageBackgroundColor = true;
            } else if (type === "descriptionColor") {
                this.descriptionColor = event;
                form.descriptionColor = event;
                this.isValidDescriptionColor = true;
            }
            this.setCustomCssValues();
        } catch (error) { console.log(error); }
        this.checkValideColorCodes();
    }

    characterSize() {
        if (this.form.formSubmitMessage) {
            this.charactersLeft = 1000 - this.form.formSubmitMessage.length;
        }
    }

    imageClick(type: string) {
        this.fileChangeEvent(type);
    }

    closeImageUploadModal() {
        this.cropRounded = !this.cropRounded;
        this.imageChangedEvent = null;
        this.croppedImage = '';
        if (this.popupOpenedFor == 'formBackgroundImage') {
            this.croppedBackgroundImage = '';
            this.backgroundImageChangedEvent = null;
        } else if (this.popupOpenedFor == 'companyLogo') {
            this.croppedCompanyLogoImage = '';
            this.companyLogoChangedEvent = null;
        }
        this.fileObj = null;
        this.popupOpenedFor = null;
        $('#add-form-name-modal').removeClass(this.portletBodyBlur);
    }

    filenewChangeEvent(event) {
        const image: any = new Image();
        const file: File = event.target.files[0];
        const isSupportfile = file.type;
        const fileSize = file.size;
        if (isSupportfile === 'image/jpg' || isSupportfile === 'image/jpeg' || isSupportfile === 'image/png') {
            if (fileSize < 12582912) {
                this.errorUploadCropper = false;
                this.fileSizeError = false;
                if (this.popupOpenedFor == 'formBackgroundImage') {
                    this.backgroundImageChangedEvent = event;
                } else if (this.popupOpenedFor == 'companyLogo') {
                    this.companyLogoChangedEvent = event;
                }
                this.imageChangedEvent = event;
            } else {
                this.fileSizeError = true;
            }
        } else {
            this.errorUploadCropper = true;
            this.showCropper = false;
        }
    }

    imageCroppedMethod(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
        if (this.popupOpenedFor == 'formBackgroundImage') {
            this.croppedBackgroundImage = event.base64;
        } else if (this.popupOpenedFor == 'companyLogo') {
            this.croppedCompanyLogoImage = event.base64;
        }
        console.log(event);
    }

    imageLoaded() {
        this.showCropper = true;
        console.log('Image loaded')
    }

    cropperReady() {
        console.log('Cropper ready')
    }

    loadImageFailed() {
        console.log('Load failed');
        this.errorUploadCropper = true;
        this.showCropper = false;
    }

    uploadBackgroundImage() {
        if (this.popupOpenedFor == 'formBackgroundImage' && this.croppedBackgroundImage === "") {
            this.showCropper = false;
        }
        else if (this.popupOpenedFor == 'formBackgroundImage') {
            this.loadingcrop = true;
            this.backgroundImageFileObj = this.utilService.convertBase64ToFileObject(this.croppedBackgroundImage);
            this.backgroundImageFileObj = this.utilService.blobToFile(this.backgroundImageFileObj);
            console.log(this.backgroundImageFileObj.size)
            this.uploadFile(this.backgroundImageFileObj, 'backgroundImage')
            this.formBackgroundImagePath = null;
            this.backgroundImageChangedEvent = null;
        } else if (this.popupOpenedFor == 'companyLogo' && this.croppedCompanyLogoImage === "") {
            this.showCropper = false;
        }
        else if (this.popupOpenedFor == 'companyLogo') {
            this.loadingcrop = true;
            this.companyLogoFileObj = this.utilService.convertBase64ToFileObject(this.croppedCompanyLogoImage);
            this.companyLogoFileObj = this.utilService.blobToFile(this.companyLogoFileObj);
            this.uploadFile(this.companyLogoFileObj, 'companyLogo')
            this.companyLogoPath = null;
            this.companyLogoChangedEvent = null;
        }
        this.loadingcrop = false;
        this.popupOpenedFor = null;
        $('#cropbackgroundImage').modal('hide');
        $('#add-form-name-modal').removeClass(this.portletBodyBlur);
    }

    fileChangeEvent(type: string) {
        this.popupOpenedFor = type;
        this.cropRounded = false;
        this.fileSizeError = false;
        if (this.popupOpenedFor == 'formBackgroundImage') {
            this.imageChangedEvent = this.backgroundImageChangedEvent;
        } else if (this.popupOpenedFor == 'companyLogo') {
            this.imageChangedEvent = this.companyLogoChangedEvent;
        }
        $('#add-form-name-modal').addClass(this.portletBodyBlur);
        $('#cropbackgroundImage').modal('show');
    }

    cropperSettings() {
        this.squareCropperSettings = this.utilService.cropSettings(this.squareCropperSettings, 130, 196, 130, false);
        this.squareCropperSettings.noFileInput = true;
        console.log(this.authenticationService.SERVER_URL + this.form.companyLogo)
    }

    chooseFileFromList() {
        this.listItems(this.pagination);
        $('#cropbackgroundImage').addClass(this.portletBodyBlur);
        $('#yourImages').modal('show');
    }

    closeYourImagesModal() {
        this.list = [];
        this.pagedItems = [];
        this.paginatedList = [];
        $('#cropbackgroundImage').removeClass(this.portletBodyBlur);
    }

    setPage(page: number) {
        try {
            if (page < 1 || page > this.pager.totalPages) { return; }
            this.pager = this.socialPagerService.getPager(this.paginatedList.length, page, this.pageSize);
            this.pagedItems = this.paginatedList.slice(this.pager.startIndex, this.pager.endIndex + 1);
        } catch (error) {
            console.error(error, "content management setPage().")
        }

    }

    listItems(pagination: Pagination) {
        this.referenceService.loading(this.httpRequestLoader, true);
        this.emailTemplateService.listAwsFiles(pagination, this.loggedInUserId)
            .subscribe(
                (data: any) => {
                    data.forEach((element, index) => { element.time = new Date(element.utcTimeString); });
                    for (var i = 0; i < data.length; i++) { data[i]["id"] = i; }
                    this.list = data;
                    this.searchList = data;
                    this.sortList = data;
                    if (this.list.length > 0) {
                        this.exisitingFileNames = this.list.map(function (a) { return a.fileName.toLowerCase(); });
                    } else {
                        // this.customResponse = new CustomResponse( 'INFO', "No records found", true );
                    }
                    this.referenceService.loading(this.httpRequestLoader, false);
                    this.paginatedList = this.list;
                    this.setPage(1);
                },
                (error: string) => { this.logger.errorPage(error); });
    }

    setFileCheck(filePath: string) {
        if (this.popupOpenedFor == 'formBackgroundImage') {
            this.formBackgroundImagePath = filePath;
            this.form.backgroundImage = filePath;
            this.formBackgroundImage = this.form.backgroundImage;
            this.backgroundImageFileObj = null;
            this.croppedBackgroundImage = '';
            this.backgroundImageChangedEvent = null;
        } else if (this.popupOpenedFor == 'companyLogo') {
            this.companyLogoPath = filePath;
            this.form.companyLogo = filePath;
            this.companyLogoFileObj = null;
            this.croppedCompanyLogoImage = '';
            this.companyLogoChangedEvent = null;
        }
        this.imageChangedEvent = null;
        this.croppedImage = '';
        $('#yourImages').modal('hide');
        $('#cropbackgroundImage').removeClass(this.portletBodyBlur);
        $('#cropbackgroundImage').modal('hide');
        $('#add-form-name-modal').removeClass(this.portletBodyBlur);
    }

    showCompanyLogoChange() {
        this.form.showCompanyLogo = !this.form.showCompanyLogo;
    }

    showFooterChange() {
        this.form.showFooter = !this.form.showFooter;
    }

    showCaptchaChange() {
        this.form.showCaptcha = !this.form.showCaptcha;
    }

    showTitleHeaderChange() {
        this.form.showTitleHeader = !this.form.showTitleHeader;
    }
    errorHandler(event) { event.target.src = 'assets/images/your-logo.png'; }

    uploadFile(file: File, type: string) {
        this.loading = true;
        this.referenceService.loading(this.httpRequestLoader, true);
        const formData: FormData = new FormData();
        formData.append('files', file, file.name);
        this.emailTemplateService.uploadFileFromForm(this.authenticationService.getUserId(), formData)
            .subscribe(
                (data: any) => {
                    if (data.statusCode === 1024 || data.statusCode === 1025) {
                        if (type == 'backgroundImage') {
                            this.backgroundImageChangedEvent = null;
                            this.croppedBackgroundImage = null;
                        } else if (type == 'companyLogo') {
                            this.companyLogoChangedEvent = null;
                            this.croppedCompanyLogoImage = null;
                        }
                        this.showSweetAlert(data.message);
                    } else if (data.access) {
                        if (type == 'backgroundImage') {
                            this.form.backgroundImage = data.filePath;
                            this.formBackgroundImage = data.filePath;
                        } else if (type == 'companyLogo') {
                            this.form.companyLogo = data.filePath;
                        }
                    } else {
                        this.authenticationService.forceToLogout();
                    }
                    this.loading = false;
                    this.referenceService.loading(this.httpRequestLoader, false);
                },
                (error: string) => {
                    this.loading = false;
                    this.logger.errorPage(error);
                });
    }

    openFormFields() {
        $('#add-form-fields').modal('show');
        this.addBlurClass();
    }

    closeFormFieldsModal() {
        this.rowIndexForAdd = undefined;
        this.columnIndexForAdd = undefined;
        $('#add-form-fields').modal('hide');
        this.removeBlurClass()
    }

    openFormDesignModal() {
        this.desigPopup = true;
        $('#add-form-designs').modal('show');
        this.addBlurClass();
    }

    closeFormDesignModal() {
        $('#add-form-designs').modal('hide');
        this.removeBlurClass()
    }


    addImage(filePath: any) {
        const parts = filePath.split('.');
        const ext = parts[parts.length - 1];
        switch (ext.toLowerCase()) {
            case 'csv': return 'assets/images/content/csv.png';
            case 'cvs': return 'assets/images/content/cvs.png';
            case 'gif': return 'assets/images/content/gif.png';
            case 'html': return 'assets/images/content/html.png';
            case 'doc': return 'assets/images/content/docs.png';
            case 'pdf': return 'assets/images/content/pdfs.png';
            case 'ppt': return 'assets/images/content/ppt.png';
            case 'pct': return 'assets/images/content/pct.png';
            case 'pptx': return 'assets/images/content/pptx.png';
            case 'txt': return 'assets/images/content/text.png';
            case 'xls': return 'assets/images/content/xls.png';
            case 'xlsx': return 'assets/images/content/xlsm.png';
            case 'xlsm': return 'assets/images/content/xlsm.png';
            case 'xml': return 'assets/images/content/xml.png';
            case 'zip': return 'assets/images/content/zip.png';
            case 'docx': return 'assets/images/content/docs.png';
            case 'docm': return 'assets/images/content/docs.png';
            case 'dotm': return 'assets/images/content/docs.png';
            case 'dotx': return 'assets/images/content/docs.png';
            case 'dot': return 'assets/images/content/docs.png';
            case 'xps': return 'assets/images/content/xps.jpg';
            case 'rtf': return 'assets/images/content/rtf.png';
            case 'odt': return 'assets/images/content/odt.png';
            case 'wps': return 'assets/images/content/wps.png';
            case 'htm': return 'assets/images/content/htm.png';
            case 'mht': return 'assets/images/content/mht.jpg';
            case 'log': return 'assets/images/content/log.png';
            case 'mp3': return 'assets/images/content/mp3.png';
            case 'mhtml': return 'assets/images/content/mhtml.png';
            case 'rar': return 'assets/images/content/rar.png';
            case 'apk': return 'assets/images/content/apk.png';
            default: return 'assets/images/content/error.png';
        }
    }
    changeImage(id: number, path: string) {
        let image = this.addImage(path);
        (<HTMLInputElement>document.getElementById('content_image_' + id)).src = image;
        (<HTMLInputElement>document.getElementById('content_image_grid_' + id)).src = image;
        $('#content_image_' + id).css('cssText', "max-height: 55%; max-width: 69px; position: relative; top: 16px;");
        $('#content_image_grid_' + id).css('cssText', "border: 0px solid #5a5a5a; max-height: 27% !important");
    }

    delete(file: ContentManagement, id: any) {
        let self = this;
        swal({
            title: 'Are you sure?',
            text: "You won't be able to undo this action",
            type: 'warning',
            showCancelButton: true,
            swalConfirmButtonColor: '#54a7e9',
            swalCancelButtonColor: '#999',
            confirmButtonText: 'Yes, delete it!'
        }).then(function () {
            if (self.selectedFileIds.length < 1) {
                self.selectedFiles.push(file);
                self.selectedFileIds.push(id);
            }
            self.deleteFile(self.contentManagement);
        }, function (dismiss: any) {
            console.log('you clicked on option' + dismiss);
        });
    }


    deleteFile(file: ContentManagement) {
        this.customResponse.isVisible = false;
        if (this.selectedFileIds.length < 1) {
            this.awsFileKeys.push(file.fileName);
        } else {
            for (let i = 0; i < this.selectedFileIds.length; i++) {
                if (this.selectedFiles[i].fileName) {
                    this.awsFileKeys.push(this.selectedFiles[i].fileName);
                }
            }

        }
        this.referenceService.loading(this.httpRequestLoader, true);
        file.userId = this.loggedInUserId;
        file.awsFileKeys = this.awsFileKeys;
        this.emailTemplateService.deleteFile(file)
            .subscribe(
                data => {
                    let deleteMessage;
                    if (this.selectedFileIds.length === 1) { deleteMessage = file.fileName + ' deleted successfully'; }
                    else { deleteMessage = 'File(s) deleted successfully'; }
                    this.customResponse = new CustomResponse('SUCCESS', deleteMessage, true);
                    this.listItems(this.pagination);
                    if (this.selectedFileIds) {
                        this.selectedFileIds.length = 0;
                        this.selectedFiles.length = 0;
                    }
                },
                (error: string) => {
                    this.logger.errorPage(error);
                }
            );
    }

    selectedPageNumber(event) {
        if (event === 0) { event = this.paginatedList.length; }
        // this.paginatedList = this.list.slice(0,event);
        this.referenceService.loading(this.httpRequestLoader, true);
        this.pageSize = event;
        this.setPage(1);
        this.referenceService.loading(this.httpRequestLoader, false);
    }

    setShowBackgroundImage(event: any) {
        this.form.showBackgroundImage = event;
        if (this.form.showBackgroundImage) {
            this.formBackgroundImage = this.form.backgroundImage;
            this.pageBackgroundColor = "";
        } else {
            this.pageBackgroundColor = this.form.pageBackgroundColor;
            this.formBackgroundImage = "";
        }
    }

    resolved(captchaResponse: string) {
        console.log(captchaResponse);
    }

    validateFormButtonValue(buttonValue: string) {
        if (!($.trim(buttonValue).length > 0)) {
            this.form.isFormButtonValueValid = false;
            this.addFormButtonValueErrorMessage(this.requiredMessage);
        } else {
            this.form.isFormButtonValueValid = true;
            this.removeFormButtoValueErrorClass();
        }
    }

    removeFormButtoValueErrorClass() {
        $('#formButtonValueDiv').removeClass(this.formErrorClass);
        $('#formButtonValueDiv').addClass(this.defaultFormClass);
        this.checkValidForm();
    }

    private addFormButtonValueErrorMessage(errorMessage: string) {
        this.form.isValid = false;
        $('#formButtonValueDiv').addClass(this.formErrorClass);
        this.formButtonValueErrorMessage = errorMessage;
    }


    validateFormSubmissionUrl(formSubmissionUrl: string) {
        if ($.trim(formSubmissionUrl).length > 0) {
            if (!this.regularExpressions.URL_PATTERN.test(formSubmissionUrl)) {
                this.addFormSubmissionUrlErrorMessage();
            } else {
                this.removeFormSubmissionUrlErrorMessage();
            }
        } else {
            this.removeFormSubmissionUrlErrorMessage();
        }
    }

    removeFormSubmissionUrlErrorMessage() {
        $('#formSubmissionUrlDiv').removeClass(this.formErrorClass);
        $('#formSubmissionUrlDiv').addClass(this.defaultFormClass);
        this.form.isValidFormSubmissionUrl = true;
        this.checkValidForm();
    }

    private addFormSubmissionUrlErrorMessage() {
        this.form.isValid = false;
        this.form.isValidFormSubmissionUrl = false;
        $('#formSubmissionUrlDiv').addClass(this.formErrorClass);
        this.formSubmissionUrlErrorMessage = 'Please enter a valid url';
    }

    checkValidForm() {
        this.form.isValid = this.form.isValidFormSubmissionUrl && this.form.isFormButtonValueValid;
    }

    checkValidColorCode(colorCode: string, type: string, customSkinColor: string) {
        if ($.trim(colorCode).length > 0) {
            if (!this.regularExpressions.COLOR_CODE_PATTERN.test(colorCode)) {
                this.addColorCodeErrorMessage(type);
            } else {
                this.removeColorCodeErrorMessage(colorCode, type, customSkinColor);
            }
        } else {
            this.removeColorCodeErrorMessage(colorCode, type, customSkinColor);
        }
    }

    private addColorCodeErrorMessage(type: string) {
        this.form.isValidColorCode = false;
        if (type === "backgroundColor") {
            this.form.backgroundColor = "";
            this.isValidBackgroundColor = false;
        } else if (type === "labelColor") {
            this.form.labelColor = "";
            this.isValidLabelColor = false;
        } else if (type === "buttonColor") {
            this.form.buttonColor = "";
            this.isValidButtonBackgroundColor = false;
        } else if (type === "buttonValueColor") {
            this.form.buttonValueColor = "";
            this.isValidButtonValueColor = false;
        } else if (type === "titleColor") {
            this.form.titleColor = "";
            this.isValidTitleColor = false;
        } else if (type === "borderColor") {
            this.form.borderColor = "";
            this.isValidBorderColor = false;
        } else if (type === "pageBackgroundColor") {
            this.form.pageBackgroundColor = "";
            this.pageBackgroundColor = "";
            this.isValidPageBackgroundColor = false;
        } else if (type === "descriptionColor") {
            this.form.descriptionColor = "";
            this.isValidDescriptionColor = false;
        }
    }

    removeColorCodeErrorMessage(colorCode: string, type: string, customSkinColor: string) {
        if (colorCode === undefined || colorCode === null || colorCode.length <= 0) {
            colorCode = customSkinColor;
        }
        if (type === "backgroundColor") {
            this.backgroundColor = colorCode;
            this.form.backgroundColor = colorCode;
            this.isValidBackgroundColor = true;
        } else if (type === "labelColor") {
            this.labelColor = colorCode;
            this.form.labelColor = colorCode;
            this.isValidLabelColor = true;
        } else if (type === "buttonColor") {
            this.buttonBackgroundColor = colorCode;
            this.form.buttonColor = colorCode;
            this.isValidButtonBackgroundColor = true;
        } else if (type === "buttonValueColor") {
            this.buttonValueColor = colorCode;
            this.form.buttonValueColor = colorCode;
            this.isValidButtonValueColor = true;
        } else if (type === "titleColor") {
            this.titleColor = colorCode;
            this.form.titleColor = colorCode;
            this.isValidTitleColor = true;
        } else if (type === "borderColor") {
            this.borderColor = colorCode;
            this.form.borderColor = colorCode;
            this.isValidBorderColor = true;
        } else if (type === "pageBackgroundColor") {
            this.pageBgColor = colorCode;
            this.form.pageBackgroundColor = colorCode;
            this.pageBackgroundColor = colorCode;
            this.isValidPageBackgroundColor = true;
        } else if (type === "descriptionColor") {
            this.descriptionColor = colorCode;
            this.form.descriptionColor = colorCode;
            this.descriptionColor = colorCode;
            this.isValidDescriptionColor = true;
        }
        this.setCustomCssValues();
        this.checkValideColorCodes();
    }

    checkValideColorCodes() {
        if (this.isValidBackgroundColor && this.isValidLabelColor && this.isValidButtonBackgroundColor && this.isValidButtonValueColor && this.isValidTitleColor && this.isValidBorderColor && this.isValidPageBackgroundColor && this.isValidDescriptionColor) {
            this.form.isValidColorCode = true;
        }
    }

    saveAs() {
        this.isSaveAs = true;
        this.validateForm();
    }

    addOrUpdate() {
        this.isSaveAs = false;
        this.validateForm();
    }

    UpdateFormTeamMemberGroupData(form: Form) {
        this.form.selectedTeamMemberIds = form.selectedTeamMemberIds;
        this.form.selectedGroupIds = form.selectedGroupIds;
    }

    descriptionCharacterSize(column: ColumnInfo) {
        column.descriptionCharacterleft = 500 - column.description.length;
    }

    checkForQuizFields(rowInfos: any) {
        let quizFieldsCount;
        $.each(rowInfos, function(index, rowInfo) {
            const quizFieldsCountRowWise = rowInfo.formLabelDTOs.filter((item) => item.labelType === 'quiz_radio' || item.labelType === 'quiz_checkbox' === true).length;
            quizFieldsCount = quizFieldsCount + quizFieldsCountRowWise;
        });
        if (quizFieldsCount > 0) {
            if (!this.form.quizForm) {
                this.existingOpenLinkInNewTabValue = this.form.openLinkInNewTab;
            }
            this.form.quizForm = true;
            this.form.openLinkInNewTab = true;
            return;
        } else {
            this.form.quizForm = false;
            this.form.openLinkInNewTab = this.existingOpenLinkInNewTabValue;
        }
    }

    setCustomCssValues() {
        document.documentElement.style.setProperty('--form-page-bg-color', this.pageBackgroundColor);
        document.documentElement.style.setProperty('--form-border-color', this.form.borderColor);
        document.documentElement.style.setProperty('--form-label-color', this.form.labelColor);
        document.documentElement.style.setProperty('--form-description-color', this.form.descriptionColor);
        document.documentElement.style.setProperty('--form-title-color', this.form.titleColor);
        document.documentElement.style.setProperty('--form-bg-color', this.form.backgroundColor);
        require("style-loader!../../../assets/admin/layout2/css/themes/form-custom-skin.css");
    }

    getCountryNames() {
        this.ngxloading = true;
        this.authenticationService.getCountryNames().
            subscribe(
                response => {
                    this.countryNames = this.authenticationService.addCountryNamesToList(response.data, this.countryNames);
                    this.ngxloading = false;
                }, error => {
                    this.logger.error("Error In Getting Country Names");
                    this.ngxloading = false;
                });
    }

    /***XNFR-433***/
    callSaveOrUpdateAPI() {
        this.form.saveAs = this.isSaveAs;
        if (this.isAdd || this.isSaveAs) {
            this.save(this.form);
        } else {
            this.update(this.form);
        }
    }

     /*** XNFR-424 ***/
     setRowInfo(columnInfos: any, rowIndex: number) {
        const rowInfo: any = {};
        rowInfo['divId'] = "row-" + rowIndex;
        rowInfo['formLabelDTOs'] = columnInfos;
        return rowInfo;
    }

    highLightSelectedRow(rowInfo: any) {
        this.selectedRow = rowInfo;
        this.isRowClicked = true;
    }

    checkAndRemoveEmptyRows() {
        this.rowInfos = $.grep(this.rowInfos, function (data, index) {
            return (data["formLabelDTOs"] !== undefined && data["formLabelDTOs"].length > 0)
        });
    }

    setNewColumnIndex(rowIndex: number, columnIndex: number) {
        this.rowIndexForAdd = rowIndex;
        this.columnIndexForAdd = columnIndex;
        this.openFormFields();
    }

    /** Move column to new row **/
    moveColumnToLastRow(columnInfo: ColumnInfo, rowIndex: number) {
        /** Remove column for existing row **/
        let columnInfos = this.rowInfos[rowIndex].formLabelDTOs;
        this.rowInfos[rowIndex].formLabelDTOs = this.referenceService.removeObjectFromArrayList(columnInfos, columnInfo.divId, 'divId');
        $('#' + columnInfo.divId).remove();
        /** Add column for new row **/
        let rowInfoPerRow: Array<ColumnInfo> = new Array<ColumnInfo>();
        rowInfoPerRow.push(columnInfo);
        this.totalRows++;
        const rowInfo = this.setRowInfo(rowInfoPerRow, this.totalRows);
        this.rowInfos.push(rowInfo);
        this.referenceService.scrollToBottomByDivId('create-from-div');
    }

    swapRows(rowInfo: any, rowIndex: number, newIndex: number) {
        let temp = this.rowInfos[newIndex];
        this.rowInfos[newIndex] = this.rowInfos[rowIndex];
        this.rowInfos[rowIndex] = temp;
        this.checkAndRemoveEmptyRows();
    }

    removeRow(rowInfo: any, rowIndex: number) {
        let columnInfos:Array<ColumnInfo> =  rowInfo['formLabelDTOs'];
        const defaultColumnsLength = columnInfos.filter((item) => item.defaultColumn === true).length;
        if(defaultColumnsLength < 1) {
            this.rowInfos = this.referenceService.removeObjectFromArrayList(this.rowInfos, rowInfo.divId, 'divId');
            $('#' + rowInfo.divId).remove();
            this.checkAndRemoveEmptyRows();
            this.isRowClicked = false;
            this.isColumnClicked = false;
            this.checkForQuizFields(this.rowInfos);   
        } else {
            this.customResponse = new CustomResponse('ERROR', 'Can not delete the row as it includes default feilds.', true);
            this.referenceService.goToTop();
        }
    }
}
