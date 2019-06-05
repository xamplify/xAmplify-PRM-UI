import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import {FormService} from '../services/form.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
declare var $:any,swal:any ;
@Component({
  selector: 'app-campaign-form-analytics',
  templateUrl: './campaign-form-analytics.component.html',
  styleUrls: ['./campaign-form-analytics.component.css'],
  providers: [Pagination, HttpRequestLoader]

})
export class CampaignFormAnalyticsComponent implements OnInit {
    alias: any;

  constructor( public referenceService: ReferenceService, private route: ActivatedRoute,
          public authenticationService: AuthenticationService,public formService:FormService, 
          public httpRequestLoader: HttpRequestLoader, public pagerService: PagerService,
          public logger: XtremandLogger
             ) { }

  ngOnInit() {
      this.alias = this.route.snapshot.params['alias'];
      alert(this.alias);
  }

}
