import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LandingPageService } from 'app/landing-pages/services/landing-page.service';

@Component({
  selector: 'app-marketplace-map-util',
  templateUrl: './marketplace-map-util.component.html',
  styleUrls: ['./marketplace-map-util.component.css']
})
export class MarketplaceMapUtilComponent implements OnInit {

  filteredCompanies: any[] =[];
  alias:any;
  isOnlyMap:boolean = false;

  lat: number = 0; // default latitude (center of map)
  lng: number = 0; // default longitude (center of map)
  zoom: number = 8;
  receivedData:any[]=[];

  private channel: BroadcastChannel;

  constructor(private elementRef: ElementRef, private route: ActivatedRoute,private router:Router,
    private landingPageService: LandingPageService,
  ) {
    this.channel = new BroadcastChannel('my_channel');
  }

  ngOnInit() {
    this.isOnlyMap = this.router.url.includes("marketplaceMap")
    this.alias = this.route.snapshot.params['alias'];
    if(this.isOnlyMap){
      this.getPartnerCompaniesByAlias();
    }else{
      this.getBrodcastData();
    }
  }

  private getBrodcastData() {
    this.channel.onmessage = (event) => {
      if (event.data.type === 'companies') {
        this.filteredCompanies = event.data.data;
        console.log('Search data received:', this.filteredCompanies);
        this.calculateMapCenterAndZoom();
      }
    };
  }

  ngAfterViewChecked() {
    const componentHeight = this.elementRef.nativeElement.offsetHeight;
    (window.parent as any).$('#map-frame').height(componentHeight +20);

  }

  calculateMapCenterAndZoom() {
    if (this.filteredCompanies.length === 0) {
      this.lat = 37.7749;
      this.lng = -122.4194;
      this.zoom = 5;
    } else {
      let minLat = this.filteredCompanies[0].latitude;
      let maxLat = this.filteredCompanies[0].latitude;
      let minLng = this.filteredCompanies[0].longitude;
      let maxLng = this.filteredCompanies[0].longitude;
  
      this.filteredCompanies.forEach(company => {
        minLat = Math.min(minLat, company.latitude);
        maxLat = Math.max(maxLat, company.latitude);
        minLng = Math.min(minLng, company.longitude);
        maxLng = Math.max(maxLng, company.longitude);
      });
  
      this.lat = (minLat + maxLat) / 2;
      this.lng = (minLng + maxLng) / 2;
  
      const latDiff = maxLat - minLat;
      const lngDiff = maxLng - minLng;
  
      if (latDiff > 10 || lngDiff > 10) {
        this.zoom = 2;  // Zoom out
      } else if (latDiff > 5 || lngDiff > 5) {
        this.zoom = 5;  // Moderate zoom
      } else {
        this.zoom = 7; // Close zoom
      }
    }
  }

  navigateToParent(event: any, openInNewTab: boolean): void {
    event.preventDefault();
    const newUrl = event.currentTarget.href;

    if (openInNewTab) {
      const newTab = window.open(newUrl, '_blank');
    } else {
      window.parent.location.href = newUrl;
    }
  }

  getPartnerCompaniesByAlias() {
    this.landingPageService.getPartnerCompanyDetailsByVendorLandscapePageAlias(this.alias).subscribe(
      response => {
        this.filteredCompanies = response.data;
        this.calculateMapCenterAndZoom();
      },
      error => {
        this.filteredCompanies = [];
      },
    );
  }
}
