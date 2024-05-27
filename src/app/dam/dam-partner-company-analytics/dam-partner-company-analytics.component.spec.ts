import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DamPartnerCompanyAnalyticsComponent } from './dam-partner-company-analytics.component';

describe('DamPartnerCompanyAnalyticsComponent', () => {
  let component: DamPartnerCompanyAnalyticsComponent;
  let fixture: ComponentFixture<DamPartnerCompanyAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DamPartnerCompanyAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DamPartnerCompanyAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
