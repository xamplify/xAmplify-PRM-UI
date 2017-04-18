import { Component, OnInit } from '@angular/core';

declare var Metronic :any;
declare var Layout :any;
declare var Demo:any;
declare var FormSamples:any;

@Component({
  selector: 'app-play-streamer',
  templateUrl: './play-streamer.component.html',
  styleUrls :[ '../video-css/portfolio.css'] //'../video-css/jquery.fancybox.css',
})
export class PlayStreamerComponent implements OnInit {

  constructor() { }

  ngOnInit(){
      try{
            Metronic.init();
            Layout.init(); 
            Demo.init(); 
            FormSamples.init();
      }
      catch(err){}
      
     }       

}
