import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";
import { MdfService } from '../services/mdf.service';
import {MdfPartnerDto} from '../models/mdf-partner-dto';
import {MdfDetailsTimeLine} from '../models/mdf-details-time-line';
import { ReferenceService } from "app/core/services/reference.service";
import { AuthenticationService } from '../../core/services/authentication.service';
@Component({
  selector: 'app-mdf-details-timeline',
  templateUrl: './mdf-details-timeline.component.html',
  styleUrls: ['./mdf-details-timeline.component.css','../mdf-html/mdf-html.component.css']
})
export class MdfDetailsTimelineComponent implements OnInit {
  loading = false;
  loggedInUserId: number=0;
  loggedInUserCompanyId: number=0;
  timeLineLoader = false;
  mdfAmountDetailsLoader = false;
  mdfDetailsId:number = 0;
  mdfPartnerDto:MdfPartnerDto = new MdfPartnerDto();
  mdfDetailsTimeLineHistory:Array<MdfDetailsTimeLine> = new Array<MdfDetailsTimeLine>();
  tilesLoader = false;
  tileClass = "col-sm-3 col-xs-6 col-lg-3 col-md-3";
  constructor(private mdfService: MdfService,private route: ActivatedRoute,public authenticationService: AuthenticationService,public xtremandLogger: XtremandLogger,public referenceService: ReferenceService,private router: Router) { 
    this.loggedInUserId = this.authenticationService.getUserId();
}

  ngOnInit() {
    this.startLoaders();
    this.mdfDetailsId = parseInt(this.route.snapshot.params['mdfDetailsId']);
    this.getCompanyId();
  }

  getCompanyId() {
    this.referenceService.getCompanyIdByUserId(this.loggedInUserId).subscribe(
      (result: any) => {
        if (result !== "") { 
          this.loggedInUserCompanyId = result;
        }else{
          this.stopLoaders();
          this.referenceService.showSweetAlertErrorMessage('Company Id Not Found');
          this.router.navigate(["/home/dashboard"]);
        }
      }, (error: any) => {
         this.xtremandLogger.log(error);
         this.xtremandLogger.errorPage(error);
         },
      () => {
        if(this.loggedInUserCompanyId!=undefined && this.loggedInUserCompanyId>0){
          this.getHistoryAndAmountDetails();
        }
      }
    );
  }

  getHistoryAndAmountDetails(){
    this.mdfService.getMdfDetailsTimeLineHistory(this.mdfDetailsId,this.loggedInUserCompanyId).
    subscribe((result: any) => {
    if(result.statusCode==200){
      this.mdfPartnerDto = result.map.partnerMdfAmountDetails;
      this.mdfDetailsTimeLineHistory = result.map.timeLineHistory;
    }else{
      
    }
    this.stopLoaders();
     
    }, error => {
      this.xtremandLogger.log(error);
    this.xtremandLogger.errorPage(error);
    });
  }


  startLoaders(){
    this.tilesLoader = true;
    this.loading = true;
    this.mdfAmountDetailsLoader = true;
    this.timeLineLoader = true;
  }

   stopLoaders(){
    this.tilesLoader = false;
    this.loading = false;
    this.mdfAmountDetailsLoader = false;
    this.timeLineLoader = false;
   } 

  goBack(){
    this.referenceService.goToRouter("home/mdf/details");
  }
  refreshHistory(){
    this.startLoaders();
    this.getHistoryAndAmountDetails();
  }

}
