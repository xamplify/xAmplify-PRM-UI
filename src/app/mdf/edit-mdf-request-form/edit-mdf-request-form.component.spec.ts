import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMdfRequestFormComponent } from './edit-mdf-request-form.component';

describe('EditMdfRequestFormComponent', () => {
  let component: EditMdfRequestFormComponent;
  let fixture: ComponentFixture<EditMdfRequestFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMdfRequestFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMdfRequestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
