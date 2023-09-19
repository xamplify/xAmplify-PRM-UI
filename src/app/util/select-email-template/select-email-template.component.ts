import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { CampaignService } from 'app/campaigns/services/campaign.service';
import { Properties } from 'app/common/models/properties';
import { Pagination } from 'app/core/models/pagination';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PagerService } from 'app/core/services/pager.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';


@Component({
  selector: 'app-select-email-template',
  templateUrl: './select-email-template.component.html',
  styleUrls: ['./select-email-template.component.css'],
  providers:[Properties]
})
export class SelectEmailTemplateComponent implements OnInit {

  emailTemplatesPagination:Pagination = new Pagination();
  @Output() selectedEmailTemplateEventEmitter = new EventEmitter();
  @Input() selectedEmailTemplateId = 0;
  emailTemplatesLoader = false;
  constructor(private campaignService:CampaignService,private xtremandLogger:XtremandLogger,
    private pagerService:PagerService,private properties:Properties,private authenticationService:AuthenticationService) { }

  ngOnInit() {
    this.emailTemplatesLoader = true;
    this.emailTemplatesPagination.maxResults = 4;
    this.emailTemplatesPagination.userId = this.authenticationService.getUserId();
    this.loadRegularEmailTemplates(this.emailTemplatesPagination);
  }

  loadRegularEmailTemplates(pagination:Pagination){
    this.campaignService.findCampaignEmailTemplates(pagination).subscribe(
      response=>{
          const data = response.data;
          pagination.totalRecords = data.totalRecords;
          pagination = this.pagerService.getPagedItems(pagination, data.list);
          this.emailTemplatesLoader = false;
      },error=>{
          this.xtremandLogger.errorPage(error);
      });
  }

  callEmitter(){
    this.selectedEmailTemplateEventEmitter.emit('S u c c e s s ');
  }
  

  



}
