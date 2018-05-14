import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayVideoLoaderComponent } from './play-video-loader.component';

describe('PlayVideoLoaderComponent', () => {
  let component: PlayVideoLoaderComponent;
  let fixture: ComponentFixture<PlayVideoLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayVideoLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayVideoLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
