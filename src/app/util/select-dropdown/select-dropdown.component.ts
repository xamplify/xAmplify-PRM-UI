import { Component, OnInit, Input,EventEmitter,Output } from '@angular/core';
import { ReferenceService } from '../../core/services/reference.service';
declare var $:any;
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
  @Input() categoryId:any;
  @Input() disabled = false;
  @Input() isDropDownSelectedValueIsText = false;
  @Input() showIcon = false;
  @Output() selectDropdownComponentEmitter = new EventEmitter();
  dropDownSearchValue:any;
  selectedIcon = "";
  constructor(public referenceService:ReferenceService) { }

  ngOnInit() {
    if(this.isDropDownSelectedValueIsText){
      this.setDefaultOptionOrSelectedOptionWithIcon();
    }else{
      this.setDefaultOptionOrSelectedOption();
    }
    
  }

  private setDefaultOptionOrSelectedOptionWithIcon() {
    if (this.categoryId != "") {
      let isStartsWithFa =  /^fa-/i.test(this.categoryId);
      if(isStartsWithFa){
        this.categoryId = "fa "+this.categoryId;
      }
      let selectedCategoryName = this.dropDownItems.filter((category) => category.id === this.categoryId)[0];
      this.defaultOption = selectedCategoryName['name'];
      this.selectedIcon = selectedCategoryName['id'];
    } else {
      let names = this.referenceService.filterSelectedColumnsFromArrayList(this.dropDownItems, 'name');
      this.defaultOption = names[0];
      let ids = this.referenceService.filterSelectedColumnsFromArrayList(this.dropDownItems, 'id');
      this.selectedIcon = ids[0];
    }
  }

  private setDefaultOptionOrSelectedOption() {
    if (this.categoryId != undefined && this.categoryId != 0) {
      let selectedCategoryName = this.dropDownItems.filter((category) => category.id === this.categoryId)[0];
      this.defaultOption = selectedCategoryName['name'];
    } else {
      let names = this.referenceService.filterSelectedColumnsFromArrayList(this.dropDownItems, 'name');
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
    this.selectedIcon = input.id;
    this.filteredDropDownItems = this.dropDownItems;
    this.showFolderDropDown = false;
    this.selectDropdownComponentEmitter.emit(input.id);
  }


}
