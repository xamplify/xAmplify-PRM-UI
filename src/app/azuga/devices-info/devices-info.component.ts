import { Component, OnInit } from '@angular/core';
import { ReferenceService } from 'app/core/services/reference.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AzugaService } from '../service/azuga.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { Properties } from 'app/common/models/properties';
import { CustomResponse } from 'app/common/models/custom-response';
declare var $:any,swal:any;
@Component({
  selector: 'app-devices-info',
  templateUrl: './devices-info.component.html',
  styleUrls: ['./devices-info.component.css'],
  providers:[HttpRequestLoader,Properties]
})
export class DevicesInfoComponent implements OnInit {
  tilesLoader  = false;
  listLoader:HttpRequestLoader = new HttpRequestLoader();
  devicesInfo:Array<any> = new Array<any>();
  reAssignDataLoader = false;
  selectedDeviceInfo:any;
  customResponse:CustomResponse = new CustomResponse();
  validForm = true;
  constructor(public azugaService:AzugaService,public referenceService:ReferenceService,public authenticationService:AuthenticationService,
    public xtremandLogger:XtremandLogger,public properties:Properties) {
   }

  ngOnInit() {
    this.findDevicesInfo();
  }

  findDevicesInfo(){
    this.referenceService.loading(this.listLoader,true);
    this.azugaService.findDevices().subscribe(
      response=>{
        let data = response.data;
        if(data!=undefined){
          this.devicesInfo = data.results;
        }
        this.referenceService.loading(this.listLoader,false);
      },error=>{
        this.xtremandLogger.errorPage(error);
      }
    );
  }

  openReAssignModalPopUp(deviceInfo:any){
    this.selectedDeviceInfo = deviceInfo;
    $('#fromCustomerId').val(1059);
    $('#toCustomerId').val(2175);
    $('#reassign-data-modal-popup').modal('show');
  }

  hideReAssignDataModalPopUp(){
    $('#reassign-data-modal-popup').modal('hide');
    $('#fromCustomerId').val();
    $('#toCustomerId').val();
    this.selectedDeviceInfo = {};
  }

  validateForm(inputId:string){
    let value = $('#'+inputId).val();
    return value!=undefined && value>0;
  }

  transferData(){
    this.referenceService.scrollToModalBodyTopByClass();
    this.customResponse = new CustomResponse();
    let validFromCustomerId = this.validateForm('fromCustomerId');
    let validToCustomerId = this.validateForm('toCustomerId');
    let validForm = validToCustomerId && validFromCustomerId;
    if(validForm){
      this.reAssignDataLoader = true;
      this.azugaService.moveDevicesData().subscribe(
        response=>{
          let statusCode = response.statusCode;
          if(statusCode==200){
            this.hideReAssignDataModalPopUp();
            this.referenceService.showSweetAlertSuccessMessage("Request to moving data is accepted and is being processed");
          }else{
            this.customResponse = new CustomResponse('ERROR',this.properties.serverErrorMessage,true);
          }
          this.reAssignDataLoader = false;
        },error=>{
          this.customResponse = new CustomResponse('ERROR',this.properties.serverErrorMessage,true);
        }
      );
    }else{
      this.customResponse = new CustomResponse('ERROR',"Please Enter Valid Input",true);
    }
    
  }
}
