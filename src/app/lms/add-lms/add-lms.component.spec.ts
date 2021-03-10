import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLmsComponent } from './add-lms.component';

describe('AddLmsComponent', () => {
  let component: AddLmsComponent;
  let fixture: ComponentFixture<AddLmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
