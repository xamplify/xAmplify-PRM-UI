import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlexiFieldComponent } from './flexi-field.component';

describe('FlexiFieldComponent', () => {
  let component: FlexiFieldComponent;
  let fixture: ComponentFixture<FlexiFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlexiFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlexiFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
