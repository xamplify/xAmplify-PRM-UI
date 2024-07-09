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
  @Input() id:any;
  @Input() disableDropDown:boolean;
  @Input() account:any;
  public sort: string = 'Ascending'; 
  public value: string = '';
  @Output() accountChange: EventEmitter<any> = new EventEmitter<any>();


  constructor() { }

  

  ngOnInit() {
      this.value = this.id;
      if (this.account != undefined) {
        this.value = this.account;
      }
      this.disableDropDown = this.disableDropDown==undefined ? false:this.disableDropDown;
  }

  public onFiltering: EmitType<FilteringEventArgs>  =  (e: FilteringEventArgs) => {
    let query = new Query();
    query = (e.text != "") ? query.where("name", "contains", e.text, true) : query;
    e.updateData(this.searchableDropDownDto.data, query);
  };

  getSelectedDropDownData(event:any){
    let selectedDropDownInfo = event.itemData;
    this.accountChange.emit(selectedDropDownInfo.id);
    this.searchableDropdownEventEmitter.emit(selectedDropDownInfo);
  }

}
