import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwitterHomeComponent } from './twitter-home.component';

describe('TwitterHomeComponent', () => {
  let component: TwitterHomeComponent;
  let fixture: ComponentFixture<TwitterHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwitterHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwitterHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
