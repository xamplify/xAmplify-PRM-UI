import { Component ,OnInit} from '@angular/core';
import { Router } from '@angular/router';
declare var Metronic,Layout,Demo,Portfolio:any;

@Component({
  selector: 'app-user-video',
  templateUrl: './user-video.component.html',
  styleUrls :['./user-video.component.css']
   // styleUrls :['../video-css/ribbons.css']
})
export class UserVideoComponent implements OnInit {

constructor( public router: Router ) {}

ngOnInit() {

try {
Metronic.init();
Layout.init();
Demo.init();
Portfolio.init();
}
catch(err){}
}
}
