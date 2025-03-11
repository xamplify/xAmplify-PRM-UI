import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LandingPageService } from 'app/landing-pages/services/landing-page.service';

declare var BroadcastChannel: any;
@Component({
  selector: 'app-marketplace-map-util',
  templateUrl: './marketplace-map-util.component.html',
  styleUrls: ['./marketplace-map-util.component.css']
})
export class MarketplaceMapUtilComponent implements OnInit {

  filteredCompanies: any[] =[];
  alias:any;
  isOnlyMap:boolean = false;

  lat: number = 0;
  lng: number = 0;
  zoom: number = 8;
  receivedData:any[]=[];
  
  channel;

  categories: any[] = [];
  filteredCategories: any[] = [];

  searchTerm: string = '';
  activeCategory: string = 'All Categories';


  constructor(private elementRef: ElementRef, private route: ActivatedRoute,private router:Router,
    private landingPageService: LandingPageService,
  ) {
    this.channel = new BroadcastChannel('my_channel');
  }

  ngOnInit() {
    this.isOnlyMap = this.router.url.includes("marketplaceMap")
    this.alias = this.route.snapshot.params['alias'];
    if(this.isOnlyMap){
      this.getVendorCompaniesByAlias();
    }else{
      this.getBrodcastData();
    }
  }

  private getBrodcastData() {
    this.channel.onmessage = (event) => {
      if (event.data.type === 'companies') {
        this.filteredCompanies = event.data.data;
        this.calculateMapCenterAndZoom();
      }
    };
  }

  ngAfterViewChecked() {
    const componentHeight = this.elementRef.nativeElement.offsetHeight;
    (window.parent as any).$('.map-frame').height(componentHeight +20);

  }

  showContent(section: string) {
    this.activeCategory = section;
    this.getUniqueCompaniesToDisplayInMaps()

  }

  showAllCategories() {
    this.activeCategory = 'All Categories';
    this.getUniqueCompaniesToDisplayInMaps();
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
        this.zoom = 2;
      } else if (latDiff > 5 || lngDiff > 5) {
        this.zoom = 5;
      } else {
        this.zoom = 7;
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

  getVendorCompaniesByAlias() {
    this.landingPageService.getVendorCompaniesByAlias(this.alias, false).subscribe(
      response => {
        this.categories = response.data;
        this.getFilteredCompanies();
      },
      error => {
        this.categories = [];
      },()=>{
      }
    );
  }

  getFilteredCompanies() {
    const term = this.searchTerm.toLowerCase();
    this.filteredCategories = this.categories
      .map(category => ({
        ...category,
        companies: category.companies.filter(
          company => company.name.toLowerCase().includes(term) || company.description.toLowerCase().includes(term)
        )
      }))
      .filter(category => category.companies.length > 0);
      this.getUniqueCompaniesToDisplayInMaps()
  }

  getUniqueCompaniesToDisplayInMaps(){
    let uniqueCompanies;
    if (this.activeCategory == 'All Categories') {
      uniqueCompanies = Array.from(
        this.filteredCategories
          .map((category) => category.companies || [])
          .reduce((acc, companies) => acc.concat(companies), [])
          .reduce((map, company) => {
            if (!map.has(company.companyId)) {
              map.set(company.companyId, company); // Add company only if not already in the map
            }
            return map;
          }, new Map())
          .values()
      );
    }else{
      uniqueCompanies = 
      Array.from(
        this.filteredCategories
        .filter((category)=>category.name == this.activeCategory)
          .map((category) => category.companies || [])
          .reduce((acc, companies) => acc.concat(companies), [])
          .reduce((map, company) => {
            if (!map.has(company.companyId)) {
              map.set(company.companyId, company); // Add company only if not already in the map
            }
            return map;
          }, new Map())
          .values()
      );
    }
    this.filteredCompanies =uniqueCompanies;
    this.calculateMapCenterAndZoom();
  }
}
