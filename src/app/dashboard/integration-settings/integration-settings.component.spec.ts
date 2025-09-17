import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationSettingsComponent } from './integration-settings.component';

describe('IntegrationSettingsComponent', () => {
  let component: IntegrationSettingsComponent;
  let fixture: ComponentFixture<IntegrationSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntegrationSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegrationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
