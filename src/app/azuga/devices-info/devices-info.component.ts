import { Component, OnInit } from '@angular/core';
import { ReferenceService } from 'app/core/services/reference.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AzugaService } from '../service/azuga.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { Properties } from 'app/common/models/properties';
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
  constructor(public azugaService:AzugaService,public referenceService:ReferenceService,public authenticationService:AuthenticationService,public xtremandLogger:XtremandLogger) {
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

}
