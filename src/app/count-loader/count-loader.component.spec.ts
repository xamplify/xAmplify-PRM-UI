import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountLoaderComponent } from './count-loader.component';

describe('CountLoaderComponent', () => {
  let component: CountLoaderComponent;
  let fixture: ComponentFixture<CountLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
