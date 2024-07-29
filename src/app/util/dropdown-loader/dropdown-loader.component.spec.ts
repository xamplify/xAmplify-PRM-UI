import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownLoaderComponent } from './dropdown-loader.component';

describe('DropdownLoaderComponent', () => {
  let component: DropdownLoaderComponent;
  let fixture: ComponentFixture<DropdownLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropdownLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
