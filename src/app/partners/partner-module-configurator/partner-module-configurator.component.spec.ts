import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerModuleConfiguratorComponent } from './partner-module-configurator.component';

describe('PartnerModuleConfiguratorComponent', () => {
  let component: PartnerModuleConfiguratorComponent;
  let fixture: ComponentFixture<PartnerModuleConfiguratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerModuleConfiguratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerModuleConfiguratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
