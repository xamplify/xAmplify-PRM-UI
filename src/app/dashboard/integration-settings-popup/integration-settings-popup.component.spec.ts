import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationSettingsPopupComponent } from './integration-settings-popup.component';

describe('IntegrationSettingsPopupComponent', () => {
  let component: IntegrationSettingsPopupComponent;
  let fixture: ComponentFixture<IntegrationSettingsPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntegrationSettingsPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegrationSettingsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
