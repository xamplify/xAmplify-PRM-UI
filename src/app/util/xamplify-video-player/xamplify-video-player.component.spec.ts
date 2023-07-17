import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XamplifyVideoPlayerComponent } from './xamplify-video-player.component';

describe('XamplifyVideoPlayerComponent', () => {
  let component: XamplifyVideoPlayerComponent;
  let fixture: ComponentFixture<XamplifyVideoPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XamplifyVideoPlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XamplifyVideoPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
