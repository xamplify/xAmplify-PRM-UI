import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectLeadComponent } from './select-lead.component';

describe('SelectLeadComponent', () => {
  let component: SelectLeadComponent;
  let fixture: ComponentFixture<SelectLeadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectLeadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
