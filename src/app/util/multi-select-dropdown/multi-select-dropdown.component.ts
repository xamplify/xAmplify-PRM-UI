import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-multi-select-dropdown',
  templateUrl: './multi-select-dropdown.component.html',
  styleUrls: ['./multi-select-dropdown.component.css']
})
export class MultiSelectDropdownComponent implements OnInit {

  @Input() dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  @Input() displayText="";
  @Input() singleSelection = false;
  @Output() multiSelectDropdownSingleSelectionEventEmitter =new EventEmitter();
  @Output() multiSelectDropdownMultiSelectionEventEmitter =new EventEmitter();
  

  constructor() { }

  ngOnInit() {

    if(this.displayText==undefined){
      this.displayText = "Select Items";
    }
    if(this.singleSelection==undefined){
      this.singleSelection = false;
    }

    this.dropdownSettings = {
      singleSelection: this.singleSelection,
      text: this.displayText,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "myclass custom-class"
    };
  }

  onItemSelect(item: any) {
    this.multiSelectDropdownSingleSelectionEventEmitter.emit(item);
  }
  OnItemDeSelect(item: any) {
    this.multiSelectDropdownSingleSelectionEventEmitter.emit();
  }
  onSelectAll(items: any) {
    this.multiSelectDropdownMultiSelectionEventEmitter.emit(items);
  }
  onDeSelectAll(items: any) {
    this.multiSelectDropdownMultiSelectionEventEmitter.emit(items);
  }

}
