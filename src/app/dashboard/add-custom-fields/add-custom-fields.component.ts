import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CustomFields } from '../models/custom-fields';
import { IntegrationService } from 'app/core/services/integration.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { CustomFieldsDto } from '../models/custom-fields-dto';

@Component({
  selector: 'app-add-custom-fields',
  templateUrl: './add-custom-fields.component.html',
  styleUrls: ['./add-custom-fields.component.css']
})
export class AddCustomFieldsComponent implements OnInit {
  @Output() closeEvent = new EventEmitter<any>();
  customFields = new CustomFields;
  customFieldsDtos = new CustomFieldsDto;
  ngxloading: boolean = false;
  loggedInUserId: number;


  constructor(private integrationService: IntegrationService, private authenticationService: AuthenticationService) { 
    this.loggedInUserId = this.authenticationService.getUserId();
  }

  ngOnInit() {
    if(this.customFields.objectType === undefined){
      this.customFields.objectType = null;
      this.customFieldsDtos.type = null;
    }
  }

  saveCustomField(){
      this.ngxloading = true;
      this.customFields.loggedInUserId = this.loggedInUserId;
      this.customFields.selectedFields.push(this.customFieldsDtos);
      this.integrationService.saveCustomFields(this.customFields).subscribe(
          response=>{
            if(response.statusCode == 200){
              this.notifyCloseCustomField();
            }
            this.ngxloading = false;
          },error=>{
            this.ngxloading = false;
          });  
  }

  notifyCloseCustomField(){
  this.closeEvent.emit("0");
  }


}
