import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLevelTimelineComponent } from './user-level-timeline.component';

describe('UserLevelTimelineComponent', () => {
  let component: UserLevelTimelineComponent;
  let fixture: ComponentFixture<UserLevelTimelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserLevelTimelineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLevelTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
