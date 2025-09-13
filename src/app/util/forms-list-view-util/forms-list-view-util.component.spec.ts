import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsListViewUtilComponent } from './forms-list-view-util.component';

describe('FormsListViewUtilComponent', () => {
  let component: FormsListViewUtilComponent;
  let fixture: ComponentFixture<FormsListViewUtilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormsListViewUtilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormsListViewUtilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
