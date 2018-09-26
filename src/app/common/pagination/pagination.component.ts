import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Pagination } from '../../core/models/pagination';
import { ReferenceService } from '../../core/services/reference.service';

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
  numberPerPage = [{ 'name': '12', 'value': 12 }, { 'name': '24', 'value': 24 }, { 'name': '48', 'value': 48 },
  { 'name': 'All', 'value': 0 }];

  constructor(public referenceService:ReferenceService) {
    this.notifyParent = new EventEmitter<any>();
    this.notifyParentDropDown = new EventEmitter<any>();
    this.pageNumber = this.numberPerPage[0];
  }
  setPage(page: number) {
    const obj = { 'page': page, 'type': this.type }
    this.notifyParent.emit(obj);
  }
  selectedPageNumber(event) {
    this.pageNumber.value = event;
    if (event === 0) { event = this.pagination.totalRecords; }
    this.pagination.maxResults = event;
    this.pagination.pageIndex = 1;
    this.notifyParentDropDown.emit(this.pagination);
  }
  ngOnInit() {
    console.log(this.type);
  }

}
