import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcludeDomainComponent } from './exclude-domain.component';

describe('ExcludeDomainComponent', () => {
  let component: ExcludeDomainComponent;
  let fixture: ComponentFixture<ExcludeDomainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExcludeDomainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcludeDomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
