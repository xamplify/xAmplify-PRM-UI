import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketoAuthenticationComponent } from './marketo-authentication.component';

describe('MarketoAuthenticationComponent', () => {
  let component: MarketoAuthenticationComponent;
  let fixture: ComponentFixture<MarketoAuthenticationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketoAuthenticationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketoAuthenticationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
