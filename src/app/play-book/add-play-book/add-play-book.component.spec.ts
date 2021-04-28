import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlayBookComponent } from './add-play-book.component';

describe('AddPlayBookComponent', () => {
  let component: AddPlayBookComponent;
  let fixture: ComponentFixture<AddPlayBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPlayBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPlayBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
