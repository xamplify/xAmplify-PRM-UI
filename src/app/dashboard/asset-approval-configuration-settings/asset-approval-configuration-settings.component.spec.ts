import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetApprovalConfigurationSettingsComponent } from './asset-approval-configuration-settings.component';

describe('AssetApprovalConfigurationSettingsComponent', () => {
  let component: AssetApprovalConfigurationSettingsComponent;
  let fixture: ComponentFixture<AssetApprovalConfigurationSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetApprovalConfigurationSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetApprovalConfigurationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
