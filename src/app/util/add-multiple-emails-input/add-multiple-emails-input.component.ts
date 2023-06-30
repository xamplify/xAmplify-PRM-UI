import { Component, OnInit, ViewChild } from '@angular/core';
import { ReferenceService } from 'app/core/services/reference.service';
import { TagInputComponent as SourceTagInput } from 'ngx-chips';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators, FormControl, NgModel } from '@angular/forms';


@Component({
  selector: 'app-add-multiple-emails-input',
  templateUrl: './add-multiple-emails-input.component.html',
  styleUrls: ['./add-multiple-emails-input.component.css']
})
export class AddMultipleEmailsInputComponent implements OnInit {

    inputs = [];
    @ViewChild( 'tagInput' )
    tagInput: SourceTagInput;
    public validators = [this.must_be_email.bind( this )];
    public errorMessages = { 'must_be_email': 'Please be sure to use a valid email format' };
    public onAddedFunc = this.beforeAdd.bind( this );
    private addFirstAttemptFailed = false;

  constructor(private referenceService:ReferenceService) { }

  ngOnInit() {
  }

  private must_be_email( control: FormControl ) {
    if ( this.addFirstAttemptFailed && !this.referenceService.validateEmailId( control.value ) ) {
        return { "must_be_email": true };
    }
    return null;
}
private beforeAdd( tag: any ) {
    let isPaste = false;
    if ( tag['value'] ) { isPaste = true; tag = tag.value; }
    if ( !this.referenceService.validateEmailId( tag ) ) {
        if ( !this.addFirstAttemptFailed ) {
            this.addFirstAttemptFailed = true;
            if ( !isPaste ) { this.tagInput.setInputValue( tag ); }
        }
        if ( isPaste ){ 
            return Observable.throw( this.errorMessages['must_be_email'] );
         }else { 
            return Observable.of( '' ).pipe( tap(() => setTimeout(() => 
                this.tagInput.setInputValue( tag ) ) ) ); 
            }
           
    }
    this.addFirstAttemptFailed = false;
    return Observable.of( tag );
}


}
