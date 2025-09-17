import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomLoginScreenSettingsComponent } from './custom-login-screen-settings.component';

describe('CustomLoginScreenSettingsComponent', () => {
  let component: CustomLoginScreenSettingsComponent;
  let fixture: ComponentFixture<CustomLoginScreenSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomLoginScreenSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomLoginScreenSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
