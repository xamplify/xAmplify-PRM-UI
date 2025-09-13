import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAnalyticsUtilComponent } from './form-analytics-util.component';

describe('FormAnalyticsUtilComponent', () => {
  let component: FormAnalyticsUtilComponent;
  let fixture: ComponentFixture<FormAnalyticsUtilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormAnalyticsUtilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAnalyticsUtilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
