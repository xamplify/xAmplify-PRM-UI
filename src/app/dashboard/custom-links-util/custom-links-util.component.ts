import { Component, OnInit,Input, ViewChild } from '@angular/core';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Pagination } from 'app/core/models/pagination';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { ReferenceService } from 'app/core/services/reference.service';
import { PagerService } from 'app/core/services/pager.service';
import { CustomLinkDto } from 'app/vanity-url/models/custom-link-dto';
import { FormBuilder, FormControl, FormGroup,Validators } from '@angular/forms';
import { max120CharactersLimitValidator,noWhiteSpaceOrMax20CharactersLimitValidator,max40CharactersLimitValidator, noWhiteSpaceValidatorWithOutLimit } from 'app/form-validator';
import { RegularExpressions } from 'app/common/models/regular-expressions';
import { CustomLinkType } from '../models/custom-link-type.enum';
import { ErrorResponse } from 'app/util/models/error-response';
import { UtilService } from 'app/core/services/util.service';
declare var swal: any, $:any;
@Component({
  selector: 'app-custom-links-util',
  templateUrl: './custom-links-util.component.html',
  styleUrls: ['./custom-links-util.component.css'],
  providers: [Properties, HttpRequestLoader,RegularExpressions]
})
export class CustomLinksUtilComponent implements OnInit {
  customResponse: CustomResponse = new CustomResponse();
  customLinkDto: CustomLinkDto = new CustomLinkDto();
  pagination: Pagination = new Pagination();
  customLinkDtos: Array<CustomLinkDto> = new Array<CustomLinkDto>();
  buttonActionType: boolean;
  iconNamesFilePath: string;
  iconsList: any = [];
  customLinkTypes :Array<any> = new Array<any>();
  selectedProtocol: string;
  saving = false;
  @Input() moduleType:string="";
  defaultType: string = CustomLinkType[CustomLinkType.NEWS];  
  headerText = "";
  listHeaderText = "";
  isDuplicateTitle = false;
  ngxLoading = false;
  formErrors = {
    'title': '',
    'link': '',
    'subtitle':'',
    'description':'',
    'icon':''
  };

  validationMessages = {
      'title': {
          'required': 'Title is required.',
          'whitespace': 'Empty spaces are not allowed.',
          'maxLimitReached': 'Title cannot be more than 20 characters long.',
      },
      'link': {
          'required': 'Link is required.',
          'maxlength': 'Link cannot be more than 2083 characters long.',
          'pattern': 'Invalid Link Pattern.'
      },
      'subTitle': {
          'maxLimitReached': 'Subtitle cannot be more than 40 characters long.',
      },
      'description': {
        'maxLimitReached': 'description cannot be more than 120 characters long.',
      
      }
  };
  customLinkForm: FormGroup;
  croppedImage:any;
  previouslySelectedImagePath = "";
  uploadImageOptionClicked = false;
  isDashboardBannerImageUploaded = true;
  formData: any = new FormData();
  isImageLoading = false;
  isAdd = true;
  isAddDashboardBannersDivHidden = false;
  dashboardBannersInfoMessage:CustomResponse = new CustomResponse();
  constructor(private vanityURLService: VanityURLService, private authenticationService: AuthenticationService, 
    private xtremandLogger: XtremandLogger, public properties: Properties, private httpRequestLoader: HttpRequestLoader, 
    private referenceService: ReferenceService, private pagerService: PagerService,private formBuilder:FormBuilder,
    private regularExpressions:RegularExpressions,public utilService:UtilService) {
      this.iconNamesFilePath = 'assets/config-files/dashboard-button-icons.json';
     this.vanityURLService.getCustomLinkIcons(this.iconNamesFilePath).subscribe(result => {
      this.iconsList = result.icon_names;
    }, error => {
      console.log(error);
    });
    let news = {'id':CustomLinkType[CustomLinkType.NEWS],'value':"News"};
    let announcements = {'id':CustomLinkType[CustomLinkType.ANNOUNCEMENTS],'value':"Announcements"};
    this.customLinkTypes.push(news);
    this.customLinkTypes.push(announcements);
  }
  
