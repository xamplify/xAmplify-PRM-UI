import { Component, OnInit, Input } from '@angular/core';
import { ReferenceService } from '../../core/services/reference.service';
import { CustomResponse } from '../models/custom-response';
@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.css']
})
export class DetailViewComponent implements OnInit {
    @Input() detailType: any;
    @Input() details: any;
    @Input() campaign: any;
    @Input() campaignType: any;
    @Input() campaignReport: any;
    
    loading: boolean;
    isOpenNotificationModal = false;
    selectedEmailNotOpenUserId: any;
    reminderSuccessMessage = false;
    customResponse: CustomResponse = new CustomResponse();
    
  constructor(public referenceService: ReferenceService) { }
  
  sendEmailNotOpenReminder(details: any){
    this.isOpenNotificationModal = true;
    this.selectedEmailNotOpenUserId = details.userId;
  }
  emailNotOpenReminderDate(event: any){
      this.isOpenNotificationModal = false;
      if(event ===  "Success"){
       this.customResponse = new CustomResponse('SUCCESS',"Reminder has been sent successfully", true);
      }
  }
  
  ngOnInit() {
  }

}
