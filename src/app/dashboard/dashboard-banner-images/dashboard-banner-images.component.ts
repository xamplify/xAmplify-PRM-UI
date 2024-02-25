import { Component, OnInit } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
import { VanityLoginDto } from 'app/util/models/vanity-login-dto';
import { Pagination } from 'app/core/models/pagination';
import { CustomLinkDto } from 'app/vanity-url/models/custom-link-dto';

Properties
@Component({
  selector: 'app-dashboard-banner-images',
  templateUrl: './dashboard-banner-images.component.html',
  styleUrls: ['./dashboard-banner-images.component.css','../news-and-announcement-and-instant-navigation-dashboard-analytics/news-and-announcement-and-instant-navigation-dashboard-analytics.component.css'],
  providers:[Properties]
})
export class DashboardBannerImagesComponent implements OnInit {

  isDataLoading = true;
  customResponse:CustomResponse = new CustomResponse();
  vanityLoginDto: VanityLoginDto = new VanityLoginDto();
  pagination:Pagination = new Pagination();
  dashboardBanners:Array<CustomLinkDto> = new Array<CustomLinkDto>();
  isDataError = false;
  constructor(public properties:Properties,public authenticationService:AuthenticationService,public referenceService:ReferenceService,
    public vanityUrlService:VanityURLService) { }

  ngOnInit() {
    this.findDashboardBanners();
  }

  findDashboardBanners(){
    if(this.authenticationService.vanityURLEnabled){
      this.isDataError = false;
      this.customResponse = new CustomResponse();
      this.vanityLoginDto.userId = this.authenticationService.getUserId();
      let companyProfileName = this.authenticationService.companyProfileName;
      if (companyProfileName !== undefined && companyProfileName !== "") {
        this.vanityLoginDto.vendorCompanyProfileName = companyProfileName;
        this.vanityLoginDto.vanityUrlFilter = true;
      } else {
        this.vanityLoginDto.vanityUrlFilter = false;
      }
      this.pagination.filterKey = this.properties.dashboardBanners;
      this.vanityUrlService.findCustomLinks(this.pagination).subscribe(
        response=>{
          this.dashboardBanners = response.data.list;
          if(this.dashboardBanners.length==0){
            this.customResponse = new CustomResponse('INFO',"No Dashboard Banners Found",true);
          }
          this.isDataLoading = false;
        },error=>{
          this.isDataError = true;
          this.isDataLoading = false;
          this.customResponse = new CustomResponse('ERROR',this.properties.serverErrorMessage,true);
        });
    }
   
  }

}
