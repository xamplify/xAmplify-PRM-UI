import { Component, OnInit,OnDestroy} from '@angular/core';
import { ActivatedRoute,Router }   from '@angular/router';
import { FormsModule, FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';

import { VideoFileService} from '../../videos/services/video-file.service';
import { ContactService } from '../../contacts/contact.service';
import { CampaignService } from '../services/campaign.service';
import { UserService } from '../../core/services/user.service';

import { Campaign} from '../models/campaign';
import { SaveVideoFile} from '../../videos/models/save-video-file';
import { ContactList } from '../../contacts/models/contact-list';

declare var swal, $, videojs , Metronic, Layout , Demo,TableManaged ,Promise: any;


@Component({
  selector: 'app-manage-publish',
  templateUrl: './manage-publish.component.html',
  styleUrls: ['./manage-publish.component.css','../../../assets/css/form.errors.css']
})
export class ManagePublishComponent implements OnInit {


    campaigns:Campaign[];
    constructor(private campaignService:CampaignService,private router:Router) {
    }
    listCampaign(){
        this.campaignService.listCampaign()
        .subscribe(
            data => {
                this.campaigns = data;
            },
            error => {
                swal(error,"","error");
            },
            () => console.log("Done")
        );
    }
    
    ngOnInit(){
        this.listCampaign();
    }
    
    editCampaign(id:number){
        var obj = {'campaignId':id}
        this.campaignService.getCampaignById(obj)
        .subscribe(
        data => {
           this.campaignService.campaign=data;
           console.log(this.campaignService.campaign);
           this.router.navigate(["/home/campaigns/publishContent"]);
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
            $( '#campaignListDiv_' + id ).remove();
            swal(data,'', 'success' );
        },
        error => { swal(error,"","error");},
        () => console.log( "Campaign Deleted Successfully" )
        );
    }
 
}
