import { Component, OnInit } from '@angular/core';
import { ReferenceService } from 'app/core/services/reference.service';

@Component({
  selector: 'app-access-denied-util',
  templateUrl: './access-denied-util.component.html',
  styleUrls: ['./access-denied-util.component.css']
})
export class AccessDeniedUtilComponent implements OnInit {

  constructor(public referenceService:ReferenceService) { }

  ngOnInit() {
  }

}
