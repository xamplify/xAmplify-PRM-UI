import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwitterTweetsComponent } from './twitter-tweets.component';

describe('TwitterTweetsComponent', () => {
  let component: TwitterTweetsComponent;
  let fixture: ComponentFixture<TwitterTweetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwitterTweetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwitterTweetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
