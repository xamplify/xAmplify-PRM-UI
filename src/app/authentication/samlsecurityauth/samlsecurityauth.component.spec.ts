import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SamlsecurityauthComponent } from './samlsecurityauth.component';

describe('SamlsecurityauthComponent', () => {
  let component: SamlsecurityauthComponent;
  let fixture: ComponentFixture<SamlsecurityauthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SamlsecurityauthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamlsecurityauthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
