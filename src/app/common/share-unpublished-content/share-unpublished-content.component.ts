import { Component, OnInit,Input } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';

@Component({
  selector: 'app-share-unpublished-content',
  templateUrl: './share-unpublished-content.component.html',
  styleUrls: ['./share-unpublished-content.component.css']
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
  constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService) { }

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
    this.referenceService.openModalPopup(this.modalPopUpId);

  }

  private addFilterOptions() {
    if(this.hasCampaignAccess) {
      this.filterOptions.push("Campaigns");
    }
    if(this.hasDamAccess) {
      this.filterOptions.push("Dam");
    }
    if(this.hasLmsAccess) {
      this.filterOptions.push("Tracks");
    }
    if(this.hasPlaybookAccess) {
      this.filterOptions.push("Playbooks");
    }
  }

  private resetValues() {
    this.filterOptions = [];
    this.modalHeaderText = "";
    this.showFilterOptions = false;
  }

  closePopup(){
    this.referenceService.closeModalPopup(this.modalPopUpId);
  }

}
