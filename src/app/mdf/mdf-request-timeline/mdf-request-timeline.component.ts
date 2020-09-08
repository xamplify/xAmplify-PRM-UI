import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";
import { MdfService } from '../services/mdf.service';
import {MdfRequestDto} from '../models/mdf-request-dto';
import { ReferenceService } from "app/core/services/reference.service";
import { AuthenticationService } from '../../core/services/authentication.service';
@Component({
  selector: 'app-mdf-request-timeline',
  templateUrl: './mdf-request-timeline.component.html',
  styleUrls: ['./mdf-request-timeline.component.css','../mdf-html/mdf-html.component.css']
})
export class MdfRequestTimelineComponent implements OnInit {
  requestId:number = 0;
  role:string = "";
  loading = false;
  loggedInUserId: number=0;
  loggedInUserCompanyId: number=0;
  mdfRequest:MdfRequestDto = new MdfRequestDto();
  documentsTitle:string = "";
  constructor(private mdfService: MdfService,private route: ActivatedRoute,public authenticationService: AuthenticationService,public xtremandLogger: XtremandLogger,public referenceService: ReferenceService,private router: Router) { 
	    this.loggedInUserId = this.authenticationService.getUserId();

}

  ngOnInit() {
    this.loading = true;
    this.requestId = parseInt(this.route.snapshot.params['requestId']);
    this.role = this.route.snapshot.params['role'];
    if("v"==this.role || "p"==this.role){
      this.getCompanyId();
    }else{
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
          this.getMdfRequestDetails();
        }
      }
    );
  }    

  getMdfRequestDetails(){
    if(this.requestId>0){
      this.loading = true;
      this.mdfService.getRequestDetailsByIdForTimeLine(this.requestId,this.loggedInUserCompanyId).
      subscribe((result: any) => {
        if(result.statusCode==200){
          this.mdfRequest = result.map.requestDetails;
        }else if(result.statusCode==404){
          this.goBack();
          this.referenceService.showSweetAlertErrorMessage("Invalid Request");
        }
        this.loading = false;
      }, error => {
        this.xtremandLogger.log(error);
        this.xtremandLogger.errorPage(error);
      });
    }else{
      this.referenceService.showSweetAlertErrorMessage("Request Id Not Found");
    }
  }

  goBack(){
    if("v"==this.role){
     // this.referenceService.goToRouter("/home/mdf/change-request/"+this.requestId);
     this.referenceService.goToRouter("/home/mdf/requests");
    }else if("p"==this.role){
      this.referenceService.goToRouter("/home/mdf/requests/p");
    }

  }

}
