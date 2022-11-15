import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DamListAndGridViewComponent } from './dam-list-and-grid-view.component';

describe('DamListAndGridViewComponent', () => {
  let component: DamListAndGridViewComponent;
  let fixture: ComponentFixture<DamListAndGridViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DamListAndGridViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DamListAndGridViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
