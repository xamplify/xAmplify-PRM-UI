import { Component, OnInit,Input,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
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
  isChildComponentCalled = false;
  isPartnersRouter = false;
  selectedIds =[];
  selectedModule = "";
  constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService,public properties:Properties,private router: Router) { }

  ngOnInit() {
    this.isPartnersRouter =  this.router.url.includes("/partners/");
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
    this.selectedModule = this.filterOptions[0];
    this.modalHeaderText = "Please Select "+this.selectedModule;
    this.contact = contact;
    this.type = type;
    this.selectedPartnerListId = partnerListId;
    this.referenceService.openModalPopup(this.modalPopUpId);
    this.applyFilter(0,this.selectedModule);

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
    this.isChildComponentCalled = false;
    this.selectedModule = "";
  }

  closePopup(){
    this.resetValues();
    this.referenceService.closeModalPopup(this.modalPopUpId);
  }

  applyFilter(index:number,filterOption:string){
    this.selectedIndex = index;
    this.isChildComponentCalled = false;
    this.modalHeaderText = "Please Select "+filterOption;
    this.isChildComponentCalled = true;
    
  }

  shareCampaignsEventReceiver(event:any){
  }

  share(){
    
  }

}
