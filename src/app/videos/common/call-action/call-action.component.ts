import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-call-action',
  templateUrl: './call-action.component.html',
  styleUrls: ['./call-action.component.css','../../../../assets/css/video-css/call-action.css']
})
export class CallActionComponent implements OnInit {
  @Input() selectedVideo: any
  constructor() { }

  ngOnInit() {
  }

}
