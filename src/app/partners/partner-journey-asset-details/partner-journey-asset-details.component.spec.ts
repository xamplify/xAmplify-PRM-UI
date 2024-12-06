import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerJourneyAssetDetailsComponent } from './partner-journey-asset-details.component';

describe('PartnerJourneyAssetDetailsComponent', () => {
  let component: PartnerJourneyAssetDetailsComponent;
  let fixture: ComponentFixture<PartnerJourneyAssetDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerJourneyAssetDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerJourneyAssetDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
