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
@Input() showInLine = false;
 isSpacethere = false;

  constructor(public referenceService: ReferenceService) { }

  ngOnInit() {
    try{
      if(this.dateAndTime!=undefined && this.dateAndTime!='Invalid Date'){
        if(this.referenceService.isSafariBrowser()){
          if((this.dateAndTime.includes(' '))) {
            this.isSpacethere = true;
          }else {
          }
      }
    }
    }catch(error){ console.log(error);}
  }

}
