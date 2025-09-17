import { Component, OnInit } from '@angular/core';
import { Country } from '../../core/models/country';
import { Timezone } from '../../core/models/timezone';
import { ReferenceService } from '../../core/services/reference.service';
import {RequestDemo} from './request-demo';
import { CustomResponse } from '../../common/models/custom-response';
import { UserService } from '../../core/services/user.service';
import { Properties } from 'app/common/models/properties';

declare var $:any;
@Component({
  selector: 'app-request-demo',
  templateUrl: './request-demo.component.html',
  styleUrls: ['./request-demo.component.css'],
  providers:[Properties]
})
export class RequestDemoComponent implements OnInit {

    countries: Country[];
    timezones: Timezone[];
    requestDemo:RequestDemo = new RequestDemo();
    isValidForm = false;
    isValidEmail = false;
    isValidCompany = false;
    isValidMobileNumber = false;
    errorClass = "success";
    submitted = false;
    isContacted = false;
    customResponse: CustomResponse = new CustomResponse();
  constructor(public refService:ReferenceService,private userService: UserService,public properties:Properties) {
      this.countries = this.refService.getCountries();
      this.setCountry();
  }

  ngOnInit() {
  }
  
  setCountry(){
      this.requestDemo.countryId = this.countries[0].id;
      this.onSelect(this.requestDemo.countryId);
  }
  
  onSelect(countryId) {
      this.timezones = this.refService.getTimeZonesByCountryId(countryId);
     }
  
  validateEmailId(){
      if(!this.refService.validateEmailId($.trim(this.requestDemo.emailId))){
          this.isValidEmail = false;
          this.isValidForm = false;
          this.errorClass = "error";
      }else{
          this.isValidEmail = true;
          this.errorClass = "success";
          if(this.isValidCompany && this.validateMobileNumber){
              this.isValidForm = true;
          }else{
              this.isValidForm = false;
          }
      }
  }
  
  validateCompany(){
      let company = $.trim(this.requestDemo.company);
      if(company.length>0){
          this.isValidCompany = true;
          if(this.isValidEmail && this.validateMobileNumber){
              this.isValidForm = true;
          }else{
              this.isValidForm = false;
          }
      }else{
          this.isValidCompany = false;
          this.isValidForm = false;
      }
  }
  
validateMobileNumber(){
    let mobileNumber = $.trim(this.requestDemo.mobileNumber);
      if(mobileNumber.length>0){
          this.isValidMobileNumber = true;
          if(this.isValidEmail && this.isValidCompany){
              this.isValidForm = true;
          }else{
              this.isValidForm = false;
          }
      }else{
          this.isValidMobileNumber = false;
          this.isValidForm = false;
      }
}

  save(){
      this.submitted = true;
      let timezoneId = $('#demo-timezoneId option:selected').val();
      let country = $.trim($('#demo-countryName option:selected').text());
      this.requestDemo.timezone = timezoneId;
      this.requestDemo.country = country;
      this.userService.saveDemoRequest(this.requestDemo)
      .subscribe(
      (result:any) => {
          this.isContacted = true;
          this.customResponse = new CustomResponse( 'SUCCESS', "Thank you.We will contact you shortly to schedule a demo.", true );
          this.refService.scrollSmoothToTop();
      },
      (error:string) => { this.customResponse = new CustomResponse( 'ERROR', "Oops!Something went wrong.Please try after sometime", true );});
  
  
  }


}
