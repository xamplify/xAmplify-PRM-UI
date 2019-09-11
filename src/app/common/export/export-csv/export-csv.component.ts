import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { ReferenceService } from '../../../core/services/reference.service';

@Component({
  selector: 'app-export-csv',
  templateUrl: './export-csv.component.html',
  styleUrls: ['./export-csv.component.css']
})
export class ExportCsvComponent implements OnInit, AfterViewInit{
    @Input() downloadListDetails: any;
    @Input() downloadListName: any;
    @Output() notifyParent: EventEmitter<any>; 
  constructor(public referenceService: ReferenceService, public changeDetectorRef: ChangeDetectorRef) {
      this.notifyParent = new EventEmitter();
  }

  convertToCSV( objArray ) {
      var array = typeof objArray != 'object' ? JSON.parse( objArray ) : objArray;
      var str = '';
      var row = "";
      for ( var index in objArray[0] ) {
          row += index + ',';
      }
      row = row.slice( 0, -1 );
      str += row + '\r\n';
      for ( var i = 0; i < array.length; i++ ) {
          var line = '';
          for ( var index in array[i] ) {
              if ( line != '' ) line += ','
                  if ( array[i][index] == undefined || array[i][index] == '' || array[i][index] == null) {
                      line += ' ';
                  } else{
                      line += array[i][index];
                      line = line.replace(",,", ",");
                  }
          }
          str += line + '\r\n';
      }
      return str;
  }
  
  downloadCsvList(){
      var csvData = this.convertToCSV( this.downloadListDetails );
      var a = document.createElement( "a" );
      a.setAttribute( 'style', 'display:none;' );
      document.body.appendChild( a );
      var blob = new Blob( [csvData], { type: 'text/csv' });
      var url = window.URL.createObjectURL( blob );
      a.href = url;
      a.download = this.downloadListName;
      a.click();
      this.changeDetectorRef.detectChanges();
      
  }
  
  ngOnInit() {
     this.downloadCsvList();
     
     setTimeout(()=>{  
         this.referenceService.isDownloadCsvFile = false;
    },3000);
     
  
  }
  
  ngAfterViewInit(){
      this.changeDetectorRef.detectChanges();
   }

}
