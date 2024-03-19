import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ReferenceService } from 'app/core/services/reference.service';

@Component({
  selector: 'app-halopsa-authentication',
  templateUrl: './halopsa-authentication.component.html',
  styleUrls: ['./halopsa-authentication.component.css']
})
export class HalopsaAuthenticationComponent implements OnInit {
  @Input() loggedInUserId: any;
  @Output() closeEvent = new EventEmitter<any>();
  constructor(public referenceService: ReferenceService,) { }

  ngOnInit() {
    this.referenceService.goToTop();
  }
  closeForm() {
    console.log("Closed halopsa Auth")
    this.closeEvent.emit("0");
  }
}
