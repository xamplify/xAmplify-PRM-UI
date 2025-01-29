import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicTopNavigationBarComponent } from './public-top-navigation-bar.component';

describe('PublicTopNavigationBarComponent', () => {
  let component: PublicTopNavigationBarComponent;
  let fixture: ComponentFixture<PublicTopNavigationBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicTopNavigationBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicTopNavigationBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
