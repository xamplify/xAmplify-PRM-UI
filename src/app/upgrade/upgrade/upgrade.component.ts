import { Component, OnInit } from '@angular/core';

declare var Metronic ,Demo,Layout :any;

@Component({
  selector: 'app-upgrade',
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.css']
})
export class UpgradeComponent implements OnInit {

  constructor() { }

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
