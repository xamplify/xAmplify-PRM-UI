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

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
  }

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
      this.loading = true;
      this.emailTemplateService.checkMarketoCredentials(this.authenticationService.getUserId()).subscribe(response =>
      {
          if (response.statusCode == 8000)
          {
              this.showMarketoForm = false;
              //this.getMarketoEmailTemplates();
              this.templateError = false;
              this.loading = false;
          }
          else
          {


              $("#templateRetrieve").modal('show');
              this.templateError = false;
              this.loading = false;

          }
      }, error =>
          {

              this.templateError = error;
              $("#templateRetrieve").modal('show');
              this.loading = false;
          })
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

  validateEmail(emailId: string)
  {

      var regex = /^[A-Za-z0-9]+(\.[_A-Za-z0-9]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$/;
      if (regex.test(emailId))
      {
          return true;

      } else
      {
          return false;

      }
  }
 
  saveMarketoTemplatesButtonState()
  {


  }

 
  toggleSubmitButtonState()
  {
      if (!this.clentIdError && !this.secretIdError && !this.marketoInstanceError)
          this.isModelFormValid = true;
      else
          this.isModelFormValid = false;

  }
  closeModal()
  {
      $("#templateRetrieve").modal('hide');
  }


}
