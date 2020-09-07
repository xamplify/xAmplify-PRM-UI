import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MdfRequestTimelineComponent } from './mdf-request-timeline.component';

describe('MdfRequestTimelineComponent', () => {
  let component: MdfRequestTimelineComponent;
  let fixture: ComponentFixture<MdfRequestTimelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MdfRequestTimelineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MdfRequestTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
