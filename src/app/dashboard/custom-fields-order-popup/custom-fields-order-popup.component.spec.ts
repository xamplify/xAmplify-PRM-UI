import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomFieldsOrderPopupComponent } from './custom-fields-order-popup.component';

describe('CustomFieldsOrderPopupComponent', () => {
  let component: CustomFieldsOrderPopupComponent;
  let fixture: ComponentFixture<CustomFieldsOrderPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomFieldsOrderPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomFieldsOrderPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
