import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMditRequestComponent } from './edit-mdit-request.component';

describe('EditMditRequestComponent', () => {
  let component: EditMditRequestComponent;
  let fixture: ComponentFixture<EditMditRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMditRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMditRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
