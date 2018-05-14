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

    numberOfItemsPerPage = [
        { 'name': '12', 'value': '12' },
        { 'name': '24', 'value': '24' },
        { 'name': '48', 'value': '48' },
        { 'name': '---All---', 'value': '0' },
    ]

    public selectedSortedOption: any = this.sortByDropDown[3];
    public itemsSize: any = this.numberOfItemsPerPage[0];
    isListView: boolean = false;
    selectedCampaignTypeIndex:number = 0;
}
