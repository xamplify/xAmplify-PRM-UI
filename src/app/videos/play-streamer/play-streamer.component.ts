import { Component, OnInit } from '@angular/core';

declare var Metronic, Layout, Demo, FormSamples: any;
@Component({
  selector: 'app-play-streamer',
  templateUrl: './play-streamer.component.html',
 styleUrls : ['../../../assets/css/jquery.nouislider.min.css',
              '../../../assets/css/jquery.nouislider.pips.min.css', '../../../assets/css/about-us.css',
              '../../../assets/css/timeline.css', '../../../assets/css/todo.css'
   ] 
})

export class PlayStreamerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
      try {
            Metronic.init();
            Layout.init();
            Demo.init();
            FormSamples.init();
      }
      catch(err) { }

     }
}
