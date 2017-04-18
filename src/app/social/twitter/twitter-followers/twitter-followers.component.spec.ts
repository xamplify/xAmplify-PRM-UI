import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwitterFollowersComponent } from './twitter-followers.component';

describe('TwitterFollowersComponent', () => {
  let component: TwitterFollowersComponent;
  let fixture: ComponentFixture<TwitterFollowersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwitterFollowersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwitterFollowersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
