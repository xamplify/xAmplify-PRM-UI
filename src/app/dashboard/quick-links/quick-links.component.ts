import { Component, OnInit } from '@angular/core';
import { ReferenceService } from 'app/core/services/reference.service';

@Component({
  selector: 'app-quick-links',
  templateUrl: './quick-links.component.html',
  styleUrls: ['./quick-links.component.css']
})
export class QuickLinksComponent implements OnInit {

  quickLinks:Array<any> = new Array<any>();
  constructor(public referenceService:ReferenceService) { }

  ngOnInit() {
  }

}
