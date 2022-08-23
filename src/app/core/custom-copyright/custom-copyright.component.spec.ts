import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomCopyrightComponent } from './custom-copyright.component';

describe('CustomCopyrightComponent', () => {
  let component: CustomCopyrightComponent;
  let fixture: ComponentFixture<CustomCopyrightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomCopyrightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomCopyrightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
