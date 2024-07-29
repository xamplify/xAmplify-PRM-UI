import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayErrorMessageComponent } from './display-error-message.component';

describe('DisplayErrorMessageComponent', () => {
  let component: DisplayErrorMessageComponent;
  let fixture: ComponentFixture<DisplayErrorMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayErrorMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayErrorMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
