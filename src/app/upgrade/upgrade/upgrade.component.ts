import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../core/services/authentication.service';

declare var Metronic ,Demo,Layout :any;

@Component({
  selector: 'app-upgrade',
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.css']
})
export class UpgradeComponent implements OnInit {

  constructor(private authenticationService:AuthenticationService) { }

  ngOnInit(){
      try{   
           Metronic.init();
           Layout.init(); 
           Demo.init(); 
      }
      catch(err){
      console.log("err");
      }
  }

}
