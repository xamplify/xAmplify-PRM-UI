import { Component, OnInit } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { ReferenceService } from 'app/core/services/reference.service';
import { PipelineStage } from 'app/dashboard/models/pipeline-stage';
import { FlexiFieldService } from 'app/dashboard/user-profile/flexi-fields/services/flexi-field.service';

declare var $: any;

@Component({
  selector: 'app-contact-status-drop-down',
  templateUrl: './contact-status-drop-down.component.html',
  styleUrls: ['./contact-status-drop-down.component.css'],
  providers: [Properties]
})
export class ContactStatusDropDownComponent implements OnInit {

  selectedDefaultIndex: number = 0;
  contactStatusLoading: boolean = false;
  contactStatusResponse: CustomResponse = new CustomResponse();
  contactStatusStages: Array<PipelineStage> = new Array<PipelineStage>();
  isDeleteOptionClicked: boolean = false;
  selectedFieldId: number = 0;

  constructor(private flexiFieldService: FlexiFieldService, private properties: Properties, 
    private referenceService: ReferenceService) { }

  ngOnInit() {
    this.findContactStatusStages();
  }

  ngOnDestroy() {
    this.contactStatusStages = [];
    this.contactStatusLoading = false;
    this.contactStatusResponse = new CustomResponse();
    this.isDeleteOptionClicked = false;
    this.selectedDefaultIndex = 0;
    this.selectedFieldId = 0;
  }

  findContactStatusStages() {
    this.contactStatusLoading = true;
    this.referenceService.scrollSmoothToTop();
    this.flexiFieldService.findContactStatusStages().subscribe(
      (response: any) => {
        if (response.statusCode === 200) {
          this.contactStatusStages = response.data;
          this.selectedDefaultIndex = this.contactStatusStages.findIndex(stage => stage.defaultStage);
          if (this.selectedDefaultIndex === -1 && this.contactStatusStages.length > 0) {
            this.contactStatusStages[0].defaultStage = true;
            this.selectedDefaultIndex = 0;
          }
        } else {
          this.contactStatusResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
        }
        this.contactStatusLoading = false;
      }, (error: any) => {
        this.contactStatusLoading = false;
        this.contactStatusResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
      }
    );
  }

  addStage() {
    this.contactStatusStages.push(new PipelineStage());
  }

  deleteStage(contactStatusStage: PipelineStage) {
    this.contactStatusResponse = new CustomResponse();
    if (contactStatusStage.id) {
      this.isDeleteOptionClicked = true;
      this.selectedFieldId = contactStatusStage.id;
    } else {
      this.isDeleteOptionClicked = false;
      const stageIndex = this.contactStatusStages.indexOf(contactStatusStage);
      this.contactStatusStages.splice(stageIndex, 1);
    }
  }

  defaultStageChange(index: number) {
    this.contactStatusStages.forEach((stage, i) => {
      stage.defaultStage = i === index;
    });
    this.selectedDefaultIndex = index;
  }

  delete(event: any) {
    if (event) {
      this.contactStatusLoading = true;
      this.flexiFieldService.deleteContactStatusStage(this.selectedFieldId).subscribe(
        (response: any) => {
          this.contactStatusLoading = false;
          if (response.statusCode === 200) {
            this.contactStatusResponse = new CustomResponse('SUCCESS', response.message, true);
            this.findContactStatusStages();
          } else {
            this.contactStatusResponse = new CustomResponse('ERROR', response.message, true);
          }
          this.resetDeleteOptions();
        }, (error: any) => {
          this.resetDeleteOptions();
          this.contactStatusLoading = false;
          this.contactStatusResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
        });
    } else {
      this.resetDeleteOptions();
    }
  }

  resetDeleteOptions(){
    this.isDeleteOptionClicked = false;
    this.selectedFieldId = 0;
  }

  saveOrUpdate() {
    this.contactStatusLoading = true;
    this.flexiFieldService.saveOrUpdateContactStatusStages(this.contactStatusStages).subscribe(
      (response: any) => {
        this.contactStatusLoading = false;
        if (response.statusCode === 200) {
          this.contactStatusResponse = new CustomResponse('SUCCESS', response.message, true);
          this.findContactStatusStages();
        } else {
          this.contactStatusResponse = new CustomResponse('ERROR', response.message, true);
        }
      }, (error: any) => {
        this.contactStatusLoading = false;
        this.contactStatusResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
      });
  }

  hasStageNameError(): boolean {
    return this.contactStatusStages.some(stage => {
      const stageName = $.trim(stage.stageName || '');
      return !stageName || stageName.length > 55;
    });
  }

}
