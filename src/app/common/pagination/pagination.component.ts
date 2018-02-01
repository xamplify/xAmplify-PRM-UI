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
  @Output() notifyParent: EventEmitter<any>;
  constructor() {
    this.notifyParent = new EventEmitter<any>();
  }
  setPage(page: number) {
    const self = this;
    const obj = { 'page': page, 'type': this.type }
    this.notifyParent.emit(obj);
  }
  ngOnInit() {
  }

}
