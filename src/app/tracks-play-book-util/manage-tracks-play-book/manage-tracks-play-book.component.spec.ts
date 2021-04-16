import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTracksPlayBookComponent } from './manage-tracks-play-book.component';

describe('ManageTracksPlayBookComponent', () => {
  let component: ManageTracksPlayBookComponent;
  let fixture: ComponentFixture<ManageTracksPlayBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageTracksPlayBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTracksPlayBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
