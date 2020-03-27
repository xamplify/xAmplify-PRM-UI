import { Component, OnInit,ViewChild } from '@angular/core';
import "rxjs/add/observable/of";
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CustomResponse } from '../../common/models/custom-response';
import { TagInputComponent as SourceTagInput } from 'ngx-chips';
import { FormGroup, FormBuilder, Validators, FormControl , NgModel} from '@angular/forms';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { VendorInvitation } from '../../dashboard/models/vendor-invitation';
import { DashboardService } from "../../dashboard/dashboard.service";

declare var $, CKEDITOR, ckInstance,swal:any;

@Component({
  selector: 'app-dynamic-email-content',
  templateUrl: './dynamic-email-content.component.html',
  styleUrls: ['./dynamic-email-content.component.css'],
  providers: [VendorInvitation]
})
export class DynamicEmailContentComponent implements OnInit {
    vendorInvitation: VendorInvitation = new VendorInvitation();
    isShowCKeditor: boolean;
    emailId:string = "";
    isValidationMessage = false;
    isError = false;
    customResponse: CustomResponse = new CustomResponse();
    invalidTagError = false;
    @ViewChild('tagInput')
    tagInput: SourceTagInput;
    public validators = [ this.must_be_email.bind(this) ];
    public errorMessages = {'must_be_email': 'Please be sure to use a valid email format'};
    public onAddedFunc = this.beforeAdd.bind(this);
    private addFirstAttemptFailed = false;
    loading = false;
    invalidContent = false;
    error = false;
    alias:string = "";
    constructor(public dashboardService: DashboardService,public authenticationService: AuthenticationService,public referenceService: ReferenceService) { }

    ngOnInit() {
    }

    closeModal() {
        $( '#send-email-dynamic-content-modal' ).modal( 'hide' );
        this.vendorInvitation = new VendorInvitation();
    }


    openModal(response:any) {
        this.emailId = response.emailId;  
        let accessUrl;      
        // if(this.authenticationService.vanityURLEnabled){            
        //   accessUrl= window.location.protocol + "//" + response.companyProfileName +"." + window.location.hostname +"/axAa/"+response.alias ;
        //   this.vendorInvitation.enableVanityURL = true;
        //   this.vendorInvitation.vanityURL = accessUrl;
        // }else{
        //   accessUrl = this.authenticationService.APP_URL+"axAa/"+response.alias;
        // }
        accessUrl= window.location.protocol + "//" + response.companyProfileName +"." + window.location.hostname +"/axAa/"+response.alias ;
        this.vendorInvitation.vanityURL = accessUrl;
        this.alias = response.alias;
        this.isShowCKeditor = true;
        CKEDITOR.config.height = '300px';
        CKEDITOR.config.baseFloatZIndex = 1E5;
        CKEDITOR.config.extraPlugins = 'btbutton';
        this.vendorInvitation.subject = "Welcome to xAmplify's marketing automation platform";
        this.vendorInvitation.emailIds.push(this.emailId);
        this.vendorInvitation.message = "Hi There," + "<br><br>" + "Your account has been successfully created."
        
            + "<br><br>" + "You just need to set your password to access our xAmplify platform to share an email, video, or social media campaigns"
        
            + "<br><br>" + "Please click the below link to set your password"
            
            + "<br><br>" + "<a href="+accessUrl+" target='_blank'>" + "Access Account" + "</a>"
        
            + "<br><br>" + "Visit " + "<a href='www.xamplify.com' target='_blank'>" + "www.xamplify.com" + "</a>" + " to learn more, or feel free to ask me questions about how it works on my end."

            + "<br><br>" + "Best, " + "<br><br>"

            + "xAmplify";
            $( '#send-email-dynamic-content-modal' ).modal( 'show' );
    }
    
    
    sendEmail(){
        this.loading = true;
        this.customResponse = new CustomResponse();
       if(this.vendorInvitation.message.replace( /\s\s+/g, '' ).replace(/\s+$/,"").replace(/\s+/g," ") && this.vendorInvitation.subject.replace( /\s\s+/g, '' ).replace(/\s+$/,"").replace(/\s+/g," ") && this.emailId.length != 0 ){
           this.dashboardService.sendWelcomeEmail(this.vendorInvitation,this.alias)
           .subscribe(
           (result:any) => {
               $( '#send-email-dynamic-content-modal' ).modal( 'hide' );
              this.loading = false;
              swal("Success!", "Email sent successfully", "success");
           },
           (error:string) => {
               this.loading = false;
               this.customResponse = new CustomResponse( 'ERROR', 'Oops! Unable to send email.Please try after sometime', true );
           });
           
       }else{
           this.loading = false;
           this.customResponse = new CustomResponse( 'ERROR', 'Please fill required fields', true );
       }
    }
    
    
    
    private must_be_email(control: FormControl) {
        if (this.addFirstAttemptFailed && !this.validateEmail(control.value)) {
            return { "must_be_email": true };
        }
        return null;
      }
      private beforeAdd(tag: any) {
        let isPaste = false;
        if(tag['value']) {  isPaste = true; tag = tag.value;}
        if (!this.validateEmail(tag)) {
          if (!this.addFirstAttemptFailed) {
            this.addFirstAttemptFailed = true;
            if(!isPaste) { this.tagInput.setInputValue(tag); }
          }
          if(isPaste) {  return Observable.throw(this.errorMessages['must_be_email']); }
          else { return Observable.of('').pipe(tap(() => setTimeout(() => this.tagInput.setInputValue(tag)))); }
        }
        this.addFirstAttemptFailed = false;
        return Observable.of(tag);
      }
      private validateEmail(text: string) {
        var EMAIL_REGEXP = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/i;
        return (text && EMAIL_REGEXP.test(text));
      }
    
    
}
