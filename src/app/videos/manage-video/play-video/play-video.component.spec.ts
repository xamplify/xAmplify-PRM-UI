import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayVideoComponent } from './play-video.component';

describe('PlayVideoComponent', () => {
  let component: PlayVideoComponent;
  let fixture: ComponentFixture<PlayVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
