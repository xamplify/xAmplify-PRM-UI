import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { DealRegistration } from '../models/deal-registraton';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Campaign } from '../../campaigns/models/campaign';
import { DealRegistrationService } from '../services/deal-registration.service';
import { CountryNames } from '../../common/models/country-names';
import { CustomResponse } from '../../common/models/custom-response';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { DealForms } from '../models/deal-forms';
import { DealAnswer } from '../models/deal-answers';
import { DealDynamicProperties } from '../models/deal-dynamic-properties';
import { DealType } from '../models/deal-type';
import { UtilService } from '../../core/services/util.service';
import { CallActionSwitch } from '../../videos/models/call-action-switch';
import { DealComments } from '../models/deal-comments';
import { DealQuestions } from '../models/deal-questions';
import { UserService } from 'app/core/services/user.service';
import { SfCustomFieldsDataDTO } from '../models/sfcustomfieldsdata';
import { SfDealComponent } from '../sf-deal/sf-deal.component';
import { Observable } from 'rxjs';



declare var flatpickr: any, $: any, swal: any;

@Component({
    selector: 'app-deal-registration',
    templateUrl: './deal-registration.component.html',
    styleUrls: ['./deal-registration.component.css'],
    providers: [CountryNames, CallActionSwitch],

})
export class DealRegistrationComponent implements OnInit, AfterViewInit {


    @Input() campaign: Campaign;
    @Input() lead: any;
    @Input() dealId: any;
    @Input() isVendor: any;
    @Output() dealReg = new EventEmitter<any>();
    @Input() isPreview = false;
    @Input() selectedTab:number=1;
    dealRegistration: DealRegistration;
    isServerError: boolean = false;
    leadData: any;
    properties: Array<DealDynamicProperties> = new Array<DealDynamicProperties>();
    property: DealDynamicProperties = new DealDynamicProperties();
    errorClass: string = "form-group has-error has-feedback";
    successClass: string = "form-group has-success has-feedback";
    formGroupClass: string = "form-group";
    website: string;
    isDealRegistrationFormValid: boolean = false;
    estimatedCloseDate: string;
    opportunityAmount: string;
    country: string;
    leadState: string;
    leadPostalCode: string;
    leadStreet: string;
    leadCity: string;
    isValidEmail: boolean;
    company: string;
    dealType: string;
    phone: string;
    email: string;
    title: string;
    role: string;

    lastName: string;
    firstName: string;
    PHONE_NUMBER_PATTERN: RegExp = /^[0-9-+]+$/;
    URL_PATTERN = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/;
    isLoading = false;

    customResponse: CustomResponse = new CustomResponse();

    phoneDivClass: string = "form-group";
    phoneError = true;
    phoneErrorMessage = "";
    websiteError: boolean;
    websiteDivClass: any;
    websiteErrorMessage: string;
    leadStreetError: boolean = true;
    leadCityError: boolean = true;
    leadStateError: boolean = true;
    leadPostalCodeError: boolean = true;
    countryError: boolean = true;
    opportunityAmountError: boolean;
    estimatedCloseDateError: boolean;
    companyError: boolean = true;
    firstNameError: boolean = true;
    lastNameError: boolean = true;
    titleError: boolean = true;
    roleError: boolean = true;
    dealTypeError: boolean;
    submitButtonText: string = "";
    ngxloading: boolean;
    loggenInUserId: any;
    forms: DealForms[] = [];
    questions: DealQuestions[] = [];
    form: DealForms;
    answers: DealAnswer[] = [];
    dealTypes: DealType[] = [];
    defaultDealTypes = ['Select Dealtype', 'New Customer', 'New Product', 'Upgrade', 'Services'];
    formId: number;
    propertiesQuestions: Array<DealDynamicProperties> = new Array<DealDynamicProperties>();


    @ViewChild(SfDealComponent)
    sfDealComponent: SfDealComponent;
    showSfDealFields: boolean = false;

