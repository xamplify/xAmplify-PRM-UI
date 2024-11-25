import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskActivityComponent } from './task-activity.component';

describe('TaskActivityComponent', () => {
  let component: TaskActivityComponent;
  let fixture: ComponentFixture<TaskActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
