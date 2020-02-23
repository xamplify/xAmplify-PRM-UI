import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveGeoLocationAnalyticsComponent } from './save-geo-location-analytics.component';

describe('SaveGeoLocationAnalyticsComponent', () => {
  let component: SaveGeoLocationAnalyticsComponent;
  let fixture: ComponentFixture<SaveGeoLocationAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveGeoLocationAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveGeoLocationAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
