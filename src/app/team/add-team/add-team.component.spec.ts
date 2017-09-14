import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableEditableComponent } from './table-editable.component';

describe('TableEditableComponent', () => {
  let component: TableEditableComponent;
  let fixture: ComponentFixture<TableEditableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableEditableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableEditableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
