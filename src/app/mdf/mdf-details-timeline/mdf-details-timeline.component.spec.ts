import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MdfDetailsTimelineComponent } from './mdf-details-timeline.component';

describe('MdfDetailsTimelineComponent', () => {
  let component: MdfDetailsTimelineComponent;
  let fixture: ComponentFixture<MdfDetailsTimelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MdfDetailsTimelineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MdfDetailsTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
