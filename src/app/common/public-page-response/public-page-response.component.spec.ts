import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicPageResponseComponent } from './public-page-response.component';

describe('PublicPageResponseComponent', () => {
  let component: PublicPageResponseComponent;
  let fixture: ComponentFixture<PublicPageResponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicPageResponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicPageResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
