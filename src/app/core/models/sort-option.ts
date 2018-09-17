export class SortOption {
    pager: any = {};
    pagedItems: any[];
    public totalRecords: number = 1;
    public searchKey: string = "";
    sortByDropDown = [
        { 'name': 'Name(A-Z)', 'value': 'campaign-ASC' },
        { 'name': 'Name(Z-A)', 'value': 'campaign-DESC' },
        { 'name': 'Created Date(ASC)', 'value': 'createdTime-ASC' },
        { 'name': 'Created Date(DESC)', 'value': 'createdTime-DESC' }
    ];
    
    partnerCampaignDetailsSortDropDown = [
                { 'name': 'Name(A-Z)', 'value': 'campaign-ASC' },
                { 'name': 'Name(Z-A)', 'value': 'campaign-DESC' },
                { 'name': 'Launched By(ASC)', 'value': 'launchedBy-ASC' },
                { 'name': 'Launched By(DESC)', 'value': 'launchedBy-DESC' },
                { 'name': 'Launched On(ASC)', 'value': 'createdTime-ASC' },
                { 'name': 'Launched On(DESC)', 'value': 'createdTime-DESC' }
                                                          
         ];

    campaignPartnersRemoveAccessSortDropDown = [
                                                { 'name': 'Email ID(A-Z)', 'value': 'emailId-ASC' },
                                                { 'name': 'Email ID(Z-A)', 'value': 'emailId-DESC' },
                                                { 'name': 'First Name(ASC)', 'value': 'firstName-ASC' },
                                                { 'name': 'First Name(DESC)', 'value': 'firstName-DESC' },
                                                { 'name': 'Last Name(ASC)', 'value': 'lastName-ASC' },
                                                { 'name': 'Last Name(DESC)', 'value': 'lastName-DESC' }
                                                
                                                
              ];
    
    numberOfItemsPerPage = [
        { 'name': '12', 'value': '12' },
        { 'name': '24', 'value': '24' },
        { 'name': '48', 'value': '48' },
        { 'name': '---All---', 'value': '0' },
    ]
    public selectedSortedOption: any = this.sortByDropDown[3];
    public defaultSortOption:any = this.partnerCampaignDetailsSortDropDown[5];
    public  campaignPartnersRemoveAccessDefaultSortOption:any = this.campaignPartnersRemoveAccessSortDropDown[0];
    public itemsSize: any = this.numberOfItemsPerPage[0];
    isListView: boolean = false;
    selectedCampaignTypeIndex:number = 0;
        
}
