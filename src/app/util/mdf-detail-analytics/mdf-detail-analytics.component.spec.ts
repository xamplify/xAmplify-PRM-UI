import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MdfDetailAnalyticsComponent } from './mdf-detail-analytics.component';

describe('MdfDetailAnalyticsComponent', () => {
  let component: MdfDetailAnalyticsComponent;
  let fixture: ComponentFixture<MdfDetailAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MdfDetailAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MdfDetailAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
