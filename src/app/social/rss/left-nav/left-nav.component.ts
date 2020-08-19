import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { RssService } from '../../services/rss.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { SocialService } from '../../services/social.service';
import { Router } from '@angular/router';
import { ReferenceService } from '../../../core/services/reference.service';

@Component({
  selector: 'app-left-nav',
  templateUrl: './left-nav.component.html',
  styleUrls: ['../rss/rss.component.css', './left-nav.component.css']
})
export class LeftNavComponent implements OnInit {
  @Input('refreshTime') refreshTime: Date;
  showVendorFeeds: boolean = false;
  constructor(public rssService: RssService, private authenticationService: AuthenticationService,private router:Router,private socialService:SocialService,private referenceService:ReferenceService) { }
  loggedInUserId: number = this.authenticationService.getUserId();
  isloading = false;
  partnerOrPartnerTeamMember = false;
  showFeeds = false;
  roleDetails:any;
  vendors: Array<any>;
  customFeedCollections: Array<any>;
  vendorFeedsCount = 0;
  vendorFeedsExpand = false;
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
          this.listAllCustomFeedCollections();
          this.getVendorFeedsCount();
          if(this.showVendorFeeds){
            this.listAllVendors();
          }
        }else{
          this.showFeeds = false;
          this.showVendorFeeds = true;
          this.listAllVendors();
          //this.listAllCustomFeedCollections();
        }
      },
      error => {
        this.isloading = false;
        console.log(error);
      }
    );
    
  }

  getVendorFeedsCount(){
    this.isloading = true;
    this.socialService.getVendorFeedsCount(this.loggedInUserId)
  	.subscribe(
    	data => {
      	let statusCode = data.statusCode;
      	if(statusCode==200){
        this.vendorFeedsCount = data.data.count;
      	}
    },
    error => {
      this.isloading = false;
    },
    () => {
      this.isloading = false;
    }
  );

  }
  
  listAllVendors(){
    this.isloading = true;
    this.socialService.listAllVendors(this.loggedInUserId)
  .subscribe(
    data => {
      let statusCode = data.statusCode;
      if(statusCode==200){
        this.vendors = data.data;
      }

    },
    error => {
      this.isloading = false;
    },
    () => {
      this.isloading = false;
    }
  );

  }
  
  listAllCustomFeedCollections(){
    this.isloading = true;
    this.socialService.listAllCustomFeedCollections(this.loggedInUserId)
  .subscribe(
    data => {
      let statusCode = data.statusCode;
      if(statusCode==200){
        this.customFeedCollections = data.data;
      }

    },
    error => {
      this.isloading = false;
    },
    () => {
      this.isloading = false;
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

   goToAllCustomFeeds(type:string, collectionId:number){
    this.isloading = true;
    this.router.navigate(['/home/rss/manage-custom-feed/'+type+"/"+collectionId]);
  }

  goToVendorFeeds(vendorCompanyId:number,type:string){
    this.router.navigate(['/home/rss/manage-custom-feed/'+type+"/"+vendorCompanyId]);
  }
}
