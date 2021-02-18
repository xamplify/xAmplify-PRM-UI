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
  providers: [Properties]
})
export class MdfStatisticsComponent implements OnInit {
  loggedInUserCompanyId: number = 0;
  loggedInUserId:number = 0;
  mdfStatsLoader = false;
  mdfStatsStatusCode = 200;
  constructor(public properties:Properties,public mdfService:MdfService,public authenticationService:AuthenticationService,public referenceService:ReferenceService,public xtremandLogger:XtremandLogger) {
    this.loggedInUserId = this.authenticationService.getUserId();
   }

  ngOnInit() {
    this.mdfStatsLoader = true;
  }
 

}
