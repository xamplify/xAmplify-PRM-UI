import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { CampaignService } from '../services/campaign.service';
import { CampaignAccess } from '../models/campaign-access';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';

@Component({
  selector: 'app-select-manage-campaign',
  templateUrl: './select-manage-campaign.component.html',
  styleUrls: ['./select-manage-campaign.component.css'],
  providers: [CampaignService, CampaignAccess]

})
export class SelectManageCampaignComponent implements OnInit {
  vendorCompanyProfileName: string = null;
  manageCampaignsCountsLoader: boolean = false;
  manageCampaignsCounts: any;
  @Output() filterContentByType = new EventEmitter();
  // selectedFilter: string = '';
  @Output() archivedCampaignsClick = new EventEmitter<void>();
  @Output() partnerCampaignsClick = new EventEmitter<void>();

  @Input() selectedFilter: string = ''; // <-- this line is required
  @Input() marketingModulesEnabled: boolean = false;
  @Input() archived: boolean = false;
  @Input() campaignAccess: any;
  @Input() authModule: any;

  constructor(private authenticationService: AuthenticationService, private referenceService: ReferenceService,
    private router: Router, private campaignService: CampaignService, public vanityUrlService: VanityURLService) {
    if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
      this.vendorCompanyProfileName = this.authenticationService.companyProfileName;
    }
  }
  ngOnInit() {
    this.archived = false;
    this.getManageCampaignCounts();
  }
  ngOnChanges() {
    this.getManageCampaignCounts();
  }

  getManageCampaignCounts() {
    this.manageCampaignsCountsLoader = true;
    this.campaignService.getManageCampaignsCounts(this.vendorCompanyProfileName).subscribe(
      (response: any) => {
        this.manageCampaignsCountsLoader = false;
        if (response.statusCode == 200) {
          this.manageCampaignsCounts = response.map;
        }
      },
      (_error: any) => {
        this.manageCampaignsCountsLoader = false;
      }
    );
  }

  loadContentByType(selectedCategory: string) {
    const validFilters = [
      'all', 'draft-campagins', 'scheduled-campagins',
      'ended-campaigns', 'cancelled-campagins', 'archived-campagins',
      'draft-campagins', 'partner-campaigns', 'folders', 'active-campagins',
    ];

    if (validFilters.includes(selectedCategory)) {
      this.selectedFilter = selectedCategory;
    } else {
      this.selectedFilter = '';
    }
    if (selectedCategory == 'archived-campagins') {
      this.archived = true;
    } else {
      this.archived = false;
    }
    this.filterContentByType.emit(this.selectedFilter);
  }
  filterAssets(tabName: string): void {

    this.selectedFilter = tabName;

    this.loadContentByType(tabName);
  }

}