  private setDefaultValuesForForm() {
    this.customLinkForm = new FormGroup({
      title: new FormControl(),
      subTitle: new FormControl(),
      link: new FormControl(),
      icon: new FormControl(),
      description: new FormControl(),
      openLinksInNewTab: new FormControl(),
      customLinkType:new FormControl()
    });
  }

	buildCustomLinkForm() {
    if(this.moduleType==this.properties.dashboardButtons){
      this.customLinkForm = this.formBuilder.group({
        'title': [this.referenceService.getTrimmedData(this.customLinkDto.buttonTitle), Validators.compose([Validators.required, noWhiteSpaceOrMax20CharactersLimitValidator])],
        'subTitle': [this.customLinkDto.buttonSubTitle,Validators.compose([max40CharactersLimitValidator])],
        'link': [this.customLinkDto.buttonLink, Validators.compose([Validators.required,Validators.pattern(this.regularExpressions.LINK_PATTERN)])],
        'icon': [this.customLinkDto.buttonIcon],
        'description': [this.customLinkDto.buttonDescription, Validators.compose([max120CharactersLimitValidator])],
        'openLinksInNewTab': [this.customLinkDto.openInNewTab],
        'customLinkType':['']
      });
    }else{
      this.customLinkForm = this.formBuilder.group({
        'title': [this.referenceService.getTrimmedData(this.customLinkDto.buttonTitle), Validators.compose([Validators.required, noWhiteSpaceValidatorWithOutLimit])],
        'link': [this.customLinkDto.buttonLink, Validators.compose([Validators.required,Validators.pattern(this.regularExpressions.LINK_PATTERN)])],
        'icon': [this.customLinkDto.buttonIcon],
        'description': [this.customLinkDto.buttonDescription],
        'openLinksInNewTab': [this.customLinkDto.openInNewTab],
        'customLinkType':[this.customLinkDto.type,Validators.required]
      });
    }

		this.customLinkForm.valueChanges
			.subscribe(data => this.getSubmittedFormValues(data));

		this.getSubmittedFormValues(); 
	}


	getSubmittedFormValues(data?: any) {
		if (!this.customLinkForm) { return; }
		const form = this.customLinkForm;
		for (const field in this.formErrors) {
			this.formErrors[field] = '';
			const control = form.get(field);
			if (control && control.dirty && !control.valid) {
				const messages = this.validationMessages[field];
				for (const key in control.errors) {
					this.formErrors[field] += messages[key] + ' ';
				}
			}
		}
	}


  ngOnInit() {
      this.callInitMethods();
  }

  callInitMethods(){
    this.clearImage();
    if(this.moduleType==this.properties.dashboardButtons){
      this.headerText = "Add Button";
      this.listHeaderText = "Your Dashboard Button's List";
      this.isDashboardBannerImageUploaded = true;
    }else if(this.moduleType==this.properties.newsAndAnnouncements){
      this.headerText = "Add News & Announcements";
      this.listHeaderText = "Your News & Announcements List";
      this.isDashboardBannerImageUploaded = true;
    }else if(this.moduleType==this.properties.dashboardBanners){
      this.headerText = "Add Dashboard Banner";
      this.listHeaderText = "Your Dashboard Banners List";
      this.isDashboardBannerImageUploaded = false;
    }
    this.buttonActionType = true;
    this.selectedProtocol = 'http';
    this.customLinkDto = new CustomLinkDto();
    this.setDefaultValuesForForm();
    this.buildCustomLinkForm();
    this.customLinkForm.get('customLinkType').setValue(this.defaultType);
    this.previouslySelectedImagePath = "";
    this.isAddDashboardBannersDivHidden= false;
    this.dashboardBannersInfoMessage = new CustomResponse();
    this.findLinks(this.pagination);
  }

