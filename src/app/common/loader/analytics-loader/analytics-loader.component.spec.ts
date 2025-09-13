import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsLoaderComponent } from './analytics-loader.component';

describe('AnalyticsLoaderComponent', () => {
  let component: AnalyticsLoaderComponent;
  let fixture: ComponentFixture<AnalyticsLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
