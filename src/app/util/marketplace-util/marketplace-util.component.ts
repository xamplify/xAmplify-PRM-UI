
import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { Processor } from 'app/core/models/processor';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { LandingPageService } from 'app/landing-pages/services/landing-page.service';
import { TracksPlayBookUtilService } from 'app/tracks-play-book-util/services/tracks-play-book-util.service';

declare var BroadcastChannel: any;

@Component({
  selector: 'app-marketplace-util',
  templateUrl: './marketplace-util.component.html',
  styleUrls: ['./marketplace-util.component.css'],
  providers: [HttpRequestLoader, Processor, LandingPageService, TracksPlayBookUtilService],
})
export class MarketplaceUtilComponent implements OnInit {
  searchTerm: string = '';
  activeCategory: string = 'All Categories';
  alias: string;
  landingPageId: number;
  categories: any[] = [];
  filteredCategories: any[] = [];

  isMasterLandingPage: boolean = false;
  filteredCompanies: any[] =[];

  channel;
  flippedCards: { [key: string]: boolean } = {};

  isHoveringReadMore:boolean = false;
  constructor(
    private route: ActivatedRoute,
    private landingPageService: LandingPageService,
    private logger: XtremandLogger,
    public httpRequestLoader: HttpRequestLoader,
    public processor: Processor,
    private router: Router,
    public referenceService: ReferenceService,
    private elementRef: ElementRef,
    public authenticationService: AuthenticationService,

  ) {
    this.channel = new BroadcastChannel('my_channel');

  }

  ngOnInit() {
    this.alias = this.route.snapshot.params['alias'];
    this.landingPageId = this.route.snapshot.params['id'];

    this.isMasterLandingPage = this.router.url.includes("/mps/")
    this.getVendorCompaniesByAlias();

  }

  ngAfterViewChecked() {
      this.setParentIframeHeight();
  }
  showContent(section: string) {
    this.activeCategory = section;
    this.getUniqueCompaniesToDisplayInMaps()

  }

  showAllCategories() {
    this.activeCategory = 'All Categories';
    this.getUniqueCompaniesToDisplayInMaps();
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
      if(!this.isMasterLandingPage){
        this.getUniqueCompaniesToDisplayInMaps();
      }
  }

  getVendorCompaniesByAlias() {
    this.landingPageService.getVendorCompaniesByAlias(this.alias, this.isMasterLandingPage).subscribe(
      response => {
        this.categories = response.data;
        this.getFilteredCompanies();
      },
      error => {
        this.categories = [];
      },()=>{
        this.setParentIframeHeight();
      }
    );
  }

  navigateToParent(event: any, openInNewTab: boolean): void {
    event.preventDefault();
    event.stopPropagation();
    const newUrl = event.currentTarget.href;

    if (openInNewTab) {
      const newTab = window.open(newUrl, '_blank');
    } else {
      window.parent.location.href = newUrl;
    }
  }

  setParentIframeHeight() {
    const componentHeight = this.elementRef.nativeElement.offsetHeight;
    if(this.categories != null && this.categories.length >0){
      (window.parent as any).$('#frame-full-height').height(componentHeight +20);
    }else{
      (window.parent as any).$('#frame-full-height').height(componentHeight +5);

    }
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
  this.channel.postMessage({ type: 'companies', data: this.filteredCompanies });
}
toggleFlip(categoryName: string, index: number): void {
  const key = `${categoryName}-${index}`;
  this.flippedCards[key] = !this.flippedCards[key];
}

isFlipped(categoryName: string, index: number): boolean {
  const key = `${categoryName}-${index}`;
  return !!this.flippedCards[key];
}

}


