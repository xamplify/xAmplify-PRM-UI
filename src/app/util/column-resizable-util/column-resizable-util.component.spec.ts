import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnResizableUtilComponent } from './column-resizable-util.component';

describe('ColumnResizableUtilComponent', () => {
  let component: ColumnResizableUtilComponent;
  let fixture: ComponentFixture<ColumnResizableUtilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColumnResizableUtilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnResizableUtilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
