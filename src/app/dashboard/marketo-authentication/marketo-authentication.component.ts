import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import { AuthenticationService } from '../../core/services/authentication.service';
import { DashboardService } from '../dashboard.service';
import { CustomResponse } from '../../common/models/custom-response';
declare var $: any;

@Component({
  selector: 'app-marketo-authentication',
  templateUrl: './marketo-authentication.component.html',
  styleUrls: ['./marketo-authentication.component.css']
})
export class MarketoAuthenticationComponent implements OnInit {
  clientId:string;
  secretId:string;
  marketoInstance:string;
  clientIdClass: string;
  secretIdClass: string;
  marketoInstanceClass: string;
  loading: boolean;
  emailTemplateService: any;
  showMarketoForm: boolean;
  templateErrorMarketo: boolean;
  clentIdError: boolean;
  secretIdError: boolean;
  marketoInstanceError: boolean;
  isModelFormValid: boolean;
    marketoButtonClass: string;
    loadingMarketo: boolean;
    responseSuccessMsgMarketo: any;
    customResponse: CustomResponse = new CustomResponse();
    @Output() closeEvent = new EventEmitter<any>();


  constructor(private authenticationService: AuthenticationService,private dashBoardService:DashboardService) { }

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
        // this.loadingMarketo = true;
        this.dashBoardService.checkMarketoCredentials(this.authenticationService.getUserId()).subscribe(response =>
        {
            if (response.statusCode == 8000)
            {
                this.loading = true;
                
               
            }
            else
            {
         
               
           
                this.templateErrorMarketo = false;
                this.loadingMarketo = false;

            }
        }, error =>
            {
                this.templateErrorMarketo = error;
               
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

        this.dashBoardService.saveMarketoCredentials(obj).subscribe(response =>
        {
            if (response.statusCode == 8003)
            {
                this.customResponse = new CustomResponse('SUCCESS', response.message, true);
               
               
                this.loadingMarketo = false;
                
            } else
            {
                this.customResponse = new CustomResponse('ERROR', response.message, true);
               
                this.loadingMarketo = false;
            }
        }, error =>
        {
        this.loadingMarketo = false;
        this.templateErrorMarketo = error;
          
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
       
        if (fieldId == 'client')
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
        } else if (fieldId == 'secret')
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
                this.marketoInstanceError = true;
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
    closeMarketoCredentials()
    {
        console.log("Closed")
        this.closeEvent.emit("0");
    }
}
