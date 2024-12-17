import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XamplifyCustomFieldsSettingsComponent } from './xamplify-custom-fields-settings.component';

describe('XamplifyCustomFieldsSettingsComponent', () => {
  let component: XamplifyCustomFieldsSettingsComponent;
  let fixture: ComponentFixture<XamplifyCustomFieldsSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XamplifyCustomFieldsSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XamplifyCustomFieldsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
