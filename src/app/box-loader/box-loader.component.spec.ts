import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxLoaderComponent } from './box-loader.component';

describe('BoxLoaderComponent', () => {
  let component: BoxLoaderComponent;
  let fixture: ComponentFixture<BoxLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoxLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
