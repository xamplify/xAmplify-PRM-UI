import { Component, OnInit,OnDestroy} from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { FormsModule, FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { Pagination } from '../../core/models/pagination';
import { Logger } from 'angular2-logger/core';
import { ReferenceService } from '../../core/services/reference.service';
import { validateCampaignSchedule,validateCampaignName } from '../../form-validator'; // not using multipleCheckboxRequireOne

declare var swal, $,  Metronic, Layout , Demo,TableManaged ,Promise;



@Component({
    selector: 'app-select-campaign',
    templateUrl: './select-campaign-type-component.html'
    //styleUrls: ['./publish-content.component.css','../../../assets/css/video-css/ribbons.css']
  })
  
export class SelectCampaignTypeComponent implements OnInit{
   
    public emailTypes = ['Video Campaign','Regular Campaign'];
    
    constructor(private route: ActivatedRoute, private fb: FormBuilder,private logger:Logger,private router:Router,private refService:ReferenceService){
        this.logger.info("select-campaign-type constructor loaded");
    }
   
    ngOnInit() {
        try{
            Metronic.init(); 
            Layout.init();
            Demo.init();
            TableManaged.init();
        }catch(error){
            this.logger.error("error in select-campaign-type ngOnInit()", error);
            swal( 'Oops...','Something went wrong!','error');
        }
        
    }
    
    
    createRegularCampaign(){
         this.refService.selectedCampaignType = "regular";
         this.router.navigate(["/home/campaigns/create-campaign"]);
     }
     createVideoCampaign(){
         this.refService.selectedCampaignType = "video";
         this.router.navigate(["/home/campaigns/create-campaign"]);
     }
    
    
}