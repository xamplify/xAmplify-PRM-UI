import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomResponse } from '../../common/models/custom-response';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { FormService } from '../services/form.service';
import { ColumnInfo } from '../models/column-info';
import { DefaultFormChoice } from '../models/default-form-choice';
import { FormOption } from '../models/form-option';
import { Form } from '../models/form';
import { FormType } from '../models/form-type.enum';
import { Router } from '@angular/router';
import { DragulaService } from 'ng2-dragula';
import { CallActionSwitch } from '../../videos/models/call-action-switch';
import { PreviewPopupComponent } from '../preview-popup/preview-popup.component';
import { VideoUtilService } from '../../videos/services/video-util.service';
import { CropperSettings, ImageCropperComponent } from 'ng2-img-cropper';
import { UtilService } from 'app/core/services/util.service';
import { Pagination } from '../../core/models/pagination';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { EmailTemplateService } from '../../email-template/services/email-template.service';
import { SocialPagerService } from '../../contacts/services/social-pager.service';
import { ActionsDescription } from '../../common/models/actions-description';
import {DomSanitizer} from '@angular/platform-browser';


import { ImageCroppedEvent } from '../../common/image-cropper/interfaces/image-cropped-event.interface';

declare var $: any, swal: any, CKEDITOR: any;


