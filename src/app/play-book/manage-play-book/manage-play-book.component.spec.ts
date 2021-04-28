import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePlayBookComponent } from './manage-play-book.component';

describe('ManagePlayBookComponent', () => {
  let component: ManagePlayBookComponent;
  let fixture: ComponentFixture<ManagePlayBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagePlayBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePlayBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
