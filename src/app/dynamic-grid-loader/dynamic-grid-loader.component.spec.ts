import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicGridLoaderComponent } from './dynamic-grid-loader.component';

describe('DynamicGridLoaderComponent', () => {
  let component: DynamicGridLoaderComponent;
  let fixture: ComponentFixture<DynamicGridLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicGridLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicGridLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
