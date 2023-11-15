import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareTracksComponent } from './share-tracks.component';

describe('ShareTracksComponent', () => {
  let component: ShareTracksComponent;
  let fixture: ComponentFixture<ShareTracksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareTracksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareTracksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
