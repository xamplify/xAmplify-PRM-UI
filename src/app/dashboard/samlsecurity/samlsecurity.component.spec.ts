import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SamlsecurityComponent } from './samlsecurity.component';

describe('SamlsecurityComponent', () => {
  let component: SamlsecurityComponent;
  let fixture: ComponentFixture<SamlsecurityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SamlsecurityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamlsecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
