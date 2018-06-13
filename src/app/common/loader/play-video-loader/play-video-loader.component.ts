import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-play-video-loader',
  templateUrl: './play-video-loader.component.html',
  styleUrls: ['./play-video-loader.component.css']
})
export class PlayVideoLoaderComponent implements OnInit {
  @Input() playVideo:boolean;
  @Input() isPlaying:boolean;
  constructor() { }

  ngOnInit() {
  }

}
