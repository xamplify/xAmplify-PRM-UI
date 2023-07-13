import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchGuidesComponent } from './search-guides.component';

describe('SearchGuidesComponent', () => {
  let component: SearchGuidesComponent;
  let fixture: ComponentFixture<SearchGuidesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchGuidesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchGuidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
