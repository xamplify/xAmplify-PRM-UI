import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainErrorComponent } from './domain-error.component';

describe('DomainErrorComponent', () => {
  let component: DomainErrorComponent;
  let fixture: ComponentFixture<DomainErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DomainErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
