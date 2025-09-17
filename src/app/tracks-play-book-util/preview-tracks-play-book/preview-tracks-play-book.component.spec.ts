import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewTracksPlayBookComponent } from './preview-tracks-play-book.component';

describe('PreviewTracksPlayBookComponent', () => {
  let component: PreviewTracksPlayBookComponent;
  let fixture: ComponentFixture<PreviewTracksPlayBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewTracksPlayBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewTracksPlayBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
