import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmSettingsComponent } from './crm-settings.component';

describe('CrmSettingsComponent', () => {
  let component: CrmSettingsComponent;
  let fixture: ComponentFixture<CrmSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrmSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
