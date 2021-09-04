import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-select-dropdown',
  templateUrl: './select-dropdown.component.html',
  styleUrls: ['./select-dropdown.component.css']
})
export class SelectDropdownComponent implements OnInit {

  dropDownValue:string = "";
  items:Array<any> = new Array<any>();
  showFolderDropDown: boolean = false;
  @Input() dropDownItems:Array<any> = new Array<any>();
  constructor() { }

  ngOnInit() {
     
  }

  filterDropDownData(inputElement: any) {
    if (inputElement == null || inputElement == undefined) {
      this.items = this.dropDownItems;
    } else {
      let value = inputElement.value;
      if (value != undefined && value != null && value != "") {
        this.items = this.dropDownItems.filter(
          item => item.name.toLowerCase().indexOf(value.toLowerCase()) > -1)
      } else {
        this.items = this.dropDownItems;
      }
    }
  }

  setDropDownValue(input: any) {
    this.dropDownValue = input.name;
    this.items = this.dropDownItems;
    this.showFolderDropDown = false;
  }


}
