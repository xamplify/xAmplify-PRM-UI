import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ReferenceService } from 'app/core/services/reference.service';
import { TaskActivity } from '../models/task-activity-dto';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { SortOption } from 'app/core/models/sort-option';
import { TaskActivityService } from '../services/task-activity.service';

declare var flatpickr:any;

@Component({
  selector: 'app-add-task-modal-popup',
  templateUrl: './add-task-modal-popup.component.html',
  styleUrls: ['./add-task-modal-popup.component.css'],
  providers: [TaskActivityService, Properties]
})
export class AddTaskModalPopupComponent implements OnInit {

  @Input() isReloadTaskActivityTab:boolean;
  @Input() userId:any;
  @Input() actionType:string;
  @Input() taskActivityId:any;
  @Output() notifySubmitSuccess = new EventEmitter();
  @Output() notifyClose = new EventEmitter();
  @Output() notifyUpdateSuccess = new EventEmitter();

  taskActivity:TaskActivity = new TaskActivity();
  customResponse:CustomResponse = new CustomResponse();
  ngxLoading:boolean = false;
  isPreview:boolean = false;
  taskTypeOption:SortOption = new SortOption();
  taskPriorityOption:SortOption = new SortOption();
  assignToDropDownOptions = [];
  dueDatePickr: any;
  isValidTask:boolean = false;
  statusDropDownOptions = [];
  dueDateTime: string;
  isDueDateError: boolean = false;
  isEdit:boolean = false;
  ckeConfig:any;

  constructor(public referenceService:ReferenceService, public taskService:TaskActivityService, public properties:Properties) { }

  ngOnInit() {
    this.initializeDueDatePicker();
    this.ckeConfig = this.properties.ckEditorConfig;
    if (this.actionType == 'add') {
      this.taskActivity.userId = this.userId;
      this.fetchAssignToDropDownOptions();
      this.fetchStatusDropDownOptions();
      this.isEdit = false;
      this.isPreview = false;
    } else if (this.actionType == 'edit') {
      this.isPreview = false;
      this.isEdit = true;
      this.fetchAssignToDropDownOptions();
      this.fetchStatusDropDownOptions();
      this.fetchTaskActivityByIdForEdit();
    } else {
      this.isPreview = true;
      this.isEdit = false;
    }
    this.referenceService.openModalPopup('addTaskModalPopup');
  }

  save() {
    this.ngxLoading = true;
    this.taskActivity.taskType = this.taskTypeOption.taskActivityTypeDropDownOption.value;
    this.taskActivity.priority = this.taskPriorityOption.taskActivityPriorityDropDownOption.value;
    this.taskService.save(this.taskActivity).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.closeTaskModal();
          this.notifySubmitSuccess.emit(!this.isReloadTaskActivityTab);
        } else {
          this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
          // this.closeTaskModal();
        }
        this.ngxLoading = false;
      }, error => {
        this.ngxLoading = false;
        this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
      }
    )
  }

  closeTaskModal() {
    this.referenceService.closeModalPopup('addTaskModalPopup');
    this.notifyClose.emit();
  }

  validateTask() {
    let isValidName = this.taskActivity.name != undefined && this.taskActivity.name.replace(/\s\s+/g, '').replace(/\s+$/, "").replace(/\s+/g, " ");
    let isValidDueDate = this.taskActivity.dueDate != undefined && this.taskActivity.dueDate.replace(/\s\s+/g, '').replace(/\s+$/, "").replace(/\s+/g, " ");
    let isValidAssignedTo = this.taskActivity.assignedTo != undefined && this.taskActivity.assignedTo > 0;
    let isValidStatus = this.taskActivity.status != undefined && this.taskActivity.status > 0;
    if (isValidName && isValidDueDate && isValidAssignedTo && isValidStatus) {
      this.isValidTask = true;
    } else {
      this.isValidTask = false;
    }
  }

  sortBy(text: any) {
    this.taskTypeOption.taskActivityTypeDropDownOption = text;
  }

  clearEndDate() {
    this.dueDatePickr.clear();
    this.taskActivity.dueDate = undefined;
  }

  private initializeDueDatePicker() {
    let now: Date = new Date();
    let defaultDate = now;
    if (this.taskActivity.dueDate != undefined && this.taskActivity.dueDate != null) {
      defaultDate = new Date(this.taskActivity.dueDate);
    }

    this.dueDatePickr = flatpickr('#taskActivityDueDatePicker', {
      enableTime: true,
      dateFormat: 'Y-m-d H:i',
      time_24hr: true,
      minDate: now,
      defaultDate: defaultDate
    });
  }

  fetchAssignToDropDownOptions() {
    this.ngxLoading = true;
    this.taskService.fetchAssignToDropDownOptions().subscribe(
      response => {
        if (response.statusCode == 200) {
          this.assignToDropDownOptions = response.data;
        } else {
          this.customResponse = new CustomResponse('ERROR', response.message, true);
        }
        this.ngxLoading = false;
      }, error => {
        this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
        this.ngxLoading = false;
      }
    )
  }

  fetchStatusDropDownOptions() {
    this.ngxLoading = false;
    this.taskService.fetchStatusDropDownOptions().subscribe(
      response => {
        if (response.statusCode == 200) {
          this.statusDropDownOptions = response.data;
        } else {
          this.customResponse = new CustomResponse('ERROR', response.message, true);
        }
        this.ngxLoading = false;
      }, error => {
        this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
        this.ngxLoading = false;
      }
    )
  }

  addTaskActivityAssignTo(userId) {
    this.taskActivity.assignedTo = userId;
  }

  addTaskActivitystatus(id) {
    this.taskActivity.status = id;
  }

  dueDateError() {
    const currentDate = new Date().getTime();
    this.dueDateTime = this.taskActivity.dueDate;
    const startDate = Date.parse(this.dueDateTime);
    if (startDate < currentDate) { 
      this.isDueDateError = true; 
    } else {
      this.isDueDateError = false;
    }
  }

  fetchTaskActivityByIdForEdit() {
    this.ngxLoading = true;
    this.taskService.fetchTaskActivityByIdForEdit(this.taskActivityId).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.taskActivity = response.data;
          this.taskTypeOption.taskActivityTypeDropDownOption.value = this.taskActivity.taskType;
          this.taskPriorityOption.taskActivityPriorityDropDownOption.value = this.taskActivity.priority;
        } else {
          this.customResponse = new CustomResponse('ERROR', response.message, true);
        }
        this.ngxLoading = false;
      }, error => {
        this.ngxLoading = false;
        this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
      }
    )
  }

  update() {
    this.ngxLoading = true;
    this.taskActivity.taskType = this.taskTypeOption.taskActivityTypeDropDownOption.value;
    this.taskActivity.priority = this.taskPriorityOption.taskActivityPriorityDropDownOption.value;
    this.taskService.update(this.taskActivity).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.closeTaskModal();
          this.notifyUpdateSuccess.emit(!this.isReloadTaskActivityTab);
        } else {
          let data = response.data;
          if (data != undefined && data.errorMessages != undefined && data.errorMessages.length > 0) {
            this.customResponse = new CustomResponse('ERROR', data.errorMessages[0].message, true);
          } else {
            this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
          }
        }
        this.ngxLoading = false;
      }, error => {
        this.ngxLoading = false;
        this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
      }
    )
  }

}