    // isMarketoLead=false;
    // showMarketoForm: boolean;
    // clientId: string;
    // secretId: string;
    // marketoInstance: string;
    // clientIdClass: string;
    // secretIdClass: string;
    // marketoInstanceClass: string;
    // loading: boolean;
    // templateError: boolean;
    // clentIdError: boolean;
    // secretIdError: boolean;
    // marketoInstanceError: boolean;
    // isModelFormValid: boolean;
    // templateSuccessMsg: any;
    // pushToMarketo = false;
    marketo = false;
    propertiesComments: Array<DealDynamicProperties> = new Array<DealDynamicProperties>();
    ownCampaignLeadAndDeal = false;
    constructor(private logger: XtremandLogger, public authenticationService: AuthenticationService, public referenceService: ReferenceService
        , public dealRegistrationService: DealRegistrationService, public countryNames: CountryNames, public utilService: UtilService
        , public callActionSwitch: CallActionSwitch,
        public userService: UserService

    ) {
        this.dealRegistration = new DealRegistration();

    }

    ngOnInit() {
        this.utilService.getJSONLocation().subscribe(response => console.log(response))

        flatpickr('.flatpickr', {
            enableTime: false,
            dateFormat: 'Y-m-d',
            minDate: new Date()
        });
        // $(".phone-input input").height( "32px")
        $(".flagInput").click(function () {
            let count = 0
            $(".flagInput .dropdown-content").each(function () {
                count++;
            });
            if (count != 0) {
                $("int-phone-prefix input").prop({ disabled: true });
            } else {
                $("int-phone-prefix input").prop({ disabled: false });
            }
        })
        this.loggenInUserId = this.authenticationService.user.id;

        if (this.dealId == -1) {

            this.userService.listForm(this.campaign.userId).subscribe(questions => {
                this.questions = questions;
            },
                error => console.log(error),
                () => {
                    this.dealRegistrationService.listDealTypes(this.campaign.userId).subscribe(dealTypes => {

                        this.dealTypes = dealTypes.data;

                        this.getLeadData();
                    },
                        error => console.log(error),
                        () => { });
                });

        }
        else {
            this.userService.listForm(this.campaign.userId).subscribe(questions => {
                this.questions = questions;
            },
                error => console.log(error),
                () => {
                    this.dealRegistrationService.listDealTypes(this.campaign.userId).subscribe(dealTypes => {
                        this.dealTypes = dealTypes.data;
                        this.getLeadData();

                    },
                        error => console.log(error),
                        () => { });
                })


        }
        if(this.isPreview){
            this.ownCampaignLeadAndDeal = false;
        }else{
            this.ownCampaignLeadAndDeal = this.campaign['ownCampaignLeadAndDeal'];
            if(this.ownCampaignLeadAndDeal){
                if(this.selectedTab==1){
                    this.isVendor = false;
                }else{
                    this.ownCampaignLeadAndDeal = false;
                }
            }
        }
    }


    getLeadData() {
        if (this.dealId == -1) {
            this.dealRegistrationService.getLeadData(this.lead)
                .subscribe(
                    data => {
                        this.setDefaultLeadData(data);

                    },
                    (error: any) => {
                        this.isServerError = true;
                    }
                );
        } else {
            this.dealRegistrationService.getDealById(this.dealId, this.loggenInUserId).
                subscribe(data => {
                    console.log(data.data)

                    this.setLeadData(data.data);

                },
                    (error: any) => {
                        this.isServerError = true;
                    })
        }
    }

