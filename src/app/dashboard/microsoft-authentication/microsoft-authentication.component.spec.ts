import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MicrosoftAuthenticationComponent } from './microsoft-authentication.component';

describe('MicrosoftAuthenticationComponent', () => {
  let component: MicrosoftAuthenticationComponent;
  let fixture: ComponentFixture<MicrosoftAuthenticationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MicrosoftAuthenticationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MicrosoftAuthenticationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
