import { Component, OnInit, Input } from '@angular/core';
import { ReferenceService } from '../../core/services/reference.service';

@Component({
  selector: 'app-timestamp-new',
  templateUrl: './timestamp.component.html',
  styleUrls: ['./timestamp.component.css']
})
export class TimestampNewComponent implements OnInit {
 @Input() dateAndTime: any;
 @Input() isOnlyTime = false;
 @Input() isOnlyDate = false;
 isSpacethere = false;

  constructor(public referenceService: ReferenceService) { }

  ngOnInit() {
    try{
      if(this.referenceService.isSafariBrowser()){
      if((this.dateAndTime.includes(' '))) {
        this.isSpacethere = true;
        // this.dateAndTime = this.dateAndTime.replace(/ /g,"T");
        // this.dateAndTime = Date.parse(this.dateAndTime);
      }else {
      }
    }
    }catch(error){ console.log(error);}
  }

}
