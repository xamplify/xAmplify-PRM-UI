import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReferenceService } from 'app/core/services/reference.service';
import { TaskActivity } from '../models/task-activity-dto';
import { SortOption } from 'app/core/models/sort-option';
import { TaskActivityService } from '../services/task-activity.service';

@Component({
  selector: 'app-preview-task-activity',
  templateUrl: './preview-task-activity.component.html',
  styleUrls: ['./preview-task-activity.component.css'],
  providers: [TaskActivityService, SortOption]
})
export class PreviewTaskActivityComponent implements OnInit {

  @Input() taskActivityId:any;
  @Output() notifyClose = new EventEmitter();

  ngxLoading:boolean = false;
  taskPriorityOption:SortOption = new SortOption();
  taskActivity:TaskActivity = new TaskActivity();

  constructor(public taskService:TaskActivityService, public referenceService:ReferenceService) { }

  ngOnInit() {
    this.referenceService.openModalPopup('viewTaskModalPopup');
    this.fecthTaskActivity();
  }

  fecthTaskActivity() {
    this.ngxLoading = true;
    this.taskService.fetchTaskActivityById(this.taskActivityId).subscribe(
      data => {
        if (data.statusCode == 200) {
          this.taskActivity = data.data;
          this.taskPriorityOption.taskActivityTypeDropDownOption.value = this.taskActivity.taskType;
          this.taskPriorityOption.taskActivityPriorityDropDownOption.value = this.taskActivity.priority;
        }
        this.ngxLoading = false;
      }, error => {
        this.ngxLoading = false;
      }
    )
  }

  closeTaskModal() {
    this.referenceService.closeModalPopup('viewTaskModalPopup');
    this.notifyClose.emit();
  }

}
