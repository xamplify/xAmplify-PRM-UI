import { Component, ElementRef, OnInit, Renderer2} from '@angular/core';
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
import { QueryBuilderConfig } from 'angular2-query-builder';
import { QueryBuilderClassNames } from 'angular2-query-builder';


declare var  $:any, CKEDITOR:any, swal: any;

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
  newDivs: number[] = [];
  clickOr = true;
  loadQueryBuilder = true;
  config:QueryBuilderConfig  = {
    fields:{}
  }
  query  = {};
  showQueryBuilder = false;
  queryBuilderCustomResponse:CustomResponse = new CustomResponse();

  classNames: QueryBuilderClassNames = {
    removeIcon: 'fa fa-minus',
    addIcon: 'fa fa-plus',
    //arrowIcon: 'fa fa-chevron-right px-2',
    button: 'btn',
    buttonGroup: 'btn-group',
    rightAlign: 'order-12 ml-auto',
    switchRow: 'd-flex px-2',
    switchGroup: 'd-flex align-items-center',
    switchRadio: 'custom-control-input',
    switchLabel: 'custom-control-label',
    switchControl: 'custom-control custom-radio custom-control-inline',
    row: 'row p-2 m-1',
    rule: 'border',
    ruleSet: 'border',
    invalidRuleSet: 'alert alert-danger',
    emptyWarning: 'text-danger mx-auto',
    operatorControl: 'form-control',
    operatorControlSize: 'col-auto pr-0',
    fieldControl: 'form-control',
    fieldControlSize: 'col-auto pr-0',
    entityControl: 'form-control',
    entityControlSize: 'col-auto pr-0',
    inputControl: 'form-control',
    inputControlSize: 'col-auto'
  }


  
  constructor(public userService: UserService, public contactService: ContactService, public authenticationService: AuthenticationService, private router: Router, public properties: Properties,
    public pagination: Pagination, public referenceService: ReferenceService, public xtremandLogger: XtremandLogger,
		public actionsDescription: ActionsDescription, public callActionSwitch: CallActionSwitch,
		public route: ActivatedRoute,public parterService: ParterService,public logger: XtremandLogger,public dealRegSevice: DealRegistrationService,
    private renderer: Renderer2, private targetEl: ElementRef){
    }

  ngOnInit() {
    this.parterService.getQueryBuilderItems().subscribe(
      response=>{
        this.queryBuilderCustomResponse = new CustomResponse();
        let data  = response.data;
        let fieldsLength = Object.keys(data.fields).length;
        this.showQueryBuilder = fieldsLength>0;
        if(this.showQueryBuilder){
          this.config = data;
          let query = {
            condition: 'and',
            rules: [
              
            ]
          };
          this.query = query;
        }else{
        this.queryBuilderCustomResponse = new CustomResponse('INFO','No Data Found For Query Builder',true);
        }
        this.loadQueryBuilder = false;
      },error=>{

      }
    );    


    $('#hideToggle').hide();
    
}

getData(){
  console.log(this.query)
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
