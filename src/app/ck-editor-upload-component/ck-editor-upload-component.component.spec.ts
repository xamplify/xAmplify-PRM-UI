import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CkEditorUploadComponentComponent } from './ck-editor-upload-component.component';

describe('CkEditorUploadComponentComponent', () => {
  let component: CkEditorUploadComponentComponent;
  let fixture: ComponentFixture<CkEditorUploadComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CkEditorUploadComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CkEditorUploadComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
