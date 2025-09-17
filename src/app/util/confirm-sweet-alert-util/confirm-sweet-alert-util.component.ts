import { SweetAlertParameterDto } from './../../common/models/sweet-alert-parameter-dto';
import { Component, OnInit,Output,EventEmitter,Input } from '@angular/core';
declare var swal:any;

@Component({
  selector: 'app-confirm-sweet-alert-util',
  templateUrl: './confirm-sweet-alert-util.component.html',
  styleUrls: ['./confirm-sweet-alert-util.component.css']
})
export class ConfirmSweetAlertUtilComponent implements OnInit {

  @Output() notifyComponent = new EventEmitter();
  @Input() parameterDto:SweetAlertParameterDto;
  constructor() { }

  ngOnInit() {
    if(this.parameterDto==undefined){
      this.parameterDto = new SweetAlertParameterDto();
    }
    this.showSweetAlertConfirmation();
  }

  
	showSweetAlertConfirmation(){
    let clicked = false;
    let self = this;
			swal({
				title: 'Are you sure?',
				text: self.parameterDto.text,
				type: 'warning',
				showCancelButton: true,
				swalConfirmButtonColor: '#54a7e9',
				swalCancelButtonColor: '#999',
				confirmButtonText: self.parameterDto.confirmButtonText,
        allowOutsideClick: false,
        allowEscapeKey: false
			}).then(function () {
        clicked = true;
        self.notifyComponent.emit(clicked);
			}, function (_dismiss: any) {
        clicked = false;
        self.notifyComponent.emit(clicked);
			});
  }
  
}
