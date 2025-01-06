import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentModuleStatusAnalyticsComponent } from './content-module-status-analytics.component';

describe('ContentModuleStatusAnalyticsComponent', () => {
  let component: ContentModuleStatusAnalyticsComponent;
  let fixture: ComponentFixture<ContentModuleStatusAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentModuleStatusAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentModuleStatusAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