    setLeadData(data: any) {
        this.dealRegistration.id = data.id;
        this.dealRegistration.firstName = data.firstName;
        this.dealRegistration.lastName = data.lastName;
        this.dealRegistration.leadCountry = data.country;
        this.dealRegistration.leadStreet = data.leadStreet;
        this.dealRegistration.phone = data.phone;
        this.dealRegistration.leadState = data.leadState;
        this.dealRegistration.postalCode = data.postalCode;
        this.dealRegistration.company = data.company;
        this.dealRegistration.leadCity = data.leadCity;
        this.dealRegistration.email = data.email;
        this.dealRegistration.website = data.website;
        this.dealRegistration.dealType = data.dealType;
        this.dealRegistration.title = data.title;
        this.dealRegistration.role = data.role;
        this.dealRegistration.isDeal = data.deal;
        this.dealRegistration.role = data.role;

        // if(data.pushToMarketo)
        //     this.dealRegistration.pushToMarketo = data.pushToMarketo;
        // else
        //     this.dealRegistration.pushToMarketo =false;

        //this.pushToMarketo = this.dealRegistration.pushToMarketo;
        if (this.dealRegistration.isDeal)
            this.submitButtonText = "UPDATE DEAL";
        else
            this.submitButtonText = "REGISTER DEAL";
        let date: any;
        if (data.estimatedClosedDate != null && data.deal)
            date = this.getFormatedDate(new Date(data.estimatedClosedDate));
        else
            date = this.getFormatedDate(new Date());
        this.dealRegistration.estimatedCloseDate = date

        /*if (!this.defaultDealTypes.includes(this.dealRegistration.dealType) && !this.dealTypes.includes(this.dealRegistration.dealType)) {
            let d = new DealType();
            d.dealType = this.dealRegistration.dealType;
            this.dealTypes.push(d);

        }*//*******Commented this line because dropdown is having duplicate data */

        this.dealRegistration.properties = data.properties;
        this.properties = data.properties;
        let i = 1;

        if (this.isVendor == 'manage-leads') {
            this.dealRegistration.properties.forEach(property => {
                property.isDisabled = true;
            })
            this.properties.forEach(property => {
                property.isDisabled = true;
            })
        }
        if(data.opportunityAmount!=null){
            this.dealRegistration.opportunityAmount = data.opportunityAmount;
        }else{
            this.dealRegistration.opportunityAmount = 0.00;
        }
        
        let countryIndex = this.countryNames.countries.indexOf(data.leadCountry);
        if (countryIndex > -1) {
            this.dealRegistration.leadCountry = this.countryNames.countries[countryIndex];
        } else {
            this.dealRegistration.leadCountry = this.countryNames.countries[0];
        }

        if (data.deal) {
            this.propertiesQuestions = this.properties.filter(p => p.propType == 'QUESTION')
            this.propertiesComments = this.properties.filter(p => p.propType == 'PROPERTY')
            this.propertiesComments.forEach(property => {
                property.divId = "property-" + i++;
                property.isSaved = true;
            })
            console.log(this.propertiesQuestions)

        } else if (this.questions.length > 0) {

            this.questions.forEach(q => {
                let property = new DealDynamicProperties();
                property.id = q.id;
                property.key = q.question;
                property.propType = 'QUESTION';
                this.propertiesQuestions.push(property);
                if (property.value == null || property.value.length == 0) {
                    property.error = true;
                    property.class = this.errorClass;
                }

            });
            console.log(this.propertiesQuestions)
        }

        this.setDealTypeError();
        this.setFieldErrorStates();


    }
    mapAnswers(answers: DealAnswer[]) {
        this.formId = answers[0].formId;
        this.dealRegistrationService.getFormById(this.campaign.userId, this.formId).subscribe(form => {
            this.form = form;
            console.log(this.form)
            console.log(answers)
            this.properties.forEach(property => {
                this.validateQuestion(property);
                this.validateComment(property);
            })
            answers.forEach(answer => {
                this.form.campaignDealQuestionDTOs.forEach(q => {
                    if (q.id == answer.questionId) {
                        q.answer = answer.answer;
                        q.answerId = answer.id;
                        if (q.answer.length > 0) {
                            q.class = this.successClass;
                            q.error = false;
                        } else {
                            q.class = this.errorClass;
                            q.error = true;
                        }
                    }
                })
            })



        },
            error => console.log(error),
            () => { })

    }
    setDefaultLeadData(data: any) {
        this.dealRegistration.firstName = data.firstName;
        this.dealRegistration.lastName = data.lastName;
        this.dealRegistration.leadCountry = data.country;
        this.dealRegistration.leadStreet = data.address;
        this.dealRegistration.phone = data.mobileNumber;
        this.dealRegistration.leadState = data.state;
        this.dealRegistration.postalCode = data.zipCode;
        this.dealRegistration.company = data.contactCompany;
        this.dealRegistration.leadCity = data.city;
        this.dealRegistration.email = this.lead.emailId;
        // this.dealRegistration.pushToMarketo = false;
        //this.pushToMarketo = this.dealRegistration.pushToMarketo;
        var date = new Date();
        this.dealRegistration.estimatedCloseDate = this.getFormatedDate(date);
        let countryIndex = this.countryNames.countries.indexOf(data.country);
        if (countryIndex > -1) {
            this.dealRegistration.leadCountry = this.countryNames.countries[countryIndex];
        } else {
            this.dealRegistration.leadCountry = this.countryNames.countries[0];
        }
        if (this.questions.length > 0) {
            this.questions.forEach(q => {
                let property = new DealDynamicProperties();
                property.key = q.question;
                property.propType = 'QUESTION';
                this.dealRegistration.properties.push(property);
                console.log(this.dealRegistration.properties)
                if (q.answer == null || q.answer.length == 0) {
                    q.error = true;
                    q.class = this.errorClass;
                }

            });
        }
        this.setDealTypeError();
        this.setFieldErrorStates()

    }

