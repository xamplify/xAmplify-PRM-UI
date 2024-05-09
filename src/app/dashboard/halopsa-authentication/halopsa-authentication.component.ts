import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-halopsa-authentication',
  templateUrl: './halopsa-authentication.component.html',
  styleUrls: ['./halopsa-authentication.component.css']
})
export class HalopsaAuthenticationComponent implements OnInit {
  clientId:string;
  secretId:string;
  halopsaInstance:string;
  clientIdClass:string;
  clientIdError:boolean;
  secretIdClass:string;
  secretIdError:boolean;
  halopsaInstanceClass:string;
  halopsaInstanceError:boolean;
  isModelFormValid:boolean;
  halopsaButtonClass:string;
  loadingHalopsa:boolean;
  templateErrorHalopsa:boolean;
  customResponse: CustomResponse = new CustomResponse();
  @Input() loggedInUserId: any;
  @Output() closeEvent = new EventEmitter<any>();
  constructor(public referenceService: ReferenceService,private authenticationService: AuthenticationService,
    private dashBoardService:DashboardService) { }

  ngOnInit() {
    this.referenceService.goToTop();
  }
  closeForm() {
    console.log("Closed halopsa Auth")
    this.closeEvent.emit("0");
  }

  submitHalopsaCredentials() {
    this.halopsaInstance = this.halopsaInstance.trim();
    this.clientId = this.clientId.trim();
    this.secretId = this.secretId.trim();
    this.loadingHalopsa = true;
        const obj = {
            userId: this.authenticationService.getUserId(),
            instanceUrl: this.halopsaInstance,
            clientId: this.clientId,
            clientSecret: this.secretId
        }

        this.dashBoardService.saveHalopsaCredentials(obj).subscribe(response =>
        {
            if (response.statusCode == 200)
            {
              this.customResponse = new CustomResponse('SUCCESS', response.message, true);
              this.loadingHalopsa = false;  
              this.closeForm();
            } else
            {
              this.customResponse = new CustomResponse('ERROR', response.message, true);
              this.loadingHalopsa = false;
            }
        }, error =>
        {
        this.loadingHalopsa = false;
        this.templateErrorHalopsa = error;
        }
        )
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
                this.clientIdError = false;
            } else
            {
                this.clientIdClass = errorClass;
                this.clientIdError = true;
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
            if (this.halopsaInstance.length > 0)
            {
              
                this.halopsaInstanceClass = successClass;
                this.halopsaInstanceError = false;
            } else
            {
                this.halopsaInstanceClass = errorClass;
                this.halopsaInstanceError = true;
            }
        }
        this.toggleSubmitButtonState();
    }

    toggleSubmitButtonState()
    {
       
        if (!this.clientIdError && !this.secretIdError && !this.halopsaInstanceError)
            {
            this.isModelFormValid = true;
            this.halopsaButtonClass = "btn btn-primary";
            }
        else
        {
            this.isModelFormValid = false;
            this.halopsaButtonClass = "btn btn-default";
        }
       

    }
}
