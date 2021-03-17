import { Component, OnInit,Input } from '@angular/core';
import {Properties} from 'app/common/models/properties';
import { CustomResponse } from 'app/common/models/custom-response';
import {DashboardService} from 'app/dashboard/dashboard.service';
import {ReferenceService} from 'app/core/services/reference.service';
import {AuthenticationService} from 'app/core/services/authentication.service';
declare var $:any;
@Component({
  selector: 'app-spf-modal-popup',
  templateUrl: './spf-modal-popup.component.html',
  styleUrls: ['./spf-modal-popup.component.css'],
  providers: [Properties]

})
export class SpfModalPopupComponent implements OnInit {
  isChecked = false;
  @Input() companyId:number;
  customResponse: CustomResponse = new CustomResponse();
  loading = false;
  checkBoxError = false;
  constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService,public properties:Properties,public dashboardService:DashboardService) { }

  ngOnInit() {
	$('#spfModalPopup').modal('show');
  }

  saveSpf(){
    this.referenceService.scrollToModalBodyTopByClass();
    if(this.isChecked){
      this.checkBoxError = false;
      this.loading = true;
      this.customResponse = new CustomResponse();
      this.updateSpfConfiguration(this.companyId);
    }else{
      this.checkBoxError = true;
    }
    
  }
  updateSpfConfiguration(companyId:number){
    this.dashboardService.updateSpfConfiguration(companyId).subscribe(
      _response=>{
        this.loading = false;
        this.referenceService.showSweetAlertSuccessMessage('SPF Configuration Done Successfully');
        $('#spfModalPopup').modal('hide');
      },_error=>{
        this.loading = false;
        this.referenceService.showSweetAlertServerErrorMessage();
      }
    );
  }

}
