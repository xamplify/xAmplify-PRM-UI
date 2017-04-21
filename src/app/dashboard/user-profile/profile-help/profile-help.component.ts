import { Component, OnInit } from '@angular/core';

declare var Metronic : any;
declare var Layout : any;
declare var Demo : any;
declare var Profile : any;

@Component({
  selector: 'app-profile-help',
  templateUrl: './profile-help.component.html',
  styleUrls: ['../../../../assets/css/bootstrap-fileinput.css','../../../../assets/css/profile.css']
})
export class ProfileHelpComponent implements OnInit {

  constructor() { }

  ngOnInit() {
      try{
          Metronic.init();
          Layout.init();
          Demo.init(); 
          Profile.init(); 
     }
     catch(err){}
 }       

}
