import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormGeoAnalyticsComponent } from './form-geo-analytics.component';

describe('FormGeoAnalyticsComponent', () => {
  let component: FormGeoAnalyticsComponent;
  let fixture: ComponentFixture<FormGeoAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormGeoAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormGeoAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
