import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectDigitalSignatureComponent } from './select-digital-signature.component';

describe('SelectDigitalSignatureComponent', () => {
  let component: SelectDigitalSignatureComponent;
  let fixture: ComponentFixture<SelectDigitalSignatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectDigitalSignatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectDigitalSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
