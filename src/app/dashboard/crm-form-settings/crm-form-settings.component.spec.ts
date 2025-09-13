import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmFormSettingsComponent } from './crm-form-settings.component';

describe('CrmFormSettingsComponent', () => {
  let component: CrmFormSettingsComponent;
  let fixture: ComponentFixture<CrmFormSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrmFormSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmFormSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
