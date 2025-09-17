import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseContentComponent } from './browse-content.component';

describe('BrowseContentComponent', () => {
  let component: BrowseContentComponent;
  let fixture: ComponentFixture<BrowseContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowseContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