  findLinks(pagination: Pagination) {
    this.referenceService.scrollSmoothToTop();
    if (this.authenticationService.vanityURLEnabled) {
      this.referenceService.loading(this.httpRequestLoader, true);
      pagination.userId = this.authenticationService.getUserId();
      pagination.vendorCompanyProfileName = this.authenticationService.companyProfileName;
      pagination.filterKey = this.moduleType;
      this.vanityURLService.findCustomLinks(pagination).subscribe(result => {
        const data = result.data;
        if (result.statusCode === 200) {
            pagination.totalRecords = data.totalRecords;
          if(this.moduleType==this.properties.dashboardButtons){
            this.customLinkDtos = data.dbButtons;
          }else{
            this.customLinkDtos = data.list;
          }
          pagination = this.pagerService.getPagedItems(pagination, this.customLinkDtos);
          if(this.moduleType==this.properties.dashboardBanners){
            this.isAddDashboardBannersDivHidden = pagination.totalRecords==5;
            this.dashboardBannersInfoMessage = new CustomResponse('INFO',this.properties.maximumDashboardBannersLimitReached,true);
          }else{
            this.isAddDashboardBannersDivHidden = false;
            this.dashboardBannersInfoMessage = new CustomResponse();
          }
        }
        if(this.customLinkDto.id>0){
          this.buttonActionType = false;
        }else{
          this.customLinkDto = new CustomLinkDto();
          this.buttonActionType = true;
        }
        this.referenceService.loading(this.httpRequestLoader, false);
      });
    }
  }

  save() {
    this.ngxLoading = true;
    this.saving = true;
    this.customResponse = new CustomResponse();
    this.customLinkDto = new CustomLinkDto();
    this.setCustomLinkDtoProperties();
    this.vanityURLService.saveCustomLinkDetails(this.customLinkDto,this.moduleType,this.formData).subscribe(result => {
      if (result.statusCode === 200) {
        let message = "";
        if(this.moduleType==this.properties.dashboardButtons){
          message = this.properties.VANITY_URL_DB_BUTTON_SUCCESS_TEXT;
        }else{
          message = result.message;
        }
        this.customResponse = new CustomResponse('SUCCESS',message, true);
        this.resetFormDataAndDtoProperties();
        this.setDefaultValuesForForm();
        this.buildCustomLinkForm();
        this.clearImage();
        this.customLinkForm.get('customLinkType').setValue(this.defaultType);
        this.findLinks(this.pagination);
      } else if (result.statusCode === 100) {
        this.customResponse = new CustomResponse('ERROR', this.properties.VANITY_URL_DB_BUTTON_TITLE_ERROR_TEXT, true);
      }else if(result.statusCode==400){
        this.removeTitleErrorClass();
        let data = result.data;
        let errorResponses = data.errorMessages;
        let self = this;
        $.each(errorResponses, function (_index: number, errorResponse: ErrorResponse) {
          let field = errorResponse.field;
          if ("title" == field) {
             self.customResponse = new CustomResponse('ERROR', "Title Already Exists", true);
             $("#customLinkTitle").removeClass('ng-valid');
             $("#customLinkTitle").addClass('ng-invalid');
          }
        });
      }
      this.referenceService.goToTop();
      this.saving = false;
      this.ngxLoading = false;
    }, error => {
      let message = "";
      if(this.moduleType==this.properties.dashboardButtons){
        message = "Error while saving dashboard button";
      }else{
        message = this.referenceService.getApiErrorMessage(error);
      }
      this.customResponse = new CustomResponse('ERROR', message, true);
      this.referenceService.goToTop();
      this.saving = false;
      this.ngxLoading = false;
      if(message==this.properties.maximumDashboardBannersLimitReached){
        this.callInitMethods();
      }
    });
  }


  private resetFormDataAndDtoProperties() {
    this.customLinkDto = new CustomLinkDto();
    this.formData.delete('dashboardBannerImage');
    this.formData.delete('customLinkDto');
  }

