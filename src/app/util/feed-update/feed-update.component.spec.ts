import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedUpdateComponent } from './feed-update.component';

describe('FeedUpdateComponent', () => {
  let component: FeedUpdateComponent;
  let fixture: ComponentFixture<FeedUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
