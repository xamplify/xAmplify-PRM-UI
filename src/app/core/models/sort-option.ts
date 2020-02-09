export class SortOption {
    pager: any = {};
    pagedItems: any[];
    public totalRecords: number = 1;
    public searchKey: string = "";
    sortByDropDown = [
        { 'name': 'Sort By', 'value': '' },
        { 'name': 'Name(A-Z)', 'value': 'campaign-ASC' },
        { 'name': 'Name(Z-A)', 'value': 'campaign-DESC' },
        { 'name': 'Created On(ASC)', 'value': 'createdTime-ASC' },
        { 'name': 'Created On(DESC)', 'value': 'createdTime-DESC' }
    ];

    partnerCampaignDetailsSortDropDown = [
        { 'name': 'Sort By', 'value': '' },
        { 'name': 'Name(A-Z)', 'value': 'campaign-ASC' },
        { 'name': 'Name(Z-A)', 'value': 'campaign-DESC' },
        { 'name': 'Launched By(ASC)', 'value': 'launchedBy-ASC' },
        { 'name': 'Launched By(DESC)', 'value': 'launchedBy-DESC' },
        { 'name': 'Launched On(ASC)', 'value': 'createdTime-ASC' },
        { 'name': 'Launched On(DESC)', 'value': 'createdTime-DESC' }

         ];

    campaignPartnersRemoveAccessSortDropDown = [
        { 'name': 'Sort By', 'value': '' },
        { 'name': 'Email ID(A-Z)', 'value': 'emailId-ASC' },
        { 'name': 'Email ID(Z-A)', 'value': 'emailId-DESC' },
        { 'name': 'First Name(ASC)', 'value': 'firstName-ASC' },
        { 'name': 'First Name(DESC)', 'value': 'firstName-DESC' },
        { 'name': 'Last Name(ASC)', 'value': 'lastName-ASC' },
        { 'name': 'Last Name(DESC)', 'value': 'lastName-DESC' }
      ];

    leadPartnersSortDropDown = [
        { 'name': 'Sort By', 'value': '' },
        { 'name': 'Email ID(A-Z)', 'value': 'emailId-ASC' },
        { 'name': 'Email ID(Z-A)', 'value': 'emailId-DESC' },
        { 'name': 'First Name(ASC)', 'value': 'firstName-ASC' },
        { 'name': 'First Name(DESC)', 'value': 'firstName-DESC' },
        { 'name': 'Last Name(ASC)', 'value': 'lastName-ASC' },
        { 'name': 'Last Name(DESC)', 'value': 'lastName-DESC' },
        { 'name': 'Leads Count(ASC)', 'value': 'count-ASC' },
        { 'name': 'Leads Count(DESC)', 'value': 'count-DESC' }
      ];

    dealPartnersSortDropDown = [
        { 'name': 'Sort By', 'value': '' },
        { 'name': 'Email ID(A-Z)', 'value': 'emailId-ASC' },
        { 'name': 'Email ID(Z-A)', 'value': 'emailId-DESC' },
        { 'name': 'First Name(ASC)', 'value': 'firstName-ASC' },
        { 'name': 'First Name(DESC)', 'value': 'firstName-DESC' },
        { 'name': 'Last Name(ASC)', 'value': 'lastName-ASC' },
        { 'name': 'Last Name(DESC)', 'value': 'lastName-DESC' },
        { 'name': 'Deals Count(ASC)', 'value': 'count-ASC' },
        { 'name': 'Deals Count(DESC)', 'value': 'count-DESC' }
      ];



    leadsSortDropDown = [
        { 'name': 'Sort By', 'value': '' },
        { 'name': 'Email ID(A-Z)', 'value': 'emailId-ASC' },
        { 'name': 'Email ID(Z-A)', 'value': 'emailId-DESC' },
        { 'name': 'Campaign Name(A-Z)', 'value': 'campaignName-ASC' },
        { 'name': 'Campaign Name(Z-A)', 'value': 'campaignName-DESC' },
        { 'name': 'First Name(ASC)', 'value': 'firstName-ASC' },
        { 'name': 'First Name(DESC)', 'value': 'firstName-DESC' },
        { 'name': 'Last Name(ASC)', 'value': 'lastName-ASC' },
        { 'name': 'Last Name(DESC)', 'value': 'lastName-DESC' },
        { 'name': 'Deal Title(ASC)', 'value': 'title-ASC' },
        { 'name': 'Deal Title(DESC)', 'value': 'title-DESC' },
        { 'name': 'Created Date(ASC)', 'value': 'createdTime-ASC' },
        { 'name': 'Created Date(DESC)', 'value': 'createdTime-DESC' }
      ];

      leadCampaignsSortDropDown = [
        { 'name': 'Sort By', 'value': '' },
        { 'name': 'Campaign Name(A-Z)', 'value': 'campaign-ASC' },
        { 'name': 'Campaign Name(Z-A)', 'value': 'campaign-DESC' },

        { 'name': 'Launch Date(ASC)', 'value': 'createdTime-ASC' },
        { 'name': 'Launch Date(DESC)', 'value': 'createdTime-DESC' },
        { 'name': 'Lead Count(ASC)', 'value': 'count-ASC' },
        { 'name': 'Lead Count(DESC)', 'value': 'count-DESC' }
         ]
         dealCampaignsSortDropDown = [
          { 'name': 'Sort By', 'value': '' },
          { 'name': 'Campaign Name(A-Z)', 'value': 'campaign-ASC' },
          { 'name': 'Campaign Name(Z-A)', 'value': 'campaign-DESC' },

          { 'name': 'Launch Date(ASC)', 'value': 'createdTime-ASC' },
          { 'name': 'Launch Date(DESC)', 'value': 'createdTime-DESC' },
          { 'name': 'Deal Count(ASC)', 'value': 'count-ASC' },
          { 'name': 'Deal Count(DESC)', 'value': 'count-DESC' }
           ]

    dealCampaignsSortDropDownOld = [
        { 'name': 'Sort By', 'value': '' },
        { 'name': 'Name(A-Z)', 'value': 'campaign-ASC' },
        { 'name': 'Name(Z-A)', 'value': 'campaign-DESC' },
        { 'name': 'Email ID(A-Z)', 'value': 'emailId-ASC' },
        { 'name': 'Email ID(Z-A)', 'value': 'emailId-DESC' },
        { 'name': 'First Name(ASC)', 'value': 'firstName-ASC' },
        { 'name': 'First Name(DESC)', 'value': 'firstName-DESC' },
        { 'name': 'Last Name(ASC)', 'value': 'lastName-ASC' },
        { 'name': 'Last Name(DESC)', 'value': 'lastName-DESC' },
        { 'name': 'Created Date(ASC)', 'value': 'createdTime-ASC' },
        { 'name': 'Created Date(DESC)', 'value': 'createdTime-DESC' },
        { 'name': 'Deals Count(ASC)', 'value': 'count-ASC' },
        { 'name': 'Deals Count(DESC)', 'value': 'count-DESC' }
         ];

    manageFormsSortOptions = [
                      { 'name': 'Name (A-Z)', 'value': 'name-ASC' },
                      { 'name': 'Name (Z-A)', 'value': 'name-DESC' },
                      { 'name': 'Created On (ASC)', 'value': 'createdTime-ASC' },
                      { 'name': 'Created On (DESC)', 'value': 'createdTime-DESC' },
                      { 'name': 'Updated On (ASC)', 'value': 'updatedTime-ASC' },
                      { 'name': 'Updated On (DESC)', 'value': 'updatedTime-DESC' }
                  ];

    partnerLandingPageSortOptions = [
                                     { 'name': 'Name (A-Z)', 'value': 'name-ASC' },
                                     { 'name': 'Name (Z-A)', 'value': 'name-DESC' },
                                     { 'name': 'Shared On (ASC)', 'value': 'createdTime-ASC' },
                                     { 'name': 'Shared On (DESC)', 'value': 'createdTime-DESC' }
                                     ];

    demoRequestSortOptions = [
                                     { 'name': 'First Name (A-Z)', 'value': 'firstName-ASC' },
                                     { 'name': 'First Name (Z-A)', 'value': 'firstName-DESC' },
                                     { 'name': 'Email Id (A-Z)', 'value': 'emailId-ASC' },
                                     { 'name': 'Email Id (Z-A)', 'value': 'emailId-DESC' },
                                     { 'name': 'TimeZone (A-Z)', 'value': 'timezone-ASC' },
                                     { 'name': 'TimeZone(Z-A)', 'value': 'timezone-DESC' },
                                     { 'name': 'Created Time (ASC)', 'value': 'createdTime-ASC' },
                                     { 'name': 'Created Time (DESC)', 'value': 'createdTime-DESC' }
                                     ];

   categorySortDropDownOptions = [
                                      { 'name': 'Name (A-Z)', 'value': 'name-ASC' },
                                      { 'name': 'Name (Z-A)', 'value': 'name-DESC' },
                                      { 'name': 'Created On (ASC)', 'value': 'createdTime-ASC' },
                                      { 'name': 'Created On (DESC)', 'value': 'createdTime-DESC' },
                                      { 'name': 'Updated On (ASC)', 'value': 'updatedTime-ASC' },
                                      { 'name': 'Updated On (DESC)', 'value': 'updatedTime-DESC' },
                                      { 'name': 'Count (ASC)', 'value': 'count-ASC' },
                                      { 'name': 'Count (DESC)', 'value': 'count-DESC' }
                                  ];


    numberOfItemsPerPage = [
        { 'name': '12', 'value': '12' },
        { 'name': '24', 'value': '24' },
        { 'name': '48', 'value': '48' },
        { 'name': '---All---', 'value': '0' },
    ]
    public selectedSortedOption: any = this.sortByDropDown[0];
    public defaultSortOption:any = this.partnerCampaignDetailsSortDropDown[0];
    public dealsPartnerSortOption:any = this.dealPartnersSortDropDown[0];
    public leadPartnerSortOption:any = this.leadPartnersSortDropDown[0];
    public leadsSortOption:any = this.leadsSortDropDown[0];
    public dealCampaignSortOption:any = this.dealCampaignsSortDropDown[0];
    public leadCampaignSortOption:any = this.leadCampaignsSortDropDown[0];
    public  campaignPartnersRemoveAccessDefaultSortOption:any = this.campaignPartnersRemoveAccessSortDropDown[0];
    public formsSortOption: any = this.manageFormsSortOptions[3];
    public partnerLandingPageSortOption:any = this.partnerLandingPageSortOptions[3];
    public selectedDemoRequestSortOption:any = this.demoRequestSortOptions[7];
    public selectedCategoryDropDownOption:any = this.categorySortDropDownOptions[5];
    public itemsSize: any = this.numberOfItemsPerPage[0];
    isListView: boolean = false;
    selectedCampaignTypeIndex:number = 0;

}
