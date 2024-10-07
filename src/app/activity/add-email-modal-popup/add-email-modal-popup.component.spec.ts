import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmailModalPopupComponent } from './add-email-modal-popup.component';

describe('AddEmailModalPopupComponent', () => {
  let component: AddEmailModalPopupComponent;
  let fixture: ComponentFixture<AddEmailModalPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEmailModalPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmailModalPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
