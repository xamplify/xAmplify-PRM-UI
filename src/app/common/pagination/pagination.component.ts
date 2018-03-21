import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Pagination } from '../../core/models/pagination';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {
  @Input() pagination: Pagination;
  @Input() type: string;
  @Input() isDropdown: boolean;
  @Output() notifyParent: EventEmitter<any>;

  @Output() notifyParentDropDown: EventEmitter<any>;

  pageNumber: any;
  numberPerPage = [ {'name':'10','value':10},  {'name':'20','value':20}, {'name':'30','value':30},
    {'name':'All','value':0}];

  constructor() {
    this.notifyParent = new EventEmitter<any>();
    this.notifyParentDropDown = new EventEmitter<any>();
    this.pageNumber = this.numberPerPage[0];
  }
  setPage(page: number) {
    const self = this;
    const obj = { 'page': page, 'type': this.type }
    this.notifyParent.emit(obj);
  }
  selectedPageNumber(event){
    this.pageNumber.value = event;
    if(event === 0){  event = this.pagination.totalRecords; }
    this.pagination.maxResults = event;
    this.pagination.pageIndex = 1;
    this.notifyParentDropDown.emit(this.pagination);
  }
  ngOnInit() {
    console.log(this.type);
    if(this.isDropdown){

    } else {
      this.isDropdown = false;
    }
  }

}
