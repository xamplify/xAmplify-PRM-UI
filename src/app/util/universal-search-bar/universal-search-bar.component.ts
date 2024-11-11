import { Component, OnInit } from '@angular/core';
import { RouterUrlConstants } from 'app/constants/router-url.contstants';
import { ReferenceService } from 'app/core/services/reference.service';

@Component({
  selector: 'app-universal-search-bar',
  templateUrl: './universal-search-bar.component.html',
  styleUrls: ['./universal-search-bar.component.css']
})
export class UniversalSearchBarComponent implements OnInit {
  searchKey: string;
  constructor(private refService:ReferenceService) { }

  ngOnInit() {
    this.searchKey = this.refService.universalSearchKey;
  }
  universalSearch() {
    this.refService.universalSearchKey = this.searchKey
    this.refService.goToRouter(RouterUrlConstants.home+RouterUrlConstants.dashboard+RouterUrlConstants.universalSearch)
  }
  universalSearchOnKeyPress(keyCode:any) {
    if (keyCode === 13) { 
      this.universalSearch();
    }
  }
}
