import { Component, OnInit } from '@angular/core';
import { Country } from '../../core/models/country';
import { Timezone } from '../../core/models/timezone';
import { ReferenceService } from '../../core/services/reference.service';
import {RequestDemo} from './request-demo';
import { CustomResponse } from '../../common/models/custom-response';
import { UserService } from '../../core/services/user.service';
declare var $:any;
@Component({
  selector: 'app-request-demo',
  templateUrl: './request-demo.component.html',
  styleUrls: ['./request-demo.component.css']
})
export class RequestDemoComponent implements OnInit {

    countries: Country[];
    timezones: Timezone[];
    requestDemo:RequestDemo = new RequestDemo();
    isValidForm = false;
    isValidEmail = false;
    isValidCompany = false;
    errorClass = "success";
    submitted = false;
    customResponse: CustomResponse = new CustomResponse();
  constructor(public refService:ReferenceService,private userService: UserService) {
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
          if(this.isValidCompany){
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
          if(this.isValidEmail){
              this.isValidForm = true;
          }else{
              this.isValidForm = false;
          }
      }else{
          this.isValidCompany = false;
          this.isValidForm = false;
      }
  }
  
  save(){
      this.submitted = true;
      let timezoneId = $('#demo-timezoneId option:selected').val();
      let country = $.trim($('#demo-countryName option:selected').text());
      this.requestDemo.timezone = timezoneId;
      this.requestDemo.country = country;
      console.log(this.requestDemo);
      this.userService.saveDemoRequest(this.requestDemo)
      .subscribe(
      (result:any) => {
          this.customResponse = new CustomResponse( 'SUCCESS', "Your Request Submitted Successfully", true );
          this.submitted = false;
          this.requestDemo = new RequestDemo();
          this.isValidForm = false;
          $("#demo-countryName").val($("#demo-countryName option:first").val());
          this.setCountry();
          this.refService.scrollSmoothToTop();
      },
      (error:string) => { this.customResponse = new CustomResponse( 'ERROR', "Oops!Something went wrong.Please try after sometime", true );});
  
  
  }


}
