import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { EmitType } from '@syncfusion/ej2-base';
import { Query } from '@syncfusion/ej2-data';
import { SearchableDropdownDto } from 'app/core/models/searchable-dropdown-dto';

@Component({
  selector: 'app-searchable-dropdown',
  templateUrl: './searchable-dropdown.component.html',
  styleUrls: ['./searchable-dropdown.component.css']
})
export class SearchableDropdownComponent implements OnInit {

  @Input() searchableDropDownDto:SearchableDropdownDto;
  @Output() searchableDropdownEventEmitter = new EventEmitter();

  constructor() { }

  //Bind the filter event
  public onFiltering: EmitType<FilteringEventArgs>  =  (e: FilteringEventArgs) => {
      let query = new Query();
      //frame the query based on search string with filter type.
      query = (e.text != "") ? query.where("name", "contains", e.text, true) : query;
      //pass the filter data source, filter query to updateData method.
      e.updateData(this.searchableDropDownDto.data, query);
  };

  ngOnInit() {
  
  }

  getSelectedDropDownData(event:any){
    console.log(event.itemData);
    this.searchableDropdownEventEmitter.emit(event.itemData);

  }

}
