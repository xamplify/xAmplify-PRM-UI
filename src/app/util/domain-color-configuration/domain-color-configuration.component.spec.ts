import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainColorConfigurationComponent } from './domain-color-configuration.component';

describe('DomainColorConfigurationComponent', () => {
  let component: DomainColorConfigurationComponent;
  let fixture: ComponentFixture<DomainColorConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DomainColorConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainColorConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
