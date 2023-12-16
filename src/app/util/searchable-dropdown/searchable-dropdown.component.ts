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
  @Input() disableDropDown:boolean;
  public sort: string = 'Ascending'; 
  public value: string = '';


  constructor() { }

  

  ngOnInit() {
      if(this.dtoObject!=undefined && this.dtoObject.selectedProductId!=undefined && this.dtoObject.selectedProductId>0){
          this.value = this.dtoObject.selectedProductId;
      }
      this.disableDropDown = this.disableDropDown==undefined ? false:this.disableDropDown;
  }

  public onFiltering: EmitType<FilteringEventArgs>  =  (e: FilteringEventArgs) => {
    let query = new Query();
    query = (e.text != "") ? query.where("name", "contains", e.text, true) : query;
    e.updateData(this.searchableDropDownDto.data, query);
  };

  getSelectedDropDownData(event:any){
    let emitter = {};
    let selectedDropDownInfo = event.itemData;
    emitter['selectedDropDownInfo'] = selectedDropDownInfo;
    if(this.dtoObject!=undefined){
      this.dtoObject['price'] = selectedDropDownInfo['price'];
      this.dtoObject['cost'] = selectedDropDownInfo['cost'];
      this.dtoObject['id'] = selectedDropDownInfo['id'];
      this.dtoObject['revenue'] = selectedDropDownInfo['price'];
      emitter['dtoObject'] = this.dtoObject;
    }
    this.searchableDropdownEventEmitter.emit(emitter);

  }

}
