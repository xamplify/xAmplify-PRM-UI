import { Component, OnInit } from '@angular/core';
declare var Metronic : any;
declare var Layout : any;
declare var Demo : any;
declare var Profile : any;

@Component({
  selector: 'app-profile-lock',
  templateUrl: './profile-lock.component.html',
  styleUrls: ['./profile-lock.component.css']
})
export class ProfileLockComponent implements OnInit {

  constructor() { }

  ngOnInit() {
      try {
          Metronic.init();
          Layout.init(); 
          Demo.init();
      }
      catch (err) {
          console.log("error");
      }
  }

}
