import { Component, OnInit } from '@angular/core';

declare var Metronic ,Layout,Demo , TableManaged :any ;

@Component({
  selector: 'app-manage-team',
  templateUrl: './manage-team.component.html',
  styleUrls: ['./manage-team.component.css']
})
export class ManageTeamComponent implements OnInit {

  constructor() { }

  ngOnInit(){
      try{
           Metronic.init();
           Layout.init(); 
           Demo.init(); 
           TableManaged.init();
      
      }
      catch(errr ){}
  }
}
