import { Component, OnInit } from '@angular/core';
import { Properties } from '../../common/models/properties';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css','../../../assets/css/default.css', '../../../assets/css/authentication-page.css'],
  providers: [Properties]
})
export class VideoComponent implements OnInit {

  constructor(public properties: Properties) { }

  ngOnInit() {
  }

}
