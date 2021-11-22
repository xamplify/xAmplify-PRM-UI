import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditModuleNameComponent } from './edit-module-name.component';

describe('EditModuleNameComponent', () => {
  let component: EditModuleNameComponent;
  let fixture: ComponentFixture<EditModuleNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditModuleNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditModuleNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
