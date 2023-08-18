import { Component, OnInit} from '@angular/core';
import { ContactService } from '../services/contact.service';
import { Properties } from '../../common/models/properties';
import { ActionsDescription } from '../../common/models/actions-description';
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from '../../core/services/authentication.service';
import { SocialContact } from '../models/social-contact';
import { PagerService } from '../../core/services/pager.service';
import { Pagination } from '../../core/models/pagination';
import { ReferenceService } from '../../core/services/reference.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { UserService } from '../../core/services/user.service';
import { CallActionSwitch } from '../../videos/models/call-action-switch';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
import { ParterService } from 'app/partners/services/parter.service';
import { DealQuestions } from '../../deal-registration/models/deal-questions';
import { DealType } from '../../deal-registration/models/deal-type';
import { DealRegistrationService } from '../../deal-registration/services/deal-registration.service';
import { CustomResponse } from '../../common/models/custom-response';
import { Pipeline } from '../../dashboard/models/pipeline';
import { PipelineStage } from '../../dashboard/models/pipeline-stage';

declare var Metronic, $, Layout, Demo, Portfolio,Highcharts, CKEDITOR, swal: any;

@Component({
  selector: 'app-workflow-form',
  templateUrl: './workflow-form.component.html',
  styleUrls: ['./workflow-form.component.css'],
  providers: [SocialContact, Pagination, Properties, ActionsDescription, CallActionSwitch]
})
export class WorkflowFormComponent implements OnInit{


  activeTabClass = "col-block col-block-active width";
  defaultTabClass = "col-block";
  completedTabClass = "col-block col-block-complete";

  campaignDetailsTabClass = this.activeTabClass;
  currentTabActiveClass: string = this.activeTabClass;
  emailTemplateTabClass: string = this.defaultTabClass;
  successTabClass: string = this.completedTabClass;
  activeClass: boolean;
  activeClass1:boolean= true;
  activeClass2:boolean;
  divs: number[] = [];

  constructor(public userService: UserService, public contactService: ContactService, public authenticationService: AuthenticationService, private router: Router, public properties: Properties,
    public pagination: Pagination, public referenceService: ReferenceService, public xtremandLogger: XtremandLogger,
		public actionsDescription: ActionsDescription, public callActionSwitch: CallActionSwitch,
		public route: ActivatedRoute,public parterService: ParterService,public logger: XtremandLogger,public dealRegSevice: DealRegistrationService,){
    }

  ngOnInit() {
    $('#hideToggle').hide();
}

  ngOnDestroy() { }

  goToAnalytics(){
      this.router.navigate(["/home/partners/individual-partner"]);
    }

  goToWorkflow(){this.router.navigate(["/home/contacts/partner-workflow"]);}

  resetActive(event: any, percent: number, step: string) {
      $(".progress-bar").css("width", percent + "%").attr("aria-valuenow", percent);
      $(".progress-completed").text(percent + "%");
      this.hideSteps();
        this.showCurrentStepInfo(step);
  }

  showAndHideDivs(){
    $('#step-1').hide();
    $('#step-2').show();
    this.activeClass2 = true;
    this.activeClass1 = false;
  }

  goToPrevious(){
    $('#step-1').show();
    $('#step-2').hide();
    this.activeClass1 = true;
    this.activeClass2 = false;
  }

  goToStep2 (event, step:string){
    this.hideSteps();
    this.showCurrentStepInfo(step)
  }

  hideSteps() {
    $("div").each(function () {
        if ($(this).hasClass("activeStepInfo")) {
            $(this).removeClass("activeStepInfo");
            $(this).addClass("hiddenStepInfo");
        }
    });
}

  showCurrentStepInfo(step) {
  var id = "#" + step;
  if (step == "step-2") {
      this.campaignDetailsTabClass = this.currentTabActiveClass;
  }
  $(id).addClass("activeStepInfo");
}
  submitForm(){ this.router.navigate(["/home/partners/manage"]);}
  
  addDiv() {
    this.divs.push(this.divs.length + 1);
  }
  deleteDiv(index: number) {
    this.divs.splice(index, 1);
  }
}
