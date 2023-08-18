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
  onTemplate:boolean;
  question: DealQuestions;
  questions: DealQuestions[] = [];
  formSubmiteState = true;

  constructor(public userService: UserService, public contactService: ContactService, public authenticationService: AuthenticationService, private router: Router, public properties: Properties,
    public pagination: Pagination, public referenceService: ReferenceService, public xtremandLogger: XtremandLogger,
		public actionsDescription: ActionsDescription, public callActionSwitch: CallActionSwitch,
		public route: ActivatedRoute,public parterService: ParterService,public logger: XtremandLogger,public dealRegSevice: DealRegistrationService,){}

  ngOnInit() {
    $('#clickPlusIcon').hide();
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
  
  // addQuestion() {
	// 	this.question = new DealQuestions();
	// 	var length;
	// 	if (this.questions != null && this.questions != undefined)
	// 		length = this.questions.length;
	// 	else
	// 		length = 0;
	// 	length = length + 1;
	// 	var id = 'question-' + length;
	// 	this.question.divId = id;
	// 	this.question.error = true;


	// 	this.questions.push(this.question);
	// 	this.submitBUttonStateChange();
	// }
  // submitBUttonStateChange() {
	// 	let countForm = 0;
	// 	this.questions.forEach(question => {

	// 		if (question.error)
	// 			countForm++;
	// 	})
	// 	if (countForm > 0 || this.questions.length == 0)
	// 		this.formSubmiteState = false;
	// 	else
	// 		this.formSubmiteState = true;

	// }
  // div1:boolean=true;
  //   div2:boolean=true;
  //   div3:boolean=true;
  // div1Function(){
  //   this.div2=true;
  //   this.div1=false;
  //   this.div3=false
  // }
  dealtype: DealType;
  dealtypes: DealType[] = [];
  dealSubmiteState = true;
  customResponseForm: CustomResponse = new CustomResponse();
  ngxloading: boolean;
  loggedInUserId = 0;
  addDealtype() {
		this.dealtype = new DealType();
		var length;
		if (this.dealtypes != null && this.dealtypes != undefined){
			length = this.dealtypes.length;
    }else
			length = 0;
		length = length + 1;
		var id = 'dealType-' + length;
		this.dealtype.divId = id;
		this.dealtype.error = true;
    this.dealtypes.push(this.dealtype);
    this.isClickPlus = this.showDivWithPlus;

    // if(!this.showDivWithPlus){this.dealtypes.push(this.dealtype);}
		// this.dealTypeButtonStateChange();
   
	}
  dealTypeButtonStateChange() {
		let countForm = 0;
		this.dealtypes.forEach(dealType => {

			if (dealType.error)
				countForm++;
		})
		if (countForm > 0 || this.dealtypes.length == 0)
			this.dealSubmiteState = false;
		else
			this.dealSubmiteState = true;

	}
  deleteDealType(i, dealType) {
		try {
			this.logger.info("Deal Type in sweetAlert() " + dealType.id);
			let self = this;
			self.dealRegSevice.deleteDealType(dealType).subscribe(result => {
        if (result.statusCode == 200) {
          self.removeDealType(i, dealType.id);
          self.customResponseForm = new CustomResponse('SUCCESS', result.data, true);
        } else if (result.statusCode == 403) {
          self.customResponseForm = new CustomResponse('ERROR', result.message, true);
        } else {
          self.customResponseForm = new CustomResponse('ERROR', self.properties.serverErrorMessage, true);
        }
        self.ngxloading = false;

      }, (error) => {
        self.ngxloading = false;

      }, () => {
        self.dealRegSevice.listDealTypes(self.loggedInUserId).subscribe(dealTypes => {

          self.dealtypes = dealTypes.data;

        });
      })
		} catch (error) {
			console.log(error);
		}
	}
  removeDealType(i, id) {

		if (id)
			console.log(id)
		console.log(i)
		var index = 1;

		this.dealtypes = this.dealtypes.filter(dealtype => dealtype.divId !== 'dealtype-' + i)
			.map(dealtype => {
				dealtype.divId = 'dealtype-' + index++;
				return dealtype;
			});
		console.log(this.dealtypes);
		this.dealTypeButtonStateChange();

	}
  showDivWithPlus:boolean
  isClickPlus:boolean;
  showFooterChange() {
    this.showDivWithPlus = !this.showDivWithPlus;
    // alert(this.showDivWithPlus)
    // and == true, or == false;
  }
  showDivWithPlusClick(){
    this.addDealtype();
    $('#clickPlusIcon').show();
  }
  showToggleAndDivWithPlusClick(){
    $('#hideToggle').show();
     this.addDealtype();
  }
}
