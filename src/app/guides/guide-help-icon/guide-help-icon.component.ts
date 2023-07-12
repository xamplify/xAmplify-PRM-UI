import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { UserGuide } from '../models/user-guide';
import { UserService } from 'app/core/services/user.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';

@Component({
  selector: 'app-guide-help-icon',
  templateUrl: './guide-help-icon.component.html',
  styleUrls: ['./guide-help-icon.component.css']
})
export class GuideHelpIconComponent implements OnInit {
  loading:boolean = false;
  @Input() searchKey : any;
  
  @Output() searchEvent = new EventEmitter<any>();

  constructor(public userService:UserService,public authenticationService:AuthenticationService,public refService:ReferenceService) { }

  ngOnInit() {
  }
  resetResponse() {
		//this.customResponse = new CustomResponse();
	}
	eventHandler(keyCode: any) { if (keyCode === 13) { this.search(); } }
	search() {
		this.searchEvent.emit(this.searchKey);
	
	}

}
