import { Component, OnInit, Input,EventEmitter,Output } from '@angular/core';
import { ReferenceService } from '../../core/services/reference.service';

@Component({
  selector: 'app-select-dropdown',
  templateUrl: './select-dropdown.component.html',
  styleUrls: ['./select-dropdown.component.css']
})
export class SelectDropdownComponent implements OnInit {

  @Input()defaultOption:string = "";
  items:Array<any> = new Array<any>();
  showFolderDropDown: boolean = false;
  @Input() dropDownItems:Array<any> = new Array<any>();
  @Output() notifyParentComponent = new EventEmitter();
  constructor(public referenceService:ReferenceService) { }

  ngOnInit() {
    // let names = this.referenceService.filterSelectedColumnsFromArrayList(this.dropDownItems,'name');
    // this.defaultOption = names[0];
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
    this.defaultOption = input.name;
    this.items = this.dropDownItems;
    this.showFolderDropDown = false;
    this.notifyParentComponent.emit(input.id);
  }


}
