import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTaskModalPopupComponent } from './add-task-modal-popup.component';

describe('AddTaskModalPopupComponent', () => {
  let component: AddTaskModalPopupComponent;
  let fixture: ComponentFixture<AddTaskModalPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTaskModalPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTaskModalPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
