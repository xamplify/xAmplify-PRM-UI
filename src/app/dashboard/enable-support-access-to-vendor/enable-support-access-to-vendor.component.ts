import { Component, OnInit } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { DashboardService } from '../dashboard.service';
import { CallActionSwitch } from 'app/videos/models/call-action-switch';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
import { LoginAsPartnerDto } from '../models/login-as-partner-dto';
@Component({
  selector: 'app-enable-support-access-to-vendor',
  templateUrl: './enable-support-access-to-vendor.component.html',
  styleUrls: ['./enable-support-access-to-vendor.component.css'],
  providers: [Properties,CallActionSwitch,HttpRequestLoader]
})
export class EnableSupportAccessToVendorComponent implements OnInit {

  httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
  customResponse:CustomResponse = new CustomResponse();
  loginAsPartnerDto:LoginAsPartnerDto = new LoginAsPartnerDto();
  constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService,public properties:Properties,
    public dashboardService:DashboardService,public callActionSwitch: CallActionSwitch,public vanityUrlService:VanityURLService) { }


  ngOnInit() {
	this.referenceService.goToTop();
    this.findLoginAsPartnerSettingsOptions();
  }

  findLoginAsPartnerSettingsOptions(){
    let companyProfileName = this.authenticationService.vanityURLEnabled ? this.authenticationService.companyProfileName :"";
    if(this.vanityUrlService.isVanityURLEnabled() && companyProfileName!=""){
			this.referenceService.startLoader(this.httpRequestLoader);
			this.dashboardService.findLoginAsPartnerSettingsOptions(companyProfileName)
			.subscribe(
			(response) => {
				this.loginAsPartnerDto = response.data;
				this.referenceService.stopLoader(this.httpRequestLoader);
			},
			(error) => {
				this.referenceService.stopLoader(this.httpRequestLoader);
				this.customResponse = this.referenceService.showServerErrorResponse(
				this.httpRequestLoader
				);
			}
			);
		}
  }

  updateLoginAsPartnerSettingsOptions(){
	   this.referenceService.goToTop();
		this.referenceService.startLoader(this.httpRequestLoader);
		this.customResponse = new CustomResponse();
		let companyProfileName = this.authenticationService.vanityURLEnabled ? this.authenticationService.companyProfileName :"";
		if(this.vanityUrlService.isVanityURLEnabled() && companyProfileName!=""){
     	 this.loginAsPartnerDto.vendorCompanyProfileName = companyProfileName;
			this.dashboardService.updateLoginAsPartnerSettingsOptions(this.loginAsPartnerDto)
			.subscribe(
				response=>{
					this.customResponse = new CustomResponse('SUCCESS',response.message,true);
					this.referenceService.stopLoader(this.httpRequestLoader);
				},error=>{
					this.referenceService.stopLoader(this.httpRequestLoader);
					this.referenceService.showSweetAlertServerErrorMessage();
				}
			);
		}else{
			this.referenceService.stopLoader(this.httpRequestLoader);
		}
		
	}

}
