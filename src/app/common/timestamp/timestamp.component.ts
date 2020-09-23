import { Component, OnInit, Input } from '@angular/core';
import { ReferenceService } from '../../core/services/reference.service';

@Component({
  selector: 'app-timestamp',
  templateUrl: './timestamp.component.html',
  styleUrls: ['./timestamp.component.css']
})
export class TimestampComponent implements OnInit {
 @Input() dateAndTime: any;
 @Input() isOnlyTime = false;
 @Input() isOnlyDate = false;
@Input() campaignView = false;
 isSpacethere = false;

  constructor(public referenceService: ReferenceService) { }

  ngOnInit() {
    try{
      if(this.referenceService.isSafariBrowser()){
      if((this.dateAndTime.includes(' '))) {
        console.log(this.dateAndTime);
        this.isSpacethere = true;
        // this.dateAndTime = this.dateAndTime.replace(/ /g,"T");
        // this.dateAndTime = Date.parse(this.dateAndTime);
      }else {
      }
    }
    }catch(error){ console.log(error);}
  }

}
