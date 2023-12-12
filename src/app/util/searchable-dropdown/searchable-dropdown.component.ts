import { Component, OnInit } from '@angular/core';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { EmitType } from '@syncfusion/ej2-base';
import { Query } from '@syncfusion/ej2-data';
@Component({
  selector: 'app-searchable-dropdown',
  templateUrl: './searchable-dropdown.component.html',
  styleUrls: ['./searchable-dropdown.component.css']
})
export class SearchableDropdownComponent implements OnInit {

  constructor() { }

  
   // defined the array of data
   public data: { [key: string]: Object }[] = [
    { Id: "s3", Country: "Alaska" },
    { Id: "s1", Country: "California" },
    { Id: "s2", Country: "Florida" },
    { Id: "s4", Country: "Georgia" }];
// maps the appropriate column to fields property
public fields: Object = { text: "Country", value: "Id" };
// set the placeholder to the DropDownList input
public text: string = "Select a country";
//Bind the filter event
public onFiltering: EmitType<FilteringEventArgs>  =  (e: FilteringEventArgs) => {
    let query = new Query();
    //frame the query based on search string with filter type.
    query = (e.text != "") ? query.where("Country", "contains", e.text, true) : query;
    //pass the filter data source, filter query to updateData method.
    e.updateData(this.data, query);
    console.log(this.data);
    console.log(query);
    console.log(e);
    
};

  ngOnInit() {
  }

}
