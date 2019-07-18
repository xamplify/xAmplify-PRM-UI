import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoResponseLoaderComponent } from './auto-response-loader.component';

describe('AutoResponseLoaderComponent', () => {
  let component: AutoResponseLoaderComponent;
  let fixture: ComponentFixture<AutoResponseLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoResponseLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoResponseLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
