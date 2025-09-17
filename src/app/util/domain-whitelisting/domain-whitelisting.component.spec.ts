import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainWhitelistingComponent } from './domain-whitelisting.component';

describe('DomainWhitelistingComponent', () => {
  let component: DomainWhitelistingComponent;
  let fixture: ComponentFixture<DomainWhitelistingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DomainWhitelistingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainWhitelistingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
