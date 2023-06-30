import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMultipleEmailsInputComponent } from './add-multiple-emails-input.component';

describe('AddMultipleEmailsInputComponent', () => {
  let component: AddMultipleEmailsInputComponent;
  let fixture: ComponentFixture<AddMultipleEmailsInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMultipleEmailsInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMultipleEmailsInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
