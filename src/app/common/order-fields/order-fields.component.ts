import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReferenceService } from 'app/core/services/reference.service';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { DragulaService } from 'ng2-dragula';
declare var $: any;
@Component({
  selector: 'app-order-fields',
  templateUrl: './order-fields.component.html',
  styleUrls: ['./order-fields.component.css']
})
export class OrderFieldsComponent implements OnInit {
  @Output() closeEmitter = new EventEmitter();
  @Input() selectedItems: any[] = [];
  ngxloading: boolean;
  selectFieldsDtos: Array<any> = new Array<any>();
  selectFields: any;
  @Input() enabledMyPreferances:boolean = false;
  constructor(private dragulaService: DragulaService, public dashBoardService: DashboardService, private referenceService: ReferenceService) {
    dragulaService.setOptions('fieldsDragula', {})
    dragulaService.dropModel.subscribe((value) => {
      this.onDropModel(value);
    });
  }
  private onDropModel(args) {
  }
  ngOnInit() {
    this.referenceService.openModalPopup('orderFieldPopup');
    this.getFiledsByUserId();
  }
  closeModalClose() {
    this.referenceService.closeModalPopup('orderFieldPopup');
    this.emitValues('close');
  }
  ngOnDestroy() {
    this.dragulaService.destroy('fieldsDragula');
  }
  getFiledsByUserId() {
    this.ngxloading = true;
    this.dashBoardService.getFieldsByUserId()
      .subscribe(
        result => {
          if (result.statusCode == 200) {
            this.selectFieldsDtos = result.data;
            if(this.selectedItems && this.selectedItems.length > 0 && this.selectedItems != undefined){
            this.selectFieldsDtos = this.selectedItems;
            }
          }
          this.ngxloading = false;
        },
        error => console.log(error),
        () => { this.ngxloading = false; });
  }
  updateMenuItems() {
    this.referenceService.closeModalPopup('orderFieldPopup');
    this.emitValues('submit');
  }
 
  emitValues(value: string) {
    const input: any = value === 'close' 
      ? { close: false } 
      : { [value]: value, selectFields: this.selectFieldsDtos,myPreferances:this.enabledMyPreferances };
    // Emit or process input as needed
    this.closeEmitter.emit(input);
  }
  selectFieldValues() {
    this.referenceService.closeModalPopup('orderFieldPopup');
    this.emitValues('select');
  }

}
