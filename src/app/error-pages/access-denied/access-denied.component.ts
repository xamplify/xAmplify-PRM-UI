import { Component, OnInit } from '@angular/core';
import { ReferenceService } from '../../core/services/reference.service';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.css']
})
export class AccessDeniedComponent implements OnInit {

  constructor(public referenceService:ReferenceService) { }

  ngOnInit() {
  }

}
