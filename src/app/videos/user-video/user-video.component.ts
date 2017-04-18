import { Component ,OnInit} from '@angular/core';
import { Router } from '@angular/router';
declare var Metronic,Layout,Demo,Portfolio:any;

@Component({
  selector: 'app-user-video',
  templateUrl: './user-video.component.html',
  styleUrls :['../../../assets/admin/pages/css/portfolio.css', '../../../assets/global/plugins/fancybox/source/jquery.fancybox.css','../video-css/ribbons.css']
})
export class UserVideoComponent implements OnInit {

	constructor( private router: Router ) {}
    
	   ngOnInit(){
	       
	       try{
	           Metronic.init();
	           Layout.init(); 
	           Demo.init(); 
	           Portfolio.init();  
	           
	       }
	       catch(err){}
	   }
	    
}
