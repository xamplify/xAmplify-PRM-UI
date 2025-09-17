import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFormUtilComponent } from './add-form-util.component';

describe('AddFormUtilComponent', () => {
  let component: AddFormUtilComponent;
  let fixture: ComponentFixture<AddFormUtilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFormUtilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFormUtilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
