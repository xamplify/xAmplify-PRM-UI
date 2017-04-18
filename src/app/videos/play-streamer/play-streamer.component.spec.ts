import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayStreamerComponent } from './play-streamer.component';

describe('PlayStreamerComponent', () => {
  let component: PlayStreamerComponent;
  let fixture: ComponentFixture<PlayStreamerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayStreamerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayStreamerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
