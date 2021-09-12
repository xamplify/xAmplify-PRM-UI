import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmSweetAlertUtilComponent } from './confirm-sweet-alert-util.component';

describe('ConfirmSweetAlertUtilComponent', () => {
  let component: ConfirmSweetAlertUtilComponent;
  let fixture: ComponentFixture<ConfirmSweetAlertUtilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmSweetAlertUtilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmSweetAlertUtilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
