import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorJourneyComponent } from './vendor-journey.component';

describe('VendorJourneyComponent', () => {
  let component: VendorJourneyComponent;
  let fixture: ComponentFixture<VendorJourneyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorJourneyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorJourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
