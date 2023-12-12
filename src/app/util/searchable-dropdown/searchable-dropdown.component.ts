import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { EmitType } from '@syncfusion/ej2-base';
import { Query } from '@syncfusion/ej2-data';
import { SearchableDropdownDto } from 'app/core/models/searchable-dropdown-dto';
import { emit } from 'process';

@Component({
  selector: 'app-searchable-dropdown',
  templateUrl: './searchable-dropdown.component.html',
  styleUrls: ['./searchable-dropdown.component.css']
})
export class SearchableDropdownComponent implements OnInit {

  @Input() searchableDropDownDto:SearchableDropdownDto;
  @Output() searchableDropdownEventEmitter = new EventEmitter();
  @Input() dtoObject:any;

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
    let emitter = {};
    let selectedDropDownInfo = event.itemData;
    emitter['selectedDropDownInfo'] = selectedDropDownInfo;
    if(this.dtoObject!=undefined){
      this.dtoObject['price'] = selectedDropDownInfo['price'];
      this.dtoObject['cost'] = selectedDropDownInfo['cost'];
      this.dtoObject['id'] = selectedDropDownInfo['id'];
      emitter['dtoObject'] = this.dtoObject;
    }
    this.searchableDropdownEventEmitter.emit(emitter);

  }

}
