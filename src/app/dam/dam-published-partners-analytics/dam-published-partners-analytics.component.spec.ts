import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DamPublishedPartnersAnalyticsComponent } from './dam-published-partners-analytics.component';

describe('DamPublishedPartnersAnalyticsComponent', () => {
  let component: DamPublishedPartnersAnalyticsComponent;
  let fixture: ComponentFixture<DamPublishedPartnersAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DamPublishedPartnersAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DamPublishedPartnersAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
