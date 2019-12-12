import { Component, OnInit, ViewChild } from '@angular/core';
import { Campaign } from '../models/campaign';
/**********Tag Input****************/
import { TagInputComponent as SourceTagInput } from 'ngx-chips';
import "rxjs/add/observable/of";
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormControl, NgModel } from '@angular/forms';
import { ReferenceService } from '../../core/services/reference.service';
import { EventCampaign } from '../models/event-campaign';
import { CampaignService } from '../services/campaign.service';
import { CustomResponse } from '../../common/models/custom-response';
import { Properties } from '../../common/models/properties';
declare var swal, $: any;
@Component( {
    selector: 'app-public-event-email-popup',
    templateUrl: './public-event-email-popup.component.html',
    styleUrls: ['./public-event-email-popup.component.css'],
    providers: [Properties]

} )
export class PublicEventEmailPopupComponent implements OnInit {

    selectedCampaign: Campaign;
    subject = "";
    emailIds = [];
    @ViewChild( 'tagInput' )
    tagInput: SourceTagInput;
    public validators = [this.must_be_email.bind( this )];
    public errorMessages = { 'must_be_email': 'Please be sure to use a valid email format' };
    public onAddedFunc = this.beforeAdd.bind( this );
    private addFirstAttemptFailed = false;
    modalPopupId = "public-event-email-modal-popup";
    sent = false;
    processing = false;
    customResponse:CustomResponse =  new CustomResponse();
    constructor(public referenceService: ReferenceService,private campaignService:CampaignService,public properties:Properties) { }

    ngOnInit() {
    }

    showPopup( campaign: Campaign ) {
        this.selectedCampaign = campaign;
        $( '#' + this.modalPopupId ).modal( 'show' );

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
            if ( isPaste ) { return Observable.throw( this.errorMessages['must_be_email'] ); }
            else { return Observable.of( '' ).pipe( tap(() => setTimeout(() => this.tagInput.setInputValue( tag ) ) ) ); }
        }
        this.addFirstAttemptFailed = false;
        return Observable.of( tag );
    }

    closePopup() {
        this.emailIds = [];
        this.subject = "";
        this.sent = false;
        this.processing = false;
        this.customResponse = new CustomResponse();
        $( '#' + this.modalPopupId ).modal( 'hide' );
    }

    send(){
        this.processing = true;
        this.referenceService.onAddingEmailIds(this.emailIds);
        let eventCampaign = new EventCampaign();
        let values = this.emailIds.map(function(a) {return a.value;});
        eventCampaign.emailIds = values;
        eventCampaign.id = this.selectedCampaign.campaignId;
        this.campaignService.sendPublicEventEmail(eventCampaign).subscribe(
                (response: any) => {
                    this.sent = true;    
                    this.processing = false;
                },
                (error: any) => {
                    this.processing = false;
                    this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
                });
    }
    
    
    

}
