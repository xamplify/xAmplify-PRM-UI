import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacebookPostsComponent } from './facebook-posts.component';

describe('FacebookPostsComponent', () => {
  let component: FacebookPostsComponent;
  let fixture: ComponentFixture<FacebookPostsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacebookPostsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacebookPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
