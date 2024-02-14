import { Component, OnInit,Input } from '@angular/core';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DashboardButton } from 'app/vanity-url/models/dashboard.button';
import { Pagination } from 'app/core/models/pagination';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { ReferenceService } from 'app/core/services/reference.service';
import { PagerService } from 'app/core/services/pager.service';
import { CustomLinkDto } from 'app/vanity-url/models/custom-link-dto';
import { FormBuilder, FormControl, FormGroup,Validators } from '@angular/forms';
import { max120CharactersLimitValidator,noWhiteSpaceOrMax20CharactersLimitValidator,max40CharactersLimitValidator } from 'app/form-validator';
import { RegularExpressions } from 'app/common/models/regular-expressions';


declare var swal: any;

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
  selectedProtocol: string;
  saving = false;
  @Input() moduleType:string="";
  headerText = "";
  listHeaderText = "";
  formErrors = {
    'title': '',
    'link': '',
    'subtitle':'',
    'description':'',
    'icon':''
  };

  validationMessages = {
      'title': {
          'required': 'Title is required',
          'whitespace': 'Empty spaces are not allowed',
          'maxLimitReached': 'Title cannot be more than 20 characters long',
      },
      'link': {
          'required': 'Link is required',
          'maxlength': 'Link cannot be more than 2083 characters long',
          'pattern': 'Invalid Link Pattern'
      },
      'subTitle': {
          'maxLimitReached': 'Subtitle cannot be more than 40 characters long',
      },
      'description': {
        'maxLimitReached': 'description cannot be more than 120 characters long',
      
      }
  };
  customLinkForm: FormGroup;
  constructor(private vanityURLService: VanityURLService, private authenticationService: AuthenticationService, 
    private xtremandLogger: XtremandLogger, private properties: Properties, private httpRequestLoader: HttpRequestLoader, 
    private referenceService: ReferenceService, private pagerService: PagerService,private formBuilder:FormBuilder,
    private regularExpressions:RegularExpressions) {
      this.customLinkForm = new FormGroup( {
        title: new FormControl(),
        subTitle: new FormControl(),
        link: new FormControl(),
        icon: new FormControl(),
        description: new FormControl(),
        openLinksInNewTab: new FormControl()
    } );
      this.iconNamesFilePath = 'assets/config-files/dashboard-button-icons.json';
    this.vanityURLService.getCustomLinkIcons(this.iconNamesFilePath).subscribe(result => {
      this.iconsList = result.icon_names;
    }, error => {
      console.log(error);
    });
  }




  
	buildCustomLinkForm() {
		this.customLinkForm = this.formBuilder.group({
			'title': [this.referenceService.getTrimmedData(this.customLinkDto.buttonTitle), Validators.compose([Validators.required, noWhiteSpaceOrMax20CharactersLimitValidator])],
			'subTitle': [this.customLinkDto.buttonSubTitle,Validators.compose([max40CharactersLimitValidator])],
      'link': [this.customLinkDto.buttonLink, Validators.compose([Validators.required,Validators.pattern(this.regularExpressions.URL_PATTERN)])],
			'icon': [this.customLinkDto.buttonIcon],
			'description': [this.customLinkDto.buttonDescription, Validators.compose([max120CharactersLimitValidator])],
			'openLinksInNewTab': [this.customLinkDto.openInNewTab],
		});

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
    if(this.moduleType=="dashboardButtons"){
      this.headerText = "Add Button";
      this.listHeaderText = "Your Dashboard Button's List";
    }else{
      
    }
    this.buttonActionType = true;
    this.selectedProtocol = 'http';
    this.customLinkDto = new CustomLinkDto();
    this.buildCustomLinkForm();
    this.findLinks(this.pagination);
  }

  findLinks(pagination: Pagination) {
    if (this.authenticationService.vanityURLEnabled) {
      this.referenceService.loading(this.httpRequestLoader, true);
      pagination.userId = this.authenticationService.getUserId();
      pagination.vendorCompanyProfileName = this.authenticationService.companyProfileName;
      this.vanityURLService.findCustomLinks(pagination).subscribe(result => {
        const data = result.data;
        if (result.statusCode === 200) {
          pagination.totalRecords = data.totalRecords;
          this.customLinkDtos = data.dbButtons;
          pagination = this.pagerService.getPagedItems(pagination, this.customLinkDtos);
        }
        this.customLinkDto = new DashboardButton();
        this.buttonActionType = true;
        this.referenceService.loading(this.httpRequestLoader, false);
      });
    }
  }

  save() {
    this.saving = true;
    this.customLinkDto = new CustomLinkDto();
    this.setCustomLinkDtoProperties();
    this.vanityURLService.saveCustomLinkDetails(this.customLinkDto).subscribe(result => {
      this.saving = false;
      if (result.statusCode === 200) {
        this.customResponse = new CustomResponse('SUCCESS', this.properties.VANITY_URL_DB_BUTTON_SUCCESS_TEXT, true);
        this.customLinkDto = new CustomLinkDto(); 
        this.saving = false;
        this.findLinks(this.pagination);
      } else if (result.statusCode === 100) {
        this.customResponse = new CustomResponse('ERROR', this.properties.VANITY_URL_DB_BUTTON_TITLE_ERROR_TEXT, true);
      }
      this.referenceService.goToTop();
    }, error => {
      this.customResponse = new CustomResponse('ERROR', "Error while saving dashboard button", true)
      this.referenceService.goToTop();
      this.saving = false;
    });
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
  }

  edit(id: number) {
    this.buttonActionType = false;
    this.referenceService.goToTop();
    const dbButtonObj = this.customLinkDtos.filter(dbButton => dbButton.id === id)[0];
    this.customLinkDto = JSON.parse(JSON.stringify(dbButtonObj));
    this.buildCustomLinkForm();
  }

  update(id: number) {
    this.vanityURLService.updateCustomLinkDetails(this.customLinkDto).subscribe(result => {
      if (result.statusCode === 200) {
        this.customResponse = new CustomResponse('SUCCESS', this.properties.VANITY_URL_DB_BUTTON_UPDATE_TEXT, true);
        this.callInitMethods();
      }
      else if (result.statusCode === 100) {
        this.customResponse = new CustomResponse('ERROR', this.properties.VANITY_URL_DB_BUTTON_TITLE_ERROR_TEXT, true);
      }
      this.referenceService.goToTop();
    }, error => {
      this.customResponse = new CustomResponse('ERROR', "Error while updating dashboard button", true)
      this.referenceService.goToTop();
    });
  }

  delete(id: number) {
    this.vanityURLService.deleteCustomLink(id).subscribe(result => {
      if (result.statusCode === 200) {
        this.customResponse = new CustomResponse('SUCCESS', this.properties.VANITY_URL_DB_BUTTON_DELETE_TEXT, true);
        this.referenceService.goToTop();
        this.pagination.pageIndex = 1;
        this.callInitMethods();
      }
    }, error => {
      this.customResponse = new CustomResponse('ERROR', "Error while deleting dashboard button", true)
      this.referenceService.goToTop();
    });
  }

  cancel() {
    this.customLinkDto = new DashboardButton();
    this.buttonActionType = true;
  }

  showAlert(dashboardButtonId: number) {
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
        self.delete(dashboardButtonId);
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

  selectedIconName() {
    
  }

  selectedProtocolOption(selectedProtocolOption: string) {
    this.selectedProtocol = selectedProtocolOption;
  }

  validateValue(value){
    console.log(value);
  }
}