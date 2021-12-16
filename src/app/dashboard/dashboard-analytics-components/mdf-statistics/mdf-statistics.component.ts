import { Component, OnInit } from '@angular/core';
import { MdfService } from 'app/mdf/services/mdf.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { XtremandLogger } from "app/error-pages/xtremand-logger.service";
import { ReferenceService } from "app/core/services/reference.service";
import { Properties } from 'app/common/models/properties';

@Component({
  selector: 'app-mdf-statistics',
  templateUrl: './mdf-statistics.component.html',
  styleUrls: ['./mdf-statistics.component.css'],
  providers: [Properties,MdfService]
})
export class MdfStatisticsComponent implements OnInit {
  loggedInUserCompanyId: number = 0;
  loggedInUserId:number = 0;
  mdfStatsLoader = false;
  mdfStatsStatusCode = 200;
  mdfData:any;
  applyFilter = false;
  constructor(public properties:Properties,public mdfService:MdfService,public authenticationService:AuthenticationService,public referenceService:ReferenceService,public xtremandLogger:XtremandLogger) {
    this.loggedInUserId = this.authenticationService.getUserId();
   }

  ngOnInit() {
    this.mdfStatsLoader = true;
    this.getCompanyId();
  }

  getCompanyId() {
    this.referenceService.getCompanyIdByUserId(this.loggedInUserId).subscribe(
      (result: any) => {
        this.loggedInUserCompanyId = result;
      }, (error: any) => {
        this.setErrorCode(error);
      },
      () => {
        this.getTilesInfo();
      }
    );

  }
  getTilesInfo() {
    this.mdfService.getVendorMdfAmountTilesInfo(this.loggedInUserCompanyId,this.applyFilter).subscribe((result: any) => {
      this.mdfStatsLoader = false;
      this.mdfData = result.data;
    }, error => {
      this.setErrorCode(error);
    });
  }

  setErrorCode(error:any){
    this.xtremandLogger.log(error);
    this.mdfStatsStatusCode = 0;
    this.mdfStatsLoader = false;
  }
  getSelectedIndexFromPopup(event:any){
		let filter = event['applyFilter'];
		let selectedIndex = event['selectedOptionIndex'];
		this.applyFilter = selectedIndex==1;
		if (filter) {
      this.mdfStatsLoader = true;
			this.getTilesInfo();
		}
  }
  

 

}
