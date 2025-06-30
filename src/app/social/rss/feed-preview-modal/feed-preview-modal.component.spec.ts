import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedPreviewModalComponent } from './feed-preview-modal.component';


describe('FeedPreviewModalComponent', () => {
  let component: FeedPreviewModalComponent;
  let fixture: ComponentFixture<FeedPreviewModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FeedPreviewModalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedPreviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});