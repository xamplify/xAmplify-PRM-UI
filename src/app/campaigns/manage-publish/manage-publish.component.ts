import { Component, OnInit,OnDestroy} from '@angular/core';
import { ActivatedRoute,Router }   from '@angular/router';
import { FormsModule, FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';

import { VideoFileService} from '../../videos/services/video-file.service';
import { ContactService } from '../../contacts/services/contact.service';
import { CampaignService } from '../services/campaign.service';
import { UserService } from '../../core/services/user.service';
import { ReferenceService } from '../../core/services/reference.service';
import { Campaign} from '../models/campaign';
import { SaveVideoFile} from '../../videos/models/save-video-file';
import { ContactList } from '../../contacts/models/contact-list';
import { Logger } from 'angular2-logger/core';
import { Pagination} from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
declare var swal, $, videojs , Metronic, Layout , Demo,TableManaged ,Promise: any;


@Component({
  selector: 'app-manage-publish',
  templateUrl: './manage-publish.component.html',
  styleUrls: ['./manage-publish.component.css'],
  providers:[Pagination]
})
export class ManagePublishComponent implements OnInit,OnDestroy {
    campaigns:Campaign[];
    pager: any = {};
    pagedItems: any[];
    public totalRecords :number=1;
    public searchKey :string="";
    isCampaignCreated:boolean = false;
    isCampaignUpdated:boolean = false;
    isCampaignDeleted:boolean = false;
        sortByDropDown  = [
                   {'name':'Sort By','value':''},
                   {'name':'Name(A-Z)','value':'campaign-ASC'},
                   {'name':'Name(Z-A)','value':'campaign-DESC'},
                   {'name':'Created Date(ASC)','value':'createdTime-ASC'},
                   {'name':'Created Date(DESC)','value':'createdTime-DESC'}
                   ];
        
        numberOfItemsPerPage = [
                                {'name':'10','value':'10'},
                                {'name':'20','value':'20'},
                                {'name':'30','value':'30'},
                                {'name':'40','value':'40'},
                                {'name':'50','value':'50'},
                                {'name':'---All---','value':'0'},
                                ]
        
        public selectedSortedOption:any = this.sortByDropDown[0];
        public itemsSize:any = this.numberOfItemsPerPage[0];
                                                       
        
        
    constructor(private campaignService:CampaignService,private router:Router,private logger:Logger,
            private pagination:Pagination,private pagerService: PagerService,private refService:ReferenceService,private userService:UserService) {
        this.isCampaignCreated = this.refService.isCampaignCreated;
        this.isCampaignUpdated = this.refService.isCampaignUpdated;
        if(this.isCampaignCreated || this.isCampaignUpdated){
            setTimeout(function() { $("#lanchSuccess").slideUp(500); }, 2000);
        }
       
    }
    
    listCampaign(pagination:Pagination){
        this.campaignService.listCampaign(pagination,this.userService.loggedInUserData.id)
        .subscribe(
            data => {
                this.campaigns = data.campaigns;
                this.totalRecords = data.totalRecords;
                pagination.totalRecords = data.totalRecords;
                pagination = this.pagerService.getPagedItems(pagination, data.campaigns);
            },
            error => {
                this.logger.error("error in listCampaign()", error);
            },
            () => this.logger.info("Finished listCampaign()", this.campaigns)
        );
    }
    
    setPage(page: number) {
        this.pagination.pageIndex = page;
        this.listCampaign(this.pagination);
    }
    
    searchCampaigns(){
        this.getAllFilteredResults(this.pagination);
    }
    
    getSortedResult(text:any){
        this.selectedSortedOption = text;
        this.getAllFilteredResults(this.pagination);
    }
    
    getNumberOfItemsPerPage(items:any){
        this.itemsSize = items;
        this.getAllFilteredResults(this.pagination);
    }
    
    
    
    getAllFilteredResults(pagination:Pagination){
        this.pagination.pageIndex = 1;
        this.pagination.searchKey = this.searchKey;
        let sortedValue = this.selectedSortedOption.value;
        if(sortedValue!=""){
            let options:string[] = sortedValue.split("-");
            this.pagination.sortcolumn = options[0];
            this.pagination.sortingOrder = options[1];
        }
        
        if(this.itemsSize.value==0){
            this.pagination.maxResults = this.pagination.totalRecords;
        }else{
            this.pagination.maxResults = this.itemsSize.value;
        }
        this.listCampaign(this.pagination);
    }
    
    
    
    ngOnInit(){
        try{
            this.listCampaign(this.pagination);
        }catch(error){
            this.logger.error("error in manage-publish-component init() ",error);
        }
        
    }
    
    editCampaign(id:number){
        var obj = {'campaignId':id}
        this.campaignService.getCampaignById(obj)
        .subscribe(
        data => {
           this.campaignService.campaign=data;
           console.log(this.campaignService.campaign);
           this.router.navigate(["/home/campaigns/create-campaign"]);
        },
        error => console.log( error ),
        () => console.log()
        )
        
    }
    
    confirmDeleteCampaign(id:number){
        let self = this;
        swal( {
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'

        }).then( function() {
            self.deleteCampaign(id);
        })
    }
 
    deleteCampaign(id:number){
        this.campaignService.delete(id)
        .subscribe(
        data => {
            this.isCampaignDeleted = true;
            $( '#campaignListDiv_' + id ).remove();
            setTimeout( function() { $( "#deleteSuccess" ).slideUp( 500 ); }, 2000 );
            this.listCampaign(this.pagination);
        },
        error => { console.log(error)},
        () => console.log( "Campaign Deleted Successfully" )
        );
        this.isCampaignDeleted = false;
    }

    ngOnDestroy() {
        this.refService.isCampaignCreated = false;
        this.refService.isCampaignUpdated = false;
        this.isCampaignDeleted = false;
        
    }
    
    
}
