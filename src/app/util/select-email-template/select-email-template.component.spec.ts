import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectEmailTemplateComponent } from './select-email-template.component';

describe('SelectEmailTemplateComponent', () => {
  let component: SelectEmailTemplateComponent;
  let fixture: ComponentFixture<SelectEmailTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectEmailTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectEmailTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
