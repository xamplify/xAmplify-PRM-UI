import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-halopsa-authentication',
  templateUrl: './halopsa-authentication.component.html',
  styleUrls: ['./halopsa-authentication.component.css']
})
export class HalopsaAuthenticationComponent implements OnInit {
  @Input() loggedInUserId: any;
  @Output() closeEvent = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }
  closeForm() {
    console.log("Closed halopsa Auth")
    this.closeEvent.emit("0");
  }
}
