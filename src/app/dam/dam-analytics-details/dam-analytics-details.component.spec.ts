import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DamAnalyticsDetailsComponent } from './dam-analytics-details.component';

describe('DamAnalyticsDetailsComponent', () => {
  let component: DamAnalyticsDetailsComponent;
  let fixture: ComponentFixture<DamAnalyticsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DamAnalyticsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DamAnalyticsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
