import { Component, OnInit } from '@angular/core';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpClient } from "@angular/common/http";
declare var $:any;
@Component({
  selector: 'app-add-dam',
  templateUrl: './add-dam.component.html',
  styleUrls: ['./add-dam.component.css']
})
export class AddDamComponent implements OnInit {
  ngxloading = false;
  jsonBody:any;
  constructor(private authenticationService:AuthenticationService,public referenceService:ReferenceService,private httpClient:HttpClient) { }

  ngOnInit() {
    this.ngxloading = true;
    this.httpClient.get("assets/config-files/bee-default-asset.json").subscribe(data =>{
      this.jsonBody = JSON.stringify(data);
      this.ngxloading = false;
    });
  }

goToManageDam(){
	this.ngxloading = true;
	this.referenceService.goToRouter("/home/dam/manage");
}

readBeeTemplateData(event:any){
  $('#addAssetDetailsPopup').modal('show');
}

hidePopup(){
  $('#addAssetDetailsPopup').modal('hide');
}

}
