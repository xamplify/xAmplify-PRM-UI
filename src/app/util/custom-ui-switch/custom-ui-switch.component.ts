import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-custom-ui-switch',
  templateUrl: './custom-ui-switch.component.html',
  styleUrls: ['./custom-ui-switch.component.css']
})
export class CustomUiSwitchComponent implements OnInit {
  test = false;
  constructor() { }

  ngOnInit() {
  }

}
