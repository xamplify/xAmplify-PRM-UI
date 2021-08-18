import { Component, OnInit,Output,EventEmitter } from '@angular/core';
declare var swal:any;

@Component({
  selector: 'app-confirm-sweet-alert-util',
  templateUrl: './confirm-sweet-alert-util.component.html',
  styleUrls: ['./confirm-sweet-alert-util.component.css']
})
export class ConfirmSweetAlertUtilComponent implements OnInit {

  @Output() notifyComponent = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.showSweetAlertConfirmation();
  }

  
	showSweetAlertConfirmation(){
    let clicked = false;
    let self = this;
			swal({
				title: 'Are you sure?',
				text: "You won't be able to undo this action!",
				type: 'warning',
				showCancelButton: true,
				swalConfirmButtonColor: '#54a7e9',
				swalCancelButtonColor: '#999',
				confirmButtonText: 'Yes, delete it!'
			}).then(function () {
        clicked = true;
        self.notifyComponent.emit(clicked);
			}, function (_dismiss: any) {
        clicked = false;
        self.notifyComponent.emit(clicked);
			});
  }
  
}
