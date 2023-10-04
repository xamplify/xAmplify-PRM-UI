import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomUiSwitchComponent } from './custom-ui-switch.component';

describe('CustomUiSwitchComponent', () => {
  let component: CustomUiSwitchComponent;
  let fixture: ComponentFixture<CustomUiSwitchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomUiSwitchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomUiSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
