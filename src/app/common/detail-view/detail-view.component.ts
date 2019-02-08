import { Component, OnInit, Input } from '@angular/core';
import { AnalyticsComponent } from "../../campaigns/analytics/analytics.component";
import { ReferenceService } from '../../core/services/reference.service';

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.css','../../campaigns/analytics/analytics.component.css','../../campaigns/analytics/timeline.css']
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
    
  constructor(public analyticsComponent: AnalyticsComponent, public referenceService: ReferenceService) { }
  
  sendEmailNotOpenReminder(details: any){
    this.isOpenNotificationModal = true;
    this.selectedEmailNotOpenUserId = details.userId;
  }
  emailNotOpenReminderDate(event: any){
      this.isOpenNotificationModal = false;
  }
  
  ngOnInit() {
  }

}