  private setCustomLinkDtoProperties() {
    let customFormDetails = this.customLinkForm.value;
    this.customLinkDto.buttonTitle = this.referenceService.getTrimmedData(customFormDetails.title);
    this.customLinkDto.buttonSubTitle = this.referenceService.getTrimmedData(customFormDetails.subTitle);
    this.customLinkDto.buttonLink = this.referenceService.getTrimmedData(customFormDetails.link);
    this.customLinkDto.buttonIcon = this.referenceService.getTrimmedData(customFormDetails.icon);
    this.customLinkDto.buttonDescription = this.referenceService.getTrimmedData(customFormDetails.description);
    this.customLinkDto.openInNewTab = customFormDetails.openLinksInNewTab;
    this.customLinkDto.vendorId = this.authenticationService.getUserId();
    this.customLinkDto.companyProfileName = this.authenticationService.companyProfileName;
    if(this.moduleType==this.properties.newsAndAnnouncements){
      this.customLinkDto.type = customFormDetails.customLinkType;
    }else if(this.moduleType==this.properties.dashboardBanners){
      this.customLinkDto.type = CustomLinkType[CustomLinkType.DASHBOARD_BANNERS];
    }
    this.customLinkDto.title = this.customLinkDto.buttonTitle;
    this.customLinkDto.link = this.customLinkDto.buttonLink;
    this.customLinkDto.description = this.customLinkDto.buttonDescription;
    this.customLinkDto.icon = this.customLinkDto.buttonIcon;
    this.customLinkDto.loggedInUserId = this.authenticationService.getUserId();
    this.customLinkDto.openLinkInNewTab = this.customLinkDto.openInNewTab;
  }

  edit(id: number) {
    this.isImageLoading = true;
    this.isAdd = false;
    this.customResponse = new CustomResponse();
    this.previouslySelectedImagePath = "";
    this.clearImage();
    this.removeTitleErrorClass();
    this.buttonActionType = false;
    this.saving = false;
    this.referenceService.goToTop();
    if(this.moduleType==this.properties.dashboardButtons){
      const dbButtonObj = this.customLinkDtos.filter(dbButton => dbButton.id === id)[0];
      this.customLinkDto = JSON.parse(JSON.stringify(dbButtonObj));
      this.buildCustomLinkForm();
    }else{
      this.ngxLoading = true;
      this.vanityURLService.getCustomLinkDetailsById(id).subscribe(
        response=>{
            this.customLinkDto = response.data;
            this.customLinkDto.buttonTitle = this.customLinkDto.title;
            this.customLinkDto.buttonIcon = this.customLinkDto.icon;
            this.customLinkDto.buttonLink = this.customLinkDto.link;
            this.customLinkDto.buttonDescription = this.customLinkDto.description;
            this.customLinkDto.openInNewTab = this.customLinkDto.openLinkInNewTab;
            this.buildCustomLinkForm();
            this.previouslySelectedImagePath = this.customLinkDto.bannerImagePath;
            $('.dashboard-banner-image').css('height', 'auto');
            this.ngxLoading = false;
        },error=>{
          this.customResponse = new CustomResponse('ERROR',this.properties.serverErrorMessage,true);
          this.buttonActionType = true;
          this.customLinkDto = new CustomLinkDto();
          this.setDefaultValuesForForm();
          this.buildCustomLinkForm();
          this.customLinkForm.get('customLinkType').setValue(this.defaultType);
          this.ngxLoading = false;
        });
    }
    
  }

  update() {
    this.setCustomLinkDtoProperties();
    if(this.moduleType==this.properties.dashboardButtons){
      this.updateDashboardButton();
    }else{
      this.customResponse = new CustomResponse();
      this.ngxLoading = true;
      this.setCustomLinkDtoProperties();
      this.vanityURLService.updateCustomLinkDetails(this.customLinkDto,this.moduleType,this.formData).subscribe(
        response=>{
          this.referenceService.scrollSmoothToTop();
          let statusCode = response.statusCode;
          if(statusCode==200){
            this.customResponse = new CustomResponse('SUCCESS',response.message,true);
            this.resetFormDataAndDtoProperties();
            this.findLinks(this.pagination);
            this.ngxLoading = false;
            this.saving = false;
            this.buttonActionType = false;
          }else{
            this.removeTitleErrorClass();
            let data = response.data;
            let errorResponses = data.errorMessages;
            let self = this;
            $.each(errorResponses, function (_index: number, errorResponse: ErrorResponse) {
              let field = errorResponse.field;
              if ("title" == field) {
                self.customResponse = new CustomResponse('ERROR', "Title Already Exists", true);
                $("#customLinkTitle").removeClass('ng-valid');
                $("#customLinkTitle").addClass('ng-invalid');
              }
            });
            this.saving = false;
            this.buttonActionType = false;
            this.ngxLoading = false;
          }
        },error=>{
          this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
          this.referenceService.goToTop();
          this.saving = false;
          this.ngxLoading = false;
          this.buttonActionType = false;
          this.formData.delete("customLinkDto");
        }
      )
    }
    
  }

