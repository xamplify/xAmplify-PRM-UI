import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { CustomResponse } from '../../common/models/custom-response';
import { Properties } from '../../common/models/properties';

declare var $:any;
@Component({
  selector: 'app-add-default-template-details',
  templateUrl: './add-default-template-details.component.html',
  styleUrls: ['./add-default-template-details.component.css'],
  providers: [Properties]
})
export class AddDefaultTemplateDetailsComponent implements OnInit {

  @Input()defaultTemplateInput:any;
  @Output()notifyChild= new EventEmitter();
  details = {};
  loader = false;
  buttonText = "Save As Default";
  customResponse:CustomResponse = new CustomResponse();
  constructor(public authenticationService:AuthenticationService,public properties:Properties) { }

  ngOnInit() {
    this.customResponse = new CustomResponse();
    this.details['id'] = this.defaultTemplateInput.id;
    this.details['name'] = this.defaultTemplateInput.name;
    $('#saveAsDefaultTemplatePopup').modal('show');
  }


  saveAsDefault(){
    this.customResponse = new CustomResponse();
    this.details['errorMessage'] = "";
    this.buttonText = "Please wait...";
    this.loader = true;
    this.authenticationService.saveAsDefaultTemplate(this.details).subscribe(
      response=>{
        if(response.statusCode==200){
          this.customResponse = new CustomResponse('SUCCESS',response.message,true);
        }else{
          this.details['errorMessage'] = response.message;
        }
        this.loader = false;
      },error=>{
        this.loader = false;
        this.customResponse = new CustomResponse('ERROR',this.properties.serverErrorMessage,true);
        this.buttonText = "Save As Default";
      }
    );
  }

  closeSaveAsDefaultTemplatePopup(){
    $('#saveAsDefaultTemplatePopup').modal('hide');
    this.details = {};
    this.notifyChild.emit();
  }
}
