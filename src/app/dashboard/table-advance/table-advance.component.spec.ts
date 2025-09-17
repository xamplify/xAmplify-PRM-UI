import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableAdvanceComponent } from './table-advance.component';

describe('TableAdvanceComponent', () => {
  let component: TableAdvanceComponent;
  let fixture: ComponentFixture<TableAdvanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableAdvanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableAdvanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
