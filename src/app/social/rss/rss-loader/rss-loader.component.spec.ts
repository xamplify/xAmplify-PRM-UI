import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RssLoaderComponent } from './rss-loader.component';

describe('RssLoaderComponent', () => {
  let component: RssLoaderComponent;
  let fixture: ComponentFixture<RssLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RssLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RssLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
