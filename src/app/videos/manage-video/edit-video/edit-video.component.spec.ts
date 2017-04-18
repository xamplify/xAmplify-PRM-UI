import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVideoComponent } from './edit-video.component';

describe('EditVideoComponent', () => {
  let component: EditVideoComponent;
  let fixture: ComponentFixture<EditVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
