import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorCompanyModelPopupComponent } from './vendor-company-model-popup.component';

describe('VendorCompanyModelPopupComponent', () => {
  let component: VendorCompanyModelPopupComponent;
  let fixture: ComponentFixture<VendorCompanyModelPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorCompanyModelPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorCompanyModelPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
