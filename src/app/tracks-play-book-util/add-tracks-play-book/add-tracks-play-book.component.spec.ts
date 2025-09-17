import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTracksPlayBookComponent } from './add-tracks-play-book.component';

describe('AddTracksPlayBookComponent', () => {
  let component: AddTracksPlayBookComponent;
  let fixture: ComponentFixture<AddTracksPlayBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTracksPlayBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTracksPlayBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
