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

  pagination:Pagination = new Pagination();
  @Output() selectedEmailTemplateEventEmitter = new EventEmitter();
  constructor(private campaignService:CampaignService,private xtremandLogger:XtremandLogger,
    private pagerService:PagerService,private properties:Properties,private authenticationService:AuthenticationService) { }

  ngOnInit() {
    alert("Template Loaded");
    this.pagination.maxResults = 4;
    this.pagination.userId = this.authenticationService.getUserId();
    this.loadRegularEmailTemplates(this.pagination);
  }

  loadRegularEmailTemplates(pagination:Pagination){
    this.campaignService.findCampaignEmailTemplates(pagination).subscribe(
      response=>{
          const data = response.data;
          pagination.totalRecords = data.totalRecords;
          pagination = this.pagerService.getPagedItems(pagination, data.list);
      },error=>{
          this.xtremandLogger.errorPage(error);
      });
  }

  callEmitter(){
    this.selectedEmailTemplateEventEmitter.emit('S u c c e s s ');
  }
  

  



}
