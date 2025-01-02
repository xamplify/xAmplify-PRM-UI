import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ReferenceService } from 'app/core/services/reference.service';
import { TaskActivity } from '../models/task-activity-dto';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { SortOption } from 'app/core/models/sort-option';
import { TaskActivityService } from '../services/task-activity.service';
import { SearchableDropdownDto } from 'app/core/models/searchable-dropdown-dto';

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
  remainderDatePickr: any;
  showRemainderDate:boolean = false;
  isBeforeHalfAnHourEnable: boolean = true;
  isBeforeOneHourEnable: boolean = true;
  isBeforeOneDayEnable: boolean = true;
  isBeforeOneWeekEnable: boolean = true;
  files: File[] = [];
  file: File;
  formData: any = new FormData();
  assignedToUsersSearchableDropDownDto: SearchableDropdownDto = new SearchableDropdownDto();
  showAssignedToUserDropdown:boolean = false;

  constructor(public referenceService:ReferenceService, public taskService:TaskActivityService, public properties:Properties) { }

  ngOnInit() {
    this.initializeDueDatePicker();
    this.initializeRemainderPicker();
    this.ckeConfig = this.properties.ckEditorConfig;
    if (this.actionType == 'add') {
      this.taskActivity.userId = this.userId;
      this.taskActivity.priority = 'LOW';
      this.taskActivity.taskType = 'TODO';
      this.taskActivity.assignedTo = 0;
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
    this.prepareFormData();
    this.taskService.save(this.taskActivity, this.formData).subscribe(
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
    let isValidRemainder = (this.taskActivity.remainderType == 'CUSTOMDATE' && this.taskActivity.remainder && this.taskActivity.remainder.replace(/\s\s+/g, '').replace(/\s+$/, "").replace(/\s+/g, " ")) || this.taskActivity.remainderType != 'CUSTOMDATE'; 
    if (isValidName && isValidDueDate && isValidAssignedTo && isValidStatus && isValidRemainder) {
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
    now.setMinutes(now.getMinutes() + 30);
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

  private initializeRemainderPicker() {
    let now: Date = new Date();
    now.setMinutes(now.getMinutes() + 30);
    let defaultDate;
    if (this.referenceService.checkIsValidString(this.taskActivity.remainder)) {
      defaultDate = new Date(this.taskActivity.remainder);
    }
    let maxDate: Date = new Date();
    if (this.referenceService.checkIsValidString(this.taskActivity.dueDate)) {
      let dueDate = new Date(this.taskActivity.dueDate);
      maxDate.setTime(dueDate.setMinutes(dueDate.getMinutes() - 30));
    }

    if (this.actionType == 'add') {
      this.remainderDatePickr = flatpickr('#taskActivityRemainderPicker', {
        enableTime: true,
        dateFormat: 'Y-m-d H:i',
        time_24hr: true,
        minDate: now,
        defaultDate: defaultDate,
        maxDate: maxDate
      })
    } else {
      this.remainderDatePickr = flatpickr('#taskActivityRemainderPicker', {
        enableTime: true,
        dateFormat: 'Y-m-d H:i',
        time_24hr: true,
        minDate: now,
        defaultDate: defaultDate,
        maxDate: maxDate
      })
    };
  }

  fetchAssignToDropDownOptions() {
    this.ngxLoading = true;
    this.taskService.fetchAssignToDropDownOptions().subscribe(
      response => {
        if (response.statusCode == 200) {
          this.assignedToUsersSearchableDropDownDto.data = response.data;
          this.assignedToUsersSearchableDropDownDto.placeHolder = "Select a member";
          this.showAssignedToUserDropdown = true;
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
    if (this.taskActivity.remainder != undefined) {
      const remainder = Date.parse(this.taskActivity.remainder);
      if (startDate < remainder) {
        this.taskActivity.remainder = undefined;
      }
    }
    this.initializeRemainderPicker();
    this.checkRemainderOptionsVisibility();
  }

  fetchTaskActivityByIdForEdit() {
    this.ngxLoading = true;
    this.taskService.fetchTaskActivityById(this.taskActivityId).subscribe(
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
      },
      () => {
        this.initializeRemainderPicker();
        if (this.taskActivity.remainderType == 'CUSTOMDATE') {
          this.showRemainderDate = true;
        }
        this.checkRemainderOptionsVisibility();
      }
    )
  }

  update() {
    this.ngxLoading = true;
    this.prepareFormData();
    this.taskService.update(this.taskActivity, this.formData).subscribe(
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

  handleRemainderType(event) {
    if (event == 'CUSTOMDATE') {
      this.showRemainderDate = true;
      this.initializeRemainderPicker();
    } else {
      this.showRemainderDate = false;
      this.taskActivity.remainder = event;
    }
  }

  isDueDateLessThanHalfAnHour(): boolean {
    if (this.taskActivity.dueDate) {
      const now = new Date();
      const diffInMinutes = (new Date(this.taskActivity.dueDate).getTime() - now.getTime()) / (1000 * 60);
      return diffInMinutes < 30;
    }
    return false;
  }

  isDueDateLessThanOneHour(): boolean {
    if (this.taskActivity.dueDate) {
      const now = new Date();
      const diffInMinutes = (new Date(this.taskActivity.dueDate).getTime() - now.getTime()) / (1000 * 60);
      return diffInMinutes < 60;
    }
    return false;
  }

  isDueDateLessThanOneDay(): boolean {
    if (this.taskActivity.dueDate) {
      const now = new Date();
      const diffInDays = (new Date(this.taskActivity.dueDate).getTime() - now.getTime()) / (1000 * 3600 * 24);
      return diffInDays < 1;
    }
    return false;
  }

  isDueDateLessThanOneWeek(): boolean {
    if (this.taskActivity.dueDate) {
      const now = new Date();
      const diffInDays = (new Date(this.taskActivity.dueDate).getTime() - now.getTime()) / (1000 * 3600 * 24);
      return diffInDays < 7;
    }
    return false;
  }

  checkRemainderOptionsVisibility() {
    this.isBeforeHalfAnHourEnable = this.isDueDateLessThanHalfAnHour();
    this.isBeforeOneHourEnable = this.isDueDateLessThanOneHour();
    this.isBeforeOneDayEnable = this.isDueDateLessThanOneDay();
    this.isBeforeOneWeekEnable = this.isDueDateLessThanOneWeek();
  }

  onFileChange(event: any): void {
    const selectedFiles: FileList = event.target.files;    
    if (selectedFiles.length > 0) {
      for (let i = 0; i < selectedFiles.length; i++) {
        this.files.push(selectedFiles[i]);
      }
      event.target.value = '';
    }
  }

  removeFile(index: number): void {
    this.files.splice(index, 1);
  }

  removeFileDTO(index: number): void {
    this.taskActivity.taskAttachmentDTOs.splice(index, 1);
  }

  prepareFormData(): void {
    this.files.forEach(file => {
      this.formData.append("uploadedFiles", file, file['name']);
    });
  }

  getSelectedAssignedToUserId(event) {
    this.taskActivity.assignedTo = event != undefined ? event['id'] : 0;
    this.validateTask();
  }

}
