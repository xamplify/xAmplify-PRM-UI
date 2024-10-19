import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { Processor } from 'app/core/models/processor';
import { ReferenceService } from 'app/core/services/reference.service';
import { UtilService } from 'app/core/services/util.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { FormService } from 'app/forms/services/form.service';
import { LandingPageService } from 'app/landing-pages/services/landing-page.service';
import { TracksPlayBookUtilService } from 'app/tracks-play-book-util/services/tracks-play-book-util.service';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
import { Ng2DeviceService } from 'ng2-device-detector';
declare var $: any;

@Component({
  selector: 'app-marketplace-util',
  templateUrl: './marketplace-util.component.html',
  styleUrls: ['./marketplace-util.component.css'],
  providers: [HttpRequestLoader, FormService, Processor, LandingPageService, TracksPlayBookUtilService],
})
export class MarketplaceUtilComponent implements OnInit {
  searchTerm: string = '';
  activeCategory: string = 'All Categories';
  alias: string;
  landingPageId: number;
  categories: any[] = [];
  filteredCategories: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private landingPageService: LandingPageService,
    private logger: XtremandLogger,
    public httpRequestLoader: HttpRequestLoader,
    public processor: Processor,
    private router: Router,
    private utilService: UtilService,
    public deviceService: Ng2DeviceService,
    private vanityURLService: VanityURLService,
    public referenceService: ReferenceService,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.alias = this.route.snapshot.params['alias'];
    this.landingPageId = this.route.snapshot.params['id'];
    this.getVendorCompaniesByAlias();
    this.getFilteredCompanies();
  }

  ngAfterViewChecked() {
      this.setParentIframeHeight();
  }
  showContent(section: string) {
    this.activeCategory = section;

  }

  showAllCategories() {
    this.activeCategory = 'All Categories';

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
  }

  getVendorCompaniesByAlias() {
    this.landingPageService.getVendorCompaniesByAlias(this.alias).subscribe(
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

  navigateToParent(event: Event): void {
    event.preventDefault(); 
    const newUrl = (event.target as HTMLAnchorElement).href; 
    window.parent.location.href = newUrl;
  }

  setParentIframeHeight() {
    const componentHeight = this.elementRef.nativeElement.offsetHeight;
    (window.parent as any).$('#frame-full-height').height(componentHeight +20);
  }

}
