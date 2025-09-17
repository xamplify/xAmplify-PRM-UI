import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Top4TracksAndPlayBooksComponent } from './top-4-tracks-and-play-books.component';

describe('Top4TracksAndPlayBooksComponent', () => {
  let component: Top4TracksAndPlayBooksComponent;
  let fixture: ComponentFixture<Top4TracksAndPlayBooksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Top4TracksAndPlayBooksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Top4TracksAndPlayBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
