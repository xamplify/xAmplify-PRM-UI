import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageInsightsComponent } from './manage-insights.component';

describe('ManageInsightsComponent', () => {
  let component: ManageInsightsComponent;
  let fixture: ComponentFixture<ManageInsightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageInsightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
