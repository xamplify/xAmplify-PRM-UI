import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnableSupportAccessToVendorComponent } from './enable-support-access-to-vendor.component';

describe('EnableSupportAccessToVendorComponent', () => {
  let component: EnableSupportAccessToVendorComponent;
  let fixture: ComponentFixture<EnableSupportAccessToVendorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnableSupportAccessToVendorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnableSupportAccessToVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
