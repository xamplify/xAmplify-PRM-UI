import { Component, OnInit, Input } from '@angular/core';
import { DealRegistration } from '../models/deal-registraton';
import { DealDynamicProperties } from '../models/deal-dynamic-properties';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Campaign } from '../../campaigns/models/campaign';
import { DealRegistrationService } from '../services/deal-registration.service';
import { CountryNames } from '../../common/models/country-names';
import { RegularExpressions } from '../../common/models/regular-expressions';
import { CustomResponse } from '../../common/models/custom-response';
import { DateFormatter, DatepickerConfig } from 'ngx-bootstrap';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { UserService } from '../../core/services/user.service';
import { DealForms } from '../models/deal-forms';
import { DealAnswer } from '../models/deal-answers';
import { User } from '../../core/models/user';
import { CallActionSwitch } from '../../videos/models/call-action-switch';
import { EmailTemplateService } from '../../email-template/services/email-template.service';
declare var flatpickr: any, $: any;



@Component({
    selector: 'app-add-leads',
    templateUrl: './add-leads.component.html',
    styleUrls: ['./add-leads.component.css'],
    providers: [CountryNames,CallActionSwitch]
})
export class AddLeadsComponent implements OnInit
{


    @Input() campaign: Campaign;
    @Input() lead: any;
    @Input() dealId: any;
    @Input() parent: any;

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
    lastName: string;
    firstName: string;
    PHONE_NUMBER_PATTERN: RegExp = /^[0-9-+]+$/;
    URL_PATTERN = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/;
    isLoadingLead = false;

    customResponse: CustomResponse = new CustomResponse("","",false);

    phoneDivClass: string = "form-group";
    phoneError = false;
    phoneErrorMessage = "";
    websiteError: boolean;
    websiteDivClass: any;
    websiteErrorMessage: string;
    leadStreetError: boolean;
    leadCityError: boolean;
    leadStateError: boolean;
    leadPostalCodeError: boolean;
    countryError: boolean;
    opportunityAmountError: boolean;
    estimatedCloseDateError: boolean;
    companyError: boolean;
    firstNameError: boolean;
    lastNameError: boolean;
    titleError: boolean;
    dealTypeError: boolean;
    submitButtonText: string = "";
    ngxloadingLead: boolean;
    loggenInUserId: any;
    forms: DealForms[] = [];
    form: DealForms;
    answers: DealAnswer[] = [];
    leadUser: User;
    formId: number;

    constructor(private logger: XtremandLogger, public authenticationService: AuthenticationService, public referenceService: ReferenceService
        , public dealRegistrationService: DealRegistrationService, public countryNames: CountryNames,public callActionSwitch: CallActionSwitch
        ,private emailTemplateService:EmailTemplateService
    )
    {
        this.dealRegistration = new DealRegistration();


    }

    ngOnInit()
    {

        flatpickr('.flatpickr', {
            enableTime: false,
            dateFormat: 'Y-m-d',
            minDate: new Date()
        });
        $(".flagInput").click(function(){
          let count = 0
            $(".flagInput .dropdown-content").each(function() {
                count++;
            });
            if(count != 0){
              $("int-phone-prefix input").prop({disabled: true});
            }else{
              $("int-phone-prefix input").prop({disabled: false});
            }
        })


        this.loggenInUserId = this.authenticationService.user.id;
        if (this.dealId == -1)
        {
            this.dealRegistrationService.getDealCreatedBy(this.lead.userId).subscribe(data =>
            {
                this.leadUser = data;
                this.submitButtonText = "SAVE";


                this.getLeadData();
            },
            error => console.log(error),
            () => { })
        }
        else
        {
            this.getLeadData();
            this.submitButtonText = "UPDATE";
        }





    }


    getLeadData()
    {
        if (this.dealId == -1)
        {
            console.log(this.lead)
            this.dealRegistrationService.getLeadData(this.lead)
                .subscribe(
                    data =>
                    {
                        console.log(data)
                        this.setDefaultLeadData(data);

                    },
                    (error: any) =>
                    {
                        this.setDefaultLeadData(this.lead);
                        this.isServerError = true;
                    }
                );
        } else
        {
            this.dealRegistrationService.getDealById(this.dealId,this.loggenInUserId).
                subscribe(data =>
                {

                    this.setLeadData(data.data);

                },
                    (error: any) =>
                    {
                        this.isServerError = true;
                    })
        }
    }

