import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-platform',
  templateUrl: './platform.component.html',
  styleUrls: ['./platform.component.css']
})
export class PlatformComponent implements OnInit {
@Input() userPlatform: any;
@Input() deviceTypeOs: boolean;
  constructor() { }

  ngOnInit() {
  }

}
