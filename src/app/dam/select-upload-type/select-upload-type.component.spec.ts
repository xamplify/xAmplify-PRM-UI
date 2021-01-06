import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectUploadTypeComponent } from './select-upload-type.component';

describe('SelectUploadTypeComponent', () => {
  let component: SelectUploadTypeComponent;
  let fixture: ComponentFixture<SelectUploadTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectUploadTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectUploadTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
