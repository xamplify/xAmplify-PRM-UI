import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLoaderComponent } from './list-loader.component';

describe('ListLoaderComponent', () => {
  let component: ListLoaderComponent;
  let fixture: ComponentFixture<ListLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
