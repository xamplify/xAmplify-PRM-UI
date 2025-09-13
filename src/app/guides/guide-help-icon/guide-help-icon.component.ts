import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { UserGuide } from '../models/user-guide';
import { UserService } from 'app/core/services/user.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { Pagination } from 'app/core/models/pagination';

@Component({
  selector: 'app-guide-help-icon',
  templateUrl: './guide-help-icon.component.html',
  styleUrls: ['./guide-help-icon.component.css']
})
export class GuideHelpIconComponent implements OnInit {
  loading:boolean = false;
  @Input() searchKey : any;
  @Input() pagination:Pagination;
  @Output() searchEvent = new EventEmitter<any>();
  constructor(public userService:UserService,public authenticationService:AuthenticationService,public refService:ReferenceService) { }

  ngOnInit() {
    this.search();
  }
  resetResponse() {
	}
	eventHandler(keyCode: any) { if (keyCode === 13) { this.search(); } }
	search() {
    this.loading = true;
		this.searchEvent.emit(this.searchKey);
    this.loading = false;
	
	}

}
