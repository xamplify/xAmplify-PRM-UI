import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { RssService } from '../../services/rss.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-left-nav',
  templateUrl: './left-nav.component.html',
  styleUrls: ['../rss/rss.component.css', './left-nav.component.css']
})
export class LeftNavComponent implements OnInit {
  @Input('refreshTime') refreshTime: Date;
  showVendorFeeds: boolean = false;
  constructor(public rssService: RssService, private authenticationService: AuthenticationService,private router:Router) { }
  loggedInUserId: number = this.authenticationService.getUserId();
  isloading = false;
  partnerOrPartnerTeamMember = false;
  showFeeds = false;
  roleDetails:any;
  ngOnInit() {
    this.loggedInUserId = this.authenticationService.getUserId();
    this.isloading = true;
    this.authenticationService.getRoleDetails(this.loggedInUserId)
    .subscribe(
      data => {
        this.isloading = false;
        if(!data.partner && !data.partnerTeamMember){
          this.showFeeds = true;
          this.getCollections();
          let isOrgAdminAndPartner = data.orgAdminAndPartner;
          let isVendorAndPartner = data.vendorAndPartner;
          let isOrgAdminAndPartnerTeamMember  = data.orgAdminAndPartnerTeamMember;
          let isVendorAndPartnerTeamMember = data.vendorAndPartnerTeamMember;
          this.showVendorFeeds = isOrgAdminAndPartner ||isVendorAndPartner || isOrgAdminAndPartnerTeamMember ||isVendorAndPartnerTeamMember;
        }else{
          this.showFeeds = false;
          this.showVendorFeeds = true;
        }
      },
      error => {
        this.isloading = false;
        console.log(error);
      }
    );
    
  }

  ngOnChanges(changes: SimpleChanges) {
        let currentValue = changes.refreshTime.currentValue;
        if(currentValue)
          this.getCollections();
  }

  getCollections() {
    this.rssService.getCollections(this.loggedInUserId)
    .subscribe(
      data => {
        this.rssService.collectionsResponse = data;
        if(this.rssService.collectionsResponse.statusCode === 8100){
          this.rssService.collectionsResponse.data.forEach(element => {
            element.isExpand = true;
          });
        }
      },
      error => console.log(error),
      () => console.log("getCollections() completed")
    );
  }

  goToAddCustomFeeds(){
    this.isloading = true;
    this.router.navigate(['/home/rss/add-custom-feed']);
  }

  goToAllCustomFeeds(){
    this.isloading = true;
    this.router.navigate(['/home/rss/manage-custom-feed']);
  }
}
