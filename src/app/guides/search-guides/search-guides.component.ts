import { Component, OnInit, Input, OnChanges,Output,EventEmitter } from '@angular/core';
import { SocialPagerService } from 'app/contacts/services/social-pager.service';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { Pagination } from 'app/core/models/pagination';
import { PagerService } from 'app/core/services/pager.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { Location } from '@angular/common';
import { UserGuide } from '../models/user-guide';
import { AuthenticationService } from 'app/core/services/authentication.service';


@Component({
  selector: 'app-search-guides',
  templateUrl: './search-guides.component.html',
  styleUrls: ['./search-guides.component.css']
})
export class SearchGuidesComponent implements OnInit, OnChanges {
  constructor(public refService: ReferenceService, public dashboardService: DashboardService, public pagerService: PagerService, public socialPagerService: SocialPagerService,
    public location:Location,public authenticationService:AuthenticationService) { }

  ngOnInit() {
  }

  ngOnChanges(){

  }
}
