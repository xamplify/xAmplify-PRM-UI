import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectwiseAuthenticationComponent } from './connectwise-authentication.component';

describe('ConnectwiseAuthenticationComponent', () => {
  let component: ConnectwiseAuthenticationComponent;
  let fixture: ComponentFixture<ConnectwiseAuthenticationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectwiseAuthenticationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectwiseAuthenticationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
