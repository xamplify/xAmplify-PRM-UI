import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMdfComponent } from './select-mdf.component';

describe('SelectMdfComponent', () => {
  let component: SelectMdfComponent;
  let fixture: ComponentFixture<SelectMdfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectMdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectMdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
