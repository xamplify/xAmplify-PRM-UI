import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwitterFriendsComponent } from './twitter-friends.component';

describe('TwitterFriendsComponent', () => {
  let component: TwitterFriendsComponent;
  let fixture: ComponentFixture<TwitterFriendsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwitterFriendsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwitterFriendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
