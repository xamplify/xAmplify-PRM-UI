import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from "@angular/core";
import { CampaignService } from 'app/campaigns/services/campaign.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { CampaignDetailsDto } from 'app/campaigns/models/campaign-details-dto';
import { CallActionSwitch } from './../../videos/models/call-action-switch';
import { CustomResponse } from './../../common/models/custom-response';
import { Properties } from './../../common/models/properties';
import { ReferenceService } from "app/core/services/reference.service";
import { Country } from "app/core/models/country";
import { Timezone } from "app/core/models/timezone";

declare var $:any, flatpickr:any;
@Component({
  selector: "app-edit-campaign-details-modal-popup",
  templateUrl: "./edit-campaign-details-modal-popup.component.html",
  styleUrls: ["./edit-campaign-details-modal-popup.component.css"],
  providers:[CallActionSwitch,Properties]
})
export class EditCampaignDetailsModalPopupComponent implements OnInit,OnDestroy {
  @Input() campaignId: number = 0;
  @Output() resetEmitter = new EventEmitter();
  @Input() navigatedFrom:string = "";
  loader = false;
  campaignDetailsDto:CampaignDetailsDto = new CampaignDetailsDto();
  teamMemberEmailIds:Array<any> = new Array<any>();
  categories:Array<any> = new Array<any>();
  buttonClicked = false;
  customResponse:CustomResponse = new CustomResponse();
  properties:Properties = new Properties();
  dataUpdated = false;
  countries: Country[];
	timezones: Timezone[];
  countryId: number = 0;
  constructor(public campaignService:CampaignService,public authenticationService:AuthenticationService,public callActionSwitch:CallActionSwitch,
    public referenceService:ReferenceService) {}
  

  ngOnInit() {
    this.loader = true;
    this.countries = this.referenceService.getCountries();
    flatpickr('.edit-campaign-flatpicker', {
			enableTime: true,
			dateFormat: 'm/d/Y h:i K',
			time_24hr: false,
      static: true
		});
    $('#edit-campaign-details-popup').modal('show');
    this.getCampaignDetailsById();
  }


  private getCampaignDetailsById() {
    this.campaignService.getCampaignDetailsById(this.campaignId)
      .subscribe(
        response => {
          let statusCode = response.statusCode;
          if (statusCode == 200) {
            let map = response.map;
            this.campaignDetailsDto = map['campaignDetailsDto'];
            let campaignId = this.campaignDetailsDto.id;
            if(campaignId>0){
              this.teamMemberEmailIds = map['adminAndTeamMembers'];
              this.categories = map['categories'];
              if (this.campaignDetailsDto.timezone == undefined) {
                this.campaignDetailsDto.countryId = this.countries[0].id;
                this.onSelectCountry(this.campaignDetailsDto.countryId);
              } else {
                let countryNames = this.referenceService.getCountries().map(function (a) { return a.name; });
                let countryIndex = countryNames.indexOf(this.campaignDetailsDto.country);
                if (countryIndex > -1) {
                  this.campaignDetailsDto.countryId = this.countries[countryIndex].id;
                  this.onSelectCountry(this.campaignDetailsDto.countryId);
                } else {
                  this.campaignDetailsDto.countryId = this.countries[0].id;
                  this.onSelectCountry(this.campaignDetailsDto.countryId);
                }
              }
            }else{
              this.referenceService.showSweetAlertErrorMessage("This campaign does not exist");
              this.referenceService.loadingPreview = false;
              this.resetEmitter.emit('updated');
            }
            this.loader = false;
          }
          else {
            this.closePopup();
            this.authenticationService.forceToLogout();
          }
        }, error => {
          this.loader = false;
          this.closePopup();
          this.referenceService.showSweetAlertServerErrorMessage();
        }
      );
  }

  onSelectCountry(countryId:number) {
		this.timezones = this.referenceService.getTimeZonesByCountryId(countryId);
	}

  setFromName(){
    let user = this.teamMemberEmailIds.filter((teamMember) => teamMember.emailId == this.campaignDetailsDto.fromEmail)[0];
    this.campaignDetailsDto.fromName = $.trim(user.firstName + " " + user.lastName);
    if (this.campaignDetailsDto.fromName.length == 0) {
      this.campaignDetailsDto.fromName = this.campaignDetailsDto.fromEmail;
     }
  }

  setOptionByType(event:any,type:number){
    if(1==type){
      this.campaignDetailsDto.emailOpened = event;
    }else if(2==type){
      this.campaignDetailsDto.linkOpened = event;
    }else if(3==type){
      this.campaignDetailsDto.videoPlayed = event;
    }else if(4==type){
      this.campaignDetailsDto.rsvpReceived = event;
    }else if(5==type){
      this.campaignDetailsDto.allowPartnerToEditThePost = event;
    }
  }

  ngOnDestroy(): void {
    this.closePopup();
  }

  closePopup(){
    $('#edit-campaign-details-popup').modal('hide');
    this.loader = false;
    if(this.dataUpdated){
      this.resetEmitter.emit('updated');
    }else{
      this.resetEmitter.emit('closed');
    }

  }

  update(){
    this.loader = true;
    this.customResponse = new CustomResponse();
    this.campaignDetailsDto.timezone = $('#timezoneId option:selected').val();
    this.campaignDetailsDto.country = $.trim($('#edit-social-campaign-countryName option:selected').text());
    this.campaignDetailsDto.description = $.trim(this.campaignDetailsDto.description);
    this.campaignService.updateCampaignDetails(this.campaignDetailsDto)
    .subscribe(
      response=>{
        let statusCode = response.statusCode;
        this.loader = false;
        this.buttonClicked = false;
        if(statusCode==200){
          this.dataUpdated = true;
        }else{
          this.customResponse = new CustomResponse('ERROR',response.message,true);
        }
        
      },error=>{
        this.loader = false;
        this.buttonClicked = false;
        this.customResponse = new CustomResponse('ERROR',this.properties.serverErrorMessage,true);
      });
  }


  
}

