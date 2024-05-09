import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVendorLogosComponent } from './add-vendor-logos.component';

describe('AddVendorLogosComponent', () => {
  let component: AddVendorLogosComponent;
  let fixture: ComponentFixture<AddVendorLogosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddVendorLogosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVendorLogosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
