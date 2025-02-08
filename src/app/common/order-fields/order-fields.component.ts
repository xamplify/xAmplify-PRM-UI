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
    console.log("selectedItems :", this.selectedItems);

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
            if(this.selectedItems.length > 0){
            this.selectFieldsDtos = this.selectedItems;
            console.log("selectFieldsDtos :", this.selectedItems);
            }
          }
          this.ngxloading = false;
        },
        error => console.log(error),
        () => { console.log('finished'); this.ngxloading = false; });
  }
  updateMenuItems() {
    this.referenceService.closeModalPopup('orderFieldPopup');
    // this.ngxloading = true;
    // let selectedFieldsResponseDto = {};
    // selectedFieldsResponseDto['propertiesList'] = this.selectFieldsDtos;
    // selectedFieldsResponseDto['myPreferances'] = this.enabledMyPreferances;
    // this.dashBoardService.saveSelectedFields(selectedFieldsResponseDto)
    //   .subscribe(
    //     data => {
    //       if (data.statusCode == 200) {
    //         this.selectFieldsDtos = data.data;
    //         this.emitValues('update');
    //       }
    //       this.ngxloading = false;
    //     },
    //     error => console.log(error),
    //     () => { this.ngxloading = true; });
    this.emitValues('submit');
  }
  // emitValues(value: string) {
  //   let input = {};
  //   if (value === 'update') {
  //     input['update'] = 'update';
  //     input['selectFields'] = this.selectFieldsDtos;
  //   } else if (value === 'select') {
  //     input['select'] = 'select';
  //     input['selectFields'] = this.selectFieldsDtos;
  //   } else if (value === 'close') {
  //     input['close'] = false;
  //   }
  //   this.closeEmitter.emit(input);
  // }
  emitValues(value: string) {
    const input: any = value === 'close' 
      ? { close: false } 
      : { [value]: value, selectFields: this.selectFieldsDtos };
  
    // Emit or process input as needed
    this.closeEmitter.emit(input);
  }
  selectFieldValues() {
    this.emitValues('select');
  }

}
