import { Component, OnInit, Input} from '@angular/core';
import { ListLoaderValue } from 'app/common/models/list-loader-value';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PagerService } from 'app/core/services/pager.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { ParterService } from '../services/parter.service';
import { UtilService } from 'app/core/services/util.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';

@Component({
  selector: 'app-partner-journey-company-info',
  templateUrl: './partner-journey-company-info.component.html',
  styleUrls: ['./partner-journey-company-info.component.css']
})
export class PartnerJourneyCompanyInfoComponent implements OnInit {
  @Input() partnerCompanyId: any;

  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  loggedInUserId: number = 0;
  companyInfo: any;

  constructor(public authenticationService: AuthenticationService,
    public referenseService: ReferenceService, public parterService: ParterService,
    public utilService: UtilService, public xtremandLogger: XtremandLogger) {
      this.loggedInUserId = this.authenticationService.getUserId(); 
  }

  ngOnInit() {
    this.getPartnerCompanyInfo();
  }

  getPartnerCompanyInfo() {
    this.referenseService.loading(this.httpRequestLoader, true);
    this.parterService.getPartnerJourneyCompanyInfo(this.partnerCompanyId, this.loggedInUserId).subscribe(
			(response: any) => {	
        this.referenseService.loading(this.httpRequestLoader, false);
        if (response.statusCode == 200) {
          this.companyInfo = response.data;	
        }        	
			},
			(_error: any) => {
        this.httpRequestLoader.isServerError = true;
        this.xtremandLogger.error(_error);
			}
		);
  }

}
