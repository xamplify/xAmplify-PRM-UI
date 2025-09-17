import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { CustomResponse } from '../../common/models/custom-response';
import { Properties } from '../../common/models/properties';
import { ReferenceService } from "app/core/services/reference.service";
import { Router, ActivatedRoute } from '@angular/router';
import { switchAll } from 'rxjs/operators';

declare var $,swal:any;
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
  validForm = false;
  nameClass = "form-group";
  constructor(public authenticationService:AuthenticationService,public properties:Properties,public referenceService:ReferenceService,private router:Router) { }

  ngOnInit() {
    this.customResponse = new CustomResponse();
    this.details['id'] = this.defaultTemplateInput.id;
    this.details['name'] = this.defaultTemplateInput.name;
    this.validateName();
    $('#saveAsDefaultTemplatePopup').modal('show');
  }

  validateName(){
    let name = $.trim(this.details['name']);
    if(name.length>0){
      this.validForm = true;
    }else{
      this.validForm = false;
    }
  }


  saveAsDefault(){
    this.nameClass = "form-group";
    this.customResponse = new CustomResponse();
    this.buttonText = "Please wait...";
    this.loader = true;
    this.authenticationService.saveAsDefaultTemplate(this.details).subscribe(
      response=>{
        this.nameClass = "form-group has-success has-feedback";
        this.buttonText = "Save As Default";
        if(response.statusCode==200){
          $('#saveAsDefaultTemplatePopup').modal('hide');
          let self = this;
          this.referenceService.showSweetAlertProcessingLoader("Default Template Is Created");
          setTimeout(()=>{ 
            swal.close();                   
            self.router.navigate(["/home/emailtemplates/select"]);
          }, 3000);
        }else{
          this.nameClass = "form-group has-error has-feedback";
          this.customResponse = new CustomResponse('ERROR',response.message,true);
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
