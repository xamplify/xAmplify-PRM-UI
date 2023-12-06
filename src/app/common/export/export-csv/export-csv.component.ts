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
      const csvHeader = Object.keys(objArray[0]).join(',');
      const csvRows = objArray.map((row) => {
          const values = Object.keys(row).map((obj) => {
              if (row[obj] === null || row[obj] === undefined || row[obj] == '' || row[obj] == 0) {
                  return `" "`;
              } else {
                  return `"${row[obj]+'\t'}"`;
              }
          });
          return values.join(',');
      });
      return `${csvHeader}\n${csvRows.join('\n')}`;
  }
  
  downloadCsvList(){
      var csvData = this.convertToCSV( this.downloadListDetails );
      console.log(csvData)
      var a = document.createElement( "a" );
      a.setAttribute( 'style', 'display:none;' );
      document.body.appendChild( a );
      var blob = new Blob( [csvData], { type: 'text/csv;charset=utf-8;' });
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
