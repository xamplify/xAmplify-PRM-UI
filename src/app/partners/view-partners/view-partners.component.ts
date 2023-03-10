import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { ParterService } from '../services/parter.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { SortOption } from '../../core/models/sort-option';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { CustomResponse } from '../../common/models/custom-response';
import { UtilService } from '../../core/services/util.service';
@Component({
  selector: 'app-view-partners',
  templateUrl: './view-partners.component.html',
  styleUrls: ['./view-partners.component.css'],
  providers: [Pagination, HttpRequestLoader, SortOption]
})
export class ViewPartnersComponent implements OnInit {
  customResponse:CustomResponse = new CustomResponse();
  pagination:Pagination = new Pagination();
  constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService,
    private xtremandLogger:XtremandLogger,private utilService:UtilService,private pagerService:PagerService,
    private partnerService:ParterService,public router: Router,public sortOption: SortOption,private route:ActivatedRoute) { }

  ngOnInit() {
    alert("View Partnes Componet Loaded");
  }

}
