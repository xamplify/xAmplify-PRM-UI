import { Component, OnInit } from '@angular/core';
import { ReferenceService } from 'app/core/services/reference.service';

declare var $:any;
@Component({
  selector: 'app-campaign-mdf-search',
  templateUrl: './campaign-mdf-search.component.html',
  styleUrls: ['./campaign-mdf-search.component.css']
})

export class CampaignMdfSearchComponent implements OnInit {

  constructor(public referenceService:ReferenceService) { }

  ngOnInit() {
    this.referenceService.hideVerticalScrollBar();
  }

  searchMdfAlias(){
    let value  = $('#mdfAlias').val();
    this.referenceService.openWindowInNewTab("/funding-request/"+value+"/analytics");
  }

}
