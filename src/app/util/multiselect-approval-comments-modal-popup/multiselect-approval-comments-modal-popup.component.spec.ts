import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiselectApprovalCommentsModalPopupComponent } from './multiselect-approval-comments-modal-popup.component';

describe('MultiselectApprovalCommentsModalPopupComponent', () => {
  let component: MultiselectApprovalCommentsModalPopupComponent;
  let fixture: ComponentFixture<MultiselectApprovalCommentsModalPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiselectApprovalCommentsModalPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiselectApprovalCommentsModalPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