  private removeTitleErrorClass() {
    $("#customLinkTitle").removeClass('ng-valid');
    $("#customLinkTitle").removeClass('ng-invalid');
  }

  private updateDashboardButton() {
    this.vanityURLService.updateCustomLinkDetails(this.customLinkDto,this.moduleType,this.formData).subscribe(result => {
      if (result.statusCode === 200) {
        this.customResponse = new CustomResponse('SUCCESS', this.properties.VANITY_URL_DB_BUTTON_UPDATE_TEXT, true);
        this.callInitMethods();
      }
      else if (result.statusCode === 100) {
        this.customResponse = new CustomResponse('ERROR', this.properties.VANITY_URL_DB_BUTTON_TITLE_ERROR_TEXT, true);
      }
      this.referenceService.goToTop();
    }, error => {
      this.customResponse = new CustomResponse('ERROR', "Error while updating dashboard button", true);
      this.referenceService.goToTop();
    });
  }

  delete(item: any) {
    this.vanityURLService.deleteCustomLink(item.id,this.moduleType).subscribe(result => {
      if (result.statusCode === 200) {
        let message = "";
        if(this.moduleType==this.properties.dashboardButtons){
          message = this.properties.VANITY_URL_DB_BUTTON_DELETE_TEXT;
        }else{
          message = item.title+" deleted successfully";
        }
        this.customResponse = new CustomResponse('SUCCESS', message, true);
        this.referenceService.goToTop();
        this.pagination.pageIndex = 1;
        this.isAdd = true;
        this.callInitMethods();
      }
    }, error => {
      let message = this.moduleType==this.properties.dashboardButtons ? 'Error while deleting dashboard button':this.properties.serverErrorMessage;
      this.customResponse = new CustomResponse('ERROR', message, true);
      this.referenceService.goToTop();
    });
  }

  cancel() {
    this.customLinkDto = new CustomLinkDto();
    this.customResponse = new CustomResponse();
    this.buttonActionType = true;
    this.setDefaultValuesForForm();
    this.buildCustomLinkForm();
    this.customLinkForm.get('customLinkType').setValue(this.defaultType);
    this.previouslySelectedImagePath = "";
    this.clearImage();
  }

  showAlert(item: any) {
    try {
      let self = this;
      swal({
        title: 'Are you sure?',
        text: "You won't be able to undo this action!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#54a7e9',
        cancelButtonColor: '#999',
        confirmButtonText: 'Yes, delete it!'

      }).then(function (myData: any) {
        self.delete(item);
      }, function (dismiss: any) {
        console.log('you clicked on option' + dismiss);
      });
    } catch (error) {
      this.xtremandLogger.error(error, "DashboardButtonsComponent", "delete()");
    }
  }

  /************Page************** */
  setPage(event: any) {
    this.pagination.pageIndex = event.page;
    this.findLinks(this.pagination);
  }

  /***Dashboard Banners***/

  openModalPopUp(){
    this.uploadImageOptionClicked = false;
    setTimeout(() => {
      this.uploadImageOptionClicked = true;
    }, 100);
    
  }

  clearImage(){
    this.croppedImage = "";
    this.formData.delete("dashboardBannerImage");
    this.isDashboardBannerImageUploaded = false;
    $('.dashboard-banner-image').css('height', '120px');
  }

  croppedImageEventReceiver(event:any){
    $('.dashboard-banner-image').css('height', 'auto');
    this.croppedImage = event['croppedImage'];
    let uploadedImageName = event['fileName'];
    let fileObj: any;
		fileObj = this.utilService.convertBase64ToFileObject(this.croppedImage);
		fileObj = this.utilService.blobToFile(fileObj);
    this.formData.append("dashboardBannerImage", fileObj, uploadedImageName);
    this.isDashboardBannerImageUploaded = true;
    
  }


}