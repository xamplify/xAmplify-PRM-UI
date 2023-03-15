
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component,EventEmitter,Input,Output, OnInit } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { RegularExpressions } from 'app/common/models/regular-expressions';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { IntegrationService } from 'app/core/services/integration.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-pipedrive-authentication',
  templateUrl: './pipedrive-authentication.component.html',
  styleUrls: ['./pipedrive-authentication.component.css'],
  providers: [RegularExpressions],
})
export class PipedriveAuthenticationComponent implements OnInit {
  @Input() loggedInUserId:any;
  @Output() closeEvent=new EventEmitter<any>();
  //instanceUrl:string;
  apiToken:string;
  
  apiTokenClass:string;
  apiTokenUrlError:boolean;
  customResponse: CustomResponse = new CustomResponse(); 
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();  
  loading: boolean = false;
  redirectUrl: string;
  currentUser: string;
  apilength1:boolean=true;
  constructor(private authenticationService: AuthenticationService, private dashBoardService: DashboardService, 
    public referenceService: ReferenceService, private vanityUrlService: VanityURLService, public regularExpressions: RegularExpressions, 
    private integrationService: IntegrationService) { }

  ngOnInit() {

    this.checkAuthorization();
  }
  changedis(event:any){
     let apilength=event;
     if(apilength.length>=4){
      this.apilength1=false;
    
     }
     else{
      this.apilength1=true;
     }

  }
  checkAuthorization() {
    this.loading = true;
    this.integrationService.checkConfigurationByType("pipedrive").subscribe(data => {
      this.loading = false;
			let response = data;      
			if (response.data.isAuthorize !== undefined && response.data.isAuthorize) {
				this.getPreIntegrationSettings();
			}
		}, error => {
      this.loading = false;
		}, () => {}
    );
  }
  getPreIntegrationSettings() {
    this.loading = true;
    this.dashBoardService.getPreIntegrationSettingsForPipedrive(this.loggedInUserId)
      .subscribe(
        response => {
          this.loading = false;
          if (response.statusCode == 200) {
            let data = response.data;
            // this.instanceUrl = data.instanceUrl;
            // this.webApiInstanceUrl = data.webApiInstanceUrl;
            this.apiToken=data.apiToken;
          }
        },
        error => {
          this.loading = false;
        },
        () => { }
      );
  }
  validateModelForm(){
    let valid = true;
    let errorMessage = "";
    
// }
     if(this.apiToken == undefined || this.apiToken== null  || this.apiToken.trim().length>=0||
        !this.regularExpressions.URL_PATTERN.test(this.apiToken.trim())){
         valid = false;
          errorMessage = "Please provide valid Api Token";
       }else if(this.apiToken!=undefined || this.apiToken!=null || this.apiToken.trim().length<0||
         this.regularExpressions.URL_PATTERN.test(this.apiToken.trim())){
          valid=true;
        errorMessage="You have provided the correct details";
      }
     if(valid) {
         this.customResponse.isVisible = false;
         this.savePreIntegrationSettings()
     } else {
        this.customResponse = new CustomResponse('ERROR', errorMessage, true);
       }
     }
     savePreIntegrationSettings() {
      this.loading = true;
      let requestObj = {
        userId: this.loggedInUserId,
        instanceUrl: this.apiToken.trim(),
        // webApiInstanceUrl: this.webApiInstanceUrl.trim()
      }
      this.dashBoardService.savePreIntegrationSettingsForPipedrive(requestObj)
        .subscribe(
          response => {          
            if (response.statusCode == 200) {
              let data = response.data;
              this.redirectUrl = data.redirectUrl;
              this.configurePipedrive();
            }
          },
          error => {
            this.loading = false;
          },
          () => { }
        );
    }
    configurePipedrive() {
      if (this.vanityUrlService.isVanityURLEnabled()) {
        let providerName = 'pipedrive';
        this.currentUser = localStorage.getItem('currentUser');
              const encodedData = window.btoa(this.currentUser);
              const encodedUrl = window.btoa(this.currentUser);
              let vanityUserId = JSON.parse(this.currentUser)['userId'];
              let url = null;
              if(this.redirectUrl){
                      url = this.authenticationService.APP_URL + "v/" + providerName + "/" + vanityUserId + "/" + null + "/" + null + "/"+ null ;
  
              }else{
                      url = this.authenticationService.APP_URL + "v/" + providerName + "/" + encodedData;
              }
  
              var x = screen.width / 2 - 700 / 2;
              var y = screen.height / 2 - 450 / 2;
              window.open(url, "Social Login", "toolbar=yes,scrollbars=yes,resizable=yes, addressbar=no,top=" + y + ",left=" + x + ",width=700,height=485");
      }
      else if (this.redirectUrl !== undefined && this.redirectUrl !== '') {
        window.location.href = this.redirectUrl;
      }
    }
    closeForm() {
      console.log("Closed")
      this.closeEvent.emit("0");
    }
  }
  
  
