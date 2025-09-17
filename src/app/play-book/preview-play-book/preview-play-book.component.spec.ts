import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewPlayBookComponent } from './preview-play-book.component';

describe('PreviewPlayBookComponent', () => {
  let component: PreviewPlayBookComponent;
  let fixture: ComponentFixture<PreviewPlayBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewPlayBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewPlayBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
