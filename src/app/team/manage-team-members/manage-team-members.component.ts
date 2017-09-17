import { Component, OnInit } from '@angular/core';

declare var Metronic ,Layout,Demo , TableManaged :any ;

@Component({
  selector: 'app-manage-team',
  templateUrl: './manage-team-members.component.html',
  styleUrls: ['./manage-team-members.component.css']
})
export class ManageTeamMembersComponent implements OnInit {

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
