import { Component, OnInit } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { Pagination } from 'app/core/models/pagination';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { VanityLoginDto } from 'app/util/models/vanity-login-dto';
import { CustomLinkDto } from 'app/vanity-url/models/custom-link-dto';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-news-and-announcement-and-instant-navigation-dashboard-analytics',
  templateUrl: './news-and-announcement-and-instant-navigation-dashboard-analytics.component.html',
  styleUrls: ['./news-and-announcement-and-instant-navigation-dashboard-analytics.component.css'],
  providers:[Properties]
})
export class NewsAndAnnouncementAndInstantNavigationDashboardAnalyticsComponent implements OnInit {
  isVanityUrlEnabled = false;
  isNewsAndAnnouncementApiLoading = false;
  isInstantNavigationLinksApiLoading = false;
  pagination:Pagination = new Pagination();
  customResponse:CustomResponse = new CustomResponse();
  properties:Properties = new Properties();
  customLinkDtos:Array<CustomLinkDto> = new Array<CustomLinkDto>();
  vanityLoginDto: VanityLoginDto = new VanityLoginDto();
  instantNavigationLinks:Array<any> = new Array<any>();
  constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService,public vanityUrlService:VanityURLService,private dashboardService:DashboardService) { }

  ngOnInit() {
    this.customResponse = new CustomResponse();
    this.isVanityUrlEnabled = this.authenticationService.vanityURLEnabled;
    if (this.isVanityUrlEnabled) {
      this.findNewsAndAnnouncements();
      this.findInstantNavigationLinks();

    }
  }


  private findInstantNavigationLinks() {
    this.vanityLoginDto.userId = this.authenticationService.getUserId();
    let companyProfileName = this.authenticationService.companyProfileName;
    if (companyProfileName !== undefined && companyProfileName !== "") {
      this.vanityLoginDto.vendorCompanyProfileName = companyProfileName;
      this.vanityLoginDto.vanityUrlFilter = true;
    } else {
      this.vanityLoginDto.vanityUrlFilter = false;
    }
    this.isInstantNavigationLinksApiLoading = true;
    this.dashboardService.findInstantNavigationLinks(this.vanityLoginDto).subscribe(
      response => {
        this.instantNavigationLinks = response.data;
        this.isInstantNavigationLinksApiLoading = false;
      }, error => {
        this.isInstantNavigationLinksApiLoading = false;
        this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
      });
  }

  private findNewsAndAnnouncements() {
    this.isNewsAndAnnouncementApiLoading = true;
    this.pagination.pageIndex = 1;
    this.pagination.maxResults = 4;
    this.vanityUrlService.findCustomLinks(this.pagination).subscribe(
      response => {
        this.customLinkDtos = response.data.list;
        this.isNewsAndAnnouncementApiLoading = false;
      }, error => {
        this.isNewsAndAnnouncementApiLoading = false;
        this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
      });
  }
}
