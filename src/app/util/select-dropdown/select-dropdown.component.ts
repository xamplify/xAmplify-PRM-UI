import { Component, OnInit, Input,EventEmitter,Output } from '@angular/core';
import { ReferenceService } from '../../core/services/reference.service';

@Component({
  selector: 'app-select-dropdown',
  templateUrl: './select-dropdown.component.html',
  styleUrls: ['./select-dropdown.component.css']
})
export class SelectDropdownComponent implements OnInit {

  defaultOption:string = "";
  filteredDropDownItems:Array<any> = new Array<any>();
  showFolderDropDown: boolean = false;
  @Input() dropDownItems:Array<any> = new Array<any>();
  @Input() categoryId:number = 0;
  @Input() disabled = false;
  @Output() selectDropdownComponentEmitter = new EventEmitter();
  dropDownSearchValue:any;
  constructor(public referenceService:ReferenceService) { }

  ngOnInit() {
    if(this.categoryId!=undefined && this.categoryId!=0){
     let selectedCategoryName = this.dropDownItems.filter((category) => category.id === this.categoryId)[0];
     this.defaultOption = selectedCategoryName['name'];
    }else{
      let names = this.referenceService.filterSelectedColumnsFromArrayList(this.dropDownItems,'name');
      this.defaultOption = names[0];
    }
    
  }

  filterDropDownData(inputElement: any) {
    if (inputElement == null || inputElement == undefined) {
      this.filteredDropDownItems = this.dropDownItems;
    } else {
      let value = inputElement.value;
      if (value != undefined && value != null && value != "") {
        this.filteredDropDownItems = this.dropDownItems.filter(
          item => item.name.toLowerCase().indexOf(value.toLowerCase()) > -1)
      } else {
        this.filteredDropDownItems = this.dropDownItems;
      }
    }
  }

  setDropDownValue(input: any) {
    this.defaultOption = input.name;
    this.filteredDropDownItems = this.dropDownItems;
    this.showFolderDropDown = false;
    this.selectDropdownComponentEmitter.emit(input.id);
  }


}
