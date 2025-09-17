import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualPartnerAnalyticsComponent } from './individual-partner-analytics.component';

describe('IndividualPartnerAnalyticsComponent', () => {
  let component: IndividualPartnerAnalyticsComponent;
  let fixture: ComponentFixture<IndividualPartnerAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndividualPartnerAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualPartnerAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