    setFieldErrorStates() {

        if (this.dealRegistration.firstName != null && this.dealRegistration.firstName.length > 0)
            this.firstNameError = false;
        else
            this.firstNameError = true;
        if (this.dealRegistration.leadStreet != null && this.dealRegistration.leadStreet.length > 0)
            this.leadStreetError = false
        else
            this.leadStreetError = true;
        if (this.dealRegistration.leadCity != null && this.dealRegistration.leadCity.length > 0)
            this.leadCityError = false
        else
            this.leadCityError = true;
        if (this.dealRegistration.lastName != null && this.dealRegistration.lastName.length > 0)
            this.lastNameError = false
        else
            this.lastNameError = true;
        if (this.dealRegistration.leadCountry != null && this.dealRegistration.leadCountry.length > 0
            && this.dealRegistration.leadCountry != "Select Country")
            this.countryError = false
        else
            this.countryError = true;
        if (this.dealRegistration.leadState != null && this.dealRegistration.leadState.length > 0)
            this.leadStateError = false
        else
            this.leadStateError = true;
        if (this.dealRegistration.postalCode != null && this.dealRegistration.postalCode.length > 0)
            this.leadPostalCodeError = false
        else
            this.leadPostalCodeError = true;
        if (this.dealRegistration.company != null && this.dealRegistration.company.length > 0)
            this.companyError = false
        else
            this.companyError = true;
        if (this.dealRegistration.role != null && this.dealRegistration.role.length > 0)
            this.roleError = false
        else
            this.roleError = true;
        if (this.dealRegistration.estimatedCloseDate != null && this.dealRegistration.estimatedCloseDate.length > 0)
            this.estimatedCloseDateError = false
        else
            this.estimatedCloseDateError = true;
        if (this.dealRegistration.title != null && this.dealRegistration.title.length > 0)
            this.titleError = false
        else
            this.titleError = true;
        if (this.dealRegistration.opportunityAmount != null
            && parseFloat(this.dealRegistration.opportunityAmount) > 0)
            this.opportunityAmountError = false
        else
            this.opportunityAmountError = true;


        this.validateWebSite(0);
        this.validatePhone(0);
        this.propertiesQuestions.forEach(property => {
            this.validateQuestion(property);

        })
        this.propertiesComments.forEach(property => {

            this.validateComment(property);
        })

        this.submitButtonStatus();

    }
    setDealTypeError() {
        if (this.dealRegistration.dealType != null && this.dealRegistration.dealType.length > 0
            && this.dealRegistration.dealType != 'Select Dealtype')
            this.dealTypeError = false
        else
            this.dealTypeError = true;

    }

    opportunityAmountUpdate(event: string) {
        this.dealRegistration.opportunityAmount = event.replace('$', '').replace(',', '');
        console.log(this.dealRegistration.opportunityAmount);
    }
    addProperties() {
        this.property = new DealDynamicProperties();
        let length = this.propertiesComments.length;
        length = length + 1;
        var id = 'property-' + length;
        this.property.divId = id;
        this.property.propType = 'PROPERTY';
        this.property.isSaved = false;
        this.property.error = true;
        this.propertiesComments.push(this.property);

        this.submitButtonStatus()

    }
    remove(i, id) {
        if (id)
            console.log(id)
        var index = 1;

        this.propertiesComments = this.propertiesComments.filter(property => property.divId !== 'property-' + i)
            .map(property => {
                property.divId = 'property-' + index++;
                return property;
            });
        this.submitButtonStatus()


    }

