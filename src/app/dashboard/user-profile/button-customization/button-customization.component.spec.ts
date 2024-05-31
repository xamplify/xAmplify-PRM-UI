import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonCustomizationComponent } from './button-customization.component';

describe('ButtonCustomizationComponent', () => {
  let component: ButtonCustomizationComponent;
  let fixture: ComponentFixture<ButtonCustomizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonCustomizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonCustomizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
