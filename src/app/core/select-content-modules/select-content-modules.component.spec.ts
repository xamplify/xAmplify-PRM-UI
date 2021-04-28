import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectContentModulesComponent } from './select-content-modules.component';

describe('SelectContentModulesComponent', () => {
  let component: SelectContentModulesComponent;
  let fixture: ComponentFixture<SelectContentModulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectContentModulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectContentModulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
