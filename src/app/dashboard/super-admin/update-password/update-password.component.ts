import { Component, OnInit } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { RegularExpressions } from 'app/common/models/regular-expressions';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { DashboardService } from 'app/dashboard/dashboard.service';


@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css'],
  providers: [RegularExpressions]
})
export class UpdatePasswordComponent implements OnInit {

  emailId:string;
  password:string;
  validEmailId = true;
  validPassword = true;
  updatePasswordLoader = false;
  updatePasswordResponse:CustomResponse = new CustomResponse();
  updatePasswordStatusCode = 200;
  showPassword = false;
  constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService,
    public dashboardService:DashboardService,public regularExpressions:RegularExpressions) { }

  ngOnInit() {
  }



  openModalPopup(){
    this.referenceService.openModalPopup("update-password-modal");
  }

  closeUpdatePasswordModal(){
    this.validEmailId = true;
    this.emailId = "";
    this.updatePasswordResponse = new CustomResponse();
    this.referenceService.closeModalPopup("update-password-modal");
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
    let x = document.getElementById("password");
      if (x['type'] === "password") {
        x['type'] = "text";
      } else {
        x['type'] = "password";
      }
  }

  validatePassword(){
    let password = this.referenceService.getTrimmedData(this.password);
    if(password.includes( " " )){
      this.validPassword = false;
    }else if(password.length>0){
      let passwordLength = password.length;
      if(passwordLength>20 || passwordLength<6){
        this.validPassword = false;
      }
    }
  }


  updatePassword(){
    console.log(this.emailId);
    console.log(this.password);
  }

}
