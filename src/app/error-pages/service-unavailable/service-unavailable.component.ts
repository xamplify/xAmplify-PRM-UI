import { Component, OnInit } from '@angular/core';
import { ReferenceService } from '../../core/services/reference.service';

@Component({
  selector: 'app-service-unavailable',
  templateUrl: './service-unavailable.component.html',
  styleUrls: ['./service-unavailable.component.css']
})
export class ServiceUnavailableComponent implements OnInit {

  constructor(public referenceService:ReferenceService) { }

  ngOnInit() {
    console.log("service unavailable component");
  }

}
