import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-merge-groups-modal-popup',
  templateUrl: './merge-groups-modal-popup.component.html',
  styleUrls: ['./merge-groups-modal-popup.component.css']
})
export class MergeGroupsModalPopupComponent implements OnInit {

  @Input() userListId = 0;
  @Input() selectedUserIds = [];
  constructor() { }

  ngOnInit() {
    
  }

}
