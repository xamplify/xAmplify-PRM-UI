import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPreviewWithSubmittedAnswersComponent } from './form-preview-with-submitted-answers.component';

describe('FormPreviewWithSubmittedAnswersComponent', () => {
  let component: FormPreviewWithSubmittedAnswersComponent;
  let fixture: ComponentFixture<FormPreviewWithSubmittedAnswersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormPreviewWithSubmittedAnswersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPreviewWithSubmittedAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
