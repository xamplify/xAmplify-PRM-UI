import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { EmailSpamScore } from '../models/email-spam-score';
import { EmailTemplate } from '../models/email-template';
import { User } from '../../core/models/user';
import { EmailSpamCheckService } from '../services/email-spam-check.service';
import { AuthenticationService } from '../../core/services/authentication.service';

declare var $: any;

@Component({
  selector: 'app-email-spam-check',
  templateUrl: './email-spam-check.component.html',
  styleUrls: ['./email-spam-check.component.css']
})
export class EmailSpamCheckComponent implements OnChanges, OnInit {
  @Input('emailTemplate') emailTemplate: EmailTemplate;
  currentEmailTemplate: EmailTemplate;
  latestEmailSpamScore: EmailSpamScore;
  constructor(private authenticationService: AuthenticationService, private emailSpamCheckService: EmailSpamCheckService) { }
  results: EmailSpamScore[] = [];
  emailSpamScore: EmailSpamScore;
  loading = false;
  selected = false;
  ngOnInit() {
    
  }
  ngOnChanges(changes: SimpleChanges) {
    const simpleChange: SimpleChange = changes.emailTemplate;
    this.currentEmailTemplate = simpleChange.currentValue;
    this.listEmailSpamScoresByEmailTemplateId(this.currentEmailTemplate.id);
  }

  listEmailSpamScoresByEmailTemplateId(emailTemplateId: number) {
    this.emailSpamCheckService.listEmailSpamScoresByEmailTemplateId(emailTemplateId).subscribe(
      result => {
        this.results = result;
        if(this.results.length == 0){
            this.send();
        }
      },
      (error: any) => console.log(error),
      () => {
        if(this.results.length > 0){
          this.latestEmailSpamScore = this.results[0];
          this.results.forEach( result => this.test(result));
        }
      }
    );
  }

  test(emailSpamScore: EmailSpamScore){
      this.loading = true;
      this.emailSpamCheckService.test(emailSpamScore.toEmail).subscribe(
      result => {
        emailSpamScore.jsonResponse = result;
        this.loading = false;
      },
      (error: any) => { console.log(error); this.loading = false; },
      () => {
        if(!emailSpamScore.score && emailSpamScore.jsonResponse){
          let _emailSpamScore = new EmailSpamScore();
          _emailSpamScore.id = emailSpamScore.id;
          _emailSpamScore.score =  emailSpamScore.jsonResponse.displayedMark;
          this.updateScore(_emailSpamScore);
        }
        if(this.latestEmailSpamScore.id === emailSpamScore.id) {
          let emailTemplate = new EmailTemplate();
          emailTemplate.id = this.currentEmailTemplate.id;
          emailTemplate.spamScore = emailSpamScore.jsonResponse.displayedMark;
          this.updateScoreInEmailTemplate(emailTemplate);
        }
        this.loading = false;
      }
    );
  }

  updateScore(emailSpamScore: EmailSpamScore){
    this.emailSpamCheckService.updateScore(emailSpamScore).subscribe(
      result => {
        // Do nothing
      },
      (error: any) => { console.log(error); }
    );
  }

  updateScoreInEmailTemplate(emailTemplate: EmailTemplate){
    this.emailSpamCheckService.updateScoreInEmailTemplate(emailTemplate).subscribe(
      result => {
        // Do nothing
      },
      (error: any) => { console.log(error); }
    );
  }

  send() {
    this.loading = true;
    let emailSpamScore = new EmailSpamScore();
    emailSpamScore.emailTemplate = new EmailTemplate();
    emailSpamScore.emailTemplate.id = this.emailTemplate.id;
    emailSpamScore.user = new User();
    emailSpamScore.user.userId = this.authenticationService.getUserId();
    emailSpamScore.user.emailId = this.authenticationService.user.emailId;
    const currentTime = Date.now().toString();
    emailSpamScore.toEmail = `xamplify-${this.authenticationService.getUserId()}-${currentTime}@mail-tester.com`;
    emailSpamScore.subject = this.emailTemplate.name;
    this.emailSpamCheckService.send(emailSpamScore).subscribe(
      result => {
        this.loading = false;
        this.results.push(result);
        this.latestEmailSpamScore = result;
        this.test(result);
      },
      (error: any) => { console.log(error); this.loading = false;}
    );
  }
  
/*  toggleIcon(e) {
      $(e.target)
          .prev('.panel-heading')
          .find(".more-less")
          .toggleClass('glyphicon-plus glyphicon-minus');
  }
  $('.panel-group').on('hidden.bs.collapse', toggleIcon);
  $('.panel-group').on('shown.bs.collapse', toggleIcon);*/

}
