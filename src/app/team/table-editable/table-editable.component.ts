import { Component, OnInit } from '@angular/core';
declare var Metronic ,Layout,Demo , TableEditable :any ;

@Component({
  selector: 'app-table-editable',
  templateUrl: './table-editable.component.html',
  styleUrls: ['./table-editable.component.css']
})
export class TableEditableComponent implements OnInit {

  constructor() { }


  ngOnInit(){
      try{
      console.log("Tablemanagedcomponent ngOnInit");
      Metronic.init(); 
      Layout.init(); 
      Demo.init(); 
      TableEditable.init();
      
      }
      catch(errr){}
  }

}