    setLeadData(data: any)
    {
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
        // if(data.pushToMarketo)
        //     this.dealRegistration.pushToMarketo = data.pushToMarketo;
        // else
        //     this.dealRegistration.pushToMarketo =false;


        let countryIndex = this.countryNames.countries.indexOf(data.leadCountry);
        if (countryIndex > -1)
        {
            this.dealRegistration.leadCountry = this.countryNames.countries[countryIndex];
        } else
        {
            this.dealRegistration.leadCountry = this.countryNames.countries[0];
        }


        this.setFieldErrorStates();


    }

    setDefaultLeadData(data: any)
    {
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
        //this.dealRegistration.pushToMarketo = false;

        this.setFieldErrorStates()

    }

    setFieldErrorStates()
    {

        if (this.dealRegistration.firstName != null && this.dealRegistration.firstName.length > 0)
            this.firstNameError = false;
        else
            this.firstNameError = true;
        if (this.dealRegistration.leadStreet != null && this.dealRegistration.leadStreet.length > 0)
            this.leadStreetError = false
        else
            this.leadStreetError = true;
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

        this.validateWebSite(0);
        //this.validatePhone(0);


        this.submitButtonStatus();

    }



    save()
    {
        this.ngxloadingLead = true;
        this.isLoadingLead = true;
        this.dealRegistration.campaignId = this.lead.campaignId;
        this.dealRegistration.createdBy = this.authenticationService.getUserId();
        this.dealRegistration.leadId = this.lead.userId;
        if(this.dealRegistration.leadCountry == "Select Country")
        this.dealRegistration.leadCountry = "";
        var obj = [];
        let answers: DealAnswer[] = [];


        this.dealRegistration.answers = answers;
        this.dealRegistration.properties = obj;
         console.log(this.dealRegistration);


        if (this.dealRegistration.id != null)
        {
            this.dealRegistrationService.updateLead(this.dealRegistration).subscribe(data =>
            {
                this.customResponse = new CustomResponse('SUCCESS', "Lead updated successfully", true);
                this.isLoadingLead = false;
                this.referenceService.goToTop();

            }, error =>
                {
                    this.ngxloadingLead = false;
                    this.logger.errorPage(error)
                })
        } else
        {
            this.dealRegistrationService.saveDeal(this.dealRegistration).subscribe(data =>
            {
                this.customResponse = new CustomResponse('SUCCESS', "Lead added successfully", true);
                this.isLoadingLead = false;
                if (data.data != undefined)
                {
                    this.dealRegistration.id = data.data;
                    this.referenceService.dealId = this.dealRegistration.id;
                    this.submitButtonText = "Update";
                }
                this.referenceService.goToTop();
            }, error =>
                {
                    this.ngxloadingLead = false;
                    this.logger.errorPage(error)
                })
        }
    }
    validateEmail(emailId: string)
    {

        var regex = /^[A-Za-z0-9]+(\.[_A-Za-z0-9]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$/;
        if (regex.test(emailId))
        {
            this.isValidEmail = true;

        } else
        {
            this.isValidEmail = false;

        }
    }

    validateField(fieldId: any, isFormElement: boolean)
    {
        var errorClass = "form-group has-error has-feedback";
        var successClass = "form-group has-success has-feedback";




        if (isFormElement && fieldId.question != null && fieldId.question != undefined)
        {

            let fieldValue = $.trim($('#question_' + fieldId.id).val());
            if (fieldValue.length > 0)
            {
                fieldId.class = successClass;
                fieldId.error = false;
            } else
            {
                fieldId.class = errorClass;
                fieldId.error = true;
            }
        } else
        {
            let fieldValue = $.trim($('#' + fieldId).val());
            if (fieldId == "website")
            {
                this.validateWebSite(1)

            }
            if (fieldId == "leadStreet")
            {
                if (fieldValue.length > 0)
                {
                    this.leadStreet = successClass;
                    this.leadStreetError = false;
                } else
                {
                    this.leadStreet = errorClass;
                    this.leadStreetError = true;
                }

            } if (fieldId == "leadCity")
            {
                if (fieldValue.length > 0)
                {
                    this.leadCity = successClass;
                    this.leadCityError = false;
                } else
                {
                    this.leadCity = errorClass;
                    this.leadCityError = true;
                }

            } if (fieldId == "leadState")
            {
                if (fieldValue.length > 0)
                {
                    this.leadState = successClass;
                    this.leadStateError = false;
                } else
                {
                    this.leadState = errorClass;
                    this.leadStateError = true;
                }

            } if (fieldId == "leadPostalCode")
            {
                if (fieldValue.length > 0 && parseInt(fieldValue))
                {
                    this.leadPostalCode = successClass;
                    this.leadPostalCodeError = false
                } else
                {
                    this.leadPostalCode = errorClass;
                    this.leadPostalCodeError = true
                }

            } if (fieldId == "leadCountry")
            {

                if (fieldValue.length > 0 && fieldValue != "Select Country")
                {
                    this.country = successClass;
                    this.countryError = false;
                } else
                {
                    this.country = errorClass;
                    this.countryError = true;
                }

            }

            if (fieldId == "company")
            {
                if (fieldValue.length > 0)
                {
                    this.company = successClass;
                    this.companyError = false;
                } else
                {
                    this.company = errorClass;
                    this.companyError = true;
                }

            }
            if (fieldId == "firstName")
            {
                if (fieldValue.length > 0)
                {
                    this.firstName = successClass;
                    this.firstNameError = false;
                } else
                {
                    this.firstName = errorClass;
                    this.firstNameError = true;
                }

            }
            if (fieldId == "lastName")
            {
                if (fieldValue.length > 0)
                {
                    this.lastName = successClass;
                    this.lastNameError = false;
                } else
                {
                    this.lastName = errorClass;
                    this.lastNameError = true;
                }

            }


            if (fieldId == "phone")
            {
                this.validatePhone(1);
            }

        }
        this.submitButtonStatus();
    }




    submitButtonStatus()
    {
        // &&  !this.phoneError
        if (!this.companyError && !this.lastNameError)
        {
        this.isDealRegistrationFormValid = true;
        }else{
            this.isDealRegistrationFormValid = false;
        }
    }
    addPhoneError(x)
    {
        this.phoneError = true;
        if (x != 0)
        {
            this.phoneErrorMessage = "Phone number is mandatory";

            this.phoneDivClass = this.errorClass;
        }
        this.phone = this.errorClass;

    }
    removePhoneError()
    {
        this.phoneError = false;
        this.phoneDivClass = this.successClass;
        this.phoneErrorMessage = "";
        this.phone = this.successClass;

    }

    addWebSiteError(x)
    {
        this.websiteError = true;
        if (x != 0)
            this.websiteDivClass = this.errorClass;
        this.website = this.errorClass;

    }
    removeWebSiteError()
    {
        this.websiteError = false;
        this.websiteDivClass = this.successClass;
        this.websiteErrorMessage = "";
        this.website = this.successClass;
    }


    validatePhone(x)
    {
        if (this.dealRegistration.phone)
        {

            if (!this.PHONE_NUMBER_PATTERN.test(this.dealRegistration.phone) || this.dealRegistration.phone.length < 8)
            {
                this.addPhoneError(x);
                this.phoneErrorMessage = "Invalid Contact Number"
            } else
            {
                this.phone = this.successClass;
                this.removePhoneError();
            }
        } else
        {
            this.addPhoneError(x);
        }
    }

    validateWebSite(x)
    {
        if (this.dealRegistration.website != null && $.trim(this.dealRegistration.website).length > 0)
        {
            if (!this.URL_PATTERN.test(this.dealRegistration.website))
            {
                this.addWebSiteError(x);
                this.websiteErrorMessage = "Please enter a valid company�s URL.";
            } else
            {
                this.removeWebSiteError();
            }
        } else
        {
            this.websiteError = true;
            if (x != 0)
                this.websiteErrorMessage = 'Please add your company�s URL.';
        }
    }


    validateForm(form: any)
    {
        console.log(form);
    }

    isEven(n)
    {
        if (n % 2 === 0) { return true; }
        return false;
    }

    getFormatedDate(date: Date)
    {
        //return string
        var returnDate = "";

        var dd = date.getDate();
        var mm = date.getMonth() + 1; //because January is 0!
        var yyyy = date.getFullYear();

        returnDate += `${yyyy}-`;
        if (mm < 10)
        {
            returnDate += `0${mm}-`;
        } else
        {
            returnDate += `${mm}-`;
        }
        //Interpolation date
        if (dd < 10)
        {
            returnDate += `0${dd}`;
        } else
        {
            returnDate += `${dd}`;
        }

        return returnDate;
    }
    commentsection(property: DealDynamicProperties)
    {
        property.isCommentSection = !property.isCommentSection;
    }



}
