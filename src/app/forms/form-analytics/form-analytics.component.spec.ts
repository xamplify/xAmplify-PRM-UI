import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAnalyticsComponent } from './form-analytics.component';

describe('FormAnalyticsComponent', () => {
  let component: FormAnalyticsComponent;
  let fixture: ComponentFixture<FormAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
