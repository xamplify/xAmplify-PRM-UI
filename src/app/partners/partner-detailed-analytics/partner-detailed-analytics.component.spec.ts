import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerDetailedAnalyticsComponent } from './partner-detailed-analytics.component';

describe('PartnerDetailedAnalyticsComponent', () => {
  let component: PartnerDetailedAnalyticsComponent;
  let fixture: ComponentFixture<PartnerDetailedAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerDetailedAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerDetailedAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
