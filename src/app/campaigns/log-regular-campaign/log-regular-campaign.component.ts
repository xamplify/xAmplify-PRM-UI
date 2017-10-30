import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { LogService } from '../../core/services/log.service';


@Component({
  selector: 'app-log-regular-campaign',
  templateUrl: './log-regular-campaign.component.html',
  styleUrls: ['./log-regular-campaign.component.css']
})
export class LogRegularCampaignComponent implements OnInit {

  campaignAlias: string;
  userAlias: string;
  templateId: number;
  templatehtml: string;
  errorHtml = '<div class="portlet light" style="padding:5px 5px 300px 17px">' +
  '<h3 style="color:blue;text-align: center;margin-top:204px;" >Sorry!!!. This campaign has been removed</h3></div>';

  constructor(public xtremandLogger: XtremandLogger, public activatedRoute: ActivatedRoute, public LogService: LogService) {
    this.xtremandLogger.log('Ui regular campaign called');
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((param: any) => {
      this.campaignAlias = param['campaignAlias'];
      this.userAlias = param['userAlias'];
      this.templateId = param['templateId'];
    }, (error: any) => {
      this.xtremandLogger.error(error);
    });
    this.getRegularTemplateHtml();
  }

  getRegularTemplateHtml() {
    try {
      this.LogService.showCampaignEmail(this.campaignAlias, this.userAlias, this.templateId)
        .subscribe((result: any) => {
                this.templatehtml = result.templatehtml;
               this.xtremandLogger.log(this.templatehtml);
                document.getElementById('regular-campaign').innerHTML = this.templatehtml;

        }, (error: any) => {
          this.xtremandLogger.error('log regular campaign component:  Loading Videos():' + error);
          this.xtremandLogger.errorPage(error);
        },
        () => console.log('getRegularTemplateHtml method completed:')
        );
    } catch (error) {
      this.xtremandLogger.error('error in showCampaign method :' + error);
    }
  }
}