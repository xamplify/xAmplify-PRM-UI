import { Component, OnInit } from '@angular/core';
import { ReferenceService } from "app/core/services/reference.service";

@Component({
  selector: 'app-select-upload-type',
  templateUrl: './select-upload-type.component.html',
  styleUrls: ['./select-upload-type.component.css']
})
export class SelectUploadTypeComponent implements OnInit {
loading = false;
  constructor(public referenceService:ReferenceService) { }

  ngOnInit() {
  }

  addAsset() {
		this.loading = true;
		this.referenceService.goToRouter("/home/dam/add");
  }
  
  goToUpload(){
		this.loading = true;
		this.referenceService.goToRouter("/home/dam/upload");
  }
  
  goToManageDam(){
    this.loading = true;
    this.referenceService.goToRouter("home/dam/manage");
  }

}