@Component({
    selector: 'app-add-form',
    templateUrl: './add-form.component.html',
    styleUrls: ['./add-form.component.css', '../../dashboard/company-profile/edit-company-profile/edit-company-profile.component.css', '../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css'],
    providers: [CallActionSwitch, HttpRequestLoader, SocialPagerService, Pagination, ActionsDescription]
})
export class AddFormComponent implements OnInit, OnDestroy {
    ngxloading = false;
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
        { 'labelName': 'Upload', 'labelType': 'upload' }
    ];
    customFields = [
        { 'labelName': 'Single Line Text Field', 'labelType': 'text', 'value': 'Field' },
        { 'labelName': 'Multi Line Text Field', 'labelType': 'textarea', 'value': 'Field' },
        { 'labelName': 'Radio Buttons', 'labelType': 'radio', 'value': 'Field' },
        { 'labelName': 'Checkboxes', 'labelType': 'checkbox', 'value': 'Field' },
        { 'labelName': 'Drop-down menu', 'labelType': 'select', 'value': 'Field' }
    ];
    formTitle = "Add Form Details";
    form: Form = new Form();
    formNameClass = "valid-form-name";
    columnInfos: Array<ColumnInfo> = new Array<ColumnInfo>();
    columnInfo: ColumnInfo = new ColumnInfo();
    selectedColumn: ColumnInfo = new ColumnInfo();
    isColumnClicked = false;
    customResponse: CustomResponse = new CustomResponse();
    isValidForm = true;
    borderErrorClass = "default-fieldset border-error";
    borderSuccessClass = "default-fieldset";
    duplicateOrEmptyLabelErrorMessage = "Empty/duplicate field lables are not allowed";
    requiredMessage = "Required";
    duplicateLabelMessage = "Already exists";
    minimumOneColumn = "Your form should contain at least one required field";
    formErrorClass = "form-group form-error";
    defaultFormClass = "form-group";
    formNameErrorMessage = "";
    formButtonValueErrorMessage = "";
    names: any = [];
    isAdd = true;
    editForm = false;
    portletBody = 'portlet-body';
    portletBodyBlur = 'portlet-body';
    buttonName = "Save Form";
    existingFormName = "";
    isFullScreenView = false;
    toolTip = "Maximize";
    @ViewChild('previewPopUpComponent') previewPopUpComponent: PreviewPopupComponent;
    loggedInUserId: number;
    categoryNames: any;
    routerLink: string = "/home/forms/manage";
    backgroundControllerColor: string;
    labelControllerColor: string;
    buttonBackgroundControllerColor: string;
    buttonValueControllerColor: string;
    valueRange: number;
    charactersLeft = 1000;
    cropRounded = false;
    @ViewChild(ImageCropperComponent) cropper: ImageCropperComponent;
    errorUploadCropper = false;
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
    numberPerPage = [{ 'name': '12', 'value': 12 }, { 'name': '24', 'value': 24 }, { 'name': '48', 'value': 48 },
    { 'name': 'All', 'value': 0 }];
    companyLogoPath: string;
    formBackgroundImagePath: string;
    popupOpenedFor: string;
    name = 'ng2-ckeditor';
    ckeConfig: any;
    @ViewChild("myckeditor") ckeditor: any;
    loading = false;
    priceTypes:Array<string>;
	logoError = false;
     formsError = false;
    constructor(public logger: XtremandLogger, public referenceService: ReferenceService, public videoUtilService: VideoUtilService, private emailTemplateService: EmailTemplateService,
        public pagination: Pagination, public actionsDescription: ActionsDescription, public socialPagerService: SocialPagerService, public authenticationService: AuthenticationService, public formService: FormService,
        private router: Router, private dragulaService: DragulaService, public callActionSwitch: CallActionSwitch, public route: ActivatedRoute, public utilService: UtilService, private sanitizer:DomSanitizer) {
        CKEDITOR.config.extraPlugins = 'colorbutton,colordialog';
		this.loggedInUserId = this.authenticationService.getUserId();
        let categoryId = this.route.snapshot.params['categoryId'];
        if (categoryId > 0) {
            this.routerLink += "/" + categoryId;
        }
        if (this.formService.form === undefined) {
            if (this.router.url.indexOf("/home/forms/edit") > -1) {
                this.navigateToManageSection();
            }
        }
        if (this.formService.form !== undefined) {
            this.isAdd = false;
            this.formTitle = "Edit Form Details";
            this.buttonName = "Update";
            this.existingFormName = this.formService.form.name.toLowerCase();
            this.form = this.formService.form;
            if (this.form.showCompanyLogo === undefined || this.form.showCompanyLogo === null) {
                this.form.showCompanyLogo = false;
            }
            if (this.form.showFooter === undefined || this.form.showFooter === null) {
                this.form.showFooter = false;
            }
            if (this.form.backgroundColor) {
                this.backgroundControllerColor = this.form.backgroundColor;
            }
            if (this.form.labelColor) {
                this.labelControllerColor = this.form.labelColor;
            }
            if (this.form.buttonColor) {
                this.buttonBackgroundControllerColor = this.form.buttonColor;
            }
            if (this.form.buttonValueColor) {
                this.buttonValueControllerColor = this.form.buttonValueColor;
            }
            if (!this.form.buttonValue) {
                this.form.buttonValue = "Submit";
            }
            this.form.isValid = true;
            this.form.isFormButtonValueValid = true;
            this.listExistingColumns(this.form.formLabelDTOs);
            this.characterSize();
        } else {
            this.listDefaultColumns();
        }
        this.highlightByLength(1);

        this.cropperSettings();
        this.pageNumber = this.numberPerPage[0];

        dragulaService.setOptions('form-options', {})
        dragulaService.dropModel.subscribe((value) => {
            this.onDropModel(value);
        });
        this.listPriceTypes();
    }


    private onDropModel(args) {
    }

    ngOnInit() {
        this.listFormNames();
        this.listCategories();
        if (this.isAdd) {
            this.ngxloading = true;
            this.formService.getCompanyLogo(this.loggedInUserId).subscribe(
                data => {
                    this.ngxloading = false;
                    this.form.companyLogo = data;
                    this.companyLogoImageUrlPath = data;
                    console.log(data)
                    $('#add-form-name-modal').modal('show');
                },
                error => {
                    this.ngxloading = false;
                    $('#add-form-name-modal').modal('show');
                });
        } else {
            this.removeBlurClass();
        }
    }

    listPriceTypes(){
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
                if (this.isAdd) {
                    this.form.categoryId = categoryIds[0];
                }

            },
            error => { this.logger.error("error in getCategoryNamesByUserId(" + this.loggedInUserId + ")", error); },
            () => this.logger.info("Finished listCategories()"));
    }

    listExistingColumns(list) {
        const self = this;
        $.each(list, function (index: number, column: any) {
            const columnInfo = self.setColumns(column, false);
            self.columnInfos.push(columnInfo);
        });
    }


    listDefaultColumns() {
        const self = this;
        $.each(this.defaultColumns, function (index: number, column: any) {
            const columnInfo = self.setColumns(column, true);
            self.columnInfos.push(columnInfo);
        });
    }


    listFormNames() {
        this.formService.listFormNames(this.loggedInUserId)
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
        if (this.form.isValid) {
            this.removeBlurClass();
        } else {
            this.addBlurClass();
            this.navigateBack();
        }
        $('#add-form-name-modal').modal('hide');
    }

    unBlurDiv() {
        $('#add-form-parent-div').removeClass(this.portletBodyBlur);
        $('#add-form-parent-div').addClass(this.portletBody);
        $('#add-form-name-modal').modal('hide');
        $('#add-form-designs').modal('hide')
    }
    showAddForm() {
        $('#add-form-name-modal').modal('show');
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
            if (this.names.indexOf($.trim(formName).toLowerCase()) > -1 && $.trim(formName).toLowerCase() != this.existingFormName) {
                this.addFormNameErrorMessage(this.duplicateLabelMessage);
            } else {
                this.removeFormNameErrorClass();
            }
        } else {
            this.addFormNameErrorMessage(this.requiredMessage);
        }
    }

    sumbitOnEnter(event) {
        if (event.keyCode == 13 && this.form.isValid) {
            this.unBlurDiv();
        }
    }



    removeFormNameErrorClass() {
        $('#formNameDiv').removeClass(this.formErrorClass);
        $('#formNameDiv').addClass(this.defaultFormClass);
        this.form.isValid = true;
        this.formNameClass = "valid-form-name";
    }

    highlightByLength(length: number) {
        if (length > 0) {
            this.selectedColumn = this.columnInfos[length - 1];
            this.isColumnClicked = true;
        }

    }

    addColumn(column: any, isDefaultColumn: boolean) {
        this.columnInfo = new ColumnInfo();
        this.columnInfo = this.setColumns(column, isDefaultColumn);
        this.highLightSelectedColumn(this.columnInfo);
        this.columnInfos.push(this.columnInfo);
        this.referenceService.scrollToBottomByDivId('create-from-div');
    }


    setColumns(column: any, isDefaultColumn: boolean) {
        const columnInfo = new ColumnInfo();
        let length = this.allItems.length;
        length = length + 1;
        columnInfo.divId = "column-" + length;
        if (column.value !== undefined) {
            const field = column.value;
            columnInfo.labelName = field + "-" + length;
            columnInfo.placeHolder = field + "-" + length;
        } else {
            columnInfo.labelName = column.labelName
            columnInfo.placeHolder = column.labelName;
            if(column.labelType == 'price' && column.priceType != undefined){
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
        columnInfo.labelId = this.referenceService.replaceAllSpacesWithUnderScore(columnInfo.labelName);
        columnInfo.hiddenLabelId = this.referenceService.replaceAllSpacesWithEmpty(columnInfo.labelName);
        columnInfo.labelType = column.labelType;
        columnInfo.isDefaultColumn = isDefaultColumn;
        if (columnInfo.labelType === 'radio') {
            if (this.isAdd || column.radioButtonChoices == undefined) {
                columnInfo.radioButtonChoices = this.addDefaultOptions(columnInfo);
                columnInfo.allRadioButtonChoicesCount = columnInfo.radioButtonChoices.length + 1;
            } else {
                columnInfo.radioButtonChoices = column.radioButtonChoices;
                columnInfo.allRadioButtonChoicesCount = column.radioButtonChoices.length + 1;
            }
        } else if (columnInfo.labelType === 'checkbox') {
            if (this.isAdd || column.checkBoxChoices == undefined) {
                columnInfo.checkBoxChoices = this.addDefaultOptions(columnInfo);
                columnInfo.allCheckBoxChoicesCount = columnInfo.checkBoxChoices.length + 1;
            } else {
                columnInfo.checkBoxChoices = column.checkBoxChoices;
                columnInfo.allCheckBoxChoicesCount = column.checkBoxChoices.length + 1;
            }
        } else if (columnInfo.labelType === 'select') {
            if (this.isAdd || column.dropDownChoices == undefined) {
                columnInfo.dropDownChoices = this.addDefaultOptions(columnInfo);
                columnInfo.allDropDownChoicesCount = columnInfo.dropDownChoices.length + 1;
            } else {
                columnInfo.dropDownChoices = column.dropDownChoices;
                columnInfo.allDropDownChoicesCount = column.dropDownChoices.length + 1;
            }

        }
        this.allItems.push(columnInfo.divId);
        return columnInfo;
    }

    addDefaultOptions(columnInfo: ColumnInfo) {
        const defaultFormChoice = new DefaultFormChoice();
        for (let i = 1; i <= 2; i++) {
            defaultFormChoice.defaultChoices.push(this.constructChoice(i));
        }
        return defaultFormChoice.defaultChoices;
    }
    constructChoice(index: number) {
        const formOption = new FormOption();
        formOption.name = 'Choice ' + index;
        formOption.labelId = 'choice-' + index;
        formOption.hiddenLabelId = this.referenceService.replaceAllSpacesWithEmpty(formOption.name);
        formOption.errorMessage = "";
        return formOption;
    }
    /********On clicking create form  column div***********/
    highLightSelectedColumn(columnInfo: ColumnInfo) {
        this.selectedColumn = columnInfo;
        this.isColumnClicked = true;
    }
    /***Remove Column from create form***********/
    removeColumn(columnInfo: ColumnInfo, index: number) {
        this.columnInfos = this.referenceService.removeObjectFromArrayList(this.columnInfos, columnInfo.divId, 'divId');
        $('#' + columnInfo.divId).remove();
        this.isColumnClicked = false;
        // this.highlightByLength(this.columnInfos.length);
    }

    /*********Add Radio Buttons*********/
    addChoice(columnInfo: ColumnInfo, index: number) {
        if (columnInfo.labelType === 'radio') {
            columnInfo.radioButtonErrorMessage = "";
            const count = columnInfo.allRadioButtonChoicesCount;
            const formOption = this.constructChoice(count);
            columnInfo.radioButtonChoices.push(formOption);
            columnInfo.allRadioButtonChoicesCount++;
        } else if (columnInfo.labelType === 'checkbox') {
            columnInfo.checkBoxErrorMessage = "";
            const count = columnInfo.allCheckBoxChoicesCount;
            columnInfo.checkBoxChoices.push(this.constructChoice(count));
            columnInfo.allCheckBoxChoicesCount++;
        } else {
            columnInfo.dropDownErrorMessage = "";
            const count = columnInfo.allDropDownChoicesCount;
            columnInfo.dropDownChoices.push(this.constructChoice(count));
            columnInfo.allDropDownChoicesCount++;
        }
        this.referenceService.scrollToBottomByDivId('edit-from-div');
        this.referenceService.scrollToBottomByDivId('create-from-div');
    }


    removeChoice(columnInfo: ColumnInfo, index: number, choice: FormOption) {
        if (columnInfo.labelType === 'radio') {
            this.removeRadioButtonChoice(columnInfo, index, choice);
        } else if (columnInfo.labelType === "checkbox") {
            this.removeCheckBoxChoice(columnInfo, index, choice);
        } else if (columnInfo.labelType === "select") {
            this.removeDropDownChoice(columnInfo, index, choice);
        }
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


    updatePriceSymbol(columnInfo: ColumnInfo,type: string){
        let symbol="";
        if(type=='Rupee'){
            symbol="₹"
        }else if(type=='Dollar'){
            symbol="$"
        }else if(type=='Yen'){
            symbol=" ¥"
        }else if(type=='Pound'){
            symbol="£"
        }else if(type=='Euro'){
            symbol="€"
        }
        columnInfo.priceSymbol=symbol;
    }

    /****************Validate Form*****************/
    validateForm() {
        this.ngxloading = true;
        this.removeErrorMessage();
        if (this.columnInfos.length > 0) {
            const requiredFieldsLength = this.columnInfos.filter((item) => item.required === true).length;
            if (requiredFieldsLength >= 1) {
                const duplicateFieldLabels = this.referenceService.returnDuplicates(this.columnInfos.map(function (a) { return a.hiddenLabelId; }));
                const self = this;
                $.each(this.columnInfos, function (index, columnInfo) {
                    $('#' + columnInfo.divId).removeClass(self.borderErrorClass);
                    $('#' + columnInfo.divId).addClass(self.borderSuccessClass);
                    columnInfo.editFormChoiceDivClass = this.borderSuccessClass;
                    columnInfo.editFormLabelDivClass = this.borderSuccessClass;
                    const labelName = $.trim(columnInfo.labelName);
                    /*********Validate Empty Label Names********************/
                    self.validateEmptyLabelNames(columnInfo, labelName);
                    /**********Validate Empty Choice Values For Radio Button/DropDown/CheckBox********************/
                    self.validateChoices(columnInfo);
                    /*********Validate Duplicate Label Names********************/
                    self.validateDuplicateFieldLabels(duplicateFieldLabels, columnInfo);
                    /******validate Duplicate Radio Button/DropDown/CheckBox**************/
                    self.validateDuplicateChoiceLables(columnInfo);

                });
                const invalidLabelDivCount = this.columnInfos.filter((item) => item.editFormLabelDivClass === this.borderErrorClass).length;
                const invalidChoicesDivCount = this.columnInfos.filter((item) => item.editFormChoiceDivClass === this.borderErrorClass).length;
                const totalCount = invalidLabelDivCount + invalidChoicesDivCount;
                if (totalCount == 0 && this.form.isValid) {
                    this.saveOrUpdateForm();
                } else {
                    this.addErrorMessage(this.duplicateOrEmptyLabelErrorMessage);
                }
            } else {
                this.addErrorMessage(this.minimumOneColumn);
            }

        } else {
            this.addErrorMessage(this.minimumOneColumn);
        }
        this.referenceService.goToTop();
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
        this.formNameClass = "invalid-form-name";
    }


    private showSweetAlert(errorMessage: string) {
        swal(errorMessage, "", "error");
    }

    saveOrUpdateForm() {
        this.form.formLabelDTOs = this.columnInfos;
        this.form.createdBy = this.authenticationService.getUserId();
        // if (this.formBackgroundImagePath) {
        //     this.form.backgroundImage = this.formBackgroundImagePath;
        //     this.formBackgroundImagePath = null;
        // } else if (this.backgroundImageFileObj) {
        //     this.uploadFile(this.backgroundImageFileObj, 'backgroundImage')
        //     this.backgroundImageFileObj = null;
        // }
        // if (this.companyLogoPath) {
        //     this.form.companyLogo = this.companyLogoPath;
        //     this.companyLogoPath = null;
        // } else if (this.companyLogoFileObj) {
        //     this.uploadFile(this.companyLogoFileObj, 'companyLogo')
        //     this.companyLogoFileObj = null;
        // }
        for (var instanceName in CKEDITOR.instances) {
            CKEDITOR.instances[instanceName].updateElement();
            this.form.footer = CKEDITOR.instances[instanceName].getData();
        }
        if(!this.form.companyLogo){
            this.form.companyLogo=this.companyLogoImageUrlPath;
        }
        if (this.isAdd) {
            this.save(this.form);
        } else {
            this.update(this.form);
        }
    }

    save(form: Form) {
        form.formType = this.formType;
        //let formData: FormData = new FormData();
        //formData.append('formDto', JSON.stringify(this.form));
        //if (this.fileObj) {
        //    formData.append('file', this.fileObj, this.fileObj.name);
        //} else {
        //    formData.append('file', null);
        //}
        this.formService.saveForm(form)
            .subscribe(
                (result: any) => {
                    if (result.access) {
                        if (result.statusCode === 100) {
                            this.showSweetAlert(this.duplicateLabelMessage);
                        } else {
                            this.referenceService.isCreated = true;
                            this.router.navigate(["/home/forms/manage"]);
                        }
                    } else {
                        this.authenticationService.forceToLogout();
                    }
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
        /* let formData: FormData = new FormData();
                formData.append('formDto', JSON.stringify(this.form));
                if (this.fileObj) {
                    formData.append('file', this.fileObj, this.fileObj.name);
                } else {
                    formData.append('file', null);
                } */
        console.log('entered' + this.form.backgroundImage)
        this.formService.updateForm(form)
            .subscribe(
                (result: any) => {
                    if (result.access) {
                        if (result.statusCode === 100) {
                            this.showSweetAlert(this.duplicateLabelMessage);
                        } else {
                            this.referenceService.isUpdated = true;
                            this.navigateToManageSection();
                        }
                    } else {
                        this.authenticationService.forceToLogout();
                    }
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
        this.previewPopUpComponent.formPreviewBeforeSave(this.columnInfos, this.form);
    }

    ngOnDestroy() {
        this.formService.form = undefined;
        this.dragulaService.destroy('form-options');
        this.minimizeForm();

    }

    navigateBack() {
        if (this.isAdd) {
            this.router.navigate(["/home/design/add"]);
        } else {
            this.navigateToManageSection();
        }
    }

    selectCategory(event) {
        this.form.categoryId = event;
    }

    navigateToManageSection() {
        let categoryId = this.route.snapshot.params['categoryId'];
        if (categoryId > 0) {
            this.router.navigate(["/home/forms/manage/" + categoryId]);
        } else {
            this.router.navigate(["/home/forms/manage"]);
        }
    }

    changeControllerColor(event: any, form: Form, type: string) {
        try {
            const rgba = this.videoUtilService.transparancyControllBarColor(event, this.valueRange);
            $('.video-js .vjs-control-bar').css('cssText', 'background-color:' + rgba + '!important');
            if (type === "backgroundColor") {
                this.backgroundControllerColor = event;
                form.backgroundColor = event;
            } else if (type === "labelColor") {
                this.labelControllerColor = event;
                form.labelColor = event;
            } else if (type === "buttonColor") {
                this.buttonBackgroundControllerColor = event;
                form.buttonColor = event
            } else if (type === "buttonValueColor") {
                this.buttonValueControllerColor = event;
                form.buttonValueColor = event
            }
        } catch (error) { console.log(error); }
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
        if (isSupportfile === 'image/jpg' || isSupportfile === 'image/jpeg' || isSupportfile === 'image/png') {
            this.errorUploadCropper = false;
            if (this.popupOpenedFor == 'formBackgroundImage') {
                this.backgroundImageChangedEvent = event;
            } else if (this.popupOpenedFor == 'companyLogo') {
                this.companyLogoChangedEvent = event;
            }
            this.imageChangedEvent = event;
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
        this.loadingcrop = true;
        if (this.popupOpenedFor == 'formBackgroundImage') {
            this.backgroundImageFileObj = this.utilService.convertBase64ToFileObject(this.croppedBackgroundImage);
            this.backgroundImageFileObj = this.utilService.blobToFile(this.backgroundImageFileObj);
            this.uploadFile(this.backgroundImageFileObj, 'backgroundImage')
            this.formBackgroundImagePath = null;
        } else if (this.popupOpenedFor == 'companyLogo') {
            this.companyLogoFileObj = this.utilService.convertBase64ToFileObject(this.croppedCompanyLogoImage);
            this.companyLogoFileObj = this.utilService.blobToFile(this.companyLogoFileObj);
            this.uploadFile(this.companyLogoFileObj, 'companyLogo')
            this.companyLogoPath = null;
        }
        this.loadingcrop = false;
        this.popupOpenedFor = null;
        $('#cropbackgroundImage').modal('hide');
        $('#add-form-name-modal').removeClass(this.portletBodyBlur);
    }

    fileChangeEvent(type: string) {
        this.popupOpenedFor = type;
        this.cropRounded = false;
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
        // if (this.form.backgroundImage != null && this.form.backgroundImage.length > 0) {
        //     this.companyLogoImageUrlPath = this.form.backgroundImage;
        //     console.log(this.companyLogoImageUrlPath)
        // }
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

    errorHandler(event) { event.target.src = 'assets/images/your-logo.png'; }

    uploadFile(file: File, type: string) {
        this.loading = true;
        this.referenceService.loading(this.httpRequestLoader, true);
        const formData: FormData = new FormData();
        formData.append('files', file, file.name);
        this.emailTemplateService.uploadFileFromForm(this.authenticationService.getUserId(), formData)
            .subscribe(
                (data: any) => {
                    if (data.access) {
                        if (type == 'backgroundImage') {
                            this.form.backgroundImage = data.filePath;
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
        $('#add-form-fields').modal('hide');
        this.removeBlurClass()
    }

    openFormDesignModal() {
        $('#add-form-designs').modal('show');
        this.addBlurClass();
    }

    closeFormDesignModal() {
        $('#add-form-designs').modal('hide');
        this.removeBlurClass()
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
        this.form.isValid = true;
    }

    private addFormButtonValueErrorMessage(errorMessage: string) {
        this.form.isValid = false;
        $('#formButtonValueDiv').addClass(this.formErrorClass);
        this.formButtonValueErrorMessage = errorMessage;
    }

	selectedPageNumber(event){
	
		}
}
