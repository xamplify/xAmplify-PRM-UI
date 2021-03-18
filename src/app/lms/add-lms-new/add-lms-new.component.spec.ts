import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLmsNewComponent } from './add-lms-new.component';

describe('AddLmsNewComponent', () => {
  let component: AddLmsNewComponent;
  let fixture: ComponentFixture<AddLmsNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLmsNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLmsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
