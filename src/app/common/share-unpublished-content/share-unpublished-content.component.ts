import { Component, OnInit,Input } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
  }

  openPopUp(){
    alert("Share UnPublished Content Component Called");
  }

}
