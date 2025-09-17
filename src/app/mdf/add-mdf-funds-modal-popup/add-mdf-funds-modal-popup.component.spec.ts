import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMdfFundsModalPopupComponent } from './add-mdf-funds-modal-popup.component';

describe('AddMdfFundsModalPopupComponent', () => {
  let component: AddMdfFundsModalPopupComponent;
  let fixture: ComponentFixture<AddMdfFundsModalPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMdfFundsModalPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMdfFundsModalPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
