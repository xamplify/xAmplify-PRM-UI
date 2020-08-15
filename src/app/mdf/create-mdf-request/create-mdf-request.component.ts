import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MdfService } from '../services/mdf.service';
import { MdfRequest } from '../models/mdf.request';
import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";
import { ReferenceService } from "app/core/services/reference.service";
import { Router } from '@angular/router';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { UtilService } from '../../core/services/util.service';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from '../../common/models/properties';
import { Form } from 'app/forms/models/form';
import { FormSubmit } from 'app/forms/models/form-submit';
import { FormSubmitField } from 'app/forms/models/form-submit-field';
import { ColumnInfo } from 'app/forms/models/column-info';
import { FormOption } from 'app/forms/models/form-option';
declare var $: any;

@Component({
  selector: 'app-create-mdf-request',
  templateUrl: './create-mdf-request.component.html',
  styleUrls: ['./create-mdf-request.component.css','../html-sample/html-sample.component.css'],
  providers: [HttpRequestLoader,Properties]
})
export class CreateMdfRequestComponent implements OnInit {

  loggedInUserId: number=0;
  loading = false;
  tilesLoader = false;
  tileData:any;
  customResponse: CustomResponse = new CustomResponse();
  mdfRequest: MdfRequest = new MdfRequest();
  vendorCompanyId:number = 0;
  loggedInUserCompanyId: number = 0;
  formLoader = false;
  form: Form = new Form();
  formStatusCode:number = 200;
  alertClass = "";
  successAlertClass = "alert alert-success";
  errorAlertClass = "alert-danger error-alert-custom-padding";
  show: boolean;
  message: string;
  constructor(private mdfService: MdfService,private route: ActivatedRoute,private utilService: UtilService,public authenticationService: AuthenticationService,public xtremandLogger: XtremandLogger,public referenceService: ReferenceService,private router: Router,public properties:Properties) {
    this.loggedInUserId = this.authenticationService.getUserId();
   }

  ngOnInit() {
    this.loading = true;
    this.vendorCompanyId = this.route.snapshot.params['vendorCompanyId'];
    if(this.vendorCompanyId!=undefined && this.vendorCompanyId>0){
      this.getCompanyId();
    }else{
      this.loading = false;
      this.referenceService.showSweetAlertErrorMessage('Vendor Company Id Not Found');
      this.router.navigate(["/home/dashboard"]);
    }
  }

  getCompanyId() {
    this.referenceService.getCompanyIdByUserId(this.loggedInUserId).subscribe(
      (result: any) => {
        if (result !== "") { 
          this.loggedInUserCompanyId = result;
        }else{
          this.loading = false;
          this.referenceService.showSweetAlertErrorMessage('Company Id Not Found');
          this.router.navigate(["/home/dashboard"]);
        }
      }, (error: any) => {
         this.xtremandLogger.log(error);
         this.xtremandLogger.errorPage(error);
         },
      () => {
        if(this.loggedInUserCompanyId!=undefined && this.loggedInUserCompanyId>0){
          this.getTilesInfo();
          this.showMdfForm();
        }
      }
    );
  }


  getTilesInfo() {
    this.tilesLoader = true;
    this.mdfService.getPartnerMdfBalance(this.vendorCompanyId,this.loggedInUserCompanyId).subscribe((result: any) => {
      if (result.statusCode === 200) {
         this.tilesLoader = false;
         this.tileData = result.data;
      }
    }, error => {
      this.xtremandLogger.log(error);
    this.xtremandLogger.errorPage(error);
    });
  }

  showMdfForm(){
    this.formLoader = true;
    this.mdfService.getMdfRequestForm(this.vendorCompanyId).
    subscribe((result: any) => {
      this.formStatusCode = result.statusCode;
      if (result.statusCode === 200) {
        this.form = result.data;
      }else{
        this.customResponse = new CustomResponse('ERROR','No MDF Form Found.Please contact admin',true);
      }
      this.loading = false;
    }, error => {
      this.xtremandLogger.log(error);
    this.xtremandLogger.errorPage(error);
    });
  }

  submitRequest(){
    this.mdfRequest = new MdfRequest();
    this.customResponse = new CustomResponse();
    this.loading = true;
    const formLabelDtos = this.form.formLabelDTOs;
    const requiredFormLabels = formLabelDtos.filter((item) => (item.required === true && $.trim(item.value).length === 0));
    if (requiredFormLabels.length > 0) {
      this.customResponse = new CustomResponse('ERROR','Please fill required fields',true);
      this.loading = false;
    } else {
      const formSubmit = new FormSubmit();
      formSubmit.id = this.form.id;
      formSubmit.alias = this.form.alias;
      $.each(formLabelDtos, function (_index: number, field: ColumnInfo) {
        const formField = new FormSubmitField();
        formField.id = field.id;
        formField.value = $.trim(field.value);
        if (field.labelType === "checkbox") {
          formField.dropdownIds = field.value;
          formField.value = "";
        }
        formSubmit.fields.push(formField);
      });
      this.mdfRequest.userId = this.loggedInUserId;
      this.mdfRequest.formSubmitDto = formSubmit;
      this.saveMdfRequest();

    }
  }

  saveMdfRequest() {
    
    this.mdfService.saveMdfRequest(this.mdfRequest).subscribe((result: any) => {
      if (result.statusCode === 200) {
        this.referenceService.isCreated = true;
        this.router.navigate(['/home/mdf/requests/p']);
      }
    }, error => {
      console.log(error);
    });
  }

  





  goToVendorList(){
    this.loading = true;
    this.router.navigate(["/home/mdf/vendors"]);
  }


  /*************Vivek************* */
  getAllMdfRequests() {
    this.mdfService.getAllMdfRequestsForPagination().subscribe((result: any) => {
      if (result.statusCode === 200) {
        console.log("success");
      }
    }, error => {
      this.xtremandLogger.errorPage(error);
    });
  }

 

  updateMdfRequest() {
    this.mdfService.updateMdfRequest(this.mdfRequest).subscribe((result: any) => {
      if (result.statusCode === 200) {
        console.log("success");
      }
    }, error => {
      this.xtremandLogger.errorPage(error);
    });
  }

}
