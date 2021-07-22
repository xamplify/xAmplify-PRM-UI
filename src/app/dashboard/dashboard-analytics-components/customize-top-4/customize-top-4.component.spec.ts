import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizeTop4Component } from './customize-top-4.component';

describe('CustomizeTop4Component', () => {
  let component: CustomizeTop4Component;
  let fixture: ComponentFixture<CustomizeTop4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomizeTop4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomizeTop4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
