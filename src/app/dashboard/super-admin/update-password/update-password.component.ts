import { Component, OnInit } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { DashboardService } from 'app/dashboard/dashboard.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit {

  emailId:string;
  validEmailId = false;
  updatePasswordLoader = false;
  updatePasswordResponse:CustomResponse = new CustomResponse();
  updatePasswordStatusCode = 200;
  constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService,public dashboardService:DashboardService) { }

  ngOnInit() {
  }

  openModalPopup(){
    this.referenceService.openModalPopup("update-password-modal");
  }

  findUserDetailsOnKeyPress(keyCode:any){
    if (keyCode === 13) { this.findUserDetails(); } 
  }

  findUserDetails(){
  this.updatePasswordLoader = true;
  

  }

}