    save() {
        this.ngxloading = true;
        this.isLoading = true;
        this.dealRegistration.campaignId = this.lead.campaignId;
        this.dealRegistration.createdBy = this.authenticationService.getUserId();
        this.dealRegistration.leadId = this.lead.userId;
        this.dealRegistration.estimatedClosedDateString = this.dealRegistration.estimatedCloseDate;
        var obj = [];
        let answers: DealAnswer[] = [];

        if (this.showSfDealFields) {
            this.setSfFormFieldValues();
        }

        if (this.dealRegistration.isDeal) {
            this.propertiesQuestions.forEach(property => {
                var question = {
                    id: property.id,
                    key: property.key,
                    value: property.value,
                    propType: 'QUESTION'
                }
                obj.push(question)
            })
            this.propertiesComments.forEach(property => {
                var question = {
                    id: property.id,
                    key: property.key,
                    value: property.value,
                    propType: 'PROPERTY'
                }
                obj.push(question)
            })
        } else {
            this.propertiesQuestions.forEach(property => {
                var question = {
                    key: property.key,
                    value: property.value,
                    propType: 'QUESTION'
                }
                obj.push(question)
            })
            this.propertiesComments.forEach(property => {
                var question = {
                    key: property.key,
                    value: property.value,
                    propType: 'PROPERTY'
                }
                obj.push(question)
            })
        }

        this.dealRegistration.answers = answers;
        this.dealRegistration.properties = obj;
        //console.log(this.pushToMarketo)
        // if(!this.dealRegistration.pushToMarketo)
        //       this.dealRegistration.pushToMarketo = this.pushToMarketo;
        //       console.log( this.dealRegistration)
        if (this.dealRegistration.id != null) {
            this.dealRegistrationService.updateDeal(this.dealRegistration).subscribe(data => {
                if (this.dealRegistration.isDeal) {
                    // this.customResponse = new CustomResponse('SUCCESS', data.message, true);
                    this.dealReg.emit(2);
                } else {
                    //this.customResponse = new CustomResponse('SUCCESS', "Deal Registered Successfully", true);
                    this.dealReg.emit(1);
                    this.dealRegistration.isDeal = true;
                }

                this.isLoading = false;
                this.referenceService.goToTop();
                this.submitButtonText = "Update Deal";
                this.dealRegistration.properties.forEach(p => p.isSaved = true);
            }, error => {
                    this.ngxloading = false;
                    this.logger.errorPage(error)
                })
        } else {
            this.dealRegistrationService.saveDeal(this.dealRegistration).subscribe(data => {
                this.customResponse = new CustomResponse('SUCCESS', data.message, true);
                this.isLoading = false;
                if (data.data != undefined) {
                    this.dealRegistration.id = data.data;
                    this.referenceService.dealId = this.dealRegistration.id;
                    this.dealRegistration.properties.forEach(p => p.isSaved = true);
                    this.submitButtonText = "Update Deal";
                }
                this.referenceService.goToTop();
            }, error => {
                    this.ngxloading = false;
                    this.logger.errorPage(error)
                })
        }
    }
    validateEmail(emailId: string) {

        var regex = /^[A-Za-z0-9]+(\.[_A-Za-z0-9]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$/;
        if (regex.test(emailId)) {
            this.isValidEmail = true;

        } else {
            this.isValidEmail = false;

        }
    }

    validateQuestion(property: DealDynamicProperties) {

        if (property.key.length > 0) {
            property.validationStausKey = this.successClass;
            property.error = false;
        } else {
            property.validationStausKey = this.errorClass;
            property.error = true;
        }

        this.submitButtonStatus()
    }

    validateComment(property: DealDynamicProperties) {

        if (property.key.length > 0 && property.value.length > 0) {
            property.validationStausKey = this.successClass;
            property.error = false;
        } else {
            property.validationStausKey = this.errorClass;
            property.error = true;
        }
        this.submitButtonStatus()


    }


    validateField(fieldId: any, isFormElement: boolean) {
        var errorClass = "form-group has-error has-feedback";
        var successClass = "form-group has-success has-feedback";




        if (isFormElement && fieldId.key != null && fieldId.key != undefined) {

            let fieldValue = $.trim($('#question_' + fieldId.id).val());
            if (fieldValue.length > 0) {
                fieldId.class = successClass;
                fieldId.error = false;
            } else {
                fieldId.class = errorClass;
                fieldId.error = true;
            }
        } else {
            let fieldValue = $.trim($('#' + fieldId).val());
            if (fieldId == "website") {
                this.marketo = true;
                this.validateWebSite(1)

            }
            if (fieldId == "leadStreet") {
                if (fieldValue.length > 0) {
                    this.leadStreet = successClass;
                    this.leadStreetError = false;
                } else {
                    this.leadStreet = errorClass;
                    this.leadStreetError = true;
                }

            } if (fieldId == "leadCity") {
                if (fieldValue.length > 0) {
                    this.leadCity = successClass;
                    this.leadCityError = false;
                } else {
                    this.leadCity = errorClass;
                    this.leadCityError = true;
                }

            } if (fieldId == "leadState") {
                if (fieldValue.length > 0) {
                    this.leadState = successClass;
                    this.leadStateError = false;
                } else {
                    this.leadState = errorClass;
                    this.leadStateError = true;
                }

            } if (fieldId == "leadPostalCode") {
                if (fieldValue.length > 0 && parseInt(fieldValue)) {
                    this.leadPostalCode = successClass;
                    this.leadPostalCodeError = false
                } else {
                    this.leadPostalCode = errorClass;
                    this.leadPostalCodeError = true
                }

            } if (fieldId == "leadCountry") {

                if (fieldValue.length > 0 && fieldValue != "Select Country") {
                    this.country = successClass;
                    this.countryError = false;
                } else {
                    this.country = errorClass;
                    this.countryError = true;
                }

            } if (fieldId == "opportunityAmount") {
                fieldValue = fieldValue.replace('$', '').replace(',', '');

                if (fieldValue.length > 0 && parseFloat(fieldValue) > 0) {
                    this.opportunityAmount = successClass;
                    this.opportunityAmountError = false;
                } else {
                    this.opportunityAmount = errorClass;
                    this.opportunityAmountError = true;
                }

            }
            if (fieldId == "estimatedCloseDate") {
                if (fieldValue.length > 0) {
                    this.estimatedCloseDate = successClass;
                    this.estimatedCloseDateError = false;
                } else {
                    this.estimatedCloseDate = errorClass;
                    this.estimatedCloseDateError = true;
                }

            }
            if (fieldId == "company") {
                if (fieldValue.length > 0) {
                    this.company = successClass;
                    this.companyError = false;
                } else {
                    this.company = errorClass;
                    this.companyError = true;
                }

            }
            if (fieldId == "firstName") {
                if (fieldValue.length > 0) {
                    this.firstName = successClass;
                    this.firstNameError = false;
                } else {
                    this.firstName = errorClass;
                    this.firstNameError = true;
                }

            }
            if (fieldId == "lastName") {
                if (fieldValue.length > 0) {
                    this.lastName = successClass;
                    this.lastNameError = false;
                } else {
                    this.lastName = errorClass;
                    this.lastNameError = true;
                }

            }
            if (fieldId == "title") {
                if (fieldValue.length > 0) {
                    this.title = successClass;
                    this.titleError = false;
                } else {
                    this.title = errorClass;
                    this.titleError = true;
                }

            }
            if (fieldId == "role") {
                if (fieldValue.length > 0) {
                    this.role = successClass;
                    this.roleError = false;
                } else {
                    this.role = errorClass;
                    this.roleError = true;
                }

            }

            if (fieldId == "phone") {
                this.validatePhone(1);
            }
            if (fieldId == "dealType") {

                if (fieldValue.length > 0 && fieldValue != "Select Dealtype") {
                    this.dealType = successClass;
                    this.dealTypeError = false;
                } else {
                    this.dealType = errorClass;
                    this.dealTypeError = true;
                }

            }

        }

        this.submitButtonStatus();
    }
    submitButtonStatus() {
        if (this.showSfDealFields) {
            this.opportunityAmountError = false;
            this.titleError = false;
            this.estimatedCloseDateError = false;
            this.dealTypeError = false;
            this.properties.length = 0;
            this.propertiesQuestions.length = 0;
        }

        if (!this.websiteError && !this.leadStreetError && !this.leadCityError
            && !this.leadStateError && !this.leadPostalCodeError && !this.countryError
            && !this.opportunityAmountError && !this.estimatedCloseDateError
            && !this.companyError && !this.firstNameError && !this.lastNameError
            && !this.titleError && !this.roleError && !this.dealTypeError && !this.phoneError) {
            let qCount = 0;
            let cCount = 0;
            this.propertiesQuestions.forEach(propery => {
                if (propery.error) {
                    this.isDealRegistrationFormValid = false;
                    qCount++;
                }
            })
            this.propertiesComments.forEach(propery => {
                if (propery.error) {
                    this.isDealRegistrationFormValid = false;
                    cCount++;
                }
            })
            if (qCount == 0 && cCount == 0)
                this.isDealRegistrationFormValid = true;
            else
                this.isDealRegistrationFormValid = false;
        } else {

            this.isDealRegistrationFormValid = false;
        }

    }
    addPhoneError(x) {
        this.phoneError = true;
        if (x != 0) {
            this.phoneErrorMessage = "Phone number is mandatory";

            this.phoneDivClass = this.errorClass;
        }
        this.phone = this.errorClass;

    }
    removePhoneError() {
        this.phoneError = false;
        this.phoneDivClass = this.successClass;
        this.phoneErrorMessage = "";
        this.phone = this.successClass;

    }

    addWebSiteError(x) {
        this.websiteError = true;
        if (x != 0)
            this.websiteDivClass = this.errorClass;
        this.website = this.errorClass;

    }
    removeWebSiteError() {
        this.websiteError = false;
        this.websiteDivClass = this.successClass;
        this.websiteErrorMessage = "";
        this.website = this.successClass;
    }


    validatePhone(x) {
        if (this.dealRegistration.phone) {

            if (!this.PHONE_NUMBER_PATTERN.test(this.dealRegistration.phone) || this.dealRegistration.phone.length < 8) {
                this.addPhoneError(x);
                this.phoneErrorMessage = "Invalid Contact Number"
            } else {
                this.phone = this.successClass;
                this.removePhoneError();
            }
        } else {
            this.addPhoneError(x);
        }
    }

    validateWebSite(x) {
        if (this.dealRegistration.website != null && $.trim(this.dealRegistration.website).length > 0) {
            if (!this.URL_PATTERN.test(this.dealRegistration.website)) {
                this.addWebSiteError(x);
                this.websiteErrorMessage = "Please enter a valid URL.";
            } else {
                this.removeWebSiteError();
            }
        } else {
            this.websiteError = true;
            if (x != 0)
                this.websiteErrorMessage = 'Please add your lead\'s URL.';
        }
    }

    validateForm(form: any) {
        console.log(form);
    }

    isEven(n) {
        if (n % 2 === 0) { return true; }
        return false;
    }

    getFormatedDate(date: Date) {
        //return string
        var returnDate = "";

        var dd = date.getDate();
        var mm = date.getMonth() + 1; //because January is 0!
        var yyyy = date.getFullYear();

        returnDate += `${yyyy}-`;
        if (mm < 10) {
            returnDate += `0${mm}-`;
        } else {
            returnDate += `${mm}-`;
        }
        //Interpolation date
        if (dd < 10) {
            returnDate += `0${dd}`;
        } else {
            returnDate += `${dd}`;
        }

        return returnDate;
    }
    commentsection(property: DealDynamicProperties) {
        property.isCommentSection = !property.isCommentSection;
    }

    deleteComment(i: number, question: DealDynamicProperties) {
        try {
            this.logger.info("Comment in sweetAlert() " + question.id);
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
                console.log("deleteComment showAlert then()" + question);
                self.dealRegistrationService.deleteProperty(question).subscribe(response => {
                    self.remove(i, question.id)

                }, error => this.logger.error(error, "DealRegistrationComponent", "deleteComment()"))
            }, function (dismiss: any) {
                console.log('you clicked on option' + dismiss);
            });
        } catch (error) {
            this.logger.error(error, "DealRegistrationComponent", "deleteCommentAlert()");
        }
    }
    showAlert(i: number, question: DealDynamicProperties) {
        if (question.isSaved) {
            this.deleteComment(i, question);

        } else {
            this.remove(i, question.id);
        }
    }
    setFormValidateErrMsg() {
    }

    clearFormValidateErrMsg() {
    }

    formatMobileNumber(mobile: string) {
        var value = mobile.toString().trim().replace(/^/, '');



        var country, city, number;

        switch (value.length) {
            case 10: // +1PPP####### -> C (PPP) ###-####
                country = 1;
                city = value.slice(0, 3);
                number = value.slice(3);
                break;

            case 11: // +CPPP####### -> CCC (PP) ###-####
                country = value[0];
                city = value.slice(1, 4);
                number = value.slice(4);
                break;

            case 12: // +CCCPP####### -> CCC (PP) ###-####
                country = value.slice(0, 3);
                city = value.slice(3, 5);
                number = value.slice(5);
                break;
            case 13: // +CCCPP####### -> CCC (PP) ###-####
                country = value.slice(0, 3);
                city = value.slice(3, 5);
                number = value.slice(5);
                break;

            default:
                return mobile;
        }

        if (country == 1) {
            country = "";
        }

        number = number.slice(0, 3) + '-' + number.slice(3);

        return (country + " -" + city + "- " + number).trim();
    }

    setSfFormFieldValues() {
        if (this.sfDealComponent.form !== undefined || this.sfDealComponent.form !== null) {
            let formLabelDTOs = this.sfDealComponent.form.formLabelDTOs;
            if (formLabelDTOs.length !== 0) {
                let sfCustomFields = formLabelDTOs.filter(fLabel => fLabel.sfCustomField === true);
                let sfDefaultFields = formLabelDTOs.filter(fLabel => fLabel.sfCustomField === false);

                for (let formLabel of sfDefaultFields) {
                    if (formLabel.labelId === "Name") {
                        this.dealRegistration.title = formLabel.value;
                    } else if (formLabel.labelId === "Description") {
                        this.dealRegistration.description = formLabel.value;
                    } else if (formLabel.labelId === "Type") {
                        this.dealRegistration.dealType = formLabel.value;
                    } else if (formLabel.labelId === "LeadSource") {
                        this.dealRegistration.leadSource = formLabel.value;
                    } else if (formLabel.labelId === "Amount") {
                        this.dealRegistration.opportunityAmount = formLabel.value;
                    } else if (formLabel.labelId === "CloseDate") {
                        this.dealRegistration.estimatedClosedDateString = formLabel.value;
                    } else if (formLabel.labelId === "NextStep") {
                        this.dealRegistration.nextStep = formLabel.value;
                    } else if (formLabel.labelId === "StageName") {
                        this.dealRegistration.stage = formLabel.value;
                    } else if (formLabel.labelId === "Probability") {
                        this.dealRegistration.probability = formLabel.value;
                    } else if (formLabel.labelId === "OrderNumber__c") {
                        this.dealRegistration.orderNumber = formLabel.value;
                    } else if (formLabel.labelId === "MainCompetitors__c") {
                        this.dealRegistration.mainCompetitor = formLabel.value;
                    } else if (formLabel.labelId === "CurrentGenerators__c") {
                        this.dealRegistration.currentGenerator = formLabel.value;
                    } else if (formLabel.labelId === "TrackingNumber__c") {
                        this.dealRegistration.trackingNumber = formLabel.value;
                    } else if (formLabel.labelId === "DeliveryInstallationStatus__c") {
                        this.dealRegistration.deliveryInstallationStatus = formLabel.value;
                    }
                }

                let sfCfDataList = [];
                for (let formLabel of sfCustomFields) {
                    let sfCfData = new SfCustomFieldsDataDTO();
                    sfCfData.sfCfLabelId = formLabel.labelId;
                    sfCfData.value = formLabel.value;
                    sfCfDataList.push(sfCfData);
                }
                this.dealRegistration.sfCustomFieldsDataDto = sfCfDataList;
            }
        }
    }

    ngAfterViewInit() {
        this.dealRegistrationService.isSfEnabledForParentCampaign(this.dealId).subscribe(result => {
            this.showSfDealFields = result;
            if(JSON.stringify(this.showSfDealFields) === '{}'){
                this.showSfDealFields = false;
            }
        },
            error => {
                console.log(error);
            });
    }

}

