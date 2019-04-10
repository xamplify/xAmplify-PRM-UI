import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../core/services/authentication.service';
declare var $: any;

@Component({
  selector: 'app-marketo-authentication',
  templateUrl: './marketo-authentication.component.html',
  styleUrls: ['./marketo-authentication.component.css']
})
export class MarketoAuthenticationComponent implements OnInit {
  clientId: string;
  secretId: string;
  marketoInstance: string;
  clientIdClass: string;
  secretIdClass: string;
  marketoInstanceClass: string;
  loading: boolean;
  emailTemplateService: any;
  showMarketoForm: boolean;
  templateError: boolean;
  clentIdError: boolean;
  secretIdError: boolean;
  marketoInstanceError: boolean;
  isModelFormValid: boolean;
    marketoButtonClass: string;
    loadingMarketo: boolean;
    responseSuccessMsg: any;

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
  }

  
     
    /**
     * 
     * Push Leads to Marketo
     */

  
    clearValues()
    {
        this.clientId = '';
        this.secretId = '';
        this.marketoInstance = '';
        this.clientIdClass = "form-group";
        this.secretIdClass = "form-group";
        this.marketoInstanceClass = "form-group";

    }
    checkMarketoCredentials()
    {
        this.loadingMarketo = true;
        this.emailTemplateService.checkMarketoCredentials(this.authenticationService.getUserId()).subscribe(response =>
        {
            if (response.statusCode == 8000)
            {
                this.loading = true;
                
               
            }
            else
            {
         
               
                $("#templateRetrieve").modal('show');
                $("#closeButton").show();
                this.templateError = false;
                this.loadingMarketo = false;

            }
        }, error =>
            {
                this.templateError = error;
                $("#templateRetrieve").modal('show');
                $("#closeButton").show();
                this.loadingMarketo = false;
            })
    }


    submitMarketoCredentials()
    {
        this.loadingMarketo = true;
        const obj = {
            userId: this.authenticationService.getUserId(),
            instanceUrl: this.marketoInstance,
            clientId: this.clientId,
            clientSecret: this.secretId
        }

        this.emailTemplateService.saveMarketoCredentials(obj).subscribe(response =>
        {
            if (response.statusCode == 8003)
            {
                $("#closeButton").hide();
                this.showMarketoForm = false;
                this.templateError = false;
                this.responseSuccessMsg = response.message;
                this.loadingMarketo = false;
                
                setTimeout(function () { $("#templateRetrieve").modal('hide') }, 3000);
            } else
            {
                $("#templateRetrieve").modal('show');
                $("#closeButton").show();
                this.templateError = response.message;
                this.responseSuccessMsg = false;
                this.loadingMarketo = false;
            }
        }, error =>
        {
        this.templateError = error;
            $("#closeButton").show();
            this.loadingMarketo = false;
        }
        )

    }
    getTemplatesFromMarketo()
    {
        this.clearValues();

        this.checkMarketoCredentials();



    }


    validateModelForm(fieldId: any)
    {
        var errorClass = "form-group has-error has-feedback";
        var successClass = "form-group has-success has-feedback";

        if (fieldId == 'email')
        {
            if (this.clientId.length > 0)
            {
                this.clientIdClass = successClass;
                this.clentIdError = false;
            } else
            {
                this.clientIdClass = errorClass;
                this.clentIdError = true;
            }
        } else if (fieldId == 'pwd')
        {
            if (this.secretId.length > 0)
            {
                this.secretIdClass = successClass;
                this.secretIdError = false;
            } else
            {
                this.secretIdClass = errorClass;
                this.secretIdError = true;
            }
        } else if (fieldId == 'instance')
        {
            if (this.marketoInstance.length > 0)
            {
                this.marketoInstanceClass = successClass;
                this.marketoInstanceError = false;
            } else
            {
                this.marketoInstanceClass = errorClass;
                this.marketoInstanceError = false;
            }
        }
        this.toggleSubmitButtonState();
    }


    saveMarketoTemplatesButtonState()
    {


    }


    toggleSubmitButtonState()
    {
        if (!this.clentIdError && !this.secretIdError && !this.marketoInstanceError)
            {
            this.isModelFormValid = true;
            this.marketoButtonClass = "btn btn-primary";
            }
        else
        {
            this.isModelFormValid = false;
            this.marketoButtonClass = "btn btn-default";
        }

    }
    closeModal()
    {
        $("#templateRetrieve").modal('hide');
    }
}
