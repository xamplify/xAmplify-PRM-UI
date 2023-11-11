import { Component, OnInit,Input,ViewChild } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { Properties } from '../models/properties';
import { ShareCampaignsComponent } from '../share-campaigns/share-campaigns.component';

@Component({
  selector: 'app-share-unpublished-content',
  templateUrl: './share-unpublished-content.component.html',
  styleUrls: ['./share-unpublished-content.component.css'],
  providers:[Properties]
})
export class ShareUnpublishedContentComponent implements OnInit {

  /**XNFR-342****/
  selectedIndex = 0;
  headerText = "";
  @Input() hasCampaignAccess = false;
  @Input() hasDamAccess = false;
  @Input() hasLmsAccess =false;
  @Input() hasPlaybookAccess = false;
  showFilterOptions = false;
  modalPopUpId = "shareUnPublishedContentPopUp";
  modalHeaderText = "";
  filterOptions:Array<string> = new Array<string>();
  @ViewChild('shareCampaignsComponent') shareCampaignsComponent: ShareCampaignsComponent;
  selectedPartnerListId = 0;
  contact:any;
  type  = "";
  constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService,public properties:Properties) { }

  ngOnInit() {
  }

  openPopUp(partnerListId: number, contact:any,type:string){
    this.resetValues();
    let accessList = [];
    accessList.push(this.hasCampaignAccess);
    accessList.push(this.hasDamAccess);
    accessList.push(this.hasLmsAccess);
    accessList.push(this.hasPlaybookAccess);
    let filteredArrayList = this.referenceService.filterArrayList(accessList,false);
    this.showFilterOptions = filteredArrayList!=undefined && filteredArrayList.length>1;
    this.addFilterOptions();
    let firstFilterOption = this.filterOptions[0];
    this.modalHeaderText = "Please Select "+firstFilterOption;
    this.contact = contact;
    this.type = type;
    this.selectedPartnerListId = partnerListId;
    this.referenceService.openModalPopup(this.modalPopUpId);

  }

  private addFilterOptions() {
    if(this.hasCampaignAccess) {
      this.filterOptions.push(this.properties.campaignsHeaderText);
    }
    if(this.hasDamAccess) {
      this.filterOptions.push(this.properties.assetsHeaderText);
    }
    if(this.hasLmsAccess) {
      this.filterOptions.push(this.properties.tracksHeaderText);
    }
    if(this.hasPlaybookAccess) {
      this.filterOptions.push(this.properties.playBooksHeaderText);
    }
  }

  private resetValues() {
    this.filterOptions = [];
    this.modalHeaderText = "";
    this.showFilterOptions = false;
    this.selectedPartnerListId = 0;
    this.contact = {};
    this.type = "";
  }

  closePopup(){
    this.referenceService.closeModalPopup(this.modalPopUpId);
  }

  applyFilter(index:number,filterOption:string){
    this.selectedIndex = index;
    this.modalHeaderText = "Please Select "+filterOption;
    if(filterOption==this.properties.campaignsHeaderText){
      this.shareCampaignsComponent.loadCampaigns(this.selectedPartnerListId,this.contact,this.type);
    }else if(filterOption==this.properties.assetsHeaderText){
    }else if(filterOption==this.properties.tracksHeaderText){
    }else if(filterOption==this.properties.playBooksHeaderText){
    }
    
  }

  shareCampaignsEventReceiver(event:any){
  }

}
