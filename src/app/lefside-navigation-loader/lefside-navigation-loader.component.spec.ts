import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LefsideNavigationLoaderComponent } from './lefside-navigation-loader.component';

describe('LefsideNavigationLoaderComponent', () => {
  let component: LefsideNavigationLoaderComponent;
  let fixture: ComponentFixture<LefsideNavigationLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LefsideNavigationLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LefsideNavigationLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
