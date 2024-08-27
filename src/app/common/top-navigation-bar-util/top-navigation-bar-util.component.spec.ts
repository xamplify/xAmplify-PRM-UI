import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopNavigationBarUtilComponent } from './top-navigation-bar-util.component';

describe('TopNavigationBarUtilComponent', () => {
  let component: TopNavigationBarUtilComponent;
  let fixture: ComponentFixture<TopNavigationBarUtilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopNavigationBarUtilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopNavigationBarUtilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
